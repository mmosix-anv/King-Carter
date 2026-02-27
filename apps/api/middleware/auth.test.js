const jwt = require('jsonwebtoken');
const { verifyToken } = require('./auth');

// Mock JWT_SECRET for testing
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

describe('verifyToken middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  test('should return 401 when no authorization header is provided', () => {
    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'No authorization header provided'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 401 when authorization header has no token', () => {
    req.headers.authorization = 'Bearer ';

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'No token provided'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 401 for invalid token', () => {
    req.headers.authorization = 'Bearer invalid-token';

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Invalid token'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 401 for expired token', () => {
    // Create an expired token
    const expiredToken = jwt.sign({ userId: 1 }, JWT_SECRET, { expiresIn: '-1h' });
    req.headers.authorization = `Bearer ${expiredToken}`;

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Token expired'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should attach userId to request and call next for valid token', () => {
    const userId = 123;
    const validToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
    req.headers.authorization = `Bearer ${validToken}`;

    verifyToken(req, res, next);

    expect(req.userId).toBe(userId);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('should handle authorization header without Bearer prefix', () => {
    const userId = 123;
    const validToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
    req.headers.authorization = validToken;

    verifyToken(req, res, next);

    // Should fail because split(' ')[1] will be undefined
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
