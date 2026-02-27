const express = require('express');
const SupabaseDatabase = require('../supabase-database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();
const db = new SupabaseDatabase();

// Get all global settings - organized by category
router.get('/', (req, res) => {
  db.all('SELECT * FROM global_settings', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }

    const settings = {
      general: {},
      contact: {},
      seo: {}
    };

    rows.forEach(row => {
      try {
        const value = JSON.parse(row.value);
        const category = row.category || 'general';
        
        // Extract the key without category prefix
        const keyParts = row.key.split('.');
        const actualKey = keyParts.length > 1 ? keyParts[1] : row.key;
        
        if (settings[category]) {
          settings[category][actualKey] = value;
        } else {
          // Fallback for uncategorized settings
          settings.general[row.key] = value;
        }
      } catch {
        const category = row.category || 'general';
        const keyParts = row.key.split('.');
        const actualKey = keyParts.length > 1 ? keyParts[1] : row.key;
        
        if (settings[category]) {
          settings[category][actualKey] = row.value;
        } else {
          settings.general[row.key] = row.value;
        }
      }
    });

    res.json({ 
      success: true,
      data: settings 
    });
  });
});

// Update global settings (protected) - supports batch updates
router.post('/', verifyToken, async (req, res) => {
  const settings = req.body;
  const userId = req.userId;

  try {
    // Flatten nested settings object into key-value pairs with categories
    const updates = [];
    
    // Process general settings
    if (settings.general) {
      Object.entries(settings.general).forEach(([key, value]) => {
        updates.push({ key: `general.${key}`, value, category: 'general' });
      });
    }
    
    // Process contact settings
    if (settings.contact) {
      Object.entries(settings.contact).forEach(([key, value]) => {
        updates.push({ key: `contact.${key}`, value, category: 'contact' });
      });
    }
    
    // Process SEO settings
    if (settings.seo) {
      Object.entries(settings.seo).forEach(([key, value]) => {
        updates.push({ key: `seo.${key}`, value, category: 'seo' });
      });
    }

    // If single key-value pair provided (backward compatibility)
    if (settings.key && settings.value !== undefined) {
      updates.push({ 
        key: settings.key, 
        value: settings.value, 
        category: settings.category || 'general' 
      });
    }

    // Update all settings
    for (const { key, value, category } of updates) {
      const sql = `INSERT INTO global_settings 
        (key, value, category, updated_at, updated_by) 
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)
        ON CONFLICT (key) DO UPDATE SET
        value = $2, category = $3, updated_at = CURRENT_TIMESTAMP, updated_by = $4`;

      await new Promise((resolve, reject) => {
        db.run(sql, [key, JSON.stringify(value), category, userId], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    res.json({ 
      success: true,
      message: 'Settings updated successfully',
      count: updates.length 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

module.exports = router;