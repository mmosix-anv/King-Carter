const axios = require('axios');

const servicesData = {
  'private-luxury-transport': {
    id: 'private-luxury-transport',
    heroTitle: 'Private Luxury Transport',
    heroTagline: 'Designed for individuals and families seeking comfort, privacy, and reliability.',
    heroImage: '/image/mltqxr0s-tvy6qwy.png',
    description: [
      'Our private luxury transport service offers a discreet, personalized travel experience tailored to your preferences.',
      'Each journey is crafted with attention to detail, ensuring a seamless experience from pickup to destination.',
      'We understand that privacy and comfort are paramount. Our fleet of premium SUVs and sedans offers spacious interiors.',
      'Whether you\'re traveling for business, pleasure, or family occasions, our private luxury transport service delivers reliability.',
      'Trust King & Carter Premier to provide a refined, thoughtful approach to private travel.'
    ],
    highlights: ['Discreet Chauffeurs', 'Premium SUVs', 'Privacy-Focused Travel', 'Flexible Scheduling', 'Door-to-Door Service', 'Refined Presentation'],
    images: ['/image/mltqxr0s-tvy6qwy.png', '/image/mltqxr0s-0ykx36e.png', '/image/mltqxr0s-5bj4l8e.png', '/image/mltqxr0s-koo2o1u.png', '/image/mltqxr0s-hynsmyb.png', '/image/mltqxr0s-3fog7d9.png', '/image/mltqxr0s-ch5rmk1.png'],
    cta: {text: 'Travel, Thoughtfully Arranged', buttonLabel: 'Book Private Transport'}
  },
  'corporate-executive-travel': {
    id: 'corporate-executive-travel',
    heroTitle: 'Corporate & Executive Travel',
    heroTagline: 'Professional transportation solutions for business leaders and corporate teams.',
    heroImage: '/image/mltqxr0s-0ykx36e.png',
    description: [
      'Our corporate and executive travel service is designed for business professionals who demand reliability.',
      'From airport transfers to multi-city business trips, our experienced chauffeurs ensure you arrive on time.',
      'We offer flexible corporate accounts, priority scheduling, and dedicated account management.',
      'Our commitment to discretion and professionalism means your business conversations remain private.',
      'Partner with King & Carter Premier for corporate travel that enhances productivity.'
    ],
    highlights: ['Punctual & Reliable Service', 'Executive Fleet Vehicles', 'Corporate Account Management', 'Mobile Office Environment', 'Professional Chauffeurs', 'Flexible Scheduling', 'Confidential & Discreet', 'Priority Booking'],
    images: ['/image/mltqxr0s-tvy6qwy.png', '/image/mltqxr0s-0ykx36e.png', '/image/mltqxr0s-5bj4l8e.png', '/image/mltqxr0s-koo2o1u.png', '/image/mltqxr0s-hynsmyb.png', '/image/mltqxr0s-3fog7d9.png', '/image/mltqxr0s-ch5rmk1.png'],
    cta: {text: 'Elevate Your Business Travel', buttonLabel: 'Book Corporate Service'}
  },
  'airport-hotel-transfers': {
    id: 'airport-hotel-transfers',
    heroTitle: 'Airport & Hotel Transfers',
    heroTagline: 'Seamless, punctual transfers for stress-free arrivals and departures.',
    heroImage: '/image/mltqxr0s-5bj4l8e.png',
    description: [
      'Our airport and hotel transfer service eliminates the stress of travel logistics.',
      'From the moment you book, we handle every detail.',
      'We understand that travel can be unpredictable.',
      'For hotel transfers, we provide prompt, reliable service that respects your schedule.',
      'Experience the difference of professional airport and hotel transfer service.'
    ],
    highlights: ['Flight Monitoring', 'Meet & Greet Service', '24/7 Availability', 'Luggage Assistance', 'All Major Airports', 'Hotel Coordination', 'Flexible Pickup Windows', 'Professional Drivers'],
    images: ['/image/mltqxr0s-tvy6qwy.png', '/image/mltqxr0s-0ykx36e.png', '/image/mltqxr0s-5bj4l8e.png', '/image/mltqxr0s-koo2o1u.png', '/image/mltqxr0s-hynsmyb.png', '/image/mltqxr0s-3fog7d9.png', '/image/mltqxr0s-ch5rmk1.png'],
    cta: {text: 'Arrive in Comfort and Style', buttonLabel: 'Book Airport Transfer'}
  },
  'special-engagements-events': {
    id: 'special-engagements-events',
    heroTitle: 'Special Engagements & Events',
    heroTagline: 'Elegant transportation for weddings, galas, and memorable occasions.',
    heroImage: '/image/mltqxr0s-koo2o1u.png',
    description: [
      'Your special occasions deserve transportation that matches their significance.',
      'From weddings to galas, corporate events to milestone celebrations, we provide elegant transportation.',
      'Our chauffeurs understand the importance of timing and presentation for special events.',
      'We work closely with event planners, venues, and coordinators to ensure seamless transportation.',
      'Make your special occasion truly unforgettable with transportation that reflects the elegance of your event.'
    ],
    highlights: ['Wedding Transportation', 'Gala & Black-Tie Events', 'Corporate Functions', 'Anniversary Celebrations', 'Impeccably Presented Fleet', 'Event Coordination', 'Flexible Scheduling', 'Professional Chauffeurs'],
    images: ['/image/mltqxr0s-tvy6qwy.png', '/image/mltqxr0s-0ykx36e.png', '/image/mltqxr0s-5bj4l8e.png', '/image/mltqxr0s-koo2o1u.png', '/image/mltqxr0s-hynsmyb.png', '/image/mltqxr0s-3fog7d9.png', '/image/mltqxr0s-ch5rmk1.png'],
    cta: {text: 'Make Your Occasion Unforgettable', buttonLabel: 'Book Event Transportation'}
  }
};

async function main() {
  const API_URL = 'http://localhost:1337/api';
  
  console.log('Starting migration...');
  console.log('Make sure Strapi is running on http://localhost:1337\n');

  for (const [key, service] of Object.entries(servicesData)) {
    try {
      await axios.post(`${API_URL}/services`, {
        data: {
          serviceId: service.id,
          heroTitle: service.heroTitle,
          heroTagline: service.heroTagline,
          heroImage: service.heroImage,
          description: service.description,
          highlights: service.highlights,
          images: service.images,
          cta: service.cta,
        },
      });
      console.log(`✓ Migrated: ${service.heroTitle}`);
    } catch (error) {
      console.error(`✗ Failed to migrate ${service.heroTitle}:`, error.response?.data || error.message);
    }
  }

  console.log('\nMigration complete!');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
