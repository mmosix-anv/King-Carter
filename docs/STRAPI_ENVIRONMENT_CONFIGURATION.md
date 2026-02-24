# Strapi Services Integration - Environment Configuration

This document provides comprehensive information about environment variables used by the Strapi services integration, their defaults for different environments, and setup instructions.

## Overview

The Strapi services integration uses environment variables to configure API connectivity, timeouts, CORS settings, and behavior across development and production environments. The system is designed to work seamlessly in development with sensible defaults while requiring explicit configuration in production for security and reliability.

## Environment Variables

### Frontend Application Variables

These variables configure the frontend application's connection to the Strapi backend.

#### `VITE_STRAPI_URL`

**Description**: Base URL for the Strapi API endpoint.

**Format**: Full URL including protocol (e.g., `http://localhost:1337` or `https://api.example.com`)

**Required**: 
- Development: No (uses default)
- Production: Yes (must be explicitly set)

**Default Values**:
- Development: `http://localhost:1337`
- Production: None (empty string, will trigger fallback to local data if not set)

**Example**:
```bash
# Development
VITE_STRAPI_URL=http://localhost:1337

# Production
VITE_STRAPI_URL=https://cms.kingandcarter.com
```

**Notes**:
- In development, if not set, the application automatically uses `http://localhost:1337`
- In production, if not set, the application will use local fallback data instead of failing
- The URL should NOT include a trailing slash
- The URL should NOT include the `/api` path (this is added automatically)

---

#### `VITE_STRAPI_TIMEOUT`

**Description**: Request timeout in milliseconds for API calls to Strapi.

**Format**: Integer value representing milliseconds

**Required**: No (uses environment-specific defaults)

**Default Values**:
- Development: `5000` (5 seconds)
- Production: `10000` (10 seconds)

**Example**:
```bash
# Custom timeout of 15 seconds
VITE_STRAPI_TIMEOUT=15000
```

**Notes**:
- Longer timeouts in production account for potential network latency
- If a request exceeds the timeout, the application falls back to local service data
- Set higher values if experiencing timeout issues with slow networks

---

### Backend (Strapi) Variables

These variables configure the Strapi backend server and its behavior.

#### `FRONTEND_URL`

**Description**: Allowed origin(s) for CORS configuration. Controls which frontend domains can access the Strapi API.

**Format**: Single URL or comma-separated list of URLs

**Required**: No (uses defaults for local development)

**Default Values**:
- Development: `http://localhost:5173,http://localhost:3000`
- Production: Should be explicitly set to your production frontend URL(s)

**Example**:
```bash
# Single origin
FRONTEND_URL=https://kingandcarter.com

# Multiple origins (staging and production)
FRONTEND_URL=https://staging.kingandcarter.com,https://kingandcarter.com
```

**Notes**:
- Multiple URLs should be comma-separated with no spaces (or spaces will be trimmed)
- Include all domains that need to access the Strapi API
- Do NOT use wildcards in production for security reasons
- The default includes common Vite and React development server ports

---

#### Standard Strapi Variables

These are standard Strapi configuration variables. See `backend/.env.example` for the complete list.

**`HOST`**: Server host address (default: `0.0.0.0`)

**`PORT`**: Server port (default: `1337`)

**`APP_KEYS`**: Application keys for session encryption (required, must be changed from defaults)

**`API_TOKEN_SALT`**: Salt for API token generation (required)

**`ADMIN_JWT_SECRET`**: Secret for admin JWT tokens (required)

**`TRANSFER_TOKEN_SALT`**: Salt for transfer tokens (required)

**`JWT_SECRET`**: Secret for JWT tokens (required)

**`ENCRYPTION_KEY`**: Key for data encryption (required)

**Security Note**: All secrets and keys MUST be changed from the example values before deploying to production.

---

## Environment-Specific Behavior

The integration adapts its behavior based on the detected environment:

### Development Environment

**Detection**: `NODE_ENV=development` or `import.meta.env.MODE=development`

**Behavior**:
- Uses `http://localhost:1337` as default Strapi URL if not specified
- Shorter timeout (5 seconds) for faster feedback during development
- Detailed error logging with full stack traces and request details
- Permissive error handling (logs warnings but continues)
- CORS allows localhost ports by default

**Logging Example**:
```javascript
// Development logs include full details
{
  message: 'Strapi API Error',
  url: 'http://localhost:1337/api/services',
  method: 'GET',
  status: 500,
  statusText: 'Internal Server Error',
  data: { error: { message: 'Database connection failed' } },
  stack: '...'
}
```

### Production Environment

**Detection**: `NODE_ENV=production` or `import.meta.env.MODE=production`

**Behavior**:
- Requires explicit `VITE_STRAPI_URL` configuration (no default)
- Longer timeout (10 seconds) to accommodate network latency
- Minimal error logging (avoids exposing internal details)
- Graceful degradation to local data without throwing errors
- CORS requires explicit `FRONTEND_URL` configuration

**Logging Example**:
```javascript
// Production logs are minimal
{
  message: 'Service data fetch failed',
  status: 500,
  fallback: 'using local data'
}
```

---

## Setup Instructions

### Development Setup

1. **Clone the repository** and install dependencies:
   ```bash
   npm install
   cd backend && npm install
   ```

2. **Configure backend environment** (optional for development):
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and change security keys if needed
   ```

3. **Start the Strapi backend**:
   ```bash
   cd backend
   npm run develop
   ```
   The backend will start at `http://localhost:1337`

4. **Configure frontend environment** (optional):
   ```bash
   # Create .env file in project root if you need custom settings
   echo "VITE_STRAPI_URL=http://localhost:1337" > .env
   echo "VITE_STRAPI_TIMEOUT=5000" >> .env
   ```

5. **Populate Strapi with service data**:
   ```bash
   cd backend
   npm run migrate:services
   ```

6. **Start the frontend application**:
   ```bash
   npm run dev
   ```
   The frontend will start at `http://localhost:5173`

7. **Verify the integration**:
   - Open `http://localhost:5173` in your browser
   - Check browser console for any Strapi connection messages
   - Services should load from Strapi (or fallback to local data if Strapi is unavailable)

### Production Setup

1. **Configure backend environment variables**:
   ```bash
   # Set all required Strapi variables
   HOST=0.0.0.0
   PORT=1337
   APP_KEYS=<generate-secure-keys>
   API_TOKEN_SALT=<generate-secure-salt>
   ADMIN_JWT_SECRET=<generate-secure-secret>
   TRANSFER_TOKEN_SALT=<generate-secure-salt>
   JWT_SECRET=<generate-secure-secret>
   ENCRYPTION_KEY=<generate-secure-key>
   
   # Set frontend URL for CORS
   FRONTEND_URL=https://yourdomain.com
   ```

2. **Configure frontend environment variables**:
   ```bash
   # Set Strapi API URL
   VITE_STRAPI_URL=https://cms.yourdomain.com
   
   # Optional: Set custom timeout
   VITE_STRAPI_TIMEOUT=10000
   ```

3. **Build the applications**:
   ```bash
   # Build frontend
   npm run build
   
   # Build backend (if needed)
   cd backend
   npm run build
   ```

4. **Deploy backend**:
   - Deploy Strapi to your hosting platform
   - Ensure all environment variables are set
   - Run migrations to populate data:
     ```bash
     npm run migrate:services
     ```

5. **Deploy frontend**:
   - Deploy the built frontend to your hosting platform
   - Ensure `VITE_STRAPI_URL` points to your deployed Strapi instance

6. **Verify the integration**:
   - Access your production frontend URL
   - Verify services load from Strapi
   - Check that CORS is working (no console errors)
   - Test fallback by temporarily stopping Strapi

### Testing the Integration

#### Health Check

Test Strapi connectivity:
```javascript
import { StrapiClient } from './src/api/strapiClient.js';

const client = new StrapiClient();
const isHealthy = await client.healthCheck();
console.log('Strapi is', isHealthy ? 'available' : 'unavailable');
```

#### Data Validation

Verify data integrity:
```javascript
const validationResult = await client.validateData();
if (!validationResult.valid) {
  console.log('Data discrepancies found:', validationResult.errors);
}
```

#### Fallback Testing

Test fallback mechanism:
```bash
# Stop Strapi backend
# Frontend should continue working with local data
# Check console for fallback warning message
```

---

## Troubleshooting

### Issue: Frontend can't connect to Strapi

**Symptoms**: Console shows connection errors, services load from local data

**Solutions**:
1. Verify Strapi is running: `curl http://localhost:1337/api/services`
2. Check `VITE_STRAPI_URL` is set correctly
3. Verify CORS configuration in `backend/config/middlewares.ts`
4. Check `FRONTEND_URL` includes your frontend domain

### Issue: CORS errors in browser console

**Symptoms**: Browser blocks requests with CORS policy errors

**Solutions**:
1. Add your frontend URL to `FRONTEND_URL` environment variable
2. Restart Strapi backend after changing environment variables
3. Verify the URL format matches exactly (including protocol and port)
4. Check browser console for the exact origin being blocked

### Issue: Requests timeout

**Symptoms**: Requests take too long and fall back to local data

**Solutions**:
1. Increase `VITE_STRAPI_TIMEOUT` value
2. Check Strapi server performance and database connection
3. Verify network connectivity between frontend and backend
4. Check Strapi logs for slow queries

### Issue: Production shows local data instead of Strapi data

**Symptoms**: Content doesn't match Strapi CMS, using fallback data

**Solutions**:
1. Verify `VITE_STRAPI_URL` is set in production environment
2. Check production build includes environment variables
3. Verify Strapi backend is accessible from production frontend
4. Check browser console for error messages
5. Test Strapi API directly: `curl https://your-strapi-url/api/services`

### Issue: Environment variables not working

**Symptoms**: Application uses defaults instead of configured values

**Solutions**:
1. Ensure `.env` file is in the correct location (project root for frontend, `backend/` for backend)
2. Restart development servers after changing `.env` files
3. Verify variable names are correct (case-sensitive)
4. For Vite variables, ensure they start with `VITE_`
5. Check that `.env` file is not in `.gitignore` for local development

---

## Configuration Examples

### Local Development (Default)

**Frontend `.env`** (optional, uses defaults):
```bash
# No configuration needed, uses defaults
```

**Backend `.env`**:
```bash
HOST=0.0.0.0
PORT=1337
APP_KEYS="dev-key-1,dev-key-2"
API_TOKEN_SALT=dev-salt
ADMIN_JWT_SECRET=dev-secret
TRANSFER_TOKEN_SALT=dev-salt
JWT_SECRET=dev-secret
ENCRYPTION_KEY=dev-key
FRONTEND_URL=http://localhost:5173
```

### Staging Environment

**Frontend `.env`**:
```bash
VITE_STRAPI_URL=https://staging-cms.kingandcarter.com
VITE_STRAPI_TIMEOUT=8000
```

**Backend `.env`**:
```bash
HOST=0.0.0.0
PORT=1337
APP_KEYS="<staging-secure-keys>"
API_TOKEN_SALT=<staging-secure-salt>
ADMIN_JWT_SECRET=<staging-secure-secret>
TRANSFER_TOKEN_SALT=<staging-secure-salt>
JWT_SECRET=<staging-secure-secret>
ENCRYPTION_KEY=<staging-secure-key>
FRONTEND_URL=https://staging.kingandcarter.com
```

### Production Environment

**Frontend `.env`**:
```bash
VITE_STRAPI_URL=https://cms.kingandcarter.com
VITE_STRAPI_TIMEOUT=10000
```

**Backend `.env`**:
```bash
HOST=0.0.0.0
PORT=1337
APP_KEYS="<production-secure-keys>"
API_TOKEN_SALT=<production-secure-salt>
ADMIN_JWT_SECRET=<production-secure-secret>
TRANSFER_TOKEN_SALT=<production-secure-salt>
JWT_SECRET=<production-secure-secret>
ENCRYPTION_KEY=<production-secure-key>
FRONTEND_URL=https://kingandcarter.com,https://www.kingandcarter.com
```

---

## Security Best Practices

1. **Never commit `.env` files** to version control
   - Use `.env.example` or `.env.template` for documentation
   - Add `.env` to `.gitignore`

2. **Use strong, unique secrets** in production
   - Generate cryptographically secure random strings
   - Use different secrets for each environment
   - Rotate secrets periodically

3. **Restrict CORS origins** in production
   - Only allow specific, known frontend domains
   - Avoid wildcards (`*`) in production
   - Use HTTPS URLs in production

4. **Use HTTPS** in production
   - Both frontend and backend should use HTTPS
   - Configure SSL/TLS certificates properly
   - Redirect HTTP to HTTPS

5. **Limit exposed information** in logs
   - Production logs should be minimal
   - Avoid logging sensitive data
   - Use proper log levels (error, warn, info)

---

## Related Documentation

- [Migration Script Usage](../backend/scripts/README.md) - How to populate Strapi with service data
- [API Client Usage](../src/api/strapiClient.js) - JSDoc documentation for the API client
- [Strapi Official Documentation](https://docs.strapi.io/) - Comprehensive Strapi guides

---

## Summary

### Quick Reference Table

| Variable | Frontend/Backend | Required | Development Default | Production Default |
|----------|-----------------|----------|---------------------|-------------------|
| `VITE_STRAPI_URL` | Frontend | No (Dev) / Yes (Prod) | `http://localhost:1337` | None (must set) |
| `VITE_STRAPI_TIMEOUT` | Frontend | No | `5000` | `10000` |
| `FRONTEND_URL` | Backend | No | `http://localhost:5173,http://localhost:3000` | None (should set) |
| `HOST` | Backend | No | `0.0.0.0` | `0.0.0.0` |
| `PORT` | Backend | No | `1337` | `1337` |
| `APP_KEYS` | Backend | Yes | Must set | Must set |
| `API_TOKEN_SALT` | Backend | Yes | Must set | Must set |
| `ADMIN_JWT_SECRET` | Backend | Yes | Must set | Must set |
| `TRANSFER_TOKEN_SALT` | Backend | Yes | Must set | Must set |
| `JWT_SECRET` | Backend | Yes | Must set | Must set |
| `ENCRYPTION_KEY` | Backend | Yes | Must set | Must set |

### Key Takeaways

- **Development works out of the box** with sensible defaults
- **Production requires explicit configuration** for security
- **Fallback mechanism ensures availability** even when Strapi is down
- **Environment-specific logging** balances debugging needs with security
- **CORS configuration** must match your frontend domain(s)
