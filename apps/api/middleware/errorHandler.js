/**
 * Global Error Handling Middleware
 * Handles all errors in the application with appropriate logging and sanitized responses
 * 
 * Requirements: 1.6
 * - 1.6: Display success and error notifications for user actions
 */

/**
 * Error handler middleware
 * Must be registered after all routes in Express app
 * 
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  // Log error with appropriate detail level
  const timestamp = new Date().toISOString();
  const errorLog = {
    timestamp,
    method: req.method,
    path: req.path,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  };
  
  console.error('[Error Handler]', JSON.stringify(errorLog, null, 2));

  // Determine error type and status code
  let statusCode = err.statusCode || 500;
  let errorType = 'SERVER_ERROR';
  let message = 'An unexpected error occurred';

  // Handle validation errors
  if (err.name === 'ValidationError' || err.type === 'validation') {
    statusCode = 400;
    errorType = 'VALIDATION_ERROR';
    message = err.message || 'Validation failed';
  }

  // Handle authentication errors
  if (err.name === 'UnauthorizedError' || err.type === 'authentication' || statusCode === 401) {
    statusCode = 401;
    errorType = 'AUTHENTICATION_ERROR';
    message = err.message || 'Authentication failed';
  }

  // Handle authorization errors
  if (err.type === 'authorization' || statusCode === 403) {
    statusCode = 403;
    errorType = 'AUTHORIZATION_ERROR';
    message = err.message || 'Access denied';
  }

  // Handle not found errors
  if (statusCode === 404) {
    errorType = 'NOT_FOUND';
    message = err.message || 'Resource not found';
  }

  // Handle file upload errors (Multer)
  if (err.name === 'MulterError') {
    statusCode = 400;
    errorType = 'UPLOAD_ERROR';
    
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'File size exceeds maximum allowed size';
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Too many files uploaded';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected file field';
        break;
      default:
        message = 'File upload failed';
    }
  }

  // Handle database errors
  if (err.code && err.code.startsWith('23')) { // PostgreSQL error codes
    statusCode = 400;
    errorType = 'DATABASE_ERROR';
    
    if (err.code === '23505') { // Unique violation
      message = 'A record with this value already exists';
    } else if (err.code === '23503') { // Foreign key violation
      message = 'Referenced record does not exist';
    } else if (err.code === '23502') { // Not null violation
      message = 'Required field is missing';
    } else {
      message = 'Database operation failed';
    }
  }

  // Sanitize error response for production
  const errorResponse = {
    success: false,
    error: {
      code: errorType,
      message: message
    }
  };

  // Include additional details in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.details = {
      originalMessage: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method
    };
  }

  // Include field information for validation errors
  if (err.field) {
    errorResponse.error.field = err.field;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found handler
 * Handles requests to non-existent routes
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`
    }
  });
};

/**
 * Async route wrapper
 * Wraps async route handlers to catch errors and pass to error handler
 * 
 * @param {Function} fn - Async route handler function
 * @returns {Function} Wrapped route handler
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler
};
