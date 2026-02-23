// Google Analytics & Tag Manager Configuration
// Update these IDs with your actual tracking IDs

export const analyticsConfig = {
  // Google Analytics 4 Measurement ID (format: G-XXXXXXXXXX)
  gaTrackingId: 'G-XXXXXXXXXX',
  
  // Google Tag Manager ID (format: GTM-XXXXXXX)
  gtmId: 'GTM-XXXXXXX',
  
  // Enable/disable tracking (set to false in development)
  enabled: import.meta.env.PROD
};

// Initialize Google Analytics
export const initGA = () => {
  if (!analyticsConfig.enabled || !analyticsConfig.gaTrackingId) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.gaTrackingId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', analyticsConfig.gaTrackingId);
};

// Initialize Google Tag Manager
export const initGTM = () => {
  if (!analyticsConfig.enabled || !analyticsConfig.gtmId) return;

  // GTM script
  const script = document.createElement('script');
  script.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${analyticsConfig.gtmId}');
  `;
  document.head.appendChild(script);

  // GTM noscript
  const noscript = document.createElement('noscript');
  noscript.innerHTML = `
    <iframe src="https://www.googletagmanager.com/ns.html?id=${analyticsConfig.gtmId}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe>
  `;
  document.body.insertBefore(noscript, document.body.firstChild);
};

// Track page views
export const trackPageView = (url) => {
  if (!analyticsConfig.enabled || !window.gtag) return;
  window.gtag('config', analyticsConfig.gaTrackingId, {
    page_path: url
  });
};

// Track events
export const trackEvent = (action, category, label, value) => {
  if (!analyticsConfig.enabled || !window.gtag) return;
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value
  });
};
