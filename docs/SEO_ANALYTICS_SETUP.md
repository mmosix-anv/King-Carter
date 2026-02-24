# SEO, Analytics & Tracking Setup

Complete documentation for SEO configuration, Google Analytics, Google Tag Manager, Vercel Analytics, and sitemap implementation.

---

## 📊 Analytics Configuration

### Google Analytics 4 (GA4)
- **Tracking ID**: `G-Z2YYTLCEK3`
- **Status**: ✅ Active in production
- **Location**: `src/config/analytics.js`

### Google Tag Manager (GTM)
- **Container ID**: `GTM-TQ9WSK5Z`
- **Status**: ✅ Active in production
- **Location**: `src/config/analytics.js`

### Vercel Analytics
- **Package**: `@vercel/analytics`
- **Status**: ✅ Integrated
- **Location**: `src/main.jsx`

### Vercel Speed Insights
- **Package**: `@vercel/speed-insights`
- **Status**: ✅ Integrated
- **Location**: `src/main.jsx`

---

## 🔧 Configuration Files

### Analytics Configuration
**File**: `src/config/analytics.js`

```javascript
export const analyticsConfig = {
  gaTrackingId: 'G-Z2YYTLCEK3',
  gtmId: 'GTM-TQ9WSK5Z',
  enabled: import.meta.env.PROD // Only active in production
};
```

**Functions**:
- `initGA()` - Initializes Google Analytics
- `initGTM()` - Initializes Google Tag Manager
- `trackPageView(url)` - Tracks page navigation
- `trackEvent(action, category, label, value)` - Tracks custom events

### SEO Configuration
**File**: `src/config/seo.js`

**Target Market**: Atlanta, GA, United States

**Primary Keywords**:
- Luxury transportation Atlanta
- Executive car service Atlanta
- Airport transportation Atlanta
- Hartsfield-Jackson airport transportation
- Corporate travel Atlanta
- Black car service Atlanta

**Structured Data**: LocalBusiness schema with:
- Business name, address, phone
- Service area (Atlanta, GA)
- Price range ($$$)
- Opening hours (24/7)

---

## 🎯 SEO Implementation

### Custom Hook
**File**: `src/hooks/useSEO.js`

Dynamically manages:
- Page titles
- Meta descriptions
- Keywords
- Open Graph tags (Facebook)
- Twitter Cards
- Canonical URLs

**Usage**:
```javascript
import { useSEO } from '../hooks/useSEO';

function MyPage() {
  useSEO('pageName'); // Uses config from seo.js
  return <div>...</div>;
}
```

### Page-Specific SEO
Each page has custom metadata in `src/config/seo.js`:
- Home
- Services
- Fleet
- Membership
- Experience
- About
- Contact

---

## 🗺️ Sitemap Configuration

### Sitemap
**File**: `public/sitemap.xml`

**Included Pages**:
- `/` (Priority: 1.0, Daily)
- `/services` (Priority: 0.9, Weekly)
- `/fleet` (Priority: 0.8, Weekly)
- `/membership` (Priority: 0.8, Weekly)
- `/experience` (Priority: 0.7, Monthly)
- `/about` (Priority: 0.7, Monthly)
- `/contact` (Priority: 0.6, Monthly)

### Robots.txt
**File**: `public/robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://kingandcarter.com/sitemap.xml
```

---

## 🚀 Initialization

### App Entry Point
**File**: `src/main.jsx`

```javascript
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Analytics />
    <SpeedInsights />
  </React.StrictMode>
);
```

### App Component
**File**: `src/App.jsx`

```javascript
import { initGA, initGTM, trackPageView } from './config/analytics';

useEffect(() => {
  initGA();
  initGTM();
}, []);

useEffect(() => {
  trackPageView(location.pathname);
}, [location]);
```

---

## 📈 Tracking Events

### Custom Event Tracking

```javascript
import { trackEvent } from './config/analytics';

// Example: Track button click
trackEvent('click', 'Button', 'Book Now', 1);

// Example: Track form submission
trackEvent('submit', 'Form', 'Contact Form', 1);

// Example: Track phone call
trackEvent('call', 'Contact', 'Phone Number', 1);
```

---

## 🔍 SEO Best Practices Implemented

### Technical SEO
- ✅ Semantic HTML structure
- ✅ Mobile-responsive design
- ✅ Fast page load times
- ✅ Clean URL structure
- ✅ Sitemap.xml
- ✅ Robots.txt

### On-Page SEO
- ✅ Unique page titles
- ✅ Meta descriptions (150-160 characters)
- ✅ Keyword optimization
- ✅ Header hierarchy (H1, H2, H3)
- ✅ Alt text for images
- ✅ Internal linking

### Local SEO
- ✅ LocalBusiness structured data
- ✅ Atlanta, GA targeting
- ✅ Service area defined
- ✅ Business hours listed
- ✅ Contact information

### Social Media SEO
- ✅ Open Graph tags (Facebook)
- ✅ Twitter Card tags
- ✅ Social media preview images
- ✅ Shareable content

---

## 🛠️ Maintenance & Updates

### Update Tracking IDs
Edit `src/config/analytics.js`:
```javascript
gaTrackingId: 'YOUR-NEW-GA-ID',
gtmId: 'YOUR-NEW-GTM-ID'
```

### Update SEO Content
Edit `src/config/seo.js`:
- Modify page titles/descriptions
- Update keywords
- Change business information
- Adjust structured data

### Update Sitemap
Edit `public/sitemap.xml`:
- Add new pages
- Update priorities
- Change frequencies
- Update lastmod dates

### Update Domain
Current domain: `https://kingandcarter.com`

Configured in:
- ✅ `public/sitemap.xml`
- ✅ `public/robots.txt`
- ✅ `src/config/seo.js` (canonical URLs)

---

## 📦 Dependencies

```json
{
  "@vercel/analytics": "^1.x.x",
  "@vercel/speed-insights": "^1.x.x"
}
```

Install:
```bash
npm install @vercel/analytics @vercel/speed-insights
```

---

## 🧪 Testing

### Verify Analytics
1. Open browser DevTools → Network tab
2. Filter by "gtag" or "gtm"
3. Navigate between pages
4. Confirm tracking requests

### Verify SEO
1. View page source (Ctrl+U)
2. Check meta tags in `<head>`
3. Verify structured data
4. Test with [Google Rich Results Test](https://search.google.com/test/rich-results)

### Verify Sitemap
1. Visit `/sitemap.xml`
2. Confirm all pages listed
3. Submit to [Google Search Console](https://search.google.com/search-console)

---

## 📝 Notes

- Analytics only active in **production** (`import.meta.env.PROD`)
- Development mode disables tracking to avoid skewing data
- Vercel Analytics works automatically on Vercel deployments
- Update domain references before production deployment
- Submit sitemap to Google Search Console after deployment

---

## 🔗 Useful Links

- [Google Analytics Dashboard](https://analytics.google.com/)
- [Google Tag Manager Dashboard](https://tagmanager.google.com/)
- [Google Search Console](https://search.google.com/search-console)
- [Vercel Analytics Dashboard](https://vercel.com/analytics)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Documentation](https://schema.org/)
