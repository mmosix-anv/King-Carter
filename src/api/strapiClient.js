/**
 * Strapi API Client Module
 * 
 * Provides a robust client for fetching service data from Strapi CMS
 * with automatic fallback to local data when Strapi is unavailable.
 * 
 * Features:
 * - Environment-aware configuration
 * - Response validation and transformation
 * - Graceful error handling with fallback mechanism
 * - Health check and data validation utilities
 * 
 * Configuration Options:
 * - baseURL: Strapi API base URL (from VITE_STRAPI_URL or environment defaults)
 * - timeout: Request timeout in milliseconds (from VITE_STRAPI_TIMEOUT or 5000ms dev / 10000ms prod)
 * - environment: 'development' or 'production' (affects logging verbosity)
 * 
 * Usage Examples:
 * 
 * @example
 * // Basic usage with default configuration
 * import { createStrapiClient } from './api/strapiClient.js';
 * 
 * const client = createStrapiClient();
 * const services = await client.fetchServices();
 * console.log(services); // { 'service-id': {...}, ... }
 * 
 * @example
 * // Custom configuration
 * import { StrapiClient } from './api/strapiClient.js';
 * 
 * const client = new StrapiClient({
 *   baseURL: 'https://custom-strapi.example.com',
 *   timeout: 15000,
 *   environment: 'production'
 * });
 * 
 * @example
 * // Fetch specific service with error handling
 * const client = createStrapiClient();
 * const service = await client.fetchServiceById('private-luxury-transport');
 * if (service) {
 *   console.log(service.heroTitle);
 * } else {
 *   console.log('Service not found');
 * }
 * 
 * @example
 * // Health check before fetching
 * const client = createStrapiClient();
 * const isHealthy = await client.healthCheck();
 * if (isHealthy) {
 *   const services = await client.fetchServices();
 * } else {
 *   console.log('Strapi unavailable, will use fallback data');
 * }
 * 
 * @example
 * // Validate data synchronization
 * const client = createStrapiClient();
 * const validation = await client.validateData();
 * if (!validation.valid) {
 *   console.log('Data discrepancies found:');
 *   validation.errors.forEach(err => {
 *     console.log(`- ${err.field}: ${err.message}`);
 *   });
 * }
 * 
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 5.4, 6.1, 6.4, 8.1, 8.2, 10.3, 10.4
 * 
 * @module api/strapiClient
 */

import { getStrapiConfig } from '../config/strapi.js';
import { validateServiceData, validateServiceArray } from './validators/serviceValidator.js';
import { servicesData } from '../data/services.js';

/**
 * @typedef {Object} StrapiConfig
 * @property {string} baseURL - Base URL for Strapi API (e.g., 'http://localhost:1337' or 'https://cms.example.com')
 * @property {number} timeout - Request timeout in milliseconds (default: 5000 in dev, 10000 in prod)
 * @property {'development' | 'production'} environment - Current environment (affects logging verbosity)
 * 
 * @example
 * // Development configuration
 * {
 *   baseURL: 'http://localhost:1337',
 *   timeout: 5000,
 *   environment: 'development'
 * }
 * 
 * @example
 * // Production configuration
 * {
 *   baseURL: 'https://cms.example.com',
 *   timeout: 10000,
 *   environment: 'production'
 * }
 */

/**
 * @typedef {Object} ServiceData
 * @property {string} id - Unique service identifier (kebab-case, e.g., 'private-luxury-transport')
 * @property {string} heroTitle - Service title displayed in hero section
 * @property {string} heroTagline - Service tagline/subtitle
 * @property {string} heroImage - Hero image URL or path
 * @property {string} featuredImage - Featured image URL or path used on homepage
 * @property {string[]} description - Array of description paragraph strings
 * @property {string[]} highlights - Array of service highlight/feature strings
 * @property {string[]} images - Array of gallery image URLs or paths
 * @property {Object} cta - Call to action configuration
 * @property {string} cta.text - CTA promotional text
 * @property {string} cta.buttonLabel - CTA button label text
 * 
 * @example
 * // Complete service data structure
 * {
 *   id: 'private-luxury-transport',
 *   heroTitle: 'Private Luxury Transport',
 *   heroTagline: 'Experience unparalleled comfort',
 *   heroImage: '/images/luxury-transport.jpg',
 *   description: [
 *     'First paragraph of description',
 *     'Second paragraph of description'
 *   ],
 *   highlights: [
 *     'Premium vehicles',
 *     'Professional chauffeurs',
 *     '24/7 availability'
 *   ],
 *   images: [
 *     '/images/gallery1.jpg',
 *     '/images/gallery2.jpg'
 *   ],
 *   cta: {
 *     text: 'Book your luxury experience today',
 *     buttonLabel: 'Reserve Now'
 *   }
 * }
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether validation passed (true) or failed (false)
 * @property {Array<{field: string, message: string, value: any}>} errors - Array of validation errors (empty if valid)
 * 
 * @example
 * // Successful validation
 * {
 *   valid: true,
 *   errors: []
 * }
 * 
 * @example
 * // Failed validation with errors
 * {
 *   valid: false,
 *   errors: [
 *     {
 *       field: 'heroTitle',
 *       message: 'heroTitle must be a non-empty string',
 *       value: ''
 *     },
 *     {
 *       field: 'description',
 *       message: 'description must be an array of strings',
 *       value: 'not an array'
 *     }
 *   ]
 * }
 */

/**
 * Strapi API Client
 * 
 * Handles all communication with the Strapi backend, including
 * fetching services, validating responses, and managing fallback logic.
 * 
 * The client automatically falls back to local service data when:
 * - Strapi is unreachable (network errors, timeouts)
 * - Strapi returns error responses (4xx, 5xx)
 * - Response data fails validation
 * 
 * Configuration is automatically loaded from environment variables:
 * - VITE_STRAPI_URL: Base URL for Strapi API
 * - VITE_STRAPI_TIMEOUT: Request timeout in milliseconds
 * 
 * Environment-specific defaults:
 * - Development: localhost:1337, 5s timeout, detailed logging
 * - Production: explicit URL required, 10s timeout, minimal logging
 * 
 * @example
 * // Using default configuration
 * const client = new StrapiClient();
 * 
 * @example
 * // Custom configuration override
 * const client = new StrapiClient({
 *   baseURL: 'https://api.example.com',
 *   timeout: 15000,
 *   environment: 'production'
 * });
 */
export class StrapiClient {
  /**
   * Creates a new Strapi client instance
   * 
   * Configuration options:
   * - baseURL: Strapi API base URL (defaults from environment)
   * - timeout: Request timeout in milliseconds (defaults: 5000ms dev, 10000ms prod)
   * - environment: 'development' or 'production' (affects logging verbosity)
   * 
   * If no config is provided, automatically loads configuration from:
   * - VITE_STRAPI_URL environment variable
   * - VITE_STRAPI_TIMEOUT environment variable
   * - NODE_ENV or import.meta.env.MODE for environment detection
   * 
   * @param {StrapiConfig} [config] - Optional configuration override
   * 
   * @example
   * // Use default environment configuration
   * const client = new StrapiClient();
   * 
   * @example
   * // Override with custom configuration
   * const client = new StrapiClient({
   *   baseURL: 'https://cms.example.com',
   *   timeout: 20000,
   *   environment: 'production'
   * });
   */
  constructor(config = null) {
    const envConfig = getStrapiConfig();
    
    this.config = {
      baseURL: config?.baseURL || envConfig.apiUrl,
      timeout: config?.timeout || envConfig.timeout,
      environment: config?.environment || (envConfig.enableDetailedLogging ? 'development' : 'production')
    };

    this.enableDetailedLogging = this.config.environment === 'development';
  }

  /**
   * Logs messages based on environment configuration
   * 
   * @private
   * @param {'info' | 'warn' | 'error'} level - Log level
   * @param {string} message - Log message
   * @param {*} [details] - Additional details (only logged in development)
   */
  _log(level, message, details = null) {
    if (level === 'error') {
      if (this.enableDetailedLogging && details) {
        console.error(message, details);
      } else {
        console.error(message);
      }
    } else if (level === 'warn') {
      if (this.enableDetailedLogging && details) {
        console.warn(message, details);
      } else {
        console.warn(message);
      }
    } else {
      if (this.enableDetailedLogging && details) {
        console.log(message, details);
      } else {
        console.log(message);
      }
    }
  }

  /**
   * Returns local fallback service data
   * 
   * @private
   * @returns {Record<string, ServiceData>} Local services data
   */
  _getFallbackData() {
    return servicesData;
  }

  /**
   * Transforms Strapi API response to local data format
   * 
   * Converts Strapi's response structure:
   * Strapi v4: { data: [{ id: number, attributes: {...} }] }
   * Strapi v5: { data: [{ id: number, serviceId: string, ... }] }
   * 
   * To local format:
   * { 'service-id': { id: 'service-id', ... } }
   * 
   * @private
   * @param {Object} strapiResponse - Raw Strapi API response
   * @returns {Record<string, ServiceData>} Transformed service data
   */
  _transformResponse(strapiResponse) {
    if (!strapiResponse?.data || !Array.isArray(strapiResponse.data)) {
      throw new Error('Invalid Strapi response structure: missing data array');
    }

    const transformed = {};

    for (const item of strapiResponse.data) {
      // Support both Strapi v4 (with attributes) and v5 (flat structure)
      const attrs = item.attributes || item;
      const serviceId = attrs.serviceId || attrs.id;

      if (!serviceId) {
        this._log('warn', 'Skipping item without serviceId', attrs);
        continue;
      }

      // Transform to local format
      transformed[serviceId] = {
        id: serviceId,
        heroTitle: attrs.heroTitle,
        heroTagline: attrs.heroTagline,
        heroImage: attrs.heroImage,
        featuredImage: attrs.featuredImage,
        description: attrs.description,
        highlights: attrs.highlights,
        images: attrs.images,
        cta: attrs.cta
      };
    }

    return transformed;
  }

  /**
   * Makes an HTTP request to Strapi API
   * 
   * @private
   * @param {string} endpoint - API endpoint (e.g., '/api/services')
   * @returns {Promise<Object>} Response data
   * @throws {Error} On network or HTTP errors
   */
  async _makeRequest(endpoint) {
    if (!this.config.baseURL) {
      throw new Error('Strapi URL not configured');
    }

    const url = `${this.config.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.response = {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        };
        throw error;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle abort/timeout
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Request timeout');
        timeoutError.code = 'ETIMEDOUT';
        throw timeoutError;
      }

      // Handle network errors (including DNS failures)
      if (error.message.includes('fetch') || error.code === 'ENOTFOUND') {
        const networkError = new Error('Network error');
        networkError.code = error.code || 'ECONNREFUSED';
        throw networkError;
      }

      throw error;
    }
  }

  /**
   * Fetches all services from Strapi
   * 
   * Returns service data as an object with serviceId as keys.
   * Falls back to local data if Strapi is unavailable or returns invalid data.
   * 
   * Fallback triggers:
   * - Network errors (connection refused, timeout, DNS failure)
   * - HTTP errors (4xx, 5xx status codes)
   * - Invalid response structure
   * - Validation failures
   * 
   * @returns {Promise<Record<string, ServiceData>>} Services data object
   * 
   * @example
   * // Basic usage
   * const client = new StrapiClient();
   * const services = await client.fetchServices();
   * // { 'private-luxury-transport': {...}, 'corporate-executive-travel': {...}, ... }
   * 
   * @example
   * // Iterate over services
   * const services = await client.fetchServices();
   * Object.entries(services).forEach(([id, service]) => {
   *   console.log(`${id}: ${service.heroTitle}`);
   * });
   * 
   * @example
   * // Access specific service from result
   * const services = await client.fetchServices();
   * const luxuryTransport = services['private-luxury-transport'];
   * if (luxuryTransport) {
   *   console.log(luxuryTransport.heroTitle);
   * }
   */
  async fetchServices() {
    try {
      // Make request to Strapi
      const response = await this._makeRequest('/api/services');

      // Transform response
      const transformed = this._transformResponse(response);

      // Validate transformed data
      const validationResult = validateServiceArray(transformed);
      if (!validationResult.valid) {
        this._log('warn', 'Invalid response from Strapi, using fallback data', {
          errors: validationResult.errors
        });
        return this._getFallbackData();
      }

      this._log('info', `Successfully fetched ${Object.keys(transformed).length} services from Strapi`);
      return transformed;

    } catch (error) {
      // Handle different error types
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
        this._log('warn', 'Strapi unavailable, using fallback data');
      } else if (error.response) {
        this._log('error', 'Strapi returned error, using fallback data', {
          status: error.response.status,
          message: error.response.data?.error?.message || error.message
        });
      } else {
        this._log('error', 'Unexpected error fetching from Strapi, using fallback data', {
          message: error.message,
          stack: this.enableDetailedLogging ? error.stack : undefined
        });
      }

      return this._getFallbackData();
    }
  }

  /**
   * Fetches a single service by ID from Strapi
   * 
   * Returns the service data if found, or null if not found.
   * Falls back to local data if Strapi is unavailable or returns invalid data.
   * 
   * Fallback triggers:
   * - Network errors (connection refused, timeout, DNS failure)
   * - HTTP errors (4xx, 5xx status codes)
   * - Service not found in Strapi (checks local data)
   * - Service ID mismatch in response
   * - Validation failures
   * 
   * @param {string} serviceId - The service identifier (e.g., 'private-luxury-transport')
   * @returns {Promise<ServiceData|null>} Service data or null if not found
   * 
   * @example
   * // Fetch specific service
   * const client = new StrapiClient();
   * const service = await client.fetchServiceById('private-luxury-transport');
   * if (service) {
   *   console.log(service.heroTitle);
   *   console.log(service.description.join(' '));
   * }
   * 
   * @example
   * // Handle not found case
   * const service = await client.fetchServiceById('non-existent-service');
   * if (!service) {
   *   console.log('Service not found');
   * }
   * 
   * @example
   * // Use in React component
   * const [service, setService] = useState(null);
   * useEffect(() => {
   *   const client = createStrapiClient();
   *   client.fetchServiceById('corporate-executive-travel')
   *     .then(setService);
   * }, []);
   */
  async fetchServiceById(serviceId) {
    try {
      // Make request to Strapi with filter
      const endpoint = `/api/services?filters[serviceId][$eq]=${encodeURIComponent(serviceId)}`;
      const response = await this._makeRequest(endpoint);

      // Transform response
      const transformed = this._transformResponse(response);

      // Check if service was found
      if (Object.keys(transformed).length === 0) {
        this._log('info', `Service ${serviceId} not found in Strapi, checking fallback data`);
        const fallbackData = this._getFallbackData();
        return fallbackData[serviceId] || null;
      }

      // Get the service (should be only one due to filter)
      const service = transformed[serviceId];

      if (!service) {
        this._log('warn', `Service ID mismatch: requested ${serviceId} but got different ID`);
        const fallbackData = this._getFallbackData();
        return fallbackData[serviceId] || null;
      }

      // Validate service data
      const validationResult = validateServiceData(service);
      if (!validationResult.valid) {
        this._log('warn', `Invalid service data for ${serviceId}, using fallback`, {
          errors: validationResult.errors
        });
        const fallbackData = this._getFallbackData();
        return fallbackData[serviceId] || null;
      }

      this._log('info', `Successfully fetched service ${serviceId} from Strapi`);
      return service;

    } catch (error) {
      // Handle errors and fall back to local data
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
        this._log('warn', `Strapi unavailable for service ${serviceId}, using fallback data`);
      } else if (error.response) {
        this._log('error', `Strapi error for service ${serviceId}, using fallback data`, {
          status: error.response.status,
          message: error.response.data?.error?.message || error.message
        });
      } else {
        this._log('error', `Unexpected error fetching service ${serviceId}, using fallback data`, {
          message: error.message
        });
      }

      const fallbackData = this._getFallbackData();
      return fallbackData[serviceId] || null;
    }
  }

  /**
   * Performs a health check on Strapi connectivity
   * 
   * Attempts to connect to Strapi and verify it's responding.
   * Returns true if Strapi is available and responding, false otherwise.
   * 
   * Use this method to:
   * - Check if Strapi is available before fetching data
   * - Monitor Strapi status in application health checks
   * - Decide whether to show "CMS unavailable" messages to users
   * 
   * @returns {Promise<boolean>} True if Strapi is healthy, false otherwise
   * 
   * @example
   * // Check health before fetching
   * const client = new StrapiClient();
   * const isHealthy = await client.healthCheck();
   * if (!isHealthy) {
   *   console.log('Strapi is unavailable, using fallback data');
   * }
   * 
   * @example
   * // Use in monitoring/status endpoint
   * app.get('/api/health', async (req, res) => {
   *   const client = createStrapiClient();
   *   const strapiHealthy = await client.healthCheck();
   *   res.json({
   *     status: 'ok',
   *     strapi: strapiHealthy ? 'connected' : 'unavailable'
   *   });
   * });
   * 
   * @example
   * // Conditional UI rendering
   * const [cmsStatus, setCmsStatus] = useState('checking');
   * useEffect(() => {
   *   const client = createStrapiClient();
   *   client.healthCheck().then(healthy => {
   *     setCmsStatus(healthy ? 'online' : 'offline');
   *   });
   * }, []);
   */
  async healthCheck() {
    try {
      if (!this.config.baseURL) {
        this._log('warn', 'Strapi URL not configured');
        return false;
      }

      // Try to fetch services endpoint
      await this._makeRequest('/api/services');
      
      this._log('info', 'Strapi health check passed');
      return true;

    } catch (error) {
      this._log('warn', 'Strapi health check failed', {
        message: error.message,
        code: error.code
      });
      return false;
    }
  }

  /**
   * Validates that Strapi data matches local data structure
   * 
   * Fetches data from Strapi and compares it against local data structure
   * to identify any discrepancies. Useful for testing and debugging.
   * 
   * Checks performed:
   * - Services in local data but missing in Strapi
   * - Services in Strapi but missing in local data
   * - Validation of each service's data structure
   * - Field type and format validation
   * 
   * Use this method to:
   * - Verify migration script ran successfully
   * - Debug data synchronization issues
   * - Validate data integrity in CI/CD pipelines
   * - Monitor data consistency over time
   * 
   * @returns {Promise<ValidationResult>} Validation result with discrepancies
   * 
   * @example
   * // Basic validation
   * const client = new StrapiClient();
   * const result = await client.validateData();
   * if (!result.valid) {
   *   console.log('Discrepancies found:', result.errors);
   * }
   * 
   * @example
   * // Detailed error reporting
   * const result = await client.validateData();
   * if (!result.valid) {
   *   console.log(`Found ${result.errors.length} issues:`);
   *   result.errors.forEach(error => {
   *     console.log(`  [${error.field}] ${error.message}`);
   *   });
   * }
   * 
   * @example
   * // Use in test suite
   * describe('Strapi Data Integrity', () => {
   *   it('should match local data structure', async () => {
   *     const client = createStrapiClient();
   *     const result = await client.validateData();
   *     expect(result.valid).toBe(true);
   *     expect(result.errors).toHaveLength(0);
   *   });
   * });
   * 
   * @example
   * // CI/CD validation script
   * const client = createStrapiClient();
   * const result = await client.validateData();
   * if (!result.valid) {
   *   console.error('Data validation failed!');
   *   process.exit(1);
   * }
   * console.log('Data validation passed');
   */
  async validateData() {
    const errors = [];

    try {
      // Fetch data from Strapi
      const response = await this._makeRequest('/api/services');
      const strapiData = this._transformResponse(response);

      // Get local data
      const localData = this._getFallbackData();

      // Check for services in local but not in Strapi
      const localIds = Object.keys(localData);
      const strapiIds = Object.keys(strapiData);

      for (const localId of localIds) {
        if (!strapiIds.includes(localId)) {
          errors.push({
            field: 'serviceId',
            message: `Service ${localId} exists in local data but not in Strapi`,
            value: localId
          });
        }
      }

      // Check for services in Strapi but not in local
      for (const strapiId of strapiIds) {
        if (!localIds.includes(strapiId)) {
          errors.push({
            field: 'serviceId',
            message: `Service ${strapiId} exists in Strapi but not in local data`,
            value: strapiId
          });
        }
      }

      // Validate each service in Strapi
      for (const [serviceId, serviceData] of Object.entries(strapiData)) {
        const validationResult = validateServiceData(serviceData);
        if (!validationResult.valid) {
          validationResult.errors.forEach(error => {
            errors.push({
              field: `${serviceId}.${error.field}`,
              message: `Service ${serviceId}: ${error.message}`,
              value: error.value
            });
          });
        }
      }

      if (errors.length === 0) {
        this._log('info', 'Data validation passed: Strapi data matches local structure');
      } else {
        this._log('warn', `Data validation found ${errors.length} discrepancies`);
      }

      return {
        valid: errors.length === 0,
        errors
      };

    } catch (error) {
      this._log('error', 'Failed to validate data', {
        message: error.message
      });

      return {
        valid: false,
        errors: [{
          field: 'connection',
          message: `Unable to connect to Strapi: ${error.message}`,
          value: null
        }]
      };
    }
  }
}

/**
 * Creates a default Strapi client instance
 * 
 * Convenience factory function that creates a StrapiClient with
 * default configuration loaded from environment variables.
 * 
 * Equivalent to: new StrapiClient()
 * 
 * @returns {StrapiClient} Configured Strapi client
 * 
 * @example
 * // Simple usage
 * import { createStrapiClient } from './api/strapiClient.js';
 * const client = createStrapiClient();
 * const services = await client.fetchServices();
 * 
 * @example
 * // Use in module initialization
 * export const strapiClient = createStrapiClient();
 * 
 * @example
 * // Use in React hooks
 * function useServices() {
 *   const [services, setServices] = useState({});
 *   useEffect(() => {
 *     const client = createStrapiClient();
 *     client.fetchServices().then(setServices);
 *   }, []);
 *   return services;
 * }
 */
export function createStrapiClient() {
  return new StrapiClient();
}
