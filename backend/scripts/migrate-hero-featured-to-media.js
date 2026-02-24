const Database = require('better-sqlite3');
const path = require('path');

/**
 * Migration script to convert heroImage and featuredImage from string URLs to media references
 * 
 * This script:
 * 1. Finds the media files in Strapi's media library by their filenames
 * 2. Creates entries in files_related_mph table to link services to their hero and featured images
 */

function migrateHeroFeaturedToMedia() {
  const dbPath = path.join(__dirname, '../.tmp/data.db');
  
  console.log('✓ Connecting to SQLite database...\n');
  const db = new Database(dbPath);

  try {
    // Mapping of service IDs to their image filenames
    const serviceImageMapping = {
      'private-luxury-transport': 'mltqxr0s-tvy6qwy.png',
      'corporate-executive-travel': 'mltqxr0s-0ykx36e.png',
      'airport-hotel-transfers': 'mltqxr0s-5bj4l8e.png',
      'special-engagements-events': 'mltqxr0s-koo2o1u.png'
    };

    console.log('Starting migration: Converting heroImage and featuredImage to media references...\n');

    // Step 1: Get all media files
    const files = db.prepare('SELECT id, name FROM files').all();
    console.log(`Step 1: Found ${files.length} media files in library\n`);

    // Create a map of filename to media ID
    const filenameToIdMap = {};
    files.forEach(file => {
      filenameToIdMap[file.name] = file.id;
    });

    // Step 2: Get all services
    const services = db.prepare('SELECT id, service_id FROM services').all();
    console.log(`Step 2: Found ${services.length} services to migrate\n`);
    console.log('Step 3: Creating media relations for heroImage and featuredImage...\n');

    let successCount = 0;
    let errorCount = 0;

    // Step 3: Create media relations for each service
    const insertStmt = db.prepare(`
      INSERT INTO files_related_mph (file_id, related_id, related_type, field, \`order\`)
      VALUES (?, ?, 'api::service.service', ?, 1)
    `);

    // Check if relations already exist
    const checkStmt = db.prepare(`
      SELECT COUNT(*) as count FROM files_related_mph 
      WHERE related_id = ? AND related_type = 'api::service.service' AND field = ?
    `);

    services.forEach((service) => {
      const serviceId = service.service_id;
      const expectedFilename = serviceImageMapping[serviceId];

      if (!expectedFilename) {
        console.log(`⚠️  No image mapping found for service: ${serviceId}`);
        return;
      }

      console.log(`Processing service: ${serviceId}`);
      console.log(`  Looking for image: ${expectedFilename}`);

      const mediaId = filenameToIdMap[expectedFilename];

      if (!mediaId) {
        console.log(`  ❌ Media file not found: ${expectedFilename}\n`);
        errorCount++;
        return;
      }

      console.log(`  ✓ Found media file (ID: ${mediaId})`);

      try {
        // Create heroImage relation
        const heroExists = checkStmt.get(service.id, 'heroImage');
        if (heroExists.count === 0) {
          insertStmt.run(mediaId, service.id, 'heroImage');
          console.log(`  ✓ Created heroImage relation`);
        } else {
          console.log(`  ⚠️  heroImage relation already exists`);
        }

        // Create featuredImage relation
        const featuredExists = checkStmt.get(service.id, 'featuredImage');
        if (featuredExists.count === 0) {
          insertStmt.run(mediaId, service.id, 'featuredImage');
          console.log(`  ✓ Created featuredImage relation\n`);
        } else {
          console.log(`  ⚠️  featuredImage relation already exists\n`);
        }

        successCount++;
      } catch (err) {
        console.error(`  ❌ Failed to create relations for ${serviceId}:`, err.message);
        errorCount++;
      }
    });

    console.log('✅ Migration completed!');
    console.log('\nSummary:');
    console.log(`- Total services processed: ${services.length}`);
    console.log(`- Successfully updated: ${successCount}`);
    console.log(`- Errors: ${errorCount}`);

    if (errorCount > 0) {
      throw new Error(`Migration completed with ${errorCount} errors`);
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    db.close();
  }
}

// Run the migration
migrateHeroFeaturedToMedia();
