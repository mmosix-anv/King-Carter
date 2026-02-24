/**
 * Unit Tests for Strapi API Client
 * 
 * Tests the StrapiClient class functionality including:
 * - Configuration and initialization
 * - Service fetching and transformation
 * - Error handling and fallback logic
 * - Health checks and validation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StrapiClient, createStrapiClient } from '../strapiClient.js';
import * as strapiConfig from '../../config/strapi.js';
import * as serviceValidator from '../validators/serviceValidator.js';
import { servicesData } from '../../data/services.js';

// Mock fetch globally
global.fetch = vi.fn();

describe('StrapiClient', () => {
  let client;
  let originalConsole;

  beforeEach(() => {
    // Create client with test configuration
    client = new StrapiClient({
      baseURL: 'http://localhost:1337',
      timeout: 5000,
      environment: 'development'
    });

    // Mock console methods to avoid noise in tests
    originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error
    };
    console.log = vi.fn();
    console.warn = vi.fn();
    console.error = vi.fn();

    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore console
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  });

  describe('Constructor', () => {
    it('should create instance with provided config', () => {
      const customClient = new StrapiClient({
        baseURL: 'https://api.example.com',
        timeout: 10000,
        environment: 'production'
      });

      expect(customClient.config.baseURL).toBe('https://api.example.com');
      expect(customClient.config.timeout).toBe(10000);
      expect(customClient.config.environment).toBe('production');
    });

    it('should use environment config when no config provided', () => {
      vi.spyOn(strapiConfig, 'getStrapiConfig').mockReturnValue({
        apiUrl: 'http://localhost:1337',
        timeout: 5000,
        enableDetailedLogging: true,
        requireExplicitConfig: false
      });

      const defaultClient = new StrapiClient();

      expect(defaultClient.config.baseURL).toBe('http://localhost:1337');
      expect(defaultClient.config.timeout).toBe(5000);
    });

    it('should enable detailed logging in development', () => {
      const devClient = new StrapiClient({
        baseURL: 'http://localhost:1337',
        environment: 'development'
      });

      expect(devClient.enableDetailedLogging).toBe(true);
    });

    it('should disable detailed logging in production', () => {
      const prodClient = new StrapiClient({
        baseURL: 'https://api.example.com',
        environment: 'production'
      });

      expect(prodClient.enableDetailedLogging).toBe(false);
    });
  });

  describe('fetchServices', () => {
    it('should fetch and transform services successfully', async () => {
      const mockStrapiResponse = {
        data: [
          {
            id: 1,
            attributes: {
              serviceId: 'test-service',
              heroTitle: 'Test Service',
              heroTagline: 'Test tagline',
              heroImage: '/image/test.png',
              description: ['Test description'],
              highlights: ['Feature 1', 'Feature 2'],
              images: ['/image/1.png'],
              cta: { text: 'CTA text', buttonLabel: 'Button' }
            }
          }
        ]
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStrapiResponse
      });

      vi.spyOn(serviceValidator, 'validateServiceArray').mockReturnValue({
        valid: true,
        errors: []
      });

      const result = await client.fetchServices();

      expect(result).toHaveProperty('test-service');
      expect(result['test-service'].id).toBe('test-service');
      expect(result['test-service'].heroTitle).toBe('Test Service');
    });

    it('should fall back to local data on network error', async () => {
      const networkError = new Error('Network error');
      networkError.code = 'ECONNREFUSED';
      global.fetch.mockRejectedValueOnce(networkError);

      const result = await client.fetchServices();

      expect(result).toEqual(servicesData);
      expect(console.warn).toHaveBeenCalled();
    });

    it('should fall back to local data on timeout', async () => {
      const timeoutError = new Error('Timeout');
      timeoutError.name = 'AbortError';
      global.fetch.mockRejectedValueOnce(timeoutError);

      const result = await client.fetchServices();

      expect(result).toEqual(servicesData);
      expect(console.warn).toHaveBeenCalled();
    });

    it('should fall back to local data on DNS failure', async () => {
      const dnsError = new Error('getaddrinfo ENOTFOUND');
      dnsError.code = 'ENOTFOUND';
      global.fetch.mockRejectedValueOnce(dnsError);

      const result = await client.fetchServices();

      expect(result).toEqual(servicesData);
      expect(console.warn).toHaveBeenCalled();
    });

    it('should fall back to local data on HTTP error', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ error: { message: 'Server error' } })
      });

      const result = await client.fetchServices();

      expect(result).toEqual(servicesData);
      expect(console.error).toHaveBeenCalled();
    });

    it('should fall back to local data on invalid response', async () => {
      const mockInvalidResponse = {
        data: [
          {
            id: 1,
            attributes: {
              serviceId: 'invalid-service',
              heroTitle: '', // Invalid: empty string
              heroTagline: 'Test',
              heroImage: '/test.png',
              description: ['Test'],
              highlights: ['Test'],
              images: ['/test.png'],
              cta: { text: 'Test', buttonLabel: 'Test' }
            }
          }
        ]
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockInvalidResponse
      });

      vi.spyOn(serviceValidator, 'validateServiceArray').mockReturnValue({
        valid: false,
        errors: [{ field: 'heroTitle', message: 'heroTitle must be non-empty' }]
      });

      const result = await client.fetchServices();

      expect(result).toEqual(servicesData);
      expect(console.warn).toHaveBeenCalled();
    });

    it('should handle empty response data', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] })
      });

      vi.spyOn(serviceValidator, 'validateServiceArray').mockReturnValue({
        valid: false,
        errors: [{ field: 'data', message: 'Service array cannot be empty' }]
      });

      const result = await client.fetchServices();

      expect(result).toEqual(servicesData);
    });
  });

  describe('fetchServiceById', () => {
    it('should fetch single service successfully', async () => {
      const mockStrapiResponse = {
        data: [
          {
            id: 1,
            attributes: {
              serviceId: 'test-service',
              heroTitle: 'Test Service',
              heroTagline: 'Test tagline',
              heroImage: '/image/test.png',
              description: ['Test description'],
              highlights: ['Feature 1'],
              images: ['/image/1.png'],
              cta: { text: 'CTA', buttonLabel: 'Button' }
            }
          }
        ]
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStrapiResponse
      });

      vi.spyOn(serviceValidator, 'validateServiceData').mockReturnValue({
        valid: true,
        errors: []
      });

      const result = await client.fetchServiceById('test-service');

      expect(result).not.toBeNull();
      expect(result.id).toBe('test-service');
      expect(result.heroTitle).toBe('Test Service');
    });

    it('should return null when service not found', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] })
      });

      const result = await client.fetchServiceById('non-existent');

      expect(result).toBeNull();
    });

    it('should fall back to local data when service ID mismatches', async () => {
      const mockStrapiResponse = {
        data: [
          {
            id: 1,
            attributes: {
              serviceId: 'wrong-service',
              heroTitle: 'Wrong Service',
              heroTagline: 'Test',
              heroImage: '/test.png',
              description: ['Test'],
              highlights: ['Test'],
              images: ['/test.png'],
              cta: { text: 'Test', buttonLabel: 'Test' }
            }
          }
        ]
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStrapiResponse
      });

      const result = await client.fetchServiceById('private-luxury-transport');

      expect(result).toEqual(servicesData['private-luxury-transport']);
      expect(console.warn).toHaveBeenCalled();
    });

    it('should fall back to local data on network error', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await client.fetchServiceById('private-luxury-transport');

      expect(result).toEqual(servicesData['private-luxury-transport']);
    });

    it('should fall back to local data on invalid service data', async () => {
      const mockInvalidResponse = {
        data: [
          {
            id: 1,
            attributes: {
              serviceId: 'test-service',
              heroTitle: '', // Invalid
              heroTagline: 'Test',
              heroImage: '/test.png',
              description: ['Test'],
              highlights: ['Test'],
              images: ['/test.png'],
              cta: { text: 'Test', buttonLabel: 'Test' }
            }
          }
        ]
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockInvalidResponse
      });

      vi.spyOn(serviceValidator, 'validateServiceData').mockReturnValue({
        valid: false,
        errors: [{ field: 'heroTitle', message: 'Invalid' }]
      });

      const result = await client.fetchServiceById('private-luxury-transport');

      expect(result).toEqual(servicesData['private-luxury-transport']);
    });
  });

  describe('healthCheck', () => {
    it('should return true when Strapi is available', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] })
      });

      const result = await client.healthCheck();

      expect(result).toBe(true);
    });

    it('should return false when Strapi is unavailable', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Connection refused'));

      const result = await client.healthCheck();

      expect(result).toBe(false);
    });

    it('should return false when baseURL is not configured', async () => {
      const unconfiguredClient = new StrapiClient({
        baseURL: '',
        timeout: 5000,
        environment: 'production'
      });

      const result = await unconfiguredClient.healthCheck();

      expect(result).toBe(false);
    });

    it('should return false on HTTP error', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
        json: async () => ({})
      });

      const result = await client.healthCheck();

      expect(result).toBe(false);
    });
  });

  describe('validateData', () => {
    it('should return valid when Strapi data matches local structure', async () => {
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

      vi.spyOn(serviceValidator, 'validateServiceData').mockReturnValue({
        valid: true,
        errors: []
      });

      const result = await client.validateData();

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should report services missing from Strapi', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] })
      });

      const result = await client.validateData();

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].message).toContain('exists in local data but not in Strapi');
    });

    it('should report services in Strapi but not in local', async () => {
      const mockStrapiResponse = {
        data: [
          {
            id: 1,
            attributes: {
              serviceId: 'unknown-service',
              heroTitle: 'Unknown',
              heroTagline: 'Test',
              heroImage: '/test.png',
              description: ['Test'],
              highlights: ['Test'],
              images: ['/test.png'],
              cta: { text: 'Test', buttonLabel: 'Test' }
            }
          }
        ]
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStrapiResponse
      });

      vi.spyOn(serviceValidator, 'validateServiceData').mockReturnValue({
        valid: true,
        errors: []
      });

      const result = await client.validateData();

      expect(result.valid).toBe(false);
      const unknownServiceError = result.errors.find(e => 
        e.message.includes('unknown-service') && e.message.includes('exists in Strapi but not in local')
      );
      expect(unknownServiceError).toBeDefined();
    });

    it('should report validation errors in service data', async () => {
      const mockStrapiResponse = {
        data: [
          {
            id: 1,
            attributes: {
              serviceId: 'private-luxury-transport',
              heroTitle: '',
              heroTagline: 'Test',
              heroImage: '/test.png',
              description: ['Test'],
              highlights: ['Test'],
              images: ['/test.png'],
              cta: { text: 'Test', buttonLabel: 'Test' }
            }
          }
        ]
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStrapiResponse
      });

      vi.spyOn(serviceValidator, 'validateServiceData').mockReturnValue({
        valid: false,
        errors: [{ field: 'heroTitle', message: 'heroTitle must be non-empty', value: '' }]
      });

      const result = await client.validateData();

      expect(result.valid).toBe(false);
      const validationError = result.errors.find(e => 
        e.message.includes('heroTitle')
      );
      expect(validationError).toBeDefined();
    });

    it('should return connection error when Strapi is unavailable', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Connection refused'));

      const result = await client.validateData();

      expect(result.valid).toBe(false);
      expect(result.errors[0].field).toBe('connection');
      expect(result.errors[0].message).toContain('Unable to connect to Strapi');
    });
  });

  describe('Response Transformation', () => {
    it('should transform Strapi response to local format', () => {
      const strapiResponse = {
        data: [
          {
            id: 1,
            attributes: {
              serviceId: 'test-service',
              heroTitle: 'Test',
              heroTagline: 'Tagline',
              heroImage: '/test.png',
              description: ['Desc'],
              highlights: ['H1'],
              images: ['/img.png'],
              cta: { text: 'CTA', buttonLabel: 'Button' }
            }
          }
        ]
      };

      const result = client._transformResponse(strapiResponse);

      expect(result).toHaveProperty('test-service');
      expect(result['test-service'].id).toBe('test-service');
    });

    it('should skip items without attributes', () => {
      const strapiResponse = {
        data: [
          { id: 1 }, // Missing attributes
          {
            id: 2,
            attributes: {
              serviceId: 'valid-service',
              heroTitle: 'Valid',
              heroTagline: 'Test',
              heroImage: '/test.png',
              description: ['Test'],
              highlights: ['Test'],
              images: ['/test.png'],
              cta: { text: 'Test', buttonLabel: 'Test' }
            }
          }
        ]
      };

      const result = client._transformResponse(strapiResponse);

      expect(result).not.toHaveProperty('undefined');
      expect(result).toHaveProperty('valid-service');
    });

    it('should skip items without serviceId', () => {
      const strapiResponse = {
        data: [
          {
            id: 1,
            attributes: {
              // Missing serviceId
              heroTitle: 'Test'
            }
          }
        ]
      };

      const result = client._transformResponse(strapiResponse);

      expect(Object.keys(result)).toHaveLength(0);
    });

    it('should throw error on invalid response structure', () => {
      expect(() => {
        client._transformResponse({ invalid: 'response' });
      }).toThrow('Invalid Strapi response structure');
    });
  });

  describe('createStrapiClient', () => {
    it('should create a client instance', () => {
      vi.spyOn(strapiConfig, 'getStrapiConfig').mockReturnValue({
        apiUrl: 'http://localhost:1337',
        timeout: 5000,
        enableDetailedLogging: true,
        requireExplicitConfig: false
      });

      const client = createStrapiClient();

      expect(client).toBeInstanceOf(StrapiClient);
    });
  });
});
