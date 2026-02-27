const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * JWT Authentication Middleware
 * Verifies JWT token from Authorization header and attaches userId to request
 * 
 * Requirements: 2.2, 2.3, 2.6
 * - 2.2: Issues JWT token with expiration time
 * - 2.3: Stores JWT token securely
 * - 2.6: Verifies JWT token on each protected API request
 */
const verifyToken = (req, res, next) => {
  // Extract token from Authorization header (format: "Bearer <token>")
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ 
      success: false,
      error: 'No authorization header provided' 
    });
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'No token provided' 
    });
  }

  try {
    // Verify JWT signature and expiration
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach userId to request object for downstream use
    req.userId = decoded.userId;
    
    // Continue to next middleware/route handler
    next();
  } catch (error) {
    // Handle invalid or expired tokens
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expired' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token' 
      });
    }
    
    // Generic error for other JWT verification failures
    return res.status(401).json({ 
      success: false,
      error: 'Token verification failed' 
    });
  }
};

module.exports = { verifyToken };
