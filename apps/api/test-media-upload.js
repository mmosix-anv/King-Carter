/**
 * Manual test script for media upload endpoint
 * 
 * This script tests the POST /api/media/upload endpoint
 * 
 * Prerequisites:
 * 1. Server must be running (npm run dev)
 * 2. Database must have a test user
 * 3. uploads/ directory must exist
 * 
 * Usage: node test-media-upload.js
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const http = require('http');

// Configuration
const API_HOST = 'localhost';
const API_PORT = 3001;
const TEST_USERNAME = 'admin';
const TEST_PASSWORD = 'admin123';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null
          };
          resolve(response);
        } catch (error) {
          resolve({ status: res.statusCode, body: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      if (data instanceof FormData) {
        data.pipe(req);
      } else {
        req.write(JSON.stringify(data));
        req.end();
      }
    } else {
      req.end();
    }
  });
}

// Step 1: Login to get JWT token
async function login() {
  log('\n1. Logging in...', colors.blue);
  
  const options = {
    hostname: API_HOST,
    port: API_PORT,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const response = await makeRequest(options, {
    username: TEST_USERNAME,
    password: TEST_PASSWORD
  });

  if (response.status === 200 && response.body.success) {
    log(`✓ Login successful`, colors.green);
    log(`  Token: ${response.body.token.substring(0, 20)}...`, colors.reset);
    return response.body.token;
  } else {
    log(`✗ Login failed: ${JSON.stringify(response.body)}`, colors.red);
    throw new Error('Login failed');
  }
}

// Step 2: Create a test image
function createTestImage() {
  log('\n2. Creating test image...', colors.blue);
  
  const testImagePath = path.join(__dirname, 'test-upload-image.jpg');
  
  // Create a simple 1x1 pixel JPEG (minimal valid JPEG)
  const jpegData = Buffer.from([
    0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46,
    0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01,
    0x00, 0x01, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
    0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08,
    0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0A, 0x0C,
    0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
    0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D,
    0x1A, 0x1C, 0x1C, 0x20, 0x24, 0x2E, 0x27, 0x20,
    0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
    0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27,
    0x39, 0x3D, 0x38, 0x32, 0x3C, 0x2E, 0x33, 0x34,
    0x32, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
    0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4,
    0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x03, 0xFF, 0xC4, 0x00, 0x14,
    0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01,
    0x00, 0x00, 0x3F, 0x00, 0x37, 0xFF, 0xD9
  ]);
  
  fs.writeFileSync(testImagePath, jpegData);
  log(`✓ Test image created: ${testImagePath}`, colors.green);
  
  return testImagePath;
}

// Step 3: Upload image
async function uploadImage(token, imagePath) {
  log('\n3. Uploading image...', colors.blue);
  
  const form = new FormData();
  form.append('image', fs.createReadStream(imagePath));
  
  const options = {
    hostname: API_HOST,
    port: API_PORT,
    path: '/api/media/upload',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      ...form.getHeaders()
    }
  };

  const response = await makeRequest(options, form);

  if (response.status === 200 && response.body.success) {
    log(`✓ Upload successful`, colors.green);
    log(`  Media ID: ${response.body.data.id}`, colors.reset);
    log(`  Original URL: ${response.body.data.urls.original}`, colors.reset);
    log(`  Thumbnail URL: ${response.body.data.urls.thumbnail}`, colors.reset);
    log(`  Medium URL: ${response.body.data.urls.medium}`, colors.reset);
    return response.body.data;
  } else {
    log(`✗ Upload failed: ${JSON.stringify(response.body)}`, colors.red);
    throw new Error('Upload failed');
  }
}

// Step 4: Verify files exist
function verifyFiles(data) {
  log('\n4. Verifying uploaded files...', colors.blue);
  
  const uploadsDir = path.join(__dirname, 'uploads');
  const files = [
    data.filename,
    data.filename.replace(/(\.\w+)$/, '-thumb$1'),
    data.filename.replace(/(\.\w+)$/, '-medium$1')
  ];
  
  let allExist = true;
  files.forEach(file => {
    const filePath = path.join(uploadsDir, file);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      log(`  ✓ ${file} (${stats.size} bytes)`, colors.green);
    } else {
      log(`  ✗ ${file} not found`, colors.red);
      allExist = false;
    }
  });
  
  return allExist;
}

// Step 5: Test error cases
async function testErrorCases(token) {
  log('\n5. Testing error cases...', colors.blue);
  
  // Test 1: No file provided
  log('  Testing upload without file...', colors.yellow);
  const form1 = new FormData();
  const options1 = {
    hostname: API_HOST,
    port: API_PORT,
    path: '/api/media/upload',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      ...form1.getHeaders()
    }
  };
  
  const response1 = await makeRequest(options1, form1);
  if (response1.status === 400 && response1.body.error.code === 'NO_FILE') {
    log(`    ✓ Correctly rejected upload without file`, colors.green);
  } else {
    log(`    ✗ Expected 400 with NO_FILE error`, colors.red);
  }
  
  // Test 2: No authorization token
  log('  Testing upload without token...', colors.yellow);
  const form2 = new FormData();
  form2.append('image', fs.createReadStream(path.join(__dirname, 'test-upload-image.jpg')));
  const options2 = {
    hostname: API_HOST,
    port: API_PORT,
    path: '/api/media/upload',
    method: 'POST',
    headers: form2.getHeaders()
  };
  
  const response2 = await makeRequest(options2, form2);
  if (response2.status === 401) {
    log(`    ✓ Correctly rejected upload without token`, colors.green);
  } else {
    log(`    ✗ Expected 401 unauthorized`, colors.red);
  }
}

// Cleanup
function cleanup() {
  log('\n6. Cleaning up...', colors.blue);
  const testImagePath = path.join(__dirname, 'test-upload-image.jpg');
  if (fs.existsSync(testImagePath)) {
    fs.unlinkSync(testImagePath);
    log(`  ✓ Removed test image`, colors.green);
  }
}

// Main test flow
async function runTests() {
  log('='.repeat(60), colors.blue);
  log('Media Upload Endpoint Test', colors.blue);
  log('='.repeat(60), colors.blue);
  
  try {
    // Login
    const token = await login();
    
    // Create test image
    const imagePath = createTestImage();
    
    // Upload image
    const uploadData = await uploadImage(token, imagePath);
    
    // Verify files
    const filesExist = verifyFiles(uploadData);
    
    // Test error cases
    await testErrorCases(token);
    
    // Cleanup
    cleanup();
    
    // Summary
    log('\n' + '='.repeat(60), colors.blue);
    if (filesExist) {
      log('All tests passed! ✓', colors.green);
    } else {
      log('Some tests failed ✗', colors.yellow);
    }
    log('='.repeat(60), colors.blue);
    
  } catch (error) {
    log(`\n✗ Test failed: ${error.message}`, colors.red);
    log(error.stack, colors.red);
    cleanup();
    process.exit(1);
  }
}

// Check if form-data is available
try {
  require.resolve('form-data');
  runTests();
} catch (e) {
  log('Error: form-data package not found', colors.red);
  log('Please install it: npm install form-data', colors.yellow);
  process.exit(1);
}
