const express = require('express');
const SupabaseDatabase = require('../supabase-database');
const { verifyToken } = require('./auth');

const router = express.Router();
const db = new SupabaseDatabase();

// Get navigation links
router.get('/', (req, res) => {
  db.get('SELECT * FROM nav_links WHERE id = 1', [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.json({
        data: {
          leftLinks: [],
          rightLinks: [],
          ctaButtons: {}
        }
      });
    }

    const navLinks = {
      leftLinks: row.left_links || [],
      rightLinks: row.right_links || [],
      ctaButtons: row.cta_buttons || {}
    };

    res.json({ data: navLinks });
  });
});

// Update navigation links (protected)
router.post('/', verifyToken, (req, res) => {
  const { leftLinks, rightLinks, ctaButtons } = req.body;

  const sql = `INSERT INTO nav_links 
    (id, left_links, right_links, cta_buttons, updated_at) 
    VALUES (1, $1, $2, $3, CURRENT_TIMESTAMP)
    ON CONFLICT (id) DO UPDATE SET
    left_links = $1, right_links = $2, cta_buttons = $3, updated_at = CURRENT_TIMESTAMP`;

  db.run(sql, [
    JSON.stringify(leftLinks),
    JSON.stringify(rightLinks),
    JSON.stringify(ctaButtons)
  ], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Navigation links updated successfully' });
  });
});

module.exports = router;