/**
 * Test routes for demonstrating error handler functionality
 * These routes are for testing purposes only
 */

const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Test validation error
router.get('/validation-error', (req, res, next) => {
  const error = new Error('Email is required');
  error.type = 'validation';
  error.field = 'email';
  next(error);
});

// Test authentication error
router.get('/auth-error', (req, res, next) => {
  const error = new Error('Invalid credentials');
  error.statusCode = 401;
  next(error);
});

// Test database error (unique constraint)
router.get('/db-unique-error', (req, res, next) => {
  const error = new Error('Duplicate key value');
  error.code = '23505';
  next(error);
});

// Test file upload error
router.get('/upload-error', (req, res, next) => {
  const error = new Error('File too large');
  error.name = 'MulterError';
  error.code = 'LIMIT_FILE_SIZE';
  next(error);
});

// Test generic server error
router.get('/server-error', (req, res, next) => {
  const error = new Error('Something went wrong');
  next(error);
});

// Test async error handling with asyncHandler
router.get('/async-error', asyncHandler(async (req, res) => {
  throw new Error('Async operation failed');
}));

// Test successful async operation
router.get('/async-success', asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Async operation succeeded' });
}));

module.exports = router;
