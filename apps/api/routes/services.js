const express = require('express');
const SupabaseDatabase = require('../supabase-database');
const { verifyToken } = require('./auth');

const router = express.Router();
const db = new SupabaseDatabase();

// Get all services
router.get('/', (req, res) => {
  console.log('Fetching all services...');
  db.all('SELECT * FROM services', [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
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
          cta: typeof row.cta === 'object' && row.cta !== null ? row.cta : (row.cta ? JSON.parse(row.cta) : {})
        };
      } catch (parseError) {
        console.error(`Error parsing service ${row.id}:`, parseError);
        console.error('Raw data:', row);
        // Skip this service if parsing fails
      }
    });

    console.log(`Returning ${Object.keys(services).length} services`);
    res.json({ data: services });
  });
});

// Get service by ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM services WHERE id = $1', [req.params.id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ error: 'Service not found' });
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
        cta: typeof row.cta === 'object' && row.cta !== null ? row.cta : (row.cta ? JSON.parse(row.cta) : {})
      };

      res.json({ data: service });
    } catch (parseError) {
      console.error(`Error parsing service ${row.id}:`, parseError);
      return res.status(500).json({ error: 'Error parsing service data' });
    }
  });
});

// Create/Update service (protected)
router.post('/', verifyToken, (req, res) => {
  const { id, heroTitle, heroTagline, heroImage, featuredImage, description, highlights, images, cta } = req.body;

  const sql = `INSERT INTO services 
    (id, hero_title, hero_tagline, hero_image, featured_image, description, highlights, images, cta, updated_at) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
    ON CONFLICT (id) DO UPDATE SET
    hero_title = $2, hero_tagline = $3, hero_image = $4, featured_image = $5,
    description = $6, highlights = $7, images = $8, cta = $9, updated_at = CURRENT_TIMESTAMP`;

  db.run(sql, [
    id,
    heroTitle,
    heroTagline,
    heroImage,
    featuredImage,
    JSON.stringify(description),
    JSON.stringify(highlights),
    JSON.stringify(images),
    JSON.stringify(cta)
  ], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Service saved successfully', id });
  });
});

// Delete service (protected)
router.delete('/:id', verifyToken, (req, res) => {
  db.run('DELETE FROM services WHERE id = $1', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Service deleted successfully' });
  });
});

module.exports = router;