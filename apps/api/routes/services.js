const express = require('express');
const SupabaseDatabase = require('../supabase-database');
const { verifyToken } = require('../middleware/auth');
const AuditRepository = require('../repositories/auditRepository');

const router = express.Router();
const db = new SupabaseDatabase();
const auditRepo = new AuditRepository();

// Get all services
router.get('/', (req, res) => {
  console.log('Fetching all services...');
  const { status } = req.query;
  
  // Build query with status filtering
  // Default to 'published' for public access unless explicitly requesting all or a specific status
  let query = 'SELECT * FROM services';
  const params = [];
  
  // If no status specified and no auth token, default to published only
  const hasAuthToken = req.headers.authorization;
  const filterStatus = status || (!hasAuthToken ? 'published' : null);
  
  if (filterStatus) {
    query += ' WHERE status = $1';
    params.push(filterStatus);
  }
  
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }

    console.log(`Found ${rows.length} services in database`);
    const services = {};
    rows.forEach(row => {
      console.log(`Processing service: ${row.id}`);
      try {
        services[row.id] = {
          id: row.id,
          serviceId: row.id,
          heroTitle: row.hero_title,
          heroTagline: row.hero_tagline,
          heroImage: row.hero_image,
          featuredImage: row.featured_image,
          description: Array.isArray(row.description) ? row.description : (row.description ? JSON.parse(row.description) : []),
          highlights: Array.isArray(row.highlights) ? row.highlights : (row.highlights ? JSON.parse(row.highlights) : []),
          images: Array.isArray(row.images) ? row.images : (row.images ? JSON.parse(row.images) : []),
          cta: typeof row.cta === 'object' && row.cta !== null ? row.cta : (row.cta ? JSON.parse(row.cta) : {}),
          status: row.status || 'published',
          createdAt: row.created_at,
          createdBy: row.created_by,
          updatedAt: row.updated_at,
          updatedBy: row.updated_by
        };
      } catch (parseError) {
        console.error(`Error parsing service ${row.id}:`, parseError);
        console.error('Raw data:', row);
        // Skip this service if parsing fails
      }
    });

    console.log(`Returning ${Object.keys(services).length} services`);
    res.json({ 
      success: true,
      data: services 
    });
  });
});

// Get service by ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM services WHERE id = $1', [req.params.id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }

    if (!row) {
      return res.status(404).json({ 
        success: false,
        error: 'Service not found' 
      });
    }

    // Check if service is published (unless authenticated)
    const hasAuthToken = req.headers.authorization;
    if (!hasAuthToken && row.status !== 'published') {
      return res.status(404).json({ 
        success: false,
        error: 'Service not found' 
      });
    }

    try {
      const service = {
        id: row.id,
        serviceId: row.id,
        heroTitle: row.hero_title,
        heroTagline: row.hero_tagline,
        heroImage: row.hero_image,
        featuredImage: row.featured_image,
        description: Array.isArray(row.description) ? row.description : (row.description ? JSON.parse(row.description) : []),
        highlights: Array.isArray(row.highlights) ? row.highlights : (row.highlights ? JSON.parse(row.highlights) : []),
        images: Array.isArray(row.images) ? row.images : (row.images ? JSON.parse(row.images) : []),
        cta: typeof row.cta === 'object' && row.cta !== null ? row.cta : (row.cta ? JSON.parse(row.cta) : {}),
        status: row.status || 'published',
        createdAt: row.created_at,
        createdBy: row.created_by,
        updatedAt: row.updated_at,
        updatedBy: row.updated_by
      };

      res.json({ 
        success: true,
        data: service 
      });
    } catch (parseError) {
      console.error(`Error parsing service ${row.id}:`, parseError);
      return res.status(500).json({ 
        success: false,
        error: 'Error parsing service data' 
      });
    }
  });
});

// Create/Update service (protected)
router.post('/', verifyToken, async (req, res) => {
  const { id, heroTitle, heroTagline, heroImage, featuredImage, description, highlights, images, cta, status } = req.body;
  const userId = req.userId; // Set by verifyToken middleware

  try {
    // Check if service exists to determine if this is create or update
    const existingService = await new Promise((resolve, reject) => {
      db.get('SELECT id, created_at, created_by FROM services WHERE id = $1', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    let sql;
    let params;
    let action;

    if (existingService) {
      // Update existing service
      action = 'update';
      sql = `UPDATE services SET
        hero_title = $1, hero_tagline = $2, hero_image = $3, featured_image = $4,
        description = $5, highlights = $6, images = $7, cta = $8, 
        status = $9, updated_at = CURRENT_TIMESTAMP, updated_by = $10
        WHERE id = $11`;
      
      params = [
        heroTitle,
        heroTagline,
        heroImage,
        featuredImage,
        JSON.stringify(description),
        JSON.stringify(highlights),
        JSON.stringify(images),
        JSON.stringify(cta),
        status || 'draft',
        userId,
        id
      ];
    } else {
      // Create new service
      action = 'create';
      sql = `INSERT INTO services 
        (id, hero_title, hero_tagline, hero_image, featured_image, description, highlights, images, cta, 
         status, created_at, created_by, updated_at, updated_by) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, $11, CURRENT_TIMESTAMP, $12)`;
      
      params = [
        id,
        heroTitle,
        heroTagline,
        heroImage,
        featuredImage,
        JSON.stringify(description),
        JSON.stringify(highlights),
        JSON.stringify(images),
        JSON.stringify(cta),
        status || 'draft',
        userId,
        userId
      ];
    }

    // Execute the database operation
    await new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve();
      });
    });

    // Record audit trail
    await auditRepo.recordChange({
      entityType: 'service',
      entityId: id,
      action: action,
      userId: userId,
      changes: {
        heroTitle,
        heroTagline,
        heroImage,
        featuredImage,
        status: status || 'draft'
      }
    });

    res.json({ 
      success: true,
      message: existingService ? 'Service updated successfully' : 'Service created successfully', 
      id 
    });
  } catch (err) {
    console.error('Error in service create/update:', err);
    return res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// Delete service (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  const userId = req.userId;
  const serviceId = req.params.id;

  try {
    // Execute the delete operation
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM services WHERE id = $1', [serviceId], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });

    // Record audit trail
    await auditRepo.recordChange({
      entityType: 'service',
      entityId: serviceId,
      action: 'delete',
      userId: userId
    });

    res.json({ 
      success: true,
      message: 'Service deleted successfully' 
    });
  } catch (err) {
    console.error('Error in service delete:', err);
    return res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

module.exports = { router };