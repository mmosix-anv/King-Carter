import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import axios from "axios";
import NodeCache from "node-cache";
import { createClient } from "@supabase/supabase-js";
import { seoConfig, resolvePageSEO, isKnownRoute, normalizePath, indexableRoutes } from "../shared/seo";
import { capturePrerenderedRoutes, outPathFor } from "../scripts/prerender-core";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Booking proxy config ─────────────────────────────────────────────────────
const TARGET_ORIGIN = "https://book.mylimobiz.com";
const ALIAS         = process.env.LIMO_ALIAS || "kingandcarter";
const CACHE_TTL     = Number(process.env.CACHE_TTL) || 300;
const cache         = new NodeCache({ stdTTL: CACHE_TTL, checkperiod: 60 });

// Resolve booking folder relative to this file
const BOOKING_DIR = path.resolve(__dirname, "..", "booking");

function loadCSS(): string {
  try {
    const css = fs.readFileSync(path.join(BOOKING_DIR, "custom.css"), "utf8");
    return `<style id="kcproxy">\n${css}\n</style>`;
  } catch { return ""; }
}

function loadFonts(): string {
  try { return fs.readFileSync(path.join(BOOKING_DIR, "fonts.html"), "utf8"); }
  catch { return ""; }
}

function rewriteUrls(html: string): string {
  return html
    .replace(/((?:src|href|action)=)"(\/v4\/[^"]+)"/g, (_, a, p) => `${a}"${TARGET_ORIGIN}${p}"`)
    .replace(/((?:src|href|action)=)'(\/v4\/[^']+)'/g, (_, a, p) => `${a}'${TARGET_ORIGIN}${p}'`);
}

function replaceGoogleMapsKey(html: string): string {
  // Remove ALL Google Maps script tags (their client-ID version)
  html = html.replace(
    /<script[^>]*maps\.googleapis\.com[^>]*>(\s*<\/script>)?/gi,
    ""
  );
  return html;
}

function swapGoogleMapsKey(html: string): string {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return html;
  return html.replace(/[?&]client=gme-[^&"'\s]*/g, `?key=${apiKey}`);
}

function stripRestrictiveMetaTags(html: string): string {
  return html.replace(/<meta[^>]+http-equiv=["']?X-Frame-Options["']?[^>]*>/gi, "");
}

function injectBase(html: string): string {
  return html.replace("<head>", `<head>\n  <base href="${TARGET_ORIGIN}/">`);
}

async function buildPage(userAgent: string, upstreamUrl: string): Promise<string> {
  const CACHE_KEY = `page:${upstreamUrl}`;
  let raw = cache.get<string>(CACHE_KEY);

  if (!raw) {
    const upstream = await axios.get(upstreamUrl, {
      headers: {
        "User-Agent":      userAgent || "Mozilla/5.0",
        "Accept":          "text/html,application/xhtml+xml,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control":   "no-cache",
      },
      timeout: 12000,
      decompress: true,
    });
    raw = upstream.data as string;
    cache.set(CACHE_KEY, raw);
    console.log(`[booking-proxy] fetched: ${upstreamUrl}`);
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const mapsScript = apiKey
    ? `<script src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&language=en&callback=GoogleGeoCore.InitGoogleServices" async defer></script>`
    : "";

  const headBlock = [
    loadFonts(),
    loadCSS(),
    mapsScript,
    "<style>html,body{background:transparent!important}</style>",
  ].filter(Boolean).join("\n");

  const bodyBlock = `\n<script src="https://cdn.jsdelivr.net/npm/iframe-resizer@4.3.9/js/iframeResizer.contentWindow.min.js"></script>`;

  let html = raw;
  html = injectBase(html);
  html = rewriteUrls(html);
  html = replaceGoogleMapsKey(html);
  html = stripRestrictiveMetaTags(html);
  html = html.replace("</head>", `${headBlock}\n</head>`);
  html = html.replace("</body>", `${bodyBlock}\n</body>`);
  return html;
}

function sendPage(res: express.Response, html: string) {
  res
    .setHeader("X-Frame-Options", "")
    .setHeader("Content-Security-Policy", "")
    .set("Content-Type", "text/html; charset=utf-8")
    .set("Cache-Control", "no-store")
    .send(html);
}

// ─── SPA metadata injection ───────────────────────────────────────────────────
// The client sets per-route metadata via the useSEO hook, but crawlers that do not
// execute JavaScript (Facebook, LinkedIn, Slack, iMessage) only ever see the shell.
// Rewriting the shell here means every consumer gets the right tags on first byte.
// Both sides read the same map in shared/seo.ts.

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Replaces a tag if the shell already has it, otherwise appends before </head>. */
function upsertTag(html: string, pattern: RegExp, tag: string): string {
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

/**
 * Upserts a JSON-LD block by script id. Uses the same id the client's useSEO hook
 * writes to (setJsonLd), so hydration overwrites this script in place instead of
 * duplicating it.
 */
function upsertJsonLd(html: string, id: string, data: unknown): string {
  const tag = `<script type="application/ld+json" id="${id}">${JSON.stringify(data)}</script>`;
  const pattern = new RegExp(`<script[^>]*\\sid=["']${id}["'][^>]*>[\\s\\S]*?<\\/script>`, "i");
  return upsertTag(html, pattern, tag);
}

function injectSeo(html: string, pathname: string): string {
  const page = resolvePageSEO(pathname);
  const path = normalizePath(pathname);
  const known = isKnownRoute(path);

  const title = page?.title ?? (known ? seoConfig.defaultTitle : "Page Not Found | King & Carter");
  const description =
    page?.description ??
    (known ? seoConfig.defaultDescription : "The page you are looking for is no longer available.");
  const image = page?.image ?? seoConfig.defaultImage;
  const canonical = `${seoConfig.siteUrl}${path === "/" ? "/" : path}`;
  const robots = page?.noindex || !known ? "noindex, nofollow" : "index, follow";

  const t = escapeHtml(title);
  const d = escapeHtml(description);

  let out = html;
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${t}</title>`);
  out = upsertTag(out, /<meta\s+name="description"[^>]*>/i, `<meta name="description" content="${d}" />`);
  out = upsertTag(out, /<meta\s+name="robots"[^>]*>/i, `<meta name="robots" content="${robots}" />`);
  out = upsertTag(out, /<meta\s+name="googlebot"[^>]*>/i, `<meta name="googlebot" content="${robots}" />`);
  out = upsertTag(out, /<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonical}" />`);

  out = upsertTag(out, /<meta\s+property="og:title"[^>]*>/i, `<meta property="og:title" content="${t}" />`);
  out = upsertTag(out, /<meta\s+property="og:description"[^>]*>/i, `<meta property="og:description" content="${d}" />`);
  out = upsertTag(out, /<meta\s+property="og:url"[^>]*>/i, `<meta property="og:url" content="${canonical}" />`);
  out = upsertTag(out, /<meta\s+property="og:image"[^>]*>/i, `<meta property="og:image" content="${escapeHtml(image)}" />`);

  out = upsertTag(out, /<meta\s+name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${t}" />`);
  out = upsertTag(out, /<meta\s+name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${d}" />`);
  out = upsertTag(out, /<meta\s+name="twitter:image"[^>]*>/i, `<meta name="twitter:image" content="${escapeHtml(image)}" />`);

  if (page?.keywords) {
    out = upsertTag(out, /<meta\s+name="keywords"[^>]*>/i, `<meta name="keywords" content="${escapeHtml(page.keywords)}" />`);
  }

  // Mirrors useSEO's unconditional setJsonLd('seo-organization', ...) so crawlers
  // that don't execute JavaScript still see the LocalBusiness graph.
  out = upsertJsonLd(out, "seo-organization", seoConfig.organization);

  return out;
}

function sendError(res: express.Response, label: string) {
  res.status(502).send(`<html><body style="font-family:sans-serif;padding:2rem;text-align:center">
    <h2>${label} temporarily unavailable</h2>
    <p>Please try again shortly or call us directly.</p>
  </body></html>`);
}

// ─── Canonicalization + security headers ──────────────────────────────────────
// SEO audits flag duplicate, unencrypted URL variants and missing security headers.
// kingandcarter.com was reachable over http://, https://www., and https:// all with
// a 200, which fragments indexing across four URLs for one page.
const CANONICAL_HOST = "kingandcarter.com";

// Host-only redirect — deliberately does NOT also enforce HTTPS here. Doing that
// requires trusting req.secure / X-Forwarded-Proto, which depends on exactly how
// the fronting reverse proxy is configured; guessing wrong turns this into a
// redirect loop (every request looks "not https" even when it already is, so the
// app redirects a request to the same URL forever — this took the site down in
// production). www/non-www only depends on the Host header, which is reliable
// regardless of proxy setup, so it can't loop. HTTP->HTTPS enforcement belongs at
// the reverse proxy/TLS-terminating layer, not guessed at here.
function canonicalRedirect(req: express.Request, res: express.Response, next: express.NextFunction) {
  const host = (req.headers.host || "").toLowerCase();

  if (host === `www.${CANONICAL_HOST}`) {
    return res.redirect(301, `https://${CANONICAL_HOST}${req.originalUrl}`);
  }

  next();
}

function securityHeaders(_req: express.Request, res: express.Response, next: express.NextFunction) {
  res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
}

// ─── Main server ──────────────────────────────────────────────────────────────
async function startServer() {
  const app = express();
  app.disable("x-powered-by");
  const server = createServer(app);

  app.use(canonicalRedirect);
  app.use(securityHeaders);

  // Declared early: both the admin rebuild endpoint below and the prerendered-
  // snapshot serving further down need this path.
  const prerenderedDir =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "prerendered")
      : path.resolve(__dirname, "..", "dist", "prerendered");

  // ── Booking proxy routes (before static) ──────────────────────────────────
  app.get("/booking", async (req, res) => {
    try {
      const html = await buildPage(req.headers["user-agent"] || "", `${TARGET_ORIGIN}/v4/${ALIAS}`);
      sendPage(res, html);
    } catch (err: any) {
      console.error("[booking-proxy] /booking error:", err.message);
      sendError(res, "Booking");
    }
  });

  app.get("/booking/login", async (req, res) => {
    try {
      const redirectUrl = (req.query.redirect as string) || process.env.LOGIN_REDIRECT_URL || "/";
      const upstreamUrl = `${TARGET_ORIGIN}/v4/${ALIAS}/widget/login?redirectUrl=${encodeURIComponent(redirectUrl)}`;
      const html = await buildPage(req.headers["user-agent"] || "", upstreamUrl);
      sendPage(res, html);
    } catch (err: any) {
      console.error("[booking-proxy] /booking/login error:", err.message);
      sendError(res, "Login");
    }
  });

  app.post("/booking/refresh", express.json(), (req, res) => {
    if (req.headers["x-refresh-secret"] !== process.env.REFRESH_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    cache.flushAll();
    console.log("[booking-proxy] cache flushed");
    res.json({ ok: true });
  });

  // ── Admin-triggered prerender rebuild ──────────────────────────────────────
  // The prerendered snapshots below are only as fresh as the last build. Services
  // and Fleet are edited through /admin against Supabase directly — real visitors
  // always see that live data (the client remounts and refetches on every load,
  // see client/src/main.tsx), but a non-JS crawler reading the snapshot would see
  // stale content until the next deploy. This lets the admin UI ask for a fresh
  // capture right after a save/delete instead of waiting on that.
  //
  // Authorization is the caller's real Supabase session, not a secret baked into
  // the client bundle — a bundled secret is extractable from the shipped JS and
  // this endpoint launches a headless browser, so a leaked secret would be a real
  // abuse/DoS vector. Reuses the same two-step check (valid Supabase user -> active
  // row in admin_users) that client/src/contexts/AdminContext.tsx already gates the
  // admin UI with.
  const supabaseAuthClient =
    process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY
      ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
      : null;

  async function isAuthenticatedAdmin(req: express.Request): Promise<boolean> {
    if (!supabaseAuthClient) return false;
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) return false;

    const { data: userData, error: userErr } = await supabaseAuthClient.auth.getUser(token);
    if (userErr || !userData.user?.email) return false;

    const { data: adminRow, error: adminErr } = await supabaseAuthClient
      .from("admin_users")
      .select("id")
      .eq("email", userData.user.email)
      .eq("is_active", true)
      .single();

    return !adminErr && !!adminRow;
  }

  let rebuildInFlight = false;

  app.post("/admin/rebuild-prerender", express.json(), async (req, res) => {
    let authorized = false;
    try {
      authorized = await isAuthenticatedAdmin(req);
    } catch (err: any) {
      console.error("[prerender] auth check failed:", err.message);
    }
    if (!authorized) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (rebuildInFlight) {
      return res.status(202).json({ ok: true, status: "already-running" });
    }

    rebuildInFlight = true;
    res.status(202).json({ ok: true, status: "started" });

    const port = process.env.PORT || 3000;
    try {
      const result = await capturePrerenderedRoutes({
        baseUrl: `http://127.0.0.1:${port}`,
        outDir: prerenderedDir,
        routes: indexableRoutes(),
        log: (msg) => console.log(msg),
      });
      console.log(`[prerender] admin-triggered rebuild done — ${result.ok.length} ok, ${result.failed.length} failed`);
    } catch (err: any) {
      // Never let a failed rebuild affect the live server — worst case, snapshots
      // just stay as they were (same fail-soft behavior as the build-time version).
      console.error("[prerender] admin-triggered rebuild failed:", err.message);
    } finally {
      rebuildInFlight = false;
    }
  });

  // ── Static + SPA fallback ──────────────────────────────────────────────────
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  // index:false so "/" falls through to the catch-all below and gets its metadata
  // injected. Without it express.static answers "/" with the raw shell.
  app.use(express.static(staticPath, { index: false }));

  // ── Prerendered snapshots ──────────────────────────────────────────────────
  // This is a client-rendered SPA: without these, a non-JS crawler sees an empty
  // <body> (0 words, no H1, no links — confirmed by a Seobility audit). Each file
  // here is a real, fully-hydrated page captured by scripts/prerender.ts (or the
  // /admin/rebuild-prerender route above, after a Services/Fleet edit), so it
  // already carries correct content, headings, links and head metadata (the
  // client's useSEO hook set that during capture, same as any real visitor). We
  // serve it verbatim to everyone for the routes that have one, and fall back to
  // the shell + injectSeo for every other path (admin, partner pages, 404, and any
  // route that doesn't have a snapshot yet).
  //
  // Content is read fresh from disk on every request rather than cached at startup
  // — a rebuild triggered while the server is already running (admin-triggered or
  // otherwise) must take effect on the next request, not require a process restart.
  // Only the route -> file path mapping is fixed at startup; that mapping itself
  // is safe to compute from indexableRoutes() (a fixed, known list), never from
  // request input, so there's no path-traversal exposure in resolving it per request.
  const prerenderedPaths = new Map<string, string>();
  for (const route of indexableRoutes()) {
    prerenderedPaths.set(route, outPathFor(prerenderedDir, route));
  }
  const snapshotCount = Array.from(prerenderedPaths.values()).filter((f) => fs.existsSync(f)).length;
  console.log(`[seo] ${snapshotCount}/${indexableRoutes().length} routes currently have a prerendered snapshot on disk`);

  const indexPath = path.join(staticPath, "index.html");
  let shell: string | null = null;
  try {
    shell = fs.readFileSync(indexPath, "utf8");
    console.log("[seo] HTML shell loaded, per-route metadata injection active");
  } catch (err: any) {
    console.error(`[seo] could not read ${indexPath}: ${err.message} — serving shell unmodified`);
  }

  app.get("*", (req, res) => {
    const snapshotPath = prerenderedPaths.get(normalizePath(req.path));
    if (snapshotPath) {
      try {
        const snapshot = fs.readFileSync(snapshotPath, "utf8");
        return res.status(200).set("Content-Type", "text/html; charset=utf-8").send(snapshot);
      } catch {
        // Not written yet (first boot, or a rebuild is mid-flight) — fall through
        // to the shell below rather than error.
      }
    }

    if (!shell) return res.sendFile(indexPath);

    // Unmatched URLs must answer 404, not a soft 404 with a 200 status. The client
    // still renders its NotFound page for them.
    const status = isKnownRoute(req.path) ? 200 : 404;

    res
      .status(status)
      .set("Content-Type", "text/html; charset=utf-8")
      .send(injectSeo(shell, req.path));
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`[booking-proxy] /booking → ${TARGET_ORIGIN}/v4/${ALIAS}`);
  });
}

startServer().catch(console.error);
