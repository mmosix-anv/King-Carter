# Limobiz Booking Widget Proxy
**Node.js / Express · VPS deployment**

Serves the mylimobiz booking page through your own domain with full CSS/font control injected server-side.

---

## File structure

```
node/
├── server.js            ← proxy logic
├── custom.css           ← ALL your styles live here (hot-reload, no restart)
├── fonts.html           ← your <link> font tags (hot-reload)
├── .env.example         ← copy to .env and fill in
├── ecosystem.config.js  ← PM2 process config
└── package.json

nginx.conf               ← drop into /etc/nginx/sites-available/
```

---

## 1. Server setup

```bash
# Clone / upload the node/ folder to your VPS, then:
cd node
cp .env.example .env
nano .env                   # set REFRESH_SECRET to a random string

npm install
```

---

## 2. Customise styles & fonts

**Colors & branding** — edit `custom.css`, find the `:root` block at the top:
```css
:root {
  --brand-primary:   #0a0a0a;   /* main buttons            */
  --brand-accent:    #c9a84c;   /* gold highlights, links  */
  --brand-bg:        #ffffff;   /* page background         */
  /* ... */
}
```
Changes take effect **immediately** on the next request — no restart needed.

**Fonts** — edit `fonts.html`, swap the Google Fonts URL for your brand font:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@400;600;700&display=swap" rel="stylesheet">
```
Then update `--brand-font` in `custom.css` to match.

---

## 3. Run with PM2 (production)

```bash
npm install -g pm2

# Edit ecosystem.config.js → set REFRESH_SECRET
pm2 start ecosystem.config.js

# Persist across reboots
pm2 save
pm2 startup              # follow the printed command
```

Useful PM2 commands:
```bash
pm2 logs booking-proxy   # live logs
pm2 restart booking-proxy
pm2 status
```

---

## 4. Nginx

```bash
sudo cp nginx.conf /etc/nginx/sites-available/booking-proxy
sudo ln -s /etc/nginx/sites-available/booking-proxy /etc/nginx/sites-enabled/

# Edit the file — replace yourdomain.com with your actual domain
sudo nano /etc/nginx/sites-available/booking-proxy

sudo nginx -t            # test config
sudo systemctl reload nginx
```

**SSL with Certbot (free):**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 5. Embed on your website

### Booking iframe
```html
<iframe
  id="booking-iframe"
  src="https://yourdomain.com/booking"
  width="100%"
  height="950"
  frameborder="0"
  style="border:none; width:100%; min-height:950px;"
></iframe>
```

### Login iframe
The `/login` route accepts an optional `?redirect=` query param — the page the
user lands on after a successful login. If omitted it falls back to
`LOGIN_REDIRECT_URL` in `.env`.

```html
<iframe
  id="login-iframe"
  src="https://yourdomain.com/login?redirect=https://yourdomain.com/account"
  width="100%"
  height="400"
  frameborder="0"
  style="border:none; width:100%;"
></iframe>
```

The login widget fires a `postMessage` when auth succeeds. Listen for it on
your parent page to react (redirect, show content, etc.):

```html
<script>
  window.addEventListener('message', function (e) {
    // Only trust messages from your proxy origin
    if (e.origin !== 'https://yourdomain.com') return;

    if (e.data && e.data.type === 'ores-login-success') {
      // User is now logged in — redirect or refresh
      window.location.href = e.data.redirectUrl || '/account';
    }

    // iframe-resizer height update
    if (e.data && e.data.height) {
      document.getElementById('login-iframe').style.height = e.data.height + 'px';
    }
  });
</script>
```

---

## 6. Force a fresh upstream fetch (cache bust)

The proxy caches the upstream HTML for 5 minutes. To force an immediate refresh:

```bash
curl -X POST https://yourdomain.com/booking/refresh \
     -H "x-refresh-secret: YOUR_REFRESH_SECRET"
```

Set `CACHE_TTL` in `.env` to change the cache duration (seconds).

---

## Key CSS selectors reference

| Element                    | Selector                           |
|----------------------------|------------------------------------|
| Primary buttons            | `.btn-primary`                     |
| Outline buttons            | `.btn-outline`                     |
| Their header (hidden)      | `header#top.ors-menu-top`          |
| Their logo (hidden)        | `img.brand-logo`                   |
| Step panel headings        | `.panel-heading`                   |
| Step wizard icons          | `.svg-step-in-active/completed`    |
| Vehicle cards              | `.vehicle-grid-item`               |
| Vehicle price              | `.vehicle-grid-item-price-numb`    |
| Form inputs                | `.form-control`                    |
| Autocomplete dropdown      | `.ors-suggest-list`                |
| Loading spinner            | `.loader-path`                     |
| Page background            | `body, .ors, #outer-wrap`          |
| Links                      | `a, .text-link`                    |
| Date picker active day     | `.day.active`                      |

---

## Notes

- Form submissions (actual bookings) go directly to `book.mylimobiz.com` — your proxy only serves the HTML shell. No booking data passes through your server.
- The session token in the upstream URL is dynamic and refreshes each cache cycle automatically.
- Review mylimobiz's Terms of Service regarding iframe embedding and proxying.
