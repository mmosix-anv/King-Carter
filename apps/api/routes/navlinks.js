const express = require('express');
const SupabaseDatabase = require('../supabase-database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();
const db = new SupabaseDatabase();

// Get navigation links
router.get('/', (req, res) => {
  db.get('SELECT * FROM nav_links WHERE id = 1', [], (err, row) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }

    if (!row) {
      return res.json({
        success: true,
        data: {
          leftLinks: [],
          rightLinks: [],
          ctaButtons: {
            primary: { label: '', url: '', variant: 'primary' },
            secondary: { label: '', url: '', variant: 'secondary' }
          }
        }
      });
    }

    try {
      const navLinks = {
        leftLinks: typeof row.left_links === 'string' ? JSON.parse(row.left_links) : (row.left_links || []),
        rightLinks: typeof row.right_links === 'string' ? JSON.parse(row.right_links) : (row.right_links || []),
        ctaButtons: typeof row.cta_buttons === 'string' ? JSON.parse(row.cta_buttons) : (row.cta_buttons || {})
      };

      res.json({ 
        success: true,
        data: navLinks 
      });
    } catch (parseError) {
      res.status(500).json({ 
        success: false,
        error: 'Failed to parse navigation data' 
      });
    }
  });
});

// Update navigation links (protected)
router.post('/', verifyToken, (req, res) => {
  const { leftLinks, rightLinks, ctaButtons } = req.body;
  const userId = req.userId;

  // Validate input
  if (!Array.isArray(leftLinks) || !Array.isArray(rightLinks)) {
    return res.status(400).json({ 
      success: false,
      error: 'leftLinks and rightLinks must be arrays' 
    });
  }

  const sql = `INSERT INTO nav_links 
    (id, left_links, right_links, cta_buttons, updated_at, updated_by) 
    VALUES (1, $1, $2, $3, CURRENT_TIMESTAMP, $4)
    ON CONFLICT (id) DO UPDATE SET
    left_links = $1, right_links = $2, cta_buttons = $3, 
    updated_at = CURRENT_TIMESTAMP, updated_by = $4`;

  db.run(sql, [
    JSON.stringify(leftLinks),
    JSON.stringify(rightLinks),
    JSON.stringify(ctaButtons || {}),
    userId
  ], function(err) {
    if (err) {
      return res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
    res.json({ 
      success: true,
      message: 'Navigation links updated successfully' 
    });
  });
});

module.exports = router;