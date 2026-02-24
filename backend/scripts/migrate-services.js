/**
 * Service Migration Script
 * 
 * Idempotent migration script that populates Strapi with service data from local services file.
 * Supports dry-run, validation, and force update modes.
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 9.1, 9.2, 9.3, 9.4, 9.5, 10.1, 10.2
 */

const fs = require('fs');
const path = require('path');

// Import service data from local services file
const servicesPath = path.join(__dirname, '../../src/data/services.js');
const servicesContent = fs.readFileSync(servicesPath, 'utf8');

// Service data - hardcoded from local services file for migration
const servicesData = {
  'private-luxury-transport': {
    id: 'private-luxury-transport',
    heroTitle: 'Private Luxury Transport',
    heroTagline: 'Designed for individuals and families seeking comfort, privacy, and reliability.',
    heroImage: '/image/mltqxr0s-tvy6qwy.png',
    featuredImage: '/image/mltqxr0s-tvy6qwy.png',
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
    featuredImage: '/image/mltqxr0s-0ykx36e.png',
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
    featuredImage: '/image/mltqxr0s-5bj4l8e.png',
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
    featuredImage: '/image/mltqxr0s-koo2o1u.png',
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

/**
 * Validates service data structure
 * @param {Object} service - Service data to validate
 * @returns {Object} Validation result with valid flag and errors array
 */
function validateServiceData(service) {
  const errors = [];

  // Check required string fields
  if (!service.id || typeof service.id !== 'string' || service.id.trim() === '') {
    errors.push('id must be a non-empty string');
  }
  if (!service.heroTitle || typeof service.heroTitle !== 'string' || service.heroTitle.trim() === '') {
    errors.push('heroTitle must be a non-empty string');
  }
  if (!service.heroTagline || typeof service.heroTagline !== 'string' || service.heroTagline.trim() === '') {
    errors.push('heroTagline must be a non-empty string');
  }
  if (!service.heroImage || typeof service.heroImage !== 'string' || service.heroImage.trim() === '') {
    errors.push('heroImage must be a non-empty string');
  }
  if (!service.featuredImage || typeof service.featuredImage !== 'string' || service.featuredImage.trim() === '') {
    errors.push('featuredImage must be a non-empty string');
  }

  // Check array fields
  if (!Array.isArray(service.description) || service.description.length === 0) {
    errors.push('description must be a non-empty array');
  } else if (!service.description.every(item => typeof item === 'string' && item.trim() !== '')) {
    errors.push('description must contain only non-empty strings');
  }

  if (!Array.isArray(service.highlights) || service.highlights.length === 0) {
    errors.push('highlights must be a non-empty array');
  } else if (!service.highlights.every(item => typeof item === 'string' && item.trim() !== '')) {
    errors.push('highlights must contain only non-empty strings');
  }

  if (!Array.isArray(service.images) || service.images.length === 0) {
    errors.push('images must be a non-empty array');
  } else if (!service.images.every(item => typeof item === 'string' && item.trim() !== '')) {
    errors.push('images must contain only non-empty strings');
  }

  // Check cta object
  if (!service.cta || typeof service.cta !== 'object' || Array.isArray(service.cta)) {
    errors.push('cta must be an object');
  } else {
    if (!service.cta.text || typeof service.cta.text !== 'string' || service.cta.text.trim() === '') {
      errors.push('cta.text must be a non-empty string');
    }
    if (!service.cta.buttonLabel || typeof service.cta.buttonLabel !== 'string' || service.cta.buttonLabel.trim() === '') {
      errors.push('cta.buttonLabel must be a non-empty string');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Migration options
 * @typedef {Object} MigrationOptions
 * @property {boolean} [dryRun=false] - Report changes without applying them
 * @property {boolean} [validate=false] - Check data integrity only
 * @property {boolean} [force=false] - Update existing services
 */

/**
 * Migration result
 * @typedef {Object} MigrationResult
 * @property {number} created - Number of services created
 * @property {number} updated - Number of services updated
 * @property {number} failed - Number of services that failed
 * @property {Array<{serviceId: string, error: string}>} errors - Array of errors
 */

/**
 * Main migration function
 * 
 * Migrates service data to Strapi with idempotency support.
 * - Checks for existing services by serviceId
 * - Updates existing services or creates new ones
 * - Validates data before database operations
 * - Returns detailed results
 * 
 * @param {MigrationOptions} options - Migration options
 * @returns {Promise<MigrationResult>} Migration results
 */
async function migrateServices(options = {}) {
  const { dryRun = false, validate = false, force = false } = options;

  const results = {
    created: 0,
    updated: 0,
    failed: 0,
    errors: []
  };

  console.log('='.repeat(60));
  console.log('Service Migration Script');
  console.log('='.repeat(60));
  
  if (dryRun) {
    console.log('MODE: Dry Run (no changes will be made)');
  } else if (validate) {
    console.log('MODE: Validation Only (checking data integrity)');
  } else {
    console.log('MODE: Migration (applying changes)');
  }
  console.log('');

  // Validation mode - just check data integrity
  if (validate) {
    console.log('Validating service data...\n');
    
    for (const [serviceId, serviceData] of Object.entries(servicesData)) {
      const validationResult = validateServiceData(serviceData);
      
      if (!validationResult.valid) {
        results.failed++;
        results.errors.push({
          serviceId,
          error: `Validation failed: ${validationResult.errors.join(', ')}`
        });
        console.log(`✗ ${serviceId}: INVALID`);
        validationResult.errors.forEach(err => console.log(`  - ${err}`));
      } else {
        console.log(`✓ ${serviceId}: Valid`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('Validation Summary:');
    console.log(`  Valid: ${Object.keys(servicesData).length - results.failed}`);
    console.log(`  Invalid: ${results.failed}`);
    console.log('='.repeat(60));

    return results;
  }

  // Process each service
  for (const [serviceId, serviceData] of Object.entries(servicesData)) {
    try {
      // Validate service data before processing
      const validationResult = validateServiceData(serviceData);
      
      if (!validationResult.valid) {
        results.failed++;
        results.errors.push({
          serviceId,
          error: `Validation failed: ${validationResult.errors.join(', ')}`
        });
        console.log(`✗ ${serviceData.heroTitle}: Validation failed`);
        validationResult.errors.forEach(err => console.log(`  - ${err}`));
        continue;
      }

      // Check if service already exists
      const existingServices = await strapi.entityService.findMany('api::service.service', {
        filters: { serviceId: serviceData.id },
        limit: 1
      });

      const existingService = existingServices && existingServices.length > 0 ? existingServices[0] : null;

      if (existingService) {
        // Service exists - update or skip based on force flag
        if (force || dryRun) {
          if (dryRun) {
            console.log(`→ ${serviceData.heroTitle}: Would update existing service (ID: ${existingService.id})`);
            results.updated++;
          } else {
            await strapi.entityService.update('api::service.service', existingService.id, {
              data: {
                serviceId: serviceData.id,
                heroTitle: serviceData.heroTitle,
                heroTagline: serviceData.heroTagline,
                heroImage: serviceData.heroImage,
                featuredImage: serviceData.featuredImage,
                description: serviceData.description,
                highlights: serviceData.highlights,
                images: serviceData.images,
                cta: serviceData.cta
              }
            });
            console.log(`↻ ${serviceData.heroTitle}: Updated existing service`);
            results.updated++;
          }
        } else {
          console.log(`→ ${serviceData.heroTitle}: Already exists (use --force to update)`);
          results.updated++;
        }
      } else {
        // Service doesn't exist - create it
        if (dryRun) {
          console.log(`→ ${serviceData.heroTitle}: Would create new service`);
          results.created++;
        } else {
          await strapi.entityService.create('api::service.service', {
            data: {
              serviceId: serviceData.id,
              heroTitle: serviceData.heroTitle,
              heroTagline: serviceData.heroTagline,
              heroImage: serviceData.heroImage,
              featuredImage: serviceData.featuredImage,
              description: serviceData.description,
              highlights: serviceData.highlights,
              images: serviceData.images,
              cta: serviceData.cta
            }
          });
          console.log(`✓ ${serviceData.heroTitle}: Created new service`);
          results.created++;
        }
      }

    } catch (error) {
      results.failed++;
      results.errors.push({
        serviceId,
        error: error.message
      });
      console.log(`✗ ${serviceData.heroTitle}: Failed - ${error.message}`);
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('Migration Summary:');
  console.log(`  Created: ${results.created}`);
  console.log(`  Updated: ${results.updated}`);
  console.log(`  Failed: ${results.failed}`);
  
  if (results.errors.length > 0) {
    console.log('\nErrors:');
    results.errors.forEach(({ serviceId, error }) => {
      console.log(`  - ${serviceId}: ${error}`);
    });
  }
  
  console.log('='.repeat(60));

  return results;
}

// Export for use in other scripts or tests
module.exports = {
  migrateServices,
  validateServiceData,
  servicesData
};

// Run migration if executed directly
if (require.main === module) {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const options = {
    dryRun: args.includes('--dry-run'),
    validate: args.includes('--validate'),
    force: args.includes('--force')
  };

  // Show help if requested
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Service Migration Script

Usage: node migrate-services.js [options]

Options:
  --dry-run    Report changes without applying them
  --validate   Check data integrity only (no database operations)
  --force      Update existing services instead of skipping them
  --help, -h   Show this help message

Examples:
  node migrate-services.js                    # Run migration
  node migrate-services.js --dry-run          # Preview changes
  node migrate-services.js --validate         # Validate data only
  node migrate-services.js --force            # Update existing services
  node migrate-services.js --dry-run --force  # Preview updates
`);
    process.exit(0);
  }

  // Run migration
  migrateServices(options)
    .then(results => {
      if (results.failed > 0) {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}
