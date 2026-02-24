/**
 * Unit tests for Schema Comparison Utility
 * 
 * Tests the data structure comparison functionality to ensure
 * local services are validated correctly against Strapi schema.
 */

import { describe, it, expect } from 'vitest';
import {
  compareServiceStructure,
  compareAllServices,
  validateServicesCompatibility,
  getStrapiSchema
} from '../schemaComparison.js';

describe('Schema Comparison Utility', () => {
  // Valid service data matching the schema
  const validService = {
    id: 'test-service',
    heroTitle: 'Test Service',
    heroTagline: 'Test tagline',
    heroImage: '/image/test.png',
    description: ['Paragraph 1', 'Paragraph 2'],
    highlights: ['Feature 1', 'Feature 2'],
    images: ['/image/1.png', '/image/2.png'],
    cta: {
      text: 'CTA text',
      buttonLabel: 'Button label'
    }
  };

  describe('compareServiceStructure', () => {
    it('should validate a correct service structure', () => {
      const result = compareServiceStructure(validService, 'test-service');
      
      expect(result.compatible).toBe(true);
      expect(result.discrepancies).toHaveLength(0);
      expect(result.missingFields).toHaveLength(0);
      expect(result.extraFields).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const invalidService = { ...validService };
      delete invalidService.heroTitle;
      
      const result = compareServiceStructure(invalidService, 'test-service');
      
      expect(result.compatible).toBe(false);
      expect(result.missingFields).toContain('heroTitle');
      expect(result.discrepancies.some(d => d.field === 'heroTitle')).toBe(true);
    });

    it('should detect type mismatches', () => {
      const invalidService = {
        ...validService,
        description: 'not an array'  // Should be array
      };
      
      const result = compareServiceStructure(invalidService, 'test-service');
      
      expect(result.compatible).toBe(false);
      expect(result.discrepancies.some(d => 
        d.field === 'description' && d.issue.includes('Type mismatch')
      )).toBe(true);
    });

    it('should detect invalid array formats', () => {
      const invalidService = {
        ...validService,
        highlights: [1, 2, 3]  // Should be array of strings
      };
      
      const result = compareServiceStructure(invalidService, 'test-service');
      
      expect(result.compatible).toBe(false);
      expect(result.discrepancies.some(d => 
        d.field === 'highlights' && d.issue.includes('JSON format mismatch')
      )).toBe(true);
    });

    it('should detect empty string fields', () => {
      const invalidService = {
        ...validService,
        heroTitle: '   '  // Empty/whitespace string
      };
      
      const result = compareServiceStructure(invalidService, 'test-service');
      
      expect(result.compatible).toBe(false);
      expect(result.discrepancies.some(d => 
        d.field === 'heroTitle' && d.issue.includes('empty')
      )).toBe(true);
    });

    it('should detect empty arrays', () => {
      const invalidService = {
        ...validService,
        description: []  // Empty array
      };
      
      const result = compareServiceStructure(invalidService, 'test-service');
      
      expect(result.compatible).toBe(false);
      expect(result.discrepancies.some(d => 
        d.field === 'description' && d.issue.includes('empty')
      )).toBe(true);
    });

    it('should validate CTA object structure', () => {
      const invalidService = {
        ...validService,
        cta: { text: 'Only text' }  // Missing buttonLabel
      };
      
      const result = compareServiceStructure(invalidService, 'test-service');
      
      expect(result.compatible).toBe(false);
      expect(result.discrepancies.some(d => 
        d.field === 'cta.buttonLabel'
      )).toBe(true);
    });

    it('should detect extra fields not in schema', () => {
      const serviceWithExtra = {
        ...validService,
        extraField: 'not in schema'
      };
      
      const result = compareServiceStructure(serviceWithExtra, 'test-service');
      
      expect(result.extraFields).toContain('extraField');
      // Extra fields don't make it incompatible, just noted
      expect(result.compatible).toBe(true);
    });

    it('should handle field name mapping (id -> serviceId)', () => {
      // The 'id' field in local data maps to 'serviceId' in Strapi
      const result = compareServiceStructure(validService, 'test-service');
      
      // Should not report 'id' as extra or 'serviceId' as missing
      expect(result.missingFields).not.toContain('serviceId');
      expect(result.extraFields).not.toContain('id');
      expect(result.compatible).toBe(true);
    });
  });

  describe('compareAllServices', () => {
    it('should compare multiple services', () => {
      const servicesData = {
        'service-1': validService,
        'service-2': { ...validService, id: 'service-2' }
      };
      
      const results = compareAllServices(servicesData);
      
      expect(Object.keys(results)).toHaveLength(2);
      expect(results['service-1'].compatible).toBe(true);
      expect(results['service-2'].compatible).toBe(true);
    });

    it('should identify incompatible services', () => {
      const servicesData = {
        'valid-service': validService,
        'invalid-service': { ...validService, heroTitle: '' }
      };
      
      const results = compareAllServices(servicesData);
      
      expect(results['valid-service'].compatible).toBe(true);
      expect(results['invalid-service'].compatible).toBe(false);
    });
  });

  describe('validateServicesCompatibility', () => {
    it('should return true when all services are compatible', () => {
      const servicesData = {
        'service-1': validService,
        'service-2': { ...validService, id: 'service-2' }
      };
      
      const isCompatible = validateServicesCompatibility(servicesData);
      
      expect(isCompatible).toBe(true);
    });

    it('should return false when any service is incompatible', () => {
      const servicesData = {
        'valid-service': validService,
        'invalid-service': { ...validService, heroTitle: '' }
      };
      
      const isCompatible = validateServicesCompatibility(servicesData);
      
      expect(isCompatible).toBe(false);
    });
  });

  describe('getStrapiSchema', () => {
    it('should return the schema definition', () => {
      const schema = getStrapiSchema();
      
      expect(schema).toBeDefined();
      expect(schema.serviceId).toBeDefined();
      expect(schema.heroTitle).toBeDefined();
      expect(schema.description).toBeDefined();
      expect(schema.cta).toBeDefined();
    });

    it('should return a copy of the schema', () => {
      const schema1 = getStrapiSchema();
      const schema2 = getStrapiSchema();
      
      // Should be equal but not the same reference
      expect(schema1).toEqual(schema2);
      expect(schema1).not.toBe(schema2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null values', () => {
      const invalidService = {
        ...validService,
        heroTitle: null
      };
      
      const result = compareServiceStructure(invalidService, 'test-service');
      
      expect(result.compatible).toBe(false);
    });

    it('should handle undefined values', () => {
      const invalidService = {
        ...validService,
        heroTitle: undefined
      };
      
      const result = compareServiceStructure(invalidService, 'test-service');
      
      expect(result.compatible).toBe(false);
    });

    it('should handle mixed array types', () => {
      const invalidService = {
        ...validService,
        description: ['Valid string', 123, null]
      };
      
      const result = compareServiceStructure(invalidService, 'test-service');
      
      expect(result.compatible).toBe(false);
    });

    it('should handle CTA as non-object', () => {
      const invalidService = {
        ...validService,
        cta: 'not an object'
      };
      
      const result = compareServiceStructure(invalidService, 'test-service');
      
      expect(result.compatible).toBe(false);
    });

    it('should handle CTA as array', () => {
      const invalidService = {
        ...validService,
        cta: ['text', 'buttonLabel']
      };
      
      const result = compareServiceStructure(invalidService, 'test-service');
      
      expect(result.compatible).toBe(false);
    });
  });
});
