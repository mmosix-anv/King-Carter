/**
 * Integration Tests for Strapi API Client
 * 
 * Tests the StrapiClient with more realistic scenarios including:
 * - End-to-end data fetching and transformation
 * - Error recovery and fallback behavior
 * - Data validation across the full pipeline
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StrapiClient } from '../strapiClient.js';
import { servicesData } from '../../data/services.js';

// Mock fetch globally
global.fetch = vi.fn();

describe('StrapiClient Integration Tests', () => {
  let client;
  let originalConsole;

  beforeEach(() => {
    client = new StrapiClient({
      baseURL: 'http://localhost:1337',
      timeout: 5000,
      environment: 'development'
    });

    // Mock console to avoid noise
    originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error
    };
    console.log = vi.fn();
    console.warn = vi.fn();
    console.error = vi.fn();

    vi.clearAllMocks();
  });

  afterEach(() => {
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  });

  describe('End-to-End Service Fetching', () => {
    it('should fetch all services and match local data structure', async () => {
      // Create a realistic Strapi response based on local data
      const mockStrapiResponse = {
        data: Object.entries(servicesData).map(([id, service], index) => ({
          id: index + 1,
          attributes: {
            serviceId: service.id,
            heroTitle: service.heroTitle,
            heroTagline: service.heroTagline,
            heroImage: service.heroImage,
            description: service.description,
            highlights: service.highlights,
            images: service.images,
            cta: service.cta,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          }
        })),
        meta: {
          pagination: {
            page: 1,
            pageSize: 25,
            pageCount: 1,
            total: Object.keys(servicesData).length
          }
        }
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStrapiResponse
      });

      const result = await client.fetchServices();

      // Verify all services are present
      expect(Object.keys(result)).toHaveLength(Object.keys(servicesData).length);

      // Verify each service has correct structure
      for (const [serviceId, service] of Object.entries(result)) {
        expect(service).toHaveProperty('id');
        expect(service).toHaveProperty('heroTitle');
        expect(service).toHaveProperty('heroTagline');
        expect(service).toHaveProperty('heroImage');
        expect(service).toHaveProperty('description');
        expect(service).toHaveProperty('highlights');
        expect(service).toHaveProperty('images');
        expect(service).toHaveProperty('cta');
        expect(service.cta).toHaveProperty('text');
        expect(service.cta).toHaveProperty('buttonLabel');

        // Verify arrays are arrays
        expect(Array.isArray(service.description)).toBe(true);
        expect(Array.isArray(service.highlights)).toBe(true);
        expect(Array.isArray(service.images)).toBe(true);
      }
    });

    it('should fetch specific service and return correct data', async () => {
      const targetServiceId = 'private-luxury-transport';
      const targetService = servicesData[targetServiceId];

      const mockStrapiResponse = {
        data: [
          {
            id: 1,
            attributes: {
              serviceId: targetService.id,
              heroTitle: targetService.heroTitle,
              heroTagline: targetService.heroTagline,
              heroImage: targetService.heroImage,
              description: targetService.description,
              highlights: targetService.highlights,
              images: targetService.images,
              cta: targetService.cta
            }
          }
        ]
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStrapiResponse
      });

      const result = await client.fetchServiceById(targetServiceId);

      expect(result).not.toBeNull();
      expect(result.id).toBe(targetServiceId);
      expect(result.heroTitle).toBe(targetService.heroTitle);
      expect(result.description).toEqual(targetService.description);
    });
  });

  describe('Error Recovery Scenarios', () => {
    it('should gracefully handle Strapi downtime and continue serving content', async () => {
      // Simulate Strapi being down
      const connectionError = new Error('Connection refused');
      connectionError.code = 'ECONNREFUSED';
      global.fetch.mockRejectedValueOnce(connectionError);

      const result = await client.fetchServices();

      // Should still return data (from fallback)
      expect(result).toBeDefined();
      expect(Object.keys(result).length).toBeGreaterThan(0);

      // Should match local data
      expect(result).toEqual(servicesData);

      // Should log warning
      expect(console.warn).toHaveBeenCalled();
    });

    it('should handle partial data corruption gracefully', async () => {
      // Simulate response with some valid and some invalid services
      const mockStrapiResponse = {
        data: [
          {
            id: 1,
            attributes: {
              serviceId: 'valid-service',
              heroTitle: 'Valid Service',
              heroTagline: 'Valid tagline',
              heroImage: '/valid.png',
              description: ['Valid description'],
              highlights: ['Valid highlight'],
              images: ['/valid.png'],
              cta: { text: 'Valid CTA', buttonLabel: 'Valid Button' }
            }
          },
          {
            id: 2,
            attributes: {
              serviceId: 'invalid-service',
              heroTitle: '', // Invalid: empty string
              heroTagline: 'Invalid',
              heroImage: '/invalid.png',
              description: ['Invalid'],
              highlights: ['Invalid'],
              images: ['/invalid.png'],
              cta: { text: 'Invalid', buttonLabel: 'Invalid' }
            }
          }
        ]
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStrapiResponse
      });

      const result = await client.fetchServices();

      // Should fall back to local data due to validation failure
      expect(result).toEqual(servicesData);
    });

    it('should handle network timeout and retry with fallback', async () => {
      const timeoutError = new Error('Timeout');
      timeoutError.name = 'AbortError';
      global.fetch.mockRejectedValueOnce(timeoutError);

      const result = await client.fetchServices();

      expect(result).toEqual(servicesData);
      expect(console.warn).toHaveBeenCalled();
    });

    it('should handle DNS resolution failures', async () => {
      const dnsError = new Error('getaddrinfo ENOTFOUND api.example.com');
      dnsError.code = 'ENOTFOUND';
      global.fetch.mockRejectedValueOnce(dnsError);

      const result = await client.fetchServices();

      expect(result).toEqual(servicesData);
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('Data Validation Pipeline', () => {
    it('should validate complete data synchronization', async () => {
      // Create perfect match with local data
      const mockStrapiResponse = {
        data: Object.entries(servicesData).map(([id, service], index) => ({
          id: index + 1,
          attributes: {
            serviceId: service.id,
            ...service
          }
        }))
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStrapiResponse
      });

      const result = await client.validateData();

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing services in Strapi', async () => {
      // Return only one service when we expect multiple
      const mockStrapiResponse = {
        data: [
          {
            id: 1,
            attributes: {
              serviceId: 'private-luxury-transport',
              ...servicesData['private-luxury-transport']
            }
          }
        ]
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStrapiResponse
      });

      const result = await client.validateData();

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);

      // Should report missing services
      const missingServices = result.errors.filter(e => 
        e.message.includes('exists in local data but not in Strapi')
      );
      expect(missingServices.length).toBeGreaterThan(0);
    });
  });

  describe('Health Check Scenarios', () => {
    it('should confirm Strapi is healthy when responding', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] })
      });

      const isHealthy = await client.healthCheck();

      expect(isHealthy).toBe(true);
    });

    it('should detect Strapi is unhealthy when not responding', async () => {
      const error = new Error('Connection refused');
      error.code = 'ECONNREFUSED';
      global.fetch.mockRejectedValueOnce(error);

      const isHealthy = await client.healthCheck();

      expect(isHealthy).toBe(false);
    });

    it('should detect Strapi is unhealthy on server error', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ error: { message: 'Server error' } })
      });

      const isHealthy = await client.healthCheck();

      expect(isHealthy).toBe(false);
    });
  });

  describe('Production vs Development Behavior', () => {
    it('should log detailed errors in development', async () => {
      const devClient = new StrapiClient({
        baseURL: 'http://localhost:1337',
        timeout: 5000,
        environment: 'development'
      });

      const error = new Error('Test error');
      error.code = 'ECONNREFUSED';
      global.fetch.mockRejectedValueOnce(error);

      await devClient.fetchServices();

      // In development, should log warnings
      expect(console.warn).toHaveBeenCalled();
    });

    it('should log minimal errors in production', async () => {
      const prodClient = new StrapiClient({
        baseURL: 'https://api.example.com',
        timeout: 10000,
        environment: 'production'
      });

      const error = new Error('Test error');
      error.code = 'ECONNREFUSED';
      global.fetch.mockRejectedValueOnce(error);

      await prodClient.fetchServices();

      // In production, should still log but without details
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('Real-World Usage Patterns', () => {
    it('should handle rapid successive requests', async () => {
      const mockResponse = {
        data: [{
          id: 1,
          attributes: {
            serviceId: 'test-service',
            heroTitle: 'Test',
            heroTagline: 'Test',
            heroImage: '/test.png',
            description: ['Test'],
            highlights: ['Test'],
            images: ['/test.png'],
            cta: { text: 'Test', buttonLabel: 'Test' }
          }
        }]
      };

      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      // Make multiple requests in parallel
      const results = await Promise.all([
        client.fetchServiceById('test-service'),
        client.fetchServiceById('test-service'),
        client.fetchServiceById('test-service')
      ]);

      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result).not.toBeNull();
        expect(result.id).toBe('test-service');
      });
    });

    it('should handle mixed success and failure requests', async () => {
      // First request succeeds
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{
            id: 1,
            attributes: {
              serviceId: 'test-service',
              heroTitle: 'Test',
              heroTagline: 'Test',
              heroImage: '/test.png',
              description: ['Test'],
              highlights: ['Test'],
              images: ['/test.png'],
              cta: { text: 'Test', buttonLabel: 'Test' }
            }
          }]
        })
      });

      // Second request fails
      const error = new Error('Network error');
      error.code = 'ECONNREFUSED';
      global.fetch.mockRejectedValueOnce(error);

      const result1 = await client.fetchServiceById('test-service');
      const result2 = await client.fetchServiceById('private-luxury-transport');

      expect(result1).not.toBeNull();
      expect(result1.id).toBe('test-service');

      expect(result2).not.toBeNull();
      expect(result2).toEqual(servicesData['private-luxury-transport']);
    });
  });
});
