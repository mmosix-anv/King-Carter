/**
 * Tests for Service Data Validator Module
 * 
 * Tests validation functions for service data integrity
 */

import { describe, it, expect } from 'vitest';
import { validateServiceData, validateServiceArray } from '../serviceValidator.js';

// Valid service data for testing
const validService = {
  id: 'test-service',
  heroTitle: 'Test Service',
  heroTagline: 'Test tagline for service',
  heroImage: '/image/test.png',
  description: ['Paragraph 1', 'Paragraph 2'],
  highlights: ['Feature 1', 'Feature 2', 'Feature 3'],
  images: ['/image/1.png', '/image/2.png', '/image/3.png'],
  cta: {
    text: 'CTA text',
    buttonLabel: 'Button label'
  }
};

describe('validateServiceData', () => {
  describe('valid data', () => {
    it('should accept valid service data with id field', () => {
      const result = validateServiceData(validService);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept valid service data with serviceId field', () => {
      const service = { ...validService, serviceId: 'test-service' };
      delete service.id;
      const result = validateServiceData(service);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept URLs starting with http://', () => {
      const service = {
        ...validService,
        heroImage: 'http://example.com/image.png',
        images: ['http://example.com/1.png', 'http://example.com/2.png']
      };
      const result = validateServiceData(service);
      expect(result.valid).toBe(true);
    });

    it('should accept URLs starting with https://', () => {
      const service = {
        ...validService,
        heroImage: 'https://example.com/image.png',
        images: ['https://example.com/1.png', 'https://example.com/2.png']
      };
      const result = validateServiceData(service);
      expect(result.valid).toBe(true);
    });
  });

  describe('invalid data types', () => {
    it('should reject null data', () => {
      const result = validateServiceData(null);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'data' })
      );
    });

    it('should reject array data', () => {
      const result = validateServiceData([]);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'data' })
      );
    });

    it('should reject string data', () => {
      const result = validateServiceData('not an object');
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'data' })
      );
    });
  });

  describe('serviceId validation', () => {
    it('should reject missing serviceId', () => {
      const service = { ...validService };
      delete service.id;
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ 
          field: 'serviceId',
          message: expect.stringContaining('non-empty string')
        })
      );
    });

    it('should reject empty string serviceId', () => {
      const service = { ...validService, id: '' };
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'serviceId' })
      );
    });

    it('should reject whitespace-only serviceId', () => {
      const service = { ...validService, id: '   ' };
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'serviceId' })
      );
    });

    it('should reject numeric serviceId', () => {
      const service = { ...validService, id: 123 };
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'serviceId' })
      );
    });
  });

  describe('heroTitle validation', () => {
    it('should reject missing heroTitle', () => {
      const service = { ...validService };
      delete service.heroTitle;
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'heroTitle' })
      );
    });

    it('should reject empty string heroTitle', () => {
      const service = { ...validService, heroTitle: '' };
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'heroTitle' })
      );
    });

    it('should reject whitespace-only heroTitle', () => {
      const service = { ...validService, heroTitle: '   ' };
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'heroTitle' })
      );
    });
  });

  describe('heroTagline validation', () => {
    it('should reject missing heroTagline', () => {
      const service = { ...validService };
      delete service.heroTagline;
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'heroTagline' })
      );
    });

    it('should reject empty string heroTagline', () => {
      const service = { ...validService, heroTagline: '' };
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'heroTagline' })
      );
    });
  });

  describe('heroImage validation', () => {
    it('should reject missing heroImage', () => {
      const service = { ...validService };
      delete service.heroImage;
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'heroImage' })
      );
    });

    it('should reject empty string heroImage', () => {
      const service = { ...validService, heroImage: '' };
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'heroImage' })
      );
    });

    it('should reject invalid URL format', () => {
      const service = { ...validService, heroImage: 'not-a-url' };
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'heroImage' })
      );
    });
  });

  describe('description validation', () => {
    it('should reject missing description', () => {
      const service = { ...validService };
      delete service.description;
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'description' })
      );
    });

    it('should reject non-array description', () => {
      const service = { ...validService, description: 'not an array' };
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'description' })
      );
    });

    it('should reject empty array description', () => {
      const service = { ...validService, description: [] };
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'description' })
      );
    });

    it('should reject array with non-string elements', () => {
      const service = { ...validService, description: ['Valid', 123, 'Valid'] };
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'description' })
      );
    });

    it('should reject array with empty strings', () => {
      const service = { ...validService, description: ['Valid', '', 'Valid'] };
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'description' })
      );
    });
  });

  describe('highlights validation', () => {
    it('should reject missing highlights', () => {
      const service = { ...validService };
      delete service.highlights;
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'highlights' })
      );
    });

    it('should reject non-array highlights', () => {
      const service = { ...validService, highlights: 'not an array' };
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'highlights' })
      );
    });

    it('should reject empty array highlights', () => {
      const service = { ...validService, highlights: [] };
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'highlights' })
      );
    });

    it('should reject array with non-string elements', () => {
      const service = { ...validService, highlights: ['Valid', null, 'Valid'] };
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'highlights' })
      );
    });
  });

  describe('images validation', () => {
    it('should reject missing images', () => {
      const service = { ...validService };
      delete service.images;
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'images' })
      );
    });

    it('should reject non-array images', () => {
      const service = { ...validService, images: 'not an array' };
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'images' })
      );
    });

    it('should reject empty array images', () => {
      const service = { ...validService, images: [] };
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'images' })
      );
    });

    it('should reject array with invalid URLs', () => {
      const service = { ...validService, images: ['/valid.png', 'invalid', '/valid2.png'] };
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'images' })
      );
    });
  });

  describe('cta validation', () => {
    it('should reject missing cta', () => {
      const service = { ...validService };
      delete service.cta;
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'cta' })
      );
    });

    it('should reject non-object cta', () => {
      const service = { ...validService, cta: 'not an object' };
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'cta' })
      );
    });

    it('should reject array cta', () => {
      const service = { ...validService, cta: [] };
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'cta' })
      );
    });

    it('should reject cta with missing text', () => {
      const service = { ...validService, cta: { buttonLabel: 'Button' } };
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'cta.text' })
      );
    });

    it('should reject cta with empty text', () => {
      const service = { ...validService, cta: { text: '', buttonLabel: 'Button' } };
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'cta.text' })
      );
    });

    it('should reject cta with missing buttonLabel', () => {
      const service = { ...validService, cta: { text: 'CTA text' } };
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'cta.buttonLabel' })
      );
    });

    it('should reject cta with empty buttonLabel', () => {
      const service = { ...validService, cta: { text: 'CTA text', buttonLabel: '' } };
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'cta.buttonLabel' })
      );
    });
  });

  describe('multiple errors', () => {
    it('should report all validation errors', () => {
      const service = {
        id: '',
        heroTitle: '',
        heroTagline: '',
        heroImage: 'invalid',
        description: [],
        highlights: 'not an array',
        images: [],
        cta: null
      };
      const result = validateServiceData(service);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(5);
    });
  });
});

describe('validateServiceArray', () => {
  describe('valid data', () => {
    it('should accept array of valid services', () => {
      const services = [
        validService,
        { ...validService, id: 'service-2', heroTitle: 'Service 2' }
      ];
      const result = validateServiceArray(services);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept object with service IDs as keys', () => {
      const services = {
        'service-1': validService,
        'service-2': { ...validService, id: 'service-2', heroTitle: 'Service 2' }
      };
      const result = validateServiceArray(services);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept single service in array', () => {
      const result = validateServiceArray([validService]);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('invalid data types', () => {
    it('should reject null data', () => {
      const result = validateServiceArray(null);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'data' })
      );
    });

    it('should reject string data', () => {
      const result = validateServiceArray('not an array');
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'data' })
      );
    });

    it('should reject empty array', () => {
      const result = validateServiceArray([]);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ 
          field: 'data',
          message: expect.stringContaining('empty')
        })
      );
    });

    it('should reject empty object', () => {
      const result = validateServiceArray({});
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'data' })
      );
    });
  });

  describe('individual service validation', () => {
    it('should report errors for invalid services with index', () => {
      const services = [
        validService,
        { ...validService, id: '', heroTitle: '' },
        validService
      ];
      const result = validateServiceArray(services);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ 
          field: expect.stringContaining('[1]'),
          message: expect.stringContaining('index 1')
        })
      );
    });

    it('should report all errors from all invalid services', () => {
      const services = [
        { ...validService, id: '' },
        { ...validService, heroTitle: '' }
      ];
      const result = validateServiceArray(services);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('duplicate serviceId detection', () => {
    it('should detect duplicate serviceIds in array', () => {
      const services = [
        validService,
        { ...validService, heroTitle: 'Different Title' }
      ];
      const result = validateServiceArray(services);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ 
          field: 'serviceId',
          message: expect.stringContaining('Duplicate')
        })
      );
    });

    it('should detect multiple duplicate serviceIds', () => {
      const services = [
        validService,
        validService,
        { ...validService, id: 'service-2' },
        { ...validService, id: 'service-2' }
      ];
      const result = validateServiceArray(services);
      expect(result.valid).toBe(false);
      const duplicateErrors = result.errors.filter(e => 
        e.message.includes('Duplicate')
      );
      expect(duplicateErrors.length).toBeGreaterThanOrEqual(2);
    });

    it('should not report duplicates for unique serviceIds', () => {
      const services = [
        validService,
        { ...validService, id: 'service-2' },
        { ...validService, id: 'service-3' }
      ];
      const result = validateServiceArray(services);
      expect(result.valid).toBe(true);
      const duplicateErrors = result.errors.filter(e => 
        e.message.includes('Duplicate')
      );
      expect(duplicateErrors).toHaveLength(0);
    });
  });
});
