/*
 * Shared Playwright capture logic for prerendering.
 *
 * Used two ways:
 *  - scripts/prerender.ts (build time): spawns its own temporary server instance
 *    (nothing is running yet during a build) and crawls that.
 *  - server/index.ts (runtime, admin-triggered): the real server is already
 *    running and IS the target, so it calls capturePrerenderedRoutes() directly
 *    against itself — no second server instance needed.
 *
 * Kept framework-agnostic (no knowledge of how the caller's server was started)
 * so it can't accidentally couple the two call sites together.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

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

export function outPathFor(outDir: string, route: string): string {
  const trimmed = route.replace(/^\//, "");
  return trimmed === "" ? path.join(outDir, "index.html") : path.join(outDir, trimmed, "index.html");
}

export interface CaptureOptions {
  baseUrl: string;
  outDir: string;
  routes: string[];
  /** Local override for environments where Playwright's own browser install is
   *  unreachable — points at an already-installed Chromium build instead. */
  executablePath?: string;
  log?: (message: string) => void;
}

export interface CaptureResult {
  ok: string[];
  failed: Array<{ route: string; error: string }>;
}

/**
 * Captures each route's fully-hydrated HTML via a real headless browser and writes
 * it to <outDir>/<route>/index.html. Never throws for a per-route failure — those
 * are reported in the returned `failed` list so a partial run still leaves whatever
 * succeeded on disk and the caller decides how to treat an incomplete capture.
 */
export async function capturePrerenderedRoutes(opts: CaptureOptions): Promise<CaptureResult> {
  const { baseUrl, outDir, routes, executablePath, log = () => {} } = opts;

  const browser = await chromium.launch({ executablePath });
  const result: CaptureResult = { ok: [], failed: [] };

  try {
    const context = await browser.newContext();
    await context.route("**/*", (route) => {
      const url = route.request().url();
      if (BLOCKED_HOST_FRAGMENTS.some((host) => url.includes(host))) return route.abort();
      return route.continue();
    });

    const MAX_ATTEMPTS = 3;
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
          await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 30000 });
          await page.waitForSelector("h1", { timeout: 15000 });
          await page.waitForTimeout(1200);

          // data-loc comes from the dev jsxLocPlugin (vite.config.ts) and leaks source
          // file paths into the DOM; harmless in a live browser session (crawlers never
          // saw it, since content was client-rendered), but we're now serving this
          // captured markup as the literal HTTP response, so it would otherwise ship
          // internal paths to every visitor and crawler via view-source.
          const html = (await page.content()).replace(/\s+data-loc="[^"]*"/g, "");
          const outPath = outPathFor(outDir, route);
          fs.mkdirSync(path.dirname(outPath), { recursive: true });
          fs.writeFileSync(outPath, html, "utf8");
          log(`[prerender] ok   ${route} (${(html.length / 1024).toFixed(1)} KB)`);
          ok = true;
        } catch (err) {
          lastErr = err;
          if (attempt < MAX_ATTEMPTS) {
            log(`[prerender] retry ${route} (attempt ${attempt} failed: ${(err as Error).message})`);
          }
        } finally {
          await page.close();
        }
      }

      if (ok) {
        result.ok.push(route);
      } else {
        result.failed.push({ route, error: (lastErr as Error)?.message ?? String(lastErr) });
        log(`[prerender] FAIL ${route} after ${MAX_ATTEMPTS} attempts: ${(lastErr as Error)?.message}`);
      }
    }
  } finally {
    await browser.close();
  }

  return result;
}
