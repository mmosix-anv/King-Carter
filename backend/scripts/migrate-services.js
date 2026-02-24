const {servicesData} = require('../../src/data/services.js');

async function migrateServices() {
  console.log('Starting Strapi migration...');

  for (const [key, service] of Object.entries(servicesData)) {
    try {
      await strapi.documents('api::service.service').create({
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
      console.error(`✗ Failed to migrate ${service.heroTitle}:`, error.message);
    }
  }

  console.log('Migration complete!');
}

module.exports = {migrateServices};
