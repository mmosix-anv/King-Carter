/**
 * Integration Tests for Response Validation in API Client
 * 
 * Validates task 6.3: Integrate response validation into API client
 * - Call validation functions on all Strapi responses
 * - Trigger fallback if validation fails
 * - Log validation errors with details
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StrapiClient } from '../strapiClient.js';
import * as serviceValidator from '../validators/serviceValidator.js';
import { servicesData } from '../../data/services.js';

// Mock fetch globally
global.fetch = vi.fn();

describe('Task 6.3: Response Validation Integration', () => {
  let client;
  let consoleWarnSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    client = new StrapiClient({
      baseURL: 'http://localhost:1337',
      timeout: 5000,
      environment: 'development'
    });

    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('Requirement 6.1: Call validation functions on all Strapi responses', () => {
    it('should validate response when fetching all services', async () => {
      const validateSpy = vi.spyOn(serviceValidator, 'validateServiceArray');
      
      const mockResponse = {
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
              cta: { text: 'CTA text', buttonLabel: 'Button' }
            }
          }
        ]
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await client.fetchServices();

      // Verify validation was called
      expect(validateSpy).toHaveBeenCalledTimes(1);
      expect(validateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          'test-service': expect.any(Object)
        })
      );
    });

    it('should validate response when fetching single service', async () => {
      const validateSpy = vi.spyOn(serviceValidator, 'validateServiceData');
      
      const mockResponse = {
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
              cta: { text: 'CTA text', buttonLabel: 'Button' }
            }
          }
        ]
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await client.fetchServiceById('test-service');

      // Verify validation was called
      expect(validateSpy).toHaveBeenCalledTimes(1);
      expect(validateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'test-service',
          heroTitle: 'Test Service'
        })
      );
    });
  });

  describe('Requirement 6.2 & 6.3: Trigger fallback if validation fails', () => {
    it('should use fallback data when service array validation fails', async () => {
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

      // Mock validation to return failure
      vi.spyOn(serviceValidator, 'validateServiceArray').mockReturnValue({
        valid: false,
        errors: [
          { 
            field: '[0].heroTitle', 
            message: 'Service at index 0: heroTitle must be a non-empty string',
            value: ''
          }
        ]
      });

      const result = await client.fetchServices();

      // Should return fallback data
      expect(result).toEqual(servicesData);
    });

    it('should use fallback data when single service validation fails', async () => {
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

      // Mock validation to return failure
      vi.spyOn(serviceValidator, 'validateServiceData').mockReturnValue({
        valid: false,
        errors: [
          { 
            field: 'heroTitle', 
            message: 'heroTitle must be a non-empty string',
            value: ''
          }
        ]
      });

      const result = await client.fetchServiceById('private-luxury-transport');

      // Should return fallback data for this service
      expect(result).toEqual(servicesData['private-luxury-transport']);
    });

    it('should use fallback when response has missing required fields', async () => {
      const mockInvalidResponse = {
        data: [
          {
            id: 1,
            attributes: {
              serviceId: 'incomplete-service',
              heroTitle: 'Test',
              // Missing heroTagline, heroImage, etc.
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
        errors: [
          { field: '[0].heroTagline', message: 'heroTagline must be a non-empty string', value: undefined },
          { field: '[0].heroImage', message: 'heroImage must be a valid URL string', value: undefined }
        ]
      });

      const result = await client.fetchServices();

      expect(result).toEqual(servicesData);
    });

    it('should use fallback when response has invalid JSON fields', async () => {
      const mockInvalidResponse = {
        data: [
          {
            id: 1,
            attributes: {
              serviceId: 'invalid-json-service',
              heroTitle: 'Test',
              heroTagline: 'Test',
              heroImage: '/test.png',
              description: 'not an array', // Invalid: should be array
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
        errors: [
          { 
            field: '[0].description', 
            message: 'description must be an array of non-empty strings',
            value: 'not an array'
          }
        ]
      });

      const result = await client.fetchServices();

      expect(result).toEqual(servicesData);
    });
  });

  describe('Requirement 6.4: Validate serviceId matches requested service', () => {
    it('should use fallback when serviceId does not match requested ID', async () => {
      const mockMismatchResponse = {
        data: [
          {
            id: 1,
            attributes: {
              serviceId: 'wrong-service-id',
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
        json: async () => mockMismatchResponse
      });

      const result = await client.fetchServiceById('private-luxury-transport');

      // Should use fallback because serviceId doesn't match
      expect(result).toEqual(servicesData['private-luxury-transport']);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Service ID mismatch')
      );
    });
  });

  describe('Requirement 6.5: Log validation errors with details', () => {
    it('should log validation errors when fetchServices validation fails', async () => {
      const mockInvalidResponse = {
        data: [
          {
            id: 1,
            attributes: {
              serviceId: 'invalid-service',
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
        json: async () => mockInvalidResponse
      });

      const validationErrors = [
        { 
          field: '[0].heroTitle', 
          message: 'heroTitle must be a non-empty string',
          value: ''
        }
      ];

      vi.spyOn(serviceValidator, 'validateServiceArray').mockReturnValue({
        valid: false,
        errors: validationErrors
      });

      await client.fetchServices();

      // Verify detailed error logging
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Invalid response from Strapi, using fallback data',
        expect.objectContaining({
          errors: validationErrors
        })
      );
    });

    it('should log validation errors when fetchServiceById validation fails', async () => {
      const mockInvalidResponse = {
        data: [
          {
            id: 1,
            attributes: {
              serviceId: 'test-service',
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
        json: async () => mockInvalidResponse
      });

      const validationErrors = [
        { 
          field: 'heroTitle', 
          message: 'heroTitle must be a non-empty string',
          value: ''
        }
      ];

      vi.spyOn(serviceValidator, 'validateServiceData').mockReturnValue({
        valid: false,
        errors: validationErrors
      });

      await client.fetchServiceById('test-service');

      // Verify detailed error logging with service ID
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid service data for test-service'),
        expect.objectContaining({
          errors: validationErrors
        })
      );
    });

    it('should include error details in development environment', async () => {
      // Client is already in development mode
      const mockInvalidResponse = {
        data: [
          {
            id: 1,
            attributes: {
              serviceId: 'test',
              heroTitle: '',
              heroTagline: 'Test',
              heroImage: '/test.png',
              description: 'invalid', // Not an array
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

      const detailedErrors = [
        { field: '[0].heroTitle', message: 'heroTitle must be a non-empty string', value: '' },
        { field: '[0].description', message: 'description must be an array', value: 'invalid' }
      ];

      vi.spyOn(serviceValidator, 'validateServiceArray').mockReturnValue({
        valid: false,
        errors: detailedErrors
      });

      await client.fetchServices();

      // In development, should log with detailed error object
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          errors: expect.arrayContaining([
            expect.objectContaining({ field: expect.any(String), message: expect.any(String) })
          ])
        })
      );
    });

    it('should log minimal errors in production environment', async () => {
      const prodClient = new StrapiClient({
        baseURL: 'http://localhost:1337',
        timeout: 5000,
        environment: 'production'
      });

      const mockInvalidResponse = {
        data: [
          {
            id: 1,
            attributes: {
              serviceId: 'test',
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
        json: async () => mockInvalidResponse
      });

      vi.spyOn(serviceValidator, 'validateServiceArray').mockReturnValue({
        valid: false,
        errors: [{ field: 'heroTitle', message: 'Invalid', value: '' }]
      });

      await prodClient.fetchServices();

      // In production, should still log but without detailed object in second parameter
      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  });

  describe('Integration: Complete validation flow', () => {
    it('should handle complete validation flow for valid data', async () => {
      const validateArraySpy = vi.spyOn(serviceValidator, 'validateServiceArray');
      
      const mockValidResponse = {
        data: [
          {
            id: 1,
            attributes: {
              serviceId: 'valid-service',
              heroTitle: 'Valid Service',
              heroTagline: 'Valid tagline',
              heroImage: '/image/valid.png',
              description: ['Valid description'],
              highlights: ['Feature 1', 'Feature 2'],
              images: ['/image/1.png', '/image/2.png'],
              cta: { text: 'Valid CTA', buttonLabel: 'Valid Button' }
            }
          }
        ]
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockValidResponse
      });

      // Mock validation to return success
      validateArraySpy.mockReturnValue({
        valid: true,
        errors: []
      });

      const result = await client.fetchServices();

      // Should validate
      expect(validateArraySpy).toHaveBeenCalled();
      
      // Should return transformed data (not fallback)
      expect(result).toHaveProperty('valid-service');
      expect(result['valid-service'].heroTitle).toBe('Valid Service');
      
      // Should not log warnings
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should handle complete validation flow for invalid data', async () => {
      const validateArraySpy = vi.spyOn(serviceValidator, 'validateServiceArray');
      
      const mockInvalidResponse = {
        data: [
          {
            id: 1,
            attributes: {
              serviceId: 'invalid-service',
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

      // Mock validation to return failure
      validateArraySpy.mockReturnValue({
        valid: false,
        errors: [
          { field: '[0].heroTitle', message: 'heroTitle must be non-empty', value: '' }
        ]
      });

      const result = await client.fetchServices();

      // Should validate
      expect(validateArraySpy).toHaveBeenCalled();
      
      // Should return fallback data
      expect(result).toEqual(servicesData);
      
      // Should log warning with details
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid response from Strapi'),
        expect.any(Object)
      );
    });
  });
});
