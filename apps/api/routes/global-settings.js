const express = require('express');
const SupabaseDatabase = require('../supabase-database');
const { verifyToken } = require('./auth');

const router = express.Router();
const db = new SupabaseDatabase();

// Get all global settings
router.get('/', (req, res) => {
  db.all('SELECT * FROM global_settings', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const settings = {};
    rows.forEach(row => {
      try {
        settings[row.key] = JSON.parse(row.value);
      } catch {
        settings[row.key] = row.value;
      }
    });

    res.json({ data: settings });
  });
});

// Update global setting (protected)
router.post('/', verifyToken, (req, res) => {
  const { key, value } = req.body;

  const sql = `INSERT INTO global_settings 
    (key, value, updated_at) 
    VALUES ($1, $2, CURRENT_TIMESTAMP)
    ON CONFLICT (key) DO UPDATE SET
    value = $2, updated_at = CURRENT_TIMESTAMP`;

  db.run(sql, [key, JSON.stringify(value)], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Setting updated successfully' });
  });
});

module.exports = router;