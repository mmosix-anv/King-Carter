/**
 * Integration test for login endpoint
 * Tests the actual HTTP endpoint
 */

const http = require('http');

function testLogin(username, password) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ username, password });
    
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: JSON.parse(body)
        });
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('=== Login Endpoint Integration Tests ===\n');

  // Test 1: Valid credentials
  console.log('Test 1: Valid credentials');
  try {
    const result = await testLogin('admin', 'admin123');
    console.log('Status:', result.statusCode);
    console.log('Response:', JSON.stringify(result.body, null, 2));
    
    if (result.statusCode === 200 && result.body.success && result.body.token) {
      console.log('✓ PASS: Login successful with valid credentials\n');
    } else {
      console.log('✗ FAIL: Expected successful login\n');
    }
  } catch (error) {
    console.log('✗ FAIL:', error.message, '\n');
  }

  // Test 2: Invalid password
  console.log('Test 2: Invalid password');
  try {
    const result = await testLogin('admin', 'wrongpassword');
    console.log('Status:', result.statusCode);
    console.log('Response:', JSON.stringify(result.body, null, 2));
    
    if (result.statusCode === 401 && !result.body.success) {
      console.log('✓ PASS: Login rejected with invalid password\n');
    } else {
      console.log('✗ FAIL: Expected 401 error\n');
    }
  } catch (error) {
    console.log('✗ FAIL:', error.message, '\n');
  }

  // Test 3: Non-existent user
  console.log('Test 3: Non-existent user');
  try {
    const result = await testLogin('nonexistent', 'password');
    console.log('Status:', result.statusCode);
    console.log('Response:', JSON.stringify(result.body, null, 2));
    
    if (result.statusCode === 401 && !result.body.success) {
      console.log('✓ PASS: Login rejected for non-existent user\n');
    } else {
      console.log('✗ FAIL: Expected 401 error\n');
    }
  } catch (error) {
    console.log('✗ FAIL:', error.message, '\n');
  }

  // Test 4: Missing username
  console.log('Test 4: Missing username');
  try {
    const result = await testLogin('', 'password');
    console.log('Status:', result.statusCode);
    console.log('Response:', JSON.stringify(result.body, null, 2));
    
    if (result.statusCode === 400 && !result.body.success) {
      console.log('✓ PASS: Request rejected with missing username\n');
    } else {
      console.log('✗ FAIL: Expected 400 error\n');
    }
  } catch (error) {
    console.log('✗ FAIL:', error.message, '\n');
  }

  console.log('=== Tests Complete ===');
}

runTests().catch(console.error);
