import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import axios from "axios";
import NodeCache from "node-cache";

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

  const headBlock = [
    loadFonts(),
    loadCSS(),
    "<style>html,body{background:transparent!important}</style>",
  ].filter(Boolean).join("\n");

  const bodyBlock = `\n<script src="https://cdn.jsdelivr.net/npm/iframe-resizer@4.3.9/js/iframeResizer.contentWindow.min.js"></script>`;

  let html = raw;
  html = injectBase(html);
  html = rewriteUrls(html);
  html = swapGoogleMapsKey(html);
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

function sendError(res: express.Response, label: string) {
  res.status(502).send(`<html><body style="font-family:sans-serif;padding:2rem;text-align:center">
    <h2>${label} temporarily unavailable</h2>
    <p>Please try again shortly or call us directly.</p>
  </body></html>`);
}

// ─── Main server ──────────────────────────────────────────────────────────────
async function startServer() {
  const app = express();
  const server = createServer(app);

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

  // ── Static + SPA fallback ──────────────────────────────────────────────────
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`[booking-proxy] /booking → ${TARGET_ORIGIN}/v4/${ALIAS}`);
  });
}

startServer().catch(console.error);
