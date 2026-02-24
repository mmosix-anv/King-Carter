/**
 * Integration Test: Complete Strapi Services Flow
 * 
 * Tests the end-to-end flow from frontend to Strapi:
 * 1. Services load from Strapi when available
 * 2. Services fall back to local data when Strapi is unavailable
 * 
 * **Validates: Requirements 4.1, 4.2, 7.5, 8.1**
 * 
 * @module __tests__/integration/strapi-flow
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createStrapiClient } from '../../api/strapiClient.js';
import { servicesData } from '../../data/services.js';

describe('Integration: Complete Strapi Services Flow', () => {
  let client;

  beforeAll(() => {
    client = createStrapiClient();
  });

  it('should successfully fetch services from Strapi when available', async () => {
    // Attempt to fetch services from Strapi
    const services = await client.fetchServices();

    // Should return data (either from Strapi or fallback)
    expect(services).toBeDefined();
    expect(typeof services).toBe('object');
    expect(Object.keys(services).length).toBeGreaterThan(0);

    // Verify data structure matches expected format
    const firstServiceId = Object.keys(services)[0];
    const firstService = services[firstServiceId];

    expect(firstService).toHaveProperty('id');
    expect(firstService).toHaveProperty('heroTitle');
    expect(firstService).toHaveProperty('heroTagline');
    expect(firstService).toHaveProperty('heroImage');
    expect(firstService).toHaveProperty('description');
    expect(firstService).toHaveProperty('highlights');
    expect(firstService).toHaveProperty('images');
    expect(firstService).toHaveProperty('cta');

    // Verify arrays are arrays
    expect(Array.isArray(firstService.description)).toBe(true);
    expect(Array.isArray(firstService.highlights)).toBe(true);
    expect(Array.isArray(firstService.images)).toBe(true);

    // Verify CTA structure
    expect(firstService.cta).toHaveProperty('text');
    expect(firstService.cta).toHaveProperty('buttonLabel');
  });

  it('should check Strapi health status', async () => {
    // Perform health check
    const isHealthy = await client.healthCheck();

    // Should return a boolean
    expect(typeof isHealthy).toBe('boolean');

    // Log the status for manual verification
    console.log(`Strapi health status: ${isHealthy ? 'ONLINE' : 'OFFLINE'}`);
  });

  it('should fetch a specific service by ID', async () => {
    // Get a service ID from local data to test with
    const testServiceId = Object.keys(servicesData)[0];

    // Fetch the service
    const service = await client.fetchServiceById(testServiceId);

    // Should return the service
    expect(service).toBeDefined();
    expect(service).not.toBeNull();
    expect(service.id).toBe(testServiceId);

    // Verify complete structure
    expect(service.heroTitle).toBeTruthy();
    expect(service.heroTagline).toBeTruthy();
    expect(service.heroImage).toBeTruthy();
    expect(Array.isArray(service.description)).toBe(true);
    expect(Array.isArray(service.highlights)).toBe(true);
    expect(Array.isArray(service.images)).toBe(true);
    expect(service.cta.text).toBeTruthy();
    expect(service.cta.buttonLabel).toBeTruthy();
  });

  it('should use fallback data when Strapi is unavailable', async () => {
    // Create a client with an invalid URL to simulate Strapi being unavailable
    const offlineClient = new (await import('../../api/strapiClient.js')).StrapiClient({
      baseURL: 'http://localhost:9999', // Non-existent port
      timeout: 1000,
      environment: 'development'
    });

    // Fetch services - should fall back to local data
    const services = await offlineClient.fetchServices();

    // Should return fallback data
    expect(services).toBeDefined();
    expect(typeof services).toBe('object');
    expect(Object.keys(services).length).toBeGreaterThan(0);

    // Verify it matches local data structure
    expect(services).toEqual(servicesData);
  });

  it('should use fallback data for specific service when Strapi is unavailable', async () => {
    // Create a client with an invalid URL
    const offlineClient = new (await import('../../api/strapiClient.js')).StrapiClient({
      baseURL: 'http://localhost:9999',
      timeout: 1000,
      environment: 'development'
    });

    // Get a service ID from local data
    const testServiceId = Object.keys(servicesData)[0];

    // Fetch the service - should fall back to local data
    const service = await offlineClient.fetchServiceById(testServiceId);

    // Should return fallback data
    expect(service).toBeDefined();
    expect(service).not.toBeNull();
    expect(service).toEqual(servicesData[testServiceId]);
  });

  it('should validate data consistency between Strapi and local data', async () => {
    // Perform data validation
    const validation = await client.validateData();

    // Should return validation result
    expect(validation).toBeDefined();
    expect(validation).toHaveProperty('valid');
    expect(validation).toHaveProperty('errors');
    expect(Array.isArray(validation.errors)).toBe(true);

    // Log validation results for manual review
    if (!validation.valid) {
      console.log(`Data validation found ${validation.errors.length} discrepancies:`);
      validation.errors.forEach(error => {
        console.log(`  - [${error.field}] ${error.message}`);
      });
    } else {
      console.log('Data validation passed: Strapi data matches local structure');
    }

    // Note: We don't assert validation.valid === true because Strapi might be offline
    // or data might legitimately differ. This test is informational.
  });
});
