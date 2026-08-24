/*
 * SEO configuration for King & Carter Premier
 * Source: King & Carter SEO Implementation Guide (August 2026) + Page 3 supplement.
 *
 * One primary keyword theme per page. Secondary keywords support the topic and are
 * not all forced into visible copy. Titles and descriptions are unique per page.
 *
 * Shared deliberately: the Express server (server/index.ts) injects these into the
 * HTML shell before it is sent, so crawlers that do not run JavaScript still see the
 * right metadata, and the client (hooks/useSEO.ts) keeps them in step on client-side
 * navigation. Both read this one file.
 *
 * ADDING A ROUTE: add it to `pageSEO` (or `servicePageSEO`) AND to `App.tsx`.
 * `isKnownRoute` below drives the HTTP status code, so a route missing from here is
 * served with a 404 status even though the page still renders.
 */

export const seoConfig = {
  siteName: 'King & Carter Premier',
  siteUrl: 'https://kingandcarter.com',
  defaultTitle: 'Luxury Transportation & Chauffeur Service Atlanta | King & Carter',
  defaultDescription:
    'King & Carter provides luxury transportation and professional chauffeur service in Atlanta for private travel, executives, airport transfers, special events and curated experiences.',
  defaultImage: 'https://kingandcarter.com/images/hero-escalade.webp',
  author: 'King & Carter Premier',
  twitterHandle: '@kingandcarter',
  telephone: '+1-770-766-0383',
  email: 'info@kingandcarter.com',

  /* Site-wide fallback keywords. Page-level `keywords` override this. */
  keywords: [
    'luxury transportation Atlanta',
    'chauffeur service Atlanta',
    'private car service Atlanta',
    'executive transportation Atlanta',
    'Atlanta black car service',
    'Atlanta airport car service',
    'luxury ground transportation Atlanta',
    'luxury transportation Georgia',
  ],

  organization: {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://kingandcarter.com/#organization',
    name: 'King & Carter Premier',
    description:
      'Atlanta luxury transportation company providing private chauffeured travel, executive and corporate transportation, airport transfers, event transportation and curated Atlanta experiences.',
    url: 'https://kingandcarter.com',
    telephone: '+1-770-766-0383',
    email: 'info@kingandcarter.com',
    image: 'https://kingandcarter.com/images/hero-escalade.webp',
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Atlanta',
      addressRegion: 'GA',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '33.7490',
      longitude: '-84.3880',
    },
    areaServed: [
      { '@type': 'City', name: 'Atlanta' },
      { '@type': 'State', name: 'Georgia' },
    ],
    knowsAbout: [
      'Luxury Transportation Atlanta',
      'Private Car Service Atlanta',
      'Executive Transportation Atlanta',
      'Atlanta Airport Car Service',
      'Event Transportation Atlanta',
    ],
  },
} as const;

export interface PageSEO {
  /** Unique <title>. */
  title: string;
  /** Unique meta description. */
  description: string;
  /** Comma-joined page keywords: primary first, then supporting terms. */
  keywords: string;
  /** Absolute og:image URL. Falls back to seoConfig.defaultImage. */
  image?: string;
  /** Keep the page out of the index (utility, auth and duplicate pages). */
  noindex?: boolean;
  /** Recommended visible H1, where the page renders it from config. */
  h1?: string;
}

/* ── Primary pages, keyed by route ──────────────────────────────────────── */

export const pageSEO: Record<string, PageSEO> = {
  /* Primary keyword: Luxury Transportation Atlanta */
  '/': {
    title: 'Luxury Transportation & Chauffeur Service Atlanta | King & Carter',
    description:
      'Luxury transportation and professional chauffeur service in Atlanta for private travel, executives, airport transfers, special events and curated experiences.',
    keywords: [
      'luxury transportation Atlanta',
      'Atlanta luxury car service',
      'Atlanta black car service',
      'chauffeur service Atlanta',
      'private car service Atlanta',
      'executive transportation Atlanta',
      'luxury chauffeur service Atlanta',
      'premium ground transportation Atlanta',
      'luxury transportation Georgia',
    ].join(', '),
  },

  /* Primary keyword: Atlanta Luxury Transportation Company */
  '/about': {
    title: 'About King & Carter | Atlanta Luxury Transportation Company',
    description:
      'Discover King & Carter, an Atlanta luxury transportation company built around hospitality, discretion, intentional service and a distinctly Georgia legacy.',
    keywords: [
      'Atlanta luxury transportation company',
      'luxury transportation company Atlanta',
      'Atlanta chauffeur company',
      'Atlanta black car company',
      'premium transportation company Atlanta',
      'private transportation company Atlanta',
      'luxury ground transportation Atlanta',
      'Georgia luxury transportation company',
    ].join(', '),
    image: 'https://kingandcarter.com/images/about-hero.webp',
  },

  /* Primary keyword: Luxury Experiences Atlanta */
  '/experience': {
    title: 'Luxury & Private Experiences Atlanta | King & Carter',
    description:
      'Discover curated Atlanta experiences by King & Carter, combining private transportation with culture, dining, entertainment and personalized hospitality.',
    keywords: [
      'luxury experiences Atlanta',
      'private experiences Atlanta',
      'curated experiences Atlanta',
      'luxury Atlanta experiences',
      'private Atlanta tours',
      'luxury Atlanta tours',
      'chauffeured Atlanta tours',
      'Atlanta cultural experiences',
      'VIP experiences Atlanta',
      'private dining experiences Atlanta',
      'Atlanta luxury lifestyle experiences',
      'Atlanta sightseeing private tour',
    ].join(', '),
    image: 'https://kingandcarter.com/images/kc-hero-chauffeur.jpg',
  },

  /* Primary keyword: Luxury Chauffeur Fleet Atlanta */
  '/fleet': {
    title: 'Luxury Chauffeur Fleet Atlanta | SUVs & Sprinters | King & Carter',
    description:
      "Explore King & Carter's Atlanta luxury transportation fleet: executive SUVs, Suburbans, Escalades, Sprinter vans and ultra-luxury vehicles by request.",
    keywords: [
      'luxury chauffeur fleet Atlanta',
      'luxury SUV service Atlanta',
      'executive SUV Atlanta',
      'chauffeured SUV Atlanta',
      'black SUV service Atlanta',
      'Chevrolet Suburban chauffeur Atlanta',
      'Cadillac Escalade chauffeur Atlanta',
      'executive Sprinter Atlanta',
      'Sprinter van service Atlanta',
      'luxury Sprinter Atlanta',
      'Mercedes Maybach chauffeur Atlanta',
      'Rolls Royce chauffeur Atlanta',
      'luxury vehicle service Atlanta',
    ].join(', '),
    image: 'https://kingandcarter.com/images/fleet-hero.jpg',
  },

  '/contact': {
    title: 'Contact King & Carter | Luxury Transportation Atlanta',
    description:
      'Contact King & Carter to arrange luxury transportation in Atlanta. Speak with our concierge about private travel, executive journeys, airport transfers and events.',
    keywords: [
      'contact luxury car service Atlanta',
      'book chauffeur service Atlanta',
      'Atlanta luxury transportation quote',
      'request private car service Atlanta',
    ].join(', '),
  },

  '/reservations': {
    title: 'Book Luxury Transportation Atlanta | Reserve | King & Carter',
    description:
      'Reserve luxury transportation in Atlanta with King & Carter. Book a professional chauffeur for private travel, airport transfers and special occasions.',
    keywords: [
      'book luxury transportation Atlanta',
      'reserve chauffeur Atlanta',
      'book car service Atlanta',
      'Atlanta chauffeur booking',
    ].join(', '),
  },

  '/become-a-member': {
    title: 'Membership | Luxury Transportation Atlanta | King & Carter',
    description:
      'Join the King & Carter membership for priority access to luxury transportation in Atlanta, preferred scheduling and invitations to curated experiences.',
    keywords: [
      'luxury transportation membership Atlanta',
      'private car service membership Atlanta',
      'VIP transportation Atlanta',
      'priority chauffeur service Atlanta',
    ].join(', '),
  },

  '/terms': {
    title: 'Terms of Service | King & Carter',
    description:
      'Terms of service for King & Carter luxury transportation in Atlanta, covering reservations, cancellations, conduct and service conditions.',
    keywords: 'King & Carter terms of service',
  },

  '/privacy': {
    title: 'Privacy Policy | King & Carter',
    description:
      'How King & Carter collects, uses and protects personal information for luxury transportation clients in Atlanta.',
    keywords: 'King & Carter privacy policy',
  },

  /* Utility and auth pages: reachable, but kept out of the index. */
  '/login': {
    title: 'Client Login | King & Carter',
    description: 'Sign in to your King & Carter client account.',
    keywords: '',
    noindex: true,
  },
  '/test': {
    title: 'Test | King & Carter',
    description: 'Internal test page.',
    keywords: '',
    noindex: true,
  },


  /* Partner staging pages: shared with a venue for review, so noindex and kept
     out of the sitemap. They must stay listed here regardless - isKnownRoute
     drives the HTTP status, so a missing entry would serve them as a 404. */
  "/aero-center": {
    title: "Aero Center × King & Carter | Executive Transportation",
    description:
      "Private chauffeur and executive transportation for guests of Aero Center in Atlanta, provided by King & Carter.",
    keywords: "Aero Center Atlanta car service, private aviation transportation Atlanta, FBO car service ATL, executive car service for private jets Atlanta, King & Carter Aero Center",
    noindex: true,
  },
  "/hyatt-atlanta": {
    title: "Hyatt Regency Atlanta × King & Carter | Executive Transportation",
    description:
      "Private chauffeur and executive transportation for guests of Hyatt Regency Atlanta, provided by King & Carter.",
    keywords: "Hyatt Regency Atlanta car service, Atlanta hotel transportation, luxury car service Hyatt Atlanta, chauffeur service for hotel guests Atlanta, King & Carter Hyatt Atlanta",
    noindex: true,
  },
  "/hotel-phoenix": {
    title: "Hotel Phoenix × King & Carter | Executive Transportation",
    description:
      "Private chauffeur and executive transportation for guests of Hotel Phoenix in Atlanta, provided by King & Carter.",
    keywords: "Hotel Phoenix Atlanta car service, Atlanta hotel transportation, luxury car service Hotel Phoenix, chauffeur service for hotel guests Atlanta, King & Carter Hotel Phoenix",
    noindex: true,
    image: "/images/hotelphoenix.jpg",
  },
};

/* ── Service pages, keyed by Supabase slug ──────────────────────────────── */

export const servicePageSEO: Record<string, PageSEO & { h1: string }> = {
  /* Page 2 — Primary keyword: Private Car Service Atlanta */
  'private-luxury-transport': {
    title: 'Private Car & Chauffeur Service Atlanta | King & Carter',
    description:
      'Private car service in Atlanta with King & Carter. Professional chauffeurs, luxury vehicles and discreet, hospitality-driven transportation tailored to you.',
    h1: 'Private Luxury Transportation in Atlanta',
    keywords: [
      'private car service Atlanta',
      'private chauffeur Atlanta',
      'private driver Atlanta',
      'luxury car service Atlanta',
      'Atlanta private transportation',
      'chauffeur service Atlanta',
      'luxury chauffeur Atlanta',
      'black car service Atlanta',
      'private luxury transportation Atlanta',
      'personal chauffeur Atlanta',
    ].join(', '),
  },

  /* Page 3 — Primary keyword: Executive Transportation Atlanta */
  'corporate-executive-travel': {
    title: 'Executive & Corporate Transportation Atlanta | King & Carter',
    description:
      'Corporate and executive transportation in Atlanta with professional chauffeurs, premium vehicles, airport transfers, hourly service and coordinated business travel.',
    h1: 'Corporate & Executive Transportation in Atlanta',
    keywords: [
      'executive transportation Atlanta',
      'corporate transportation Atlanta',
      'executive car service Atlanta',
      'corporate car service Atlanta',
      'executive chauffeur service Atlanta',
      'corporate chauffeur service Atlanta',
      'business transportation Atlanta',
      'Atlanta executive transportation',
      'Atlanta corporate transportation',
      'executive black car service Atlanta',
      'corporate black car service Atlanta',
      'corporate airport transportation Atlanta',
      'executive airport transportation Atlanta',
      'executive SUV service Atlanta',
      'business car service Atlanta',
      'corporate travel transportation Atlanta',
      'corporate event transportation Atlanta',
      'executive driver Atlanta',
      'chauffeur for business travel Atlanta',
    ].join(', '),
  },

  /* Page 4 — Primary keyword: Atlanta Airport Car Service */
  'airport-hotel-transfers': {
    title: 'Atlanta Airport Car Service & Private Transfers | King & Carter',
    description:
      'Atlanta airport car service and private ATL transfers with professional chauffeurs, flight monitoring and luxury hotel transportation. Book King & Carter.',
    h1: 'Luxury Airport & Hotel Transportation in Atlanta',
    keywords: [
      'Atlanta airport car service',
      'ATL airport car service',
      'Atlanta airport black car service',
      'Atlanta airport transportation',
      'Atlanta airport chauffeur service',
      'private airport transportation Atlanta',
      'luxury airport transportation Atlanta',
      'Atlanta airport transfer',
      'private airport transfer Atlanta',
      'chauffeur to Atlanta airport',
      'Atlanta hotel transportation',
      'Atlanta airport pickup service',
      'Atlanta airport SUV service',
    ].join(', '),
  },

  /* Page 5 — Primary keyword: Event Transportation Atlanta */
  'special-engagements-events': {
    title: 'Luxury Event Transportation Atlanta | King & Carter',
    description:
      'Luxury event transportation in Atlanta with professional chauffeurs and premium vehicles for weddings, concerts, galas and private or corporate engagements.',
    h1: "Transportation for Atlanta's Special Engagements & Events",
    keywords: [
      'event transportation Atlanta',
      'luxury event transportation Atlanta',
      'special event transportation Atlanta',
      'chauffeur service for events Atlanta',
      'private event transportation Atlanta',
      'VIP transportation Atlanta',
      'corporate event transportation Atlanta',
      'wedding transportation Atlanta',
      'concert transportation Atlanta',
      'Atlanta nightlife transportation',
      'luxury SUV event transportation Atlanta',
      'group event transportation Atlanta',
      'special occasion chauffeur Atlanta',
    ].join(', '),
  },
};

/* ── Route resolution, shared by the server and the client ──────────────── */

/** Strips a trailing slash so `/about/` and `/about` resolve identically. */
export function normalizePath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

/**
 * Metadata for a path, or `undefined` when the path has none (admin, unknown).
 * Service pages resolve through their slug.
 */
export function resolvePageSEO(pathname: string): PageSEO | undefined {
  const path = normalizePath(pathname);

  const direct = pageSEO[path];
  if (direct) return direct;

  const serviceMatch = /^\/services\/([^/]+)$/.exec(path);
  if (serviceMatch) return servicePageSEO[serviceMatch[1]];

  return undefined;
}

/**
 * Whether a path is a real route. Drives the HTTP status the server returns, so
 * unmatched URLs get a genuine 404 instead of a soft 404 with a 200 status.
 */
export function isKnownRoute(pathname: string): boolean {
  const path = normalizePath(pathname);

  if (resolvePageSEO(path)) return true;
  if (path === '/404') return true;
  // Admin routes are dynamic (/admin/services/:id) and are noindex anyway.
  if (path === '/admin' || path.startsWith('/admin/')) return true;

  return false;
}