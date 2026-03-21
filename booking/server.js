'use strict';

require('dotenv').config();
const express    = require('express');
const axios      = require('axios');
const NodeCache  = require('node-cache');
const morgan     = require('morgan');
const fs         = require('fs');
const path       = require('path');

// ─── Config ───────────────────────────────────────────────────────────────────
const TARGET_ORIGIN = 'https://book.mylimobiz.com';
const ALIAS         = process.env.LIMO_ALIAS   || 'kingandcarter';
const PORT          = process.env.PORT          || 3002;
const CACHE_TTL     = process.env.CACHE_TTL     || 300;  // seconds
const TRUST_PROXY   = process.env.TRUST_PROXY === 'false' ? false : 1; // behind Nginx

// ─── App setup ────────────────────────────────────────────────────────────────
const app   = express();
const cache = new NodeCache({ stdTTL: Number(CACHE_TTL), checkperiod: 60 });

app.set('trust proxy', TRUST_PROXY);
app.use(morgan('combined'));

// ─── File loaders (hot-reload: no server restart needed) ──────────────────────

// Reads custom.css on every request — edit live without restarting
function loadCSS() {
  const p = path.join(__dirname, 'custom.css');
  try {
    return `<style id="kcproxy">\n${fs.readFileSync(p, 'utf8')}\n</style>`;
  } catch {
    console.warn('[proxy] custom.css not found');
    return '';
  }
}

// Reads fonts.html — put your <link> or @import tags here
function loadFonts() {
  const p = path.join(__dirname, 'fonts.html');
  try { return fs.readFileSync(p, 'utf8'); }
  catch { return ''; }
}

// ─── HTML transforms ──────────────────────────────────────────────────────────

// Rewrite relative /v4/ paths → absolute upstream URLs.
// Form actions also point at the real origin so bookings/logins process correctly.
function rewriteUrls(html) {
  return html
    .replace(/((?:src|href|action)=)"(\/v4\/[^"]+)"/g,
      (_, a, p) => `${a}"${TARGET_ORIGIN}${p}"`)
    .replace(/((?:src|href|action)=)'(\/v4\/[^']+)'/g,
      (_, a, p) => `${a}'${TARGET_ORIGIN}${p}'`);
}

// Swap LimoAnywhere's Google Maps client ID for your own API key
function swapGoogleMapsKey(html) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return html;
  // Replace ?client=gme-limoanywhere... with ?key=YOUR_KEY
  return html
    .replace(/[?&]client=gme-[^&"'\s]*/g, `?key=${apiKey}`)
    .replace(/(maps\.googleapis\.com\/maps\/api\/js[^"']*)\?client=gme-[^&"'\s]*/g,
      `$1?key=${apiKey}`);
}

// Remove any meta tags that set X-Frame-Options inline
function stripRestrictiveMetaTags(html) {
  return html.replace(
    /<meta[^>]+http-equiv=["']?X-Frame-Options["']?[^>]*>/gi, ''
  );
}

// Inject <base> so browser resolves any leftover relative paths correctly
function injectBase(html) {
  return html.replace('<head>', `<head>\n  <base href="${TARGET_ORIGIN}/">`);
}

// ─── Full page pipeline ───────────────────────────────────────────────────────
// upstreamUrl  — the exact URL to fetch from book.mylimobiz.com
// iframeId     — id used in the parentIFrame stub (for iframe-resizer)
async function buildPage(req, upstreamUrl, iframeId = 'booking-iframe') {
  const CACHE_KEY = `page:${upstreamUrl}`;
  let raw = cache.get(CACHE_KEY);

  if (!raw) {
    const upstream = await axios.get(upstreamUrl, {
      headers: {
        'User-Agent':      req.headers['user-agent'] || 'Mozilla/5.0',
        'Accept':          'text/html,application/xhtml+xml,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control':   'no-cache',
      },
      timeout: 12000,
      decompress: true,
    });
    raw = upstream.data;
    cache.set(CACHE_KEY, raw);
    console.log(`[proxy] fetched: ${upstreamUrl}`);
  }

  const headBlock = [
    loadFonts(),
    loadCSS(),
    '<style>html,body{background:transparent!important}</style>',
  ].filter(Boolean).join('\n');

  // iframe-resizer content-window script + parentIFrame stub
  const bodyBlock = `
<script src="https://cdn.jsdelivr.net/npm/iframe-resizer@4.3.9/js/iframeResizer.contentWindow.min.js"></script>
<script>
  window.parentIFrame = window.parentIFrame || {
    size:                      function() {},
    getId:                     function() { return '${iframeId}'; },
    getPageInfo:               function() {},
    scrollTo:                  function() {},
    scrollToOffset:            function() {},
    sendMessage:               function() {},
    setHeightCalculationMethod:function() {},
    setTargetOrigin:           function() {},
  };
</script>`;

  let html = raw;
  html = injectBase(html);
  html = rewriteUrls(html);
  html = swapGoogleMapsKey(html);
  html = stripRestrictiveMetaTags(html);
  html = html.replace('</head>', `${headBlock}\n</head>`);
  html = html.replace('</body>', `${bodyBlock}\n</body>`);
  return html;
}

// Shared response sender — strips all embedding-blocking headers
function sendPage(res, html) {
  res
    .setHeader('X-Frame-Options', '')
    .setHeader('Content-Security-Policy', '')
    .set('Content-Type', 'text/html; charset=utf-8')
    .set('Cache-Control', 'no-store')
    .send(html);
}

// Shared error page
function sendError(res, label) {
  res.status(502).send(`
    <html><body style="font-family:sans-serif;padding:2rem;text-align:center">
      <h2>${label} temporarily unavailable</h2>
      <p>Please try again shortly or call us directly.</p>
    </body></html>
  `);
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// ── /booking ──────────────────────────────────────────────────────────────────
// Proxies: https://book.mylimobiz.com/v4/kingandcarter
// Embed:   <iframe id="booking-iframe" src="https://yourdomain.com/booking">
app.get('/booking', async (req, res) => {
  try {
    const html = await buildPage(
      req,
      `${TARGET_ORIGIN}/v4/${ALIAS}`,
      'booking-iframe'
    );
    sendPage(res, html);
  } catch (err) {
    console.error('[proxy] /booking error:', err.message);
    sendError(res, 'Booking');
  }
});

// ── /login ────────────────────────────────────────────────────────────────────
// Proxies: https://book.mylimobiz.com/v4/kingandcarter/widget/login
//
// The upstream widget supports a ?redirectUrl= param that controls where the
// user lands after a successful login. We forward whatever the caller passes
// as ?redirect (your site URL), falling back to the env var or '/'.
//
// Embed example:
//   <iframe id="login-iframe"
//     src="https://yourdomain.com/login?redirect=https://yourdomain.com/dashboard">
//
// The login widget posts back to your page via postMessage when auth succeeds.
// See the postMessage listener snippet in README.md.
app.get('/login', async (req, res) => {
  try {
    // Accept ?redirect= from the caller; fall back to env or root
    const redirectUrl = req.query.redirect
      || process.env.LOGIN_REDIRECT_URL
      || '/';

    // Encode it for the upstream URL query string
    const upstreamUrl =
      `${TARGET_ORIGIN}/v4/${ALIAS}/widget/login` +
      `?redirectUrl=${encodeURIComponent(redirectUrl)}`;

    const html = await buildPage(req, upstreamUrl, 'login-iframe');
    sendPage(res, html);
  } catch (err) {
    console.error('[proxy] /login error:', err.message);
    sendError(res, 'Login');
  }
});

// ── /booking/refresh — bust both caches ───────────────────────────────────────
// curl -X POST https://yourdomain.com/booking/refresh \
//      -H "x-refresh-secret: YOUR_SECRET"
app.post('/booking/refresh', express.json(), (req, res) => {
  if (req.headers['x-refresh-secret'] !== process.env.REFRESH_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  cache.flushAll();
  console.log('[proxy] cache flushed via /booking/refresh');
  res.json({ ok: true, flushed: true });
});

// ── /health ───────────────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({
  status:  'ok',
  alias:   ALIAS,
  uptime:  Math.floor(process.uptime()),
  cached:  cache.keys(),
}));

app.use((_, res) => res.status(404).send('Not found'));

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, '127.0.0.1', () => {
  console.log(`[proxy] listening on http://127.0.0.1:${PORT}`);
  console.log(`[proxy] /booking → ${TARGET_ORIGIN}/v4/${ALIAS}`);
  console.log(`[proxy] /login   → ${TARGET_ORIGIN}/v4/${ALIAS}/widget/login`);
});

process.on('SIGTERM', () => { console.log('[proxy] shutdown'); process.exit(0); });
