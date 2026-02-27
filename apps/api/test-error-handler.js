/**
 * Integration test for error handler middleware
 * Tests error handling in actual HTTP requests
 */

const http = require('http');

function makeRequest(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            body: body
          });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('=== Error Handler Integration Tests ===\n');

  // Test 1: 404 for non-existent route
  console.log('Test 1: 404 for non-existent route');
  try {
    const result = await makeRequest('/api/nonexistent');
    console.log('Status:', result.statusCode);
    console.log('Response:', JSON.stringify(result.body, null, 2));
    
    if (result.statusCode === 404 && 
        result.body.success === false && 
        result.body.error.code === 'NOT_FOUND') {
      console.log('✓ PASS: 404 handler works correctly\n');
    } else {
      console.log('✗ FAIL: Expected 404 with NOT_FOUND error\n');
    }
  } catch (error) {
    console.log('✗ FAIL:', error.message, '\n');
  }

  // Test 2: Health check still works
  console.log('Test 2: Health check endpoint');
  try {
    const result = await makeRequest('/api/health');
    console.log('Status:', result.statusCode);
    console.log('Response:', JSON.stringify(result.body, null, 2));
    
    if (result.statusCode === 200 && result.body.status === 'ok') {
      console.log('✓ PASS: Health check works correctly\n');
    } else {
      console.log('✗ FAIL: Expected 200 with status ok\n');
    }
  } catch (error) {
    console.log('✗ FAIL:', error.message, '\n');
  }

  // Test 3: Authentication error (no token)
  console.log('Test 3: Authentication error handling');
  try {
    const result = await makeRequest('/api/nav-links', 'POST');
    console.log('Status:', result.statusCode);
    console.log('Response:', JSON.stringify(result.body, null, 2));
    
    if (result.statusCode === 401 && result.body.success === false) {
      console.log('✓ PASS: Authentication error handled correctly\n');
    } else {
      console.log('✗ FAIL: Expected 401 authentication error\n');
    }
  } catch (error) {
    console.log('✗ FAIL:', error.message, '\n');
  }

  console.log('=== Tests Complete ===');
  console.log('\nNote: Make sure the API server is running on port 3001');
  console.log('Run: npm run dev (in apps/api directory)');
}

runTests().catch(console.error);
