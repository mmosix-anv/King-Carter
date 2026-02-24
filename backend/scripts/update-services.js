const axios = require('axios');

const servicesData = {
  'private-luxury-transport': {
    id: 'private-luxury-transport',
    heroTitle: 'Private Luxury Transport',
    heroTagline: 'Designed for individuals and families seeking comfort, privacy, and reliability.',
    heroImage: '/image/mltqxr0s-tvy6qwy.png',
    description: [
      'Our private luxury transport service offers a discreet, personalized travel experience tailored to your preferences. Whether for daily commutes, special occasions, or leisure travel, we provide premium vehicles and professional chauffeurs dedicated to your comfort and privacy.',
      'Each journey is crafted with attention to detail, ensuring a seamless experience from pickup to destination. Our chauffeurs are trained to provide the highest level of discretion and professionalism, allowing you to relax, work, or simply enjoy the ride.',
      'We understand that privacy and comfort are paramount. Our fleet of premium SUVs and sedans offers spacious interiors, climate control, and amenities designed to make every trip exceptional. From flexible scheduling to door-to-door service, we adapt to your needs.',
      'Whether you\'re traveling for business, pleasure, or family occasions, our private luxury transport service delivers reliability and elegance. Experience transportation that respects your time, values your privacy, and exceeds your expectations.',
      'Trust King & Carter Premier to provide a refined, thoughtful approach to private travel. Every detail is considered, every journey is personalized, and every client is treated with the utmost care and respect.'
    ],
    highlights: [
      'Discreet Chauffeurs',
      'Premium SUVs',
      'Privacy-Focused Travel',
      'Flexible Scheduling',
      'Door-to-Door Service',
      'Refined Presentation'
    ],
    images: [
      '/image/mltqxr0s-tvy6qwy.png',
      '/image/mltqxr0s-0ykx36e.png',
      '/image/mltqxr0s-5bj4l8e.png',
      '/image/mltqxr0s-koo2o1u.png',
      '/image/mltqxr0s-hynsmyb.png',
      '/image/mltqxr0s-3fog7d9.png',
      '/image/mltqxr0s-ch5rmk1.png'
    ],
    cta: {
      text: 'Travel, Thoughtfully Arranged',
      buttonLabel: 'Book Private Transport'
    }
  },
  'corporate-executive-travel': {
    id: 'corporate-executive-travel',
    heroTitle: 'Corporate & Executive Travel',
    heroTagline: 'Professional transportation solutions for business leaders and corporate teams.',
    heroImage: '/image/mltqxr0s-0ykx36e.png',
    description: [
      'Our corporate and executive travel service is designed for business professionals who demand reliability, punctuality, and professionalism. We understand that time is your most valuable asset, and our service is built to maximize efficiency while maintaining the highest standards of comfort.',
      'From airport transfers to multi-city business trips, our experienced chauffeurs ensure you arrive on time, every time. Our fleet of executive vehicles provides a mobile office environment, allowing you to prepare for meetings, make calls, or simply relax between appointments.',
      'We offer flexible corporate accounts, priority scheduling, and dedicated account management to streamline your business travel needs. Whether you\'re hosting clients, attending conferences, or managing a busy executive schedule, we provide seamless transportation solutions.',
      'Our commitment to discretion and professionalism means your business conversations remain private, and your travel experience reflects the excellence of your organization. We work with your schedule, adapt to last-minute changes, and ensure every journey supports your business objectives.',
      'Partner with King & Carter Premier for corporate travel that enhances productivity, projects professionalism, and delivers consistent excellence. Your success is our priority, and we\'re dedicated to providing transportation that meets the demands of modern business.'
    ],
    highlights: [
      'Punctual & Reliable Service',
      'Executive Fleet Vehicles',
      'Corporate Account Management',
      'Mobile Office Environment',
      'Professional Chauffeurs',
      'Flexible Scheduling',
      'Confidential & Discreet',
      'Priority Booking'
    ],
    images: [
      '/image/mltqxr0s-tvy6qwy.png',
      '/image/mltqxr0s-0ykx36e.png',
      '/image/mltqxr0s-5bj4l8e.png',
      '/image/mltqxr0s-koo2o1u.png',
      '/image/mltqxr0s-hynsmyb.png',
      '/image/mltqxr0s-3fog7d9.png',
      '/image/mltqxr0s-ch5rmk1.png'
    ],
    cta: {
      text: 'Elevate Your Business Travel',
      buttonLabel: 'Book Corporate Service'
    }
  },
  'airport-hotel-transfers': {
    id: 'airport-hotel-transfers',
    heroTitle: 'Airport & Hotel Transfers',
    heroTagline: 'Seamless, punctual transfers for stress-free arrivals and departures.',
    heroImage: '/image/mltqxr0s-5bj4l8e.png',
    description: [
      'Our airport and hotel transfer service eliminates the stress of travel logistics, providing reliable, comfortable transportation between airports, hotels, and destinations. We monitor flight schedules in real-time, ensuring your chauffeur is ready when you arrive, regardless of delays or early arrivals.',
      'From the moment you book, we handle every detail. Our chauffeurs track your flight, adjust pickup times automatically, and greet you with professionalism and courtesy. Whether you\'re arriving for business or leisure, we ensure a smooth transition from airport to destination.',
      'We understand that travel can be unpredictable. Our service includes flight monitoring, flexible pickup windows, and assistance with luggage. Our vehicles are spacious, comfortable, and equipped to make your transfer as relaxing as possible after a long flight.',
      'For hotel transfers, we provide prompt, reliable service that respects your schedule. Whether you need early morning airport runs or late-night pickups, our 24/7 availability ensures you\'re never left waiting. We serve all major airports and hotels in the region.',
      'Choose King & Carter Premier for transfers that prioritize your comfort, respect your time, and deliver peace of mind. Start and end your journey with the reliability and elegance you deserve.'
    ],
    highlights: [
      'Real-Time Flight Monitoring',
      '24/7 Availability',
      'Meet & Greet Service',
      'Luggage Assistance',
      'Spacious Vehicles',
      'All Major Airports Covered',
      'Hotel Coordination',
      'Flexible Pickup Windows'
    ],
    images: [
      '/image/mltqxr0s-tvy6qwy.png',
      '/image/mltqxr0s-0ykx36e.png',
      '/image/mltqxr0s-5bj4l8e.png',
      '/image/mltqxr0s-koo2o1u.png',
      '/image/mltqxr0s-hynsmyb.png',
      '/image/mltqxr0s-3fog7d9.png',
      '/image/mltqxr0s-ch5rmk1.png'
    ],
    cta: {
      text: 'Arrive in Comfort and Style',
      buttonLabel: 'Book Transfer Service'
    }
  },
  'special-engagements-events': {
    id: 'special-engagements-events',
    heroTitle: 'Special Engagements & Events',
    heroTagline: 'Elegant transportation for weddings, galas, and memorable occasions.',
    heroImage: '/image/mltqxr0s-koo2o1u.png',
    description: [
      'Our special engagements and events service is designed to make your most important occasions truly unforgettable. From weddings and anniversaries to galas and milestone celebrations, we provide elegant transportation that complements the significance of your event.',
      'We understand that special occasions require meticulous planning and flawless execution. Our team works closely with you to coordinate timing, routes, and special requests, ensuring transportation seamlessly integrates with your event schedule. Every detail is managed with care and precision.',
      'Our premium fleet is impeccably maintained and presented, providing a stunning backdrop for photos and a luxurious experience for you and your guests. Whether you need transportation for the wedding party, VIP guests, or multi-vehicle coordination, we deliver excellence.',
      'From red carpet arrivals to intimate celebrations, our chauffeurs are trained to provide service that matches the elegance of your event. We handle logistics so you can focus on creating memories, knowing that transportation is in expert hands.',
      'Trust King & Carter Premier to elevate your special occasions with transportation that reflects the importance of your celebration. We\'re honored to be part of your most cherished moments and committed to making them extraordinary.'
    ],
    highlights: [
      'Wedding Transportation',
      'Gala & Formal Events',
      'Anniversary Celebrations',
      'Multi-Vehicle Coordination',
      'Red Carpet Service',
      'Event Planning Support',
      'Impeccably Presented Fleet',
      'Customized Packages',
      'Professional Event Chauffeurs'
    ],
    images: [
      '/image/mltqxr0s-tvy6qwy.png',
      '/image/mltqxr0s-0ykx36e.png',
      '/image/mltqxr0s-5bj4l8e.png',
      '/image/mltqxr0s-koo2o1u.png',
      '/image/mltqxr0s-hynsmyb.png',
      '/image/mltqxr0s-3fog7d9.png',
      '/image/mltqxr0s-ch5rmk1.png'
    ],
    cta: {
      text: 'Make Your Occasion Unforgettable',
      buttonLabel: 'Book Event Transportation'
    }
  }
};

async function main() {
  const API_URL = 'http://localhost:1337/api';
  
  console.log('='.repeat(60));
  console.log('Service Update Script');
  console.log('='.repeat(60));
  console.log('Updating services with complete data from src/data/services.js\n');

  let updated = 0;
  let failed = 0;

  for (const [key, service] of Object.entries(servicesData)) {
    try {
      // First, get the existing service to find its document ID
      const response = await axios.get(`${API_URL}/services`, {
        params: {
          'filters[serviceId][$eq]': service.id
        }
      });

      if (response.data.data.length === 0) {
        console.log(`✗ ${service.heroTitle}: Not found in database`);
        failed++;
        continue;
      }

      const existingService = response.data.data[0];
      const documentId = existingService.documentId;

      // Update the service
      await axios.put(`${API_URL}/services/${documentId}`, {
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
      
      console.log(`✓ ${service.heroTitle}: Updated successfully`);
      updated++;
    } catch (error) {
      console.error(`✗ ${service.heroTitle}: Failed`);
      if (error.response) {
        console.error('  Status:', error.response.status);
        console.error('  Data:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.error('  Error:', error.message);
        console.error('  Stack:', error.stack);
      }
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Update Summary:');
  console.log(`  Updated: ${updated}`);
  console.log(`  Failed: ${failed}`);
  console.log('='.repeat(60));
}

main().catch(error => {
  console.error('Update failed:', error);
  process.exit(1);
});
