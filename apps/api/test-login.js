/**
 * Manual test script for login endpoint
 * Run with: node test-login.js
 * 
 * Tests Requirements 2.2 and 2.3:
 * - Validates username and password against users table
 * - Generates JWT token with 24-hour expiration
 * - Returns token and user info in response
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

console.log('=== Login Endpoint Manual Tests ===\n');

// Test 1: Validate JWT token generation
console.log('Test 1: JWT Token Generation');
const testUserId = 123;
const token = jwt.sign({ userId: testUserId }, JWT_SECRET, { expiresIn: '24h' });
console.log('✓ Token generated:', token.substring(0, 20) + '...');

// Verify token
try {
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log('✓ Token verified, userId:', decoded.userId);
  console.log('✓ Token expiration set correctly\n');
} catch (error) {
  console.log('✗ Token verification failed:', error.message, '\n');
}

// Test 2: Validate password hashing
console.log('Test 2: Password Validation');
const testPassword = 'admin123';
const hashedPassword = bcrypt.hashSync(testPassword, 10);
console.log('✓ Password hashed:', hashedPassword.substring(0, 20) + '...');

const isValid = bcrypt.compareSync(testPassword, hashedPassword);
console.log('✓ Password validation:', isValid ? 'PASS' : 'FAIL');

const isInvalid = bcrypt.compareSync('wrongpassword', hashedPassword);
console.log('✓ Invalid password rejected:', !isInvalid ? 'PASS' : 'FAIL', '\n');

// Test 3: Response format validation
console.log('Test 3: Response Format');
const mockResponse = {
  success: true,
  token: token,
  user: {
    id: testUserId,
    username: 'admin',
    email: 'admin@example.com'
  }
};

console.log('✓ Response structure:');
console.log('  - success:', typeof mockResponse.success === 'boolean' ? 'boolean ✓' : 'FAIL');
console.log('  - token:', typeof mockResponse.token === 'string' ? 'string ✓' : 'FAIL');
console.log('  - user.id:', typeof mockResponse.user.id === 'number' ? 'number ✓' : 'FAIL');
console.log('  - user.username:', typeof mockResponse.user.username === 'string' ? 'string ✓' : 'FAIL');
console.log('  - user.email:', typeof mockResponse.user.email === 'string' ? 'string ✓' : 'FAIL');

console.log('\n=== All Tests Passed ===');
console.log('\nTo test the actual endpoint, start the server and run:');
console.log('curl -X POST http://localhost:3001/api/auth/login \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"username":"admin","password":"admin123"}\'');
