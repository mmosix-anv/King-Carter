const axios = require('axios');

const API_URL = 'http://localhost:1337/api';

// Map service IDs to their featured images
const featuredImages = {
  'private-luxury-transport': '/image/mltqxr0s-tvy6qwy.png',
  'corporate-executive-travel': '/image/mltqxr0s-0ykx36e.png',
  'airport-hotel-transfers': '/image/mltqxr0s-5bj4l8e.png',
  'special-engagements-events': '/image/mltqxr0s-koo2o1u.png'
};

async function migrateServices() {
  console.log('Starting migration to add featuredImage field...\n');

  try {
    // Fetch all existing services
    console.log('Fetching services from:', `${API_URL}/services`);
    const response = await axios.get(`${API_URL}/services`);
    console.log('Response status:', response.status);
    
    const services = response.data.data;
    console.log(`Found ${services.length} services to update\n`);

    // Update each service with its featured image
    for (const service of services) {
      // In Strapi v5, the structure is flat at the top level
      const serviceId = service.serviceId;
      const documentId = service.documentId;
      const featuredImage = featuredImages[serviceId];

      console.log(`Processing: ${serviceId} (documentId: ${documentId})`);

      if (!featuredImage) {
        console.log(`⚠ No featured image mapping found for: ${serviceId}\n`);
        continue;
      }

      try {
        // Use documentId for Strapi v5
        await axios.put(`${API_URL}/services/${documentId}`, {
          data: {
            featuredImage: featuredImage
          }
        });
        console.log(`✓ Updated ${serviceId} with featuredImage: ${featuredImage}\n`);
      } catch (error) {
        console.error(`✗ Failed to update ${serviceId}:`);
        console.error('  Error:', error.response?.data || error.message);
        if (error.response) {
          console.error('  Status:', error.response.status);
        }
        console.log('');
      }
    }

    console.log('✓ Migration complete!');
  } catch (error) {
    console.error('✗ Migration failed:');
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    if (error.code) {
      console.error('Error code:', error.code);
    }
    process.exit(1);
  }
}

migrateServices();
