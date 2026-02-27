/**
 * Comprehensive test for all error handler types
 */

const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: 'GET',
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
  console.log('=== Comprehensive Error Handler Tests ===\n');

  const tests = [
    {
      name: 'Validation Error',
      path: '/api/test-errors/validation-error',
      expectedStatus: 400,
      expectedCode: 'VALIDATION_ERROR'
    },
    {
      name: 'Authentication Error',
      path: '/api/test-errors/auth-error',
      expectedStatus: 401,
      expectedCode: 'AUTHENTICATION_ERROR'
    },
    {
      name: 'Database Unique Constraint Error',
      path: '/api/test-errors/db-unique-error',
      expectedStatus: 400,
      expectedCode: 'DATABASE_ERROR'
    },
    {
      name: 'File Upload Error',
      path: '/api/test-errors/upload-error',
      expectedStatus: 400,
      expectedCode: 'UPLOAD_ERROR'
    },
    {
      name: 'Generic Server Error',
      path: '/api/test-errors/server-error',
      expectedStatus: 500,
      expectedCode: 'SERVER_ERROR'
    },
    {
      name: 'Async Error Handling',
      path: '/api/test-errors/async-error',
      expectedStatus: 500,
      expectedCode: 'SERVER_ERROR'
    },
    {
      name: 'Async Success (no error)',
      path: '/api/test-errors/async-success',
      expectedStatus: 200,
      expectedCode: null
    },
    {
      name: '404 Not Found',
      path: '/api/nonexistent-route',
      expectedStatus: 404,
      expectedCode: 'NOT_FOUND'
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    console.log(`Test: ${test.name}`);
    try {
      const result = await makeRequest(test.path);
      console.log(`  Status: ${result.statusCode}`);
      console.log(`  Response:`, JSON.stringify(result.body, null, 2));
      
      if (result.statusCode === test.expectedStatus) {
        if (test.expectedCode === null) {
          // Success case - no error expected
          if (result.body.success !== false) {
            console.log(`  ✓ PASS\n`);
            passed++;
          } else {
            console.log(`  ✗ FAIL: Expected success response\n`);
            failed++;
          }
        } else {
          // Error case - check error code
          if (result.body.error && result.body.error.code === test.expectedCode) {
            console.log(`  ✓ PASS\n`);
            passed++;
          } else {
            console.log(`  ✗ FAIL: Expected error code ${test.expectedCode}\n`);
            failed++;
          }
        }
      } else {
        console.log(`  ✗ FAIL: Expected status ${test.expectedStatus}\n`);
        failed++;
      }
    } catch (error) {
      console.log(`  ✗ FAIL: ${error.message}\n`);
      failed++;
    }
  }

  console.log('=== Test Summary ===');
  console.log(`Total: ${tests.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`\nNote: Make sure the API server is running on port 3001`);
}

runTests().catch(console.error);
