/**
 * Integration tests for Service Validator with actual service data
 * 
 * Validates that the validator works correctly with real service data
 */

import { describe, it, expect } from 'vitest';
import { validateServiceData, validateServiceArray } from '../serviceValidator.js';
import { servicesData } from '../../../data/services.js';

describe('Service Validator Integration Tests', () => {
  describe('with actual services data', () => {
    it('should validate all services in servicesData', () => {
      const result = validateServiceArray(servicesData);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate each individual service', () => {
      const serviceIds = Object.keys(servicesData);
      
      serviceIds.forEach(serviceId => {
        const service = servicesData[serviceId];
        const result = validateServiceData(service);
        
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should validate private-luxury-transport service', () => {
      const service = servicesData['private-luxury-transport'];
      const result = validateServiceData(service);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate corporate-executive-travel service', () => {
      const service = servicesData['corporate-executive-travel'];
      const result = validateServiceData(service);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate airport-hotel-transfers service', () => {
      const service = servicesData['airport-hotel-transfers'];
      const result = validateServiceData(service);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate special-engagements-events service', () => {
      const service = servicesData['special-engagements-events'];
      const result = validateServiceData(service);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('error reporting with real data structure', () => {
    it('should provide detailed errors for corrupted service data', () => {
      const corruptedService = {
        ...servicesData['private-luxury-transport'],
        heroTitle: '',
        description: [],
        cta: { text: 'Valid' } // missing buttonLabel
      };
      
      const result = validateServiceData(corruptedService);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(3);
      
      // Check that errors include field names
      const errorFields = result.errors.map(e => e.field);
      expect(errorFields).toContain('heroTitle');
      expect(errorFields).toContain('description');
      expect(errorFields).toContain('cta.buttonLabel');
    });

    it('should detect duplicate serviceIds in array format', () => {
      const servicesArray = [
        servicesData['private-luxury-transport'],
        servicesData['private-luxury-transport'] // duplicate
      ];
      
      const result = validateServiceArray(servicesArray);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'serviceId',
          message: expect.stringContaining('Duplicate')
        })
      );
    });
  });

  describe('data structure compatibility', () => {
    it('should handle services data as object (current format)', () => {
      const result = validateServiceArray(servicesData);
      expect(result.valid).toBe(true);
    });

    it('should handle services data as array (Strapi format)', () => {
      const servicesArray = Object.values(servicesData);
      const result = validateServiceArray(servicesArray);
      expect(result.valid).toBe(true);
    });

    it('should validate service with serviceId field instead of id', () => {
      const service = {
        ...servicesData['private-luxury-transport'],
        serviceId: 'private-luxury-transport'
      };
      delete service.id;
      
      const result = validateServiceData(service);
      expect(result.valid).toBe(true);
    });
  });
});
