// King & Carter Brochure - Image URLs and Content Constants

// Logo local URL
export const LOGO_URL = "/images/logo.png";

export const IMAGES = {
  // Hero — Cadillac Escalade V-Series at luxury hotel
  hero: "/images/hero.jpg",
  // Suburban at airport/private aviation
  gridAirport: "/images/grid-airport.jpg",
  // Fleet lineup at luxury hotel entrance
  gridFleetHotel: "/images/grid-fleet-hotel.jpg",
  // Luxury vehicle interior
  gridInterior: "/images/grid-interior.jpg",
  // Atlanta skyline at twilight
  atlantaSkyline: "/images/atlanta-skyline.jpg",
  // Chevy Suburban on city street at night
  suburbanCity: "/images/suburban-city.jpg",
  // Escalade V-Series at luxury hotel with chauffeur
  escaladePrivate: "/images/escalade-private.jpg",
  // Escalade fleet at corporate tower with Atlanta skyline
  escaladeFleet: "/images/escalade-fleet.jpg",
  // Suburban fleet lineup at corporate building
  suburbanFleet: "/images/suburban-fleet.jpg",
  // Atlanta Buckhead district
  atlantaBuckhead: "/images/atlanta-buckhead.jpg",
  // Atlanta event venue
  atlantaEventVenue: "/images/atlanta-event-venue.jpg",
};

export const SERVICES = [
  {
    title: "Private Luxury Transport",
    description: "Bespoke ground transportation for individuals who value comfort, discretion, and a hospitality-first experience.",
    image: IMAGES.escaladePrivate,
  },
  {
    title: "Corporate & Executive Travel",
    description: "Reliable, professional transport solutions for executives and organizations requiring consistent, elevated service.",
    image: IMAGES.escaladeFleet,
  },
  {
    title: "Airport & Hotel Transfers",
    description: "Seamless arrivals and departures with professional coordination, flight tracking, and personalized meet-and-greet service.",
    image: IMAGES.gridAirport,
  },
  {
    title: "Special Events & Lifestyle",
    description: "Curated transport experiences for galas, weddings, corporate events, and exclusive lifestyle engagements.",
    image: IMAGES.atlantaEventVenue,
  },
];

export const TESTIMONIALS = [
  {
    category: "Private Transport",
    quote: "King & Carter transformed what used to be a stressful part of my day into something I genuinely look forward to. The attention to detail is remarkable.",
    attribution: "Private Client, Atlanta",
  },
  {
    category: "Corporate Travel",
    quote: "We've partnered with King & Carter for all our executive travel needs. Their professionalism and discretion are unmatched in the industry.",
    attribution: "Fortune 500 Executive",
  },
  {
    category: "Event Transport",
    quote: "From the initial booking to the final drop-off, every touchpoint was handled with grace and precision. True luxury is in the details.",
    attribution: "Event Planner, Georgia",
  },
  {
    category: "Airport Transfer",
    quote: "After a long international flight, being greeted by a King & Carter chauffeur felt like arriving home. The experience was seamless and deeply personal.",
    attribution: "Frequent Traveler",
  },
];

export const FLEET = {
  core: {
    title: "Core Fleet",
    subtitle: "Modern, black-on-black luxury vehicles",
    vehicles: ["Chevrolet Suburban", "Cadillac Escalade", "Executive Sprinter Vans"],
  },
  reserve: {
    title: "Reserve Collection",
    subtitle: "Ultra-luxury vehicles for select clients and special engagements",
    vehicles: ["Rolls-Royce Cullinan", "Rolls-Royce Ghost", "Mercedes-Maybach"],
    note: "Advance notice required. Pricing provided upon request.",
  },
};
