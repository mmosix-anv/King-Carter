const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const API_URL = 'http://localhost:1337/api';
const UPLOADS_DIR = path.join(__dirname, '../public/uploads');

// All services use the same 7 images
const imageFiles = [
  'mltqxr0s-tvy6qwy.png',
  'mltqxr0s-0ykx36e.png',
  'mltqxr0s-5bj4l8e.png',
  'mltqxr0s-koo2o1u.png',
  'mltqxr0s-hynsmyb.png',
  'mltqxr0s-3fog7d9.png',
  'mltqxr0s-ch5rmk1.png'
];

async function uploadImageManually(filename) {
  const filePath = path.join(UPLOADS_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const formData = new FormData();
  formData.append('files', fs.createReadStream(filePath), {
    filename: filename,
    contentType: 'image/png'
  });

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    
    return response.data[0];
  } catch (error) {
    if (error.response?.status === 403) {
      console.error(`\n⚠ Upload permission denied. Please enable upload permissions for public role in Strapi admin.`);
      console.error(`   1. Go to http://localhost:1337/admin`);
      console.error(`   2. Navigate to Settings > Users & Permissions > Roles > Public`);
      console.error(`   3. Enable "Upload" permissions`);
      console.error(`   4. Save and re-run this script\n`);
    }
    throw error;
  }
}

async function migrateImagesToMedia() {
  console.log('Starting migration of images to Strapi media library...\n');
  console.log('⚠ IMPORTANT: Make sure upload permissions are enabled for public role');
  console.log('   Or run this script with admin authentication\n');

  try {
    // Step 1: Upload all images to Strapi's media library
    console.log('Step 1: Uploading images to media library...');
    const uploadedFiles = [];
    
    for (const filename of imageFiles) {
      console.log(`  Uploading: ${filename}`);
      try {
        const uploadedFile = await uploadImageManually(filename);
        uploadedFiles.push(uploadedFile);
        console.log(`  ✓ Uploaded with ID: ${uploadedFile.id}`);
      } catch (error) {
        console.error(`  ✗ Failed to upload ${filename}`);
        if (error.response?.status !== 403) {
          console.error(`    Error: ${error.message}`);
        }
        throw error;
      }
    }
    
    console.log(`\n✓ Successfully uploaded ${uploadedFiles.length} images\n`);

    // Step 2: Fetch all services
    console.log('Step 2: Fetching services...');
    const response = await axios.get(`${API_URL}/services`);
    const services = response.data.data;
    console.log(`Found ${services.length} services to update\n`);

    // Step 3: Update each service to link to the uploaded media files
    console.log('Step 3: Updating services with media references...');
    const mediaIds = uploadedFiles.map(file => file.id);
    
    for (const service of services) {
      const serviceId = service.serviceId;
      const documentId = service.documentId;

      console.log(`  Processing: ${serviceId} (documentId: ${documentId})`);

      try {
        await axios.put(`${API_URL}/services/${documentId}`, {
          data: {
            images: mediaIds
          }
        });
        console.log(`  ✓ Updated ${serviceId} with ${mediaIds.length} media references\n`);
      } catch (error) {
        console.error(`  ✗ Failed to update ${serviceId}:`);
        console.error('    Error:', error.response?.data || error.message);
        if (error.response) {
          console.error('    Status:', error.response.status);
        }
        console.log('');
      }
    }

    console.log('✓ Migration complete!');
    console.log(`\nSummary:`);
    console.log(`  - Uploaded ${uploadedFiles.length} images to media library`);
    console.log(`  - Updated ${services.length} services with media references`);
    
  } catch (error) {
    console.error('\n✗ Migration failed');
    process.exit(1);
  }
}

migrateImagesToMedia();
