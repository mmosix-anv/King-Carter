const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SupabaseDatabase = require('../supabase-database');

const router = express.Router();
const db = new SupabaseDatabase();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * POST /api/auth/login
 * Login endpoint with JWT token generation
 * 
 * Requirements: 2.2, 2.3
 * - 2.2: Issues JWT token with expiration time (24 hours)
 * - 2.3: Returns JWT token for secure storage in browser
 * 
 * Request body:
 * - username: string (required)
 * - password: string (required)
 * 
 * Response:
 * - success: boolean
 * - token: string (JWT token)
 * - user: object { id, username, email }
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate request body
  if (!username || !password) {
    return res.status(400).json({ 
      success: false,
      error: 'Username and password are required' 
    });
  }

  // Query users table for matching username
  db.get('SELECT * FROM users WHERE username = $1', [username], (err, user) => {
    if (err) {
      console.error('Database error during login:', err);
      return res.status(500).json({ 
        success: false,
        error: 'Internal server error' 
      });
    }

    // User not found
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Validate password against hashed password in database
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Generate JWT token with 24-hour expiration
    const token = jwt.sign(
      { userId: user.id }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Return token and user info (excluding password)
    res.json({ 
      success: true,
      token,
      user: { 
        id: user.id, 
        username: user.username,
        email: user.email || null
      }
    });
  });
});

module.exports = { router };