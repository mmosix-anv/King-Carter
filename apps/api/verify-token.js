/**
 * Verify JWT token expiration
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Sample token from the test (replace with actual token)
const token = process.argv[2];

if (!token) {
  console.log('Usage: node verify-token.js <token>');
  console.log('\nRun test-endpoint.js first to get a token');
  process.exit(1);
}

try {
  const decoded = jwt.decode(token, { complete: true });
  
  console.log('=== JWT Token Analysis ===\n');
  console.log('Header:', JSON.stringify(decoded.header, null, 2));
  console.log('\nPayload:', JSON.stringify(decoded.payload, null, 2));
  
  const iat = new Date(decoded.payload.iat * 1000);
  const exp = new Date(decoded.payload.exp * 1000);
  const duration = (decoded.payload.exp - decoded.payload.iat) / 3600; // hours
  
  console.log('\nIssued At:', iat.toISOString());
  console.log('Expires At:', exp.toISOString());
  console.log('Duration:', duration, 'hours');
  
  if (duration === 24) {
    console.log('\n✓ Token has correct 24-hour expiration (Requirement 2.2)');
  } else {
    console.log('\n✗ Token expiration is incorrect. Expected 24 hours, got', duration);
  }
  
  // Verify signature
  const verified = jwt.verify(token, JWT_SECRET);
  console.log('\n✓ Token signature is valid');
  console.log('User ID:', verified.userId);
  
} catch (error) {
  console.log('✗ Error:', error.message);
}
