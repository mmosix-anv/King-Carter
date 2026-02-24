/**
 * This script directly inserts file records into the database and updates services
 * Run with: node scripts/migrate-images-direct.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

function getFileInfo(filename) {
  const filePath = path.join(UPLOADS_DIR, filename);
  const stats = fs.statSync(filePath);
  const hash = crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('hex');
  
  return {
    name: filename,
    alternativeText: null,
    caption: null,
    width: null,
    height: null,
    formats: null,
    hash: hash.substring(0, 16),
    ext: '.png',
    mime: 'image/png',
    size: (stats.size / 1024).toFixed(2), // Size in KB
    url: `/uploads/${filename}`,
    previewUrl: null,
    provider: 'local',
    provider_metadata: null,
    folderPath: '/',
  };
}

async function main() {
  console.log('Starting direct migration of images to Strapi media library...\n');

  const Strapi = require('@strapi/strapi');
  let strapi;

  try {
    // Initialize Strapi
    console.log('Initializing Strapi...');
    strapi = await Strapi.createStrapi({
      appDir: path.join(__dirname, '..'),
      distDir: path.join(__dirname, '../dist'),
    }).load();
    console.log('✓ Strapi initialized\n');

    // Step 1: Create file entries in the database
    console.log('Step 1: Creating file entries in database...');
    const uploadedFiles = [];
    
    for (const filename of imageFiles) {
      console.log(`  Processing: ${filename}`);
      const fileInfo = getFileInfo(filename);
      
      // Check if file already exists
      const existing = await strapi.query('plugin::upload.file').findOne({
        where: { name: filename }
      });
      
      if (existing) {
        console.log(`  ⚠ File already exists with ID: ${existing.id}`);
        uploadedFiles.push(existing);
        continue;
      }
      
      // Create new file entry
      const file = await strapi.query('plugin::upload.file').create({
        data: fileInfo
      });
      
      uploadedFiles.push(file);
      console.log(`  ✓ Created file entry with ID: ${file.id}`);
    }
    
    console.log(`\n✓ Successfully processed ${uploadedFiles.length} images\n`);

    // Step 2: Fetch all services
    console.log('Step 2: Fetching services...');
    const services = await strapi.documents('api::service.service').findMany();
    console.log(`Found ${services.length} services to update\n`);

    // Step 3: Update each service to link to the uploaded media files
    console.log('Step 3: Updating services with media references...');
    const mediaIds = uploadedFiles.map(file => file.id);
    
    for (const service of services) {
      const serviceId = service.serviceId;
      const documentId = service.documentId;

      console.log(`  Processing: ${serviceId} (documentId: ${documentId})`);

      try {
        await strapi.documents('api::service.service').update({
          documentId: documentId,
          data: {
            images: mediaIds
          }
        });
        console.log(`  ✓ Updated ${serviceId} with ${mediaIds.length} media references\n`);
      } catch (error) {
        console.error(`  ✗ Failed to update ${serviceId}:`);
        console.error('    Error:', error.message);
        console.log('');
      }
    }

    console.log('✓ Migration complete!');
    console.log(`\nSummary:`);
    console.log(`  - Processed ${uploadedFiles.length} images in media library`);
    console.log(`  - Updated ${services.length} services with media references`);
    
  } catch (error) {
    console.error('\n✗ Migration failed:');
    console.error('Error message:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    if (strapi) {
      await strapi.destroy();
    }
    process.exit(0);
  }
}

main();
