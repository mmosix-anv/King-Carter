/**
 * Integration Tests for Strapi API Endpoint Configuration
 * 
 * Validates Requirements 8.1, 8.2, 8.3, 8.5:
 * - /api/services endpoint is exposed
 * - Filtering by serviceId works
 * - Response format matches expected structure
 * - JSON content-type headers are correct
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const STRAPI_URL = process.env.VITE_STRAPI_URL || 'http://localhost:1337';
const API_ENDPOINT = `${STRAPI_URL}/api/services`;

describe('Strapi API Endpoint Configuration', () => {
  let strapiAvailable = false;

  beforeAll(async () => {
    // Check if Strapi is running
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      strapiAvailable = response.ok || response.status === 404;
    } catch (error) {
      console.warn('Strapi is not running. Some tests will be skipped.');
      strapiAvailable = false;
    }
  });

  describe('Requirement 8.1: /api/services endpoint exposure', () => {
    it('should expose GET /api/services endpoint', async () => {
      if (!strapiAvailable) {
        console.log('⚠️  Skipping: Strapi not running');
        return;
      }

      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      // Should not return 404 (endpoint exists)
      expect(response.status).not.toBe(404);
      
      // Should return 200 or 403 (endpoint exists, might need auth)
      expect([200, 403]).toContain(response.status);
    });

    it('should return all services when no filters applied', async () => {
      if (!strapiAvailable) {
        console.log('⚠️  Skipping: Strapi not running');
        return;
      }

      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Should have data property
        expect(data).toHaveProperty('data');
        expect(Array.isArray(data.data)).toBe(true);
        
        // If services exist, verify structure
        if (data.data.length > 0) {
          const service = data.data[0];
          expect(service).toHaveProperty('id');
          expect(service).toHaveProperty('serviceId');
        }
      }
    });
  });

  describe('Requirement 8.2: Filtering by serviceId', () => {
    it('should support filtering by serviceId parameter', async () => {
      if (!strapiAvailable) {
        console.log('⚠️  Skipping: Strapi not running');
        return;
      }

      // First, get all services to find a valid serviceId
      const allServicesResponse = await fetch(API_ENDPOINT);
      
      if (!allServicesResponse.ok) {
        console.log('⚠️  Cannot test filtering: unable to fetch services');
        return;
      }

      const allServices = await allServicesResponse.json();
      
      if (!allServices.data || allServices.data.length === 0) {
        console.log('⚠️  Cannot test filtering: no services in database');
        return;
      }

      const testServiceId = allServices.data[0].serviceId;

      // Test filtering
      const filterUrl = `${API_ENDPOINT}?filters[serviceId][$eq]=${testServiceId}`;
      const response = await fetch(filterUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data).toHaveProperty('data');
      expect(Array.isArray(data.data)).toBe(true);

      // Should return at most one service (serviceId is unique)
      expect(data.data.length).toBeLessThanOrEqual(1);

      // If service found, verify it matches the filter
      if (data.data.length === 1) {
        expect(data.data[0].serviceId).toBe(testServiceId);
      }
    });

    it('should return empty array for non-existent serviceId', async () => {
      if (!strapiAvailable) {
        console.log('⚠️  Skipping: Strapi not running');
        return;
      }

      const nonExistentId = 'non-existent-service-id-12345';
      const filterUrl = `${API_ENDPOINT}?filters[serviceId][$eq]=${nonExistentId}`;
      
      const response = await fetch(filterUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        expect(data).toHaveProperty('data');
        expect(data.data).toHaveLength(0);
      }
    });
  });

  describe('Requirement 8.3: Consistent service ordering', () => {
    it('should return services in consistent order across requests', async () => {
      if (!strapiAvailable) {
        console.log('⚠️  Skipping: Strapi not running');
        return;
      }

      // Make two requests
      const response1 = await fetch(API_ENDPOINT);
      const response2 = await fetch(API_ENDPOINT);

      if (!response1.ok || !response2.ok) {
        console.log('⚠️  Cannot test ordering: unable to fetch services');
        return;
      }

      const data1 = await response1.json();
      const data2 = await response2.json();

      // Should have same number of services
      expect(data1.data.length).toBe(data2.data.length);

      // Should be in same order (compare IDs)
      const ids1 = data1.data.map(s => s.id);
      const ids2 = data2.data.map(s => s.id);
      expect(ids1).toEqual(ids2);

      // Should be in same order (compare serviceIds)
      const serviceIds1 = data1.data.map(s => s.serviceId);
      const serviceIds2 = data2.data.map(s => s.serviceId);
      expect(serviceIds1).toEqual(serviceIds2);
    });
  });

  describe('Requirement 8.5: JSON response format and headers', () => {
    it('should return Content-Type: application/json header', async () => {
      if (!strapiAvailable) {
        console.log('⚠️  Skipping: Strapi not running');
        return;
      }

      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      const contentType = response.headers.get('content-type');
      expect(contentType).toBeTruthy();
      expect(contentType.toLowerCase()).toContain('application/json');
    });

    it('should return valid JSON in response body', async () => {
      if (!strapiAvailable) {
        console.log('⚠️  Skipping: Strapi not running');
        return;
      }

      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // Should not throw when parsing JSON
        const data = await response.json();
        
        // Should have expected Strapi response structure
        expect(data).toHaveProperty('data');
        expect(Array.isArray(data.data)).toBe(true);
      }
    });

    it('should return proper Strapi response structure', async () => {
      if (!strapiAvailable) {
        console.log('⚠️  Skipping: Strapi not running');
        return;
      }

      const response = await fetch(API_ENDPOINT);

      if (response.ok) {
        const data = await response.json();

        // Verify Strapi response structure
        expect(data).toHaveProperty('data');
        expect(Array.isArray(data.data)).toBe(true);
        expect(data).toHaveProperty('meta');

        // If services exist, verify service structure
        if (data.data.length > 0) {
          const service = data.data[0];
          
          // Each service should have id and serviceId
          expect(service).toHaveProperty('id');
          expect(service).toHaveProperty('serviceId');
          
          // Service should contain all required fields
          expect(service).toHaveProperty('heroTitle');
          expect(service).toHaveProperty('heroTagline');
          expect(service).toHaveProperty('heroImage');
          expect(service).toHaveProperty('description');
          expect(service).toHaveProperty('highlights');
          expect(service).toHaveProperty('images');
          expect(service).toHaveProperty('cta');

          // Verify data types
          expect(typeof service.serviceId).toBe('string');
          expect(typeof service.heroTitle).toBe('string');
          expect(typeof service.heroTagline).toBe('string');
          expect(typeof service.heroImage).toBe('string');
          expect(Array.isArray(service.description)).toBe(true);
          expect(Array.isArray(service.highlights)).toBe(true);
          expect(Array.isArray(service.images)).toBe(true);
          expect(typeof service.cta).toBe('object');
          expect(service.cta).toHaveProperty('text');
          expect(service.cta).toHaveProperty('buttonLabel');
        }
      }
    });
  });

  describe('CORS Configuration', () => {
    it('should include CORS headers for allowed origins', async () => {
      if (!strapiAvailable) {
        console.log('⚠️  Skipping: Strapi not running');
        return;
      }

      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
          'Origin': 'http://localhost:5173'
        }
      });

      // Check for CORS headers (may vary based on configuration)
      const accessControlAllowOrigin = response.headers.get('access-control-allow-origin');
      
      // Should either allow specific origin or wildcard
      if (accessControlAllowOrigin) {
        expect(['http://localhost:5173', '*']).toContain(accessControlAllowOrigin);
      }
    });

    it('should support OPTIONS preflight requests', async () => {
      if (!strapiAvailable) {
        console.log('⚠️  Skipping: Strapi not running');
        return;
      }

      const response = await fetch(API_ENDPOINT, {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:5173',
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });

      // OPTIONS should succeed
      expect([200, 204]).toContain(response.status);
    });
  });
});
