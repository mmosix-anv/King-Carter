// SEO Configuration for King & Carter Premier
// Target Market: Atlanta, GA and United States

export const seoConfig = {
  siteName: 'King & Carter Premier',
  siteUrl: 'https://kingandcarter.com',
  defaultTitle: 'King & Carter Premier | Luxury Ground Transportation in Atlanta',
  defaultDescription: 'Premium luxury transportation services in Atlanta, GA. Executive car service, airport transfers, corporate travel, and special event transportation. Professional chauffeurs, modern fleet, 24/7 availability.',
  
  keywords: [
    // Primary Keywords
    'luxury transportation Atlanta',
    'executive car service Atlanta',
    'private chauffeur Atlanta',
    'luxury car service Atlanta GA',
    
    // Service-Specific Keywords
    'airport transportation Atlanta',
    'corporate car service Atlanta',
    'Atlanta executive travel',
    'luxury airport transfer Atlanta',
    'private driver Atlanta',
    'chauffeur service Atlanta',
    
    // Event Keywords
    'wedding transportation Atlanta',
    'special event car service Atlanta',
    'Atlanta gala transportation',
    
    // Location Keywords
    'Hartsfield-Jackson airport transportation',
    'Buckhead car service',
    'Midtown Atlanta transportation',
    'Atlanta luxury ground transportation',
    
    // Premium Keywords
    'premium car service Atlanta',
    'high end transportation Atlanta',
    'VIP car service Atlanta',
    'luxury SUV service Atlanta',
    'black car service Atlanta'
  ],
  
  author: 'King & Carter Premier',
  twitterHandle: '@kingandcarter',
  
  // Structured Data
  organization: {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'King & Carter Premier',
    description: 'Premium luxury ground transportation services in Atlanta, Georgia',
    url: 'https://kingandcarter.com',
    telephone: '(770) 766-0383',
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Atlanta',
      addressRegion: 'GA',
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '33.7490',
      longitude: '-84.3880'
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Atlanta'
      },
      {
        '@type': 'State',
        name: 'Georgia'
      }
    ],
    serviceType: [
      'Luxury Transportation',
      'Executive Car Service',
      'Airport Transfer',
      'Corporate Travel',
      'Special Event Transportation'
    ]
  }
};

// Page-specific SEO configurations
export const pageSEO = {
  home: {
    title: 'Luxury Ground Transportation Atlanta | King & Carter Premier',
    description: 'Experience premium ground transportation in Atlanta. Professional chauffeurs, luxury vehicles, and exceptional service for executives, families, and special events. Book your ride today.',
    keywords: 'luxury transportation Atlanta, executive car service, private chauffeur Atlanta, premium ground transportation'
  },
  
  services: {
    'private-luxury-transport': {
      title: 'Private Luxury Transportation Atlanta | Executive Car Service',
      description: 'Discreet, personalized luxury transportation in Atlanta. Premium SUVs and sedans with professional chauffeurs for your comfort and privacy. Available 24/7.',
      keywords: 'private luxury transport Atlanta, executive car service, personal chauffeur Atlanta, luxury SUV service'
    },
    'corporate-executive-travel': {
      title: 'Corporate Car Service Atlanta | Executive Business Travel',
      description: 'Professional corporate transportation for Atlanta executives. Reliable, punctual service with mobile office environment. Corporate accounts available.',
      keywords: 'corporate car service Atlanta, executive travel, business transportation Atlanta, corporate chauffeur'
    },
    'airport-hotel-transfers': {
      title: 'Atlanta Airport Transportation | Hartsfield-Jackson Transfers',
      description: 'Seamless airport transfers to/from Hartsfield-Jackson Atlanta Airport. Flight monitoring, meet & greet service, 24/7 availability. Book your transfer now.',
      keywords: 'Atlanta airport transportation, Hartsfield-Jackson transfer, airport car service Atlanta, ATL airport shuttle'
    },
    'special-engagements-events': {
      title: 'Special Event Transportation Atlanta | Wedding & Gala Car Service',
      description: 'Elegant transportation for weddings, galas, and special occasions in Atlanta. Impeccably presented fleet and professional event chauffeurs.',
      keywords: 'wedding transportation Atlanta, special event car service, gala transportation Atlanta, luxury event transport'
    }
  },
  
  about: {
    title: 'About King & Carter Premier | Atlanta Luxury Transportation',
    description: 'Learn about King & Carter Premier, Atlanta\'s premier luxury ground transportation service. Our commitment to excellence, professionalism, and refined service.',
    keywords: 'about King Carter, luxury transportation company Atlanta, premium car service Atlanta'
  },
  
  contact: {
    title: 'Contact Us | Book Luxury Transportation in Atlanta',
    description: 'Contact King & Carter Premier for luxury transportation in Atlanta. Request a quote, book a ride, or inquire about our premium car services. Available 24/7.',
    keywords: 'contact luxury car service Atlanta, book transportation Atlanta, request quote car service'
  },
  
  experience: {
    title: 'Experience Premium Service | King & Carter Atlanta',
    description: 'Discover the King & Carter experience. Premium luxury transportation services designed for discerning individuals and businesses in Atlanta.',
    keywords: 'luxury experience Atlanta, premium car service, executive transportation experience'
  },
  
  membership: {
    title: 'Membership Services | Exclusive Transportation Atlanta',
    description: 'Join King & Carter Premier membership for exclusive benefits, priority booking, and personalized luxury transportation services in Atlanta.',
    keywords: 'luxury transportation membership Atlanta, exclusive car service, VIP transportation Atlanta'
  }
};
