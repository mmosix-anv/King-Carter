/**
 * Unit tests for error handling middleware
 */

const { errorHandler, notFoundHandler, asyncHandler } = require('./errorHandler');

describe('Error Handler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      method: 'GET',
      path: '/api/test'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    
    // Suppress console.error during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('errorHandler', () => {
    test('should handle generic server errors with 500 status', () => {
      const error = new Error('Something went wrong');
      
      errorHandler(error, req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    });

    test('should handle validation errors with 400 status', () => {
      const error = new Error('Invalid input');
      error.name = 'ValidationError';
      
      errorHandler(error, req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input'
        }
      });
    });

    test('should handle authentication errors with 401 status', () => {
      const error = new Error('Token expired');
      error.statusCode = 401;
      
      errorHandler(error, req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Token expired'
        }
      });
    });

    test('should handle Multer file size errors', () => {
      const error = new Error('File too large');
      error.name = 'MulterError';
      error.code = 'LIMIT_FILE_SIZE';
      
      errorHandler(error, req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'UPLOAD_ERROR',
          message: 'File size exceeds maximum allowed size'
        }
      });
    });

    test('should handle database unique constraint violations', () => {
      const error = new Error('Duplicate key');
      error.code = '23505';
      
      errorHandler(error, req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'A record with this value already exists'
        }
      });
    });

    test('should include field information for validation errors', () => {
      const error = new Error('Email is required');
      error.type = 'validation';
      error.field = 'email';
      
      errorHandler(error, req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email is required',
          field: 'email'
        }
      });
    });

    test('should handle 404 errors', () => {
      const error = new Error('Not found');
      error.statusCode = 404;
      
      errorHandler(error, req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Not found'
        }
      });
    });

    test('should log errors with timestamp and request details', () => {
      const error = new Error('Test error');
      
      errorHandler(error, req, res, next);
      
      expect(console.error).toHaveBeenCalled();
      const logCall = console.error.mock.calls[0];
      expect(logCall[0]).toBe('[Error Handler]');
      expect(logCall[1]).toContain('timestamp');
      expect(logCall[1]).toContain('GET');
      expect(logCall[1]).toContain('/api/test');
    });
  });

  describe('notFoundHandler', () => {
    test('should return 404 for non-existent routes', () => {
      req.method = 'POST';
      req.path = '/api/nonexistent';
      
      notFoundHandler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Route POST /api/nonexistent not found'
        }
      });
    });
  });

  describe('asyncHandler', () => {
    test('should catch errors from async functions and pass to next', async () => {
      const error = new Error('Async error');
      const asyncFn = jest.fn().mockRejectedValue(error);
      const wrappedFn = asyncHandler(asyncFn);
      
      await wrappedFn(req, res, next);
      
      expect(next).toHaveBeenCalledWith(error);
    });

    test('should call async function with req, res, next', async () => {
      const asyncFn = jest.fn().mockResolvedValue();
      const wrappedFn = asyncHandler(asyncFn);
      
      await wrappedFn(req, res, next);
      
      expect(asyncFn).toHaveBeenCalledWith(req, res, next);
    });

    test('should not call next if async function succeeds', async () => {
      const asyncFn = jest.fn().mockResolvedValue();
      const wrappedFn = asyncHandler(asyncFn);
      
      await wrappedFn(req, res, next);
      
      expect(next).not.toHaveBeenCalled();
    });
  });
});
