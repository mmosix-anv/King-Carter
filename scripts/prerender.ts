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
 * entry. The server (server/index.ts) reads these straight off disk per-request and
 * serves them verbatim, falling back to the shell + injectSeo for anything else.
 * (The server can also re-run this same capture against itself at runtime — see
 * capturePrerenderedRoutes in prerender-core.ts and the /admin/rebuild-prerender
 * route — so admin edits to Services/Fleet don't have to wait for the next deploy.)
 */
import { spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { indexableRoutes } from "../shared/seo";
import { capturePrerenderedRoutes } from "./prerender-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SERVER_ENTRY = path.join(ROOT, "dist", "index.js");
const OUT_DIR = path.join(ROOT, "dist", "prerendered");
const PORT = process.env.PRERENDER_PORT || "4173";
const BASE_URL = `http://127.0.0.1:${PORT}`;

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

    const routes = indexableRoutes();
    console.log(`[prerender] capturing ${routes.length} routes`);

    const result = await capturePrerenderedRoutes({
      baseUrl: BASE_URL,
      outDir: OUT_DIR,
      routes,
      // Unset in CI/deploy, where the normal Playwright-managed browser is used.
      // Only needed locally where `npx playwright install` can't reach its CDN.
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
      log: console.log,
    });

    if (result.failed.length > 0) {
      throw new Error(`${result.failed.length} of ${routes.length} routes failed to prerender`);
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
