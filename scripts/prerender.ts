/*
 * Build-time prerenderer.
 *
 * Non-JS crawlers (and several SEO auditing tools) never run the client bundle, so
 * they see an empty <body> — this SPA has no server-rendered content, only
 * server-injected <head> metadata (see injectSeo in server/index.ts). That showed
 * up directly in a Seobility audit: 0 words, no H1, no headings, no internal links
 * detected on every page.
 *
 * Reimplementing this as real SSR would mean stubbing every `window`/`document`
 * reference across ~20 page components and reproducing the provider tree — this
 * app wasn't written with SSR in mind. Driving a real, headless browser against the
 * real production server sidesteps all of that: it captures the exact DOM a human
 * (and Googlebot) already sees after hydration and data fetches complete, with zero
 * changes to application code.
 *
 * Output: dist/prerendered/<route>/index.html, one per shared/seo.ts indexableRoutes()
 * entry. The server (server/index.ts) serves these verbatim to everyone for those
 * routes, falling back to the existing shell + injectSeo for anything else.
 */
import { chromium } from "playwright";
import { spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { indexableRoutes } from "../shared/seo";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SERVER_ENTRY = path.join(ROOT, "dist", "index.js");
const OUT_DIR = path.join(ROOT, "dist", "prerendered");
const PORT = process.env.PRERENDER_PORT || "4173";
const BASE_URL = `http://127.0.0.1:${PORT}`;

// Keep real pageviews out of analytics — this is a bot crawling the site, not a visitor.
const BLOCKED_HOST_FRAGMENTS = [
  "googletagmanager.com",
  "google-analytics.com",
  "analytics.google.com",
  "doubleclick.net",
  "vercel-insights.com",
  "vercel-scripts.com",
  "va.vercel-scripts.com",
];

function outPathFor(route: string): string {
  const trimmed = route.replace(/^\//, "");
  return trimmed === "" ? path.join(OUT_DIR, "index.html") : path.join(OUT_DIR, trimmed, "index.html");
}

function waitForServer(url: string, timeoutMs = 30000): Promise<void> {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      fetch(url)
        .then(() => resolve())
        .catch(() => {
          if (Date.now() - start > timeoutMs) {
            reject(new Error(`Server at ${url} did not respond within ${timeoutMs}ms`));
            return;
          }
          setTimeout(attempt, 300);
        });
    };
    attempt();
  });
}

async function main() {
  if (!fs.existsSync(SERVER_ENTRY)) {
    throw new Error(`${SERVER_ENTRY} not found. Build the server (esbuild server/index.ts ...) before prerendering.`);
  }

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`[prerender] starting production server on ${BASE_URL}`);
  const serverProcess: ChildProcess = spawn(process.execPath, [SERVER_ENTRY], {
    env: { ...process.env, NODE_ENV: "production", PORT },
    stdio: ["ignore", "inherit", "inherit"],
  });

  let cleanedUp = false;
  const cleanup = () => {
    if (cleanedUp) return;
    cleanedUp = true;
    if (serverProcess.pid && !serverProcess.killed) serverProcess.kill();
  };
  process.on("exit", cleanup);
  process.on("SIGINT", () => { cleanup(); process.exit(1); });
  process.on("SIGTERM", () => { cleanup(); process.exit(1); });

  try {
    await waitForServer(`${BASE_URL}/`);

    // Local override for environments where `npx playwright install` can't reach its
    // CDN — points at an already-installed Chromium build instead of downloading one.
    // Unset in CI/deploy, where the normal Playwright-managed browser is used.
    const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined });
    const context = await browser.newContext();
    await context.route("**/*", (route) => {
      const url = route.request().url();
      if (BLOCKED_HOST_FRAGMENTS.some((host) => url.includes(host))) return route.abort();
      return route.continue();
    });

    const routes = indexableRoutes();
    console.log(`[prerender] capturing ${routes.length} routes`);

    const MAX_ATTEMPTS = 3;
    let failures = 0;
    for (const route of routes) {
      let lastErr: unknown;
      let ok = false;

      for (let attempt = 1; attempt <= MAX_ATTEMPTS && !ok; attempt++) {
        const page = await context.newPage();
        try {
          // Not `networkidle`: Supabase's client and the booking widget loader keep
          // long-lived connections open, so the page never goes network-idle and the
          // wait just times out. Wait for DOM parse, then for the content we actually
          // need (the h1 every page renders), then a fixed settle delay for the
          // Supabase fetch -> setState -> re-render cycle on data-backed pages
          // (Home, Fleet, ServicePage) to finish. A slow upstream Supabase response
          // occasionally misses this even when the route itself is fine, hence the
          // retries rather than a longer fixed timeout.
          await page.goto(`${BASE_URL}${route}`, { waitUntil: "domcontentloaded", timeout: 30000 });
          await page.waitForSelector("h1", { timeout: 15000 });
          await page.waitForTimeout(1200);

          // data-loc comes from the dev jsxLocPlugin (vite.config.ts) and leaks source
          // file paths into the DOM; harmless in a live browser session (crawlers never
          // saw it, since content was client-rendered), but we're now serving this
          // captured markup as the literal HTTP response, so it would otherwise ship
          // internal paths to every visitor and crawler via view-source.
          const html = (await page.content()).replace(/\s+data-loc="[^"]*"/g, "");
          const outPath = outPathFor(route);
          fs.mkdirSync(path.dirname(outPath), { recursive: true });
          fs.writeFileSync(outPath, html, "utf8");
          console.log(`[prerender] ok   ${route} -> ${path.relative(ROOT, outPath)} (${(html.length / 1024).toFixed(1)} KB)`);
          ok = true;
        } catch (err) {
          lastErr = err;
          if (attempt < MAX_ATTEMPTS) {
            console.warn(`[prerender] retry ${route} (attempt ${attempt} failed: ${(err as Error).message})`);
          }
        } finally {
          await page.close();
        }
      }

      if (!ok) {
        failures++;
        console.error(`[prerender] FAIL ${route} after ${MAX_ATTEMPTS} attempts:`, (lastErr as Error).message);
      }
    }

    await browser.close();

    if (failures > 0) {
      throw new Error(`${failures} of ${routes.length} routes failed to prerender`);
    }
    console.log(`[prerender] done — ${routes.length} routes captured`);
  } finally {
    cleanup();
  }
}

main().catch((err) => {
  // Deliberately non-fatal: this runs as the last step of `build:server`, and a
  // deploy environment without Chromium available (no internet egress at build
  // time, missing system libs, etc.) must not block shipping. Without snapshots,
  // the server's prerendered-snapshot map is just empty and every route falls back
  // to the existing shell + injectSeo — i.e. exactly today's production behavior,
  // not a regression. Loud in the build log, but the build still succeeds.
  console.error("[prerender] FAILED — build will continue without prerendered snapshots:", err);
});
