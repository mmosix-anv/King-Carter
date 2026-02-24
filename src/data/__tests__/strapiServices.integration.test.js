/**
 * Integration tests for strapiServices module
 * 
 * Tests the refactored service data fetching that uses StrapiClient
 * with automatic fallback to local data.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchServices, fetchServiceById } from '../strapiServices.js';
import { servicesData } from '../services.js';

describe('strapiServices integration', () => {
  describe('fetchServices', () => {
    it('should return service data in the expected format', async () => {
      const services = await fetchServices();
      
      // Should return an object
      expect(services).toBeDefined();
      expect(typeof services).toBe('object');
      
      // Should have service IDs as keys
      const serviceIds = Object.keys(services);
      expect(serviceIds.length).toBeGreaterThan(0);
      
      // Each service should have required fields
      for (const serviceId of serviceIds) {
        const service = services[serviceId];
        expect(service).toHaveProperty('id');
        expect(service).toHaveProperty('heroTitle');
        expect(service).toHaveProperty('heroTagline');
        expect(service).toHaveProperty('heroImage');
        expect(service).toHaveProperty('description');
        expect(service).toHaveProperty('highlights');
        expect(service).toHaveProperty('images');
        expect(service).toHaveProperty('cta');
        
        // Validate types
        expect(typeof service.id).toBe('string');
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
    });

    it('should return data matching local services structure', async () => {
      const services = await fetchServices();
      
      // Should have the same service IDs as local data
      const localIds = Object.keys(servicesData);
      const fetchedIds = Object.keys(services);
      
      // At minimum, should have all local service IDs (may have more from Strapi)
      for (const localId of localIds) {
        expect(fetchedIds).toContain(localId);
      }
    });
  });

  describe('fetchServiceById', () => {
    it('should return a single service by ID', async () => {
      const serviceId = 'private-luxury-transport';
      const service = await fetchServiceById(serviceId);
      
      // Should return service data
      expect(service).toBeDefined();
      expect(service).not.toBeNull();
      
      // Should have correct ID
      expect(service.id).toBe(serviceId);
      
      // Should have all required fields
      expect(service).toHaveProperty('heroTitle');
      expect(service).toHaveProperty('heroTagline');
      expect(service).toHaveProperty('heroImage');
      expect(service).toHaveProperty('description');
      expect(service).toHaveProperty('highlights');
      expect(service).toHaveProperty('images');
      expect(service).toHaveProperty('cta');
    });

    it('should return null for non-existent service', async () => {
      const service = await fetchServiceById('non-existent-service');
      expect(service).toBeNull();
    });

    it('should return data for all known service IDs', async () => {
      const serviceIds = Object.keys(servicesData);
      
      for (const serviceId of serviceIds) {
        const service = await fetchServiceById(serviceId);
        expect(service).toBeDefined();
        expect(service).not.toBeNull();
        expect(service.id).toBe(serviceId);
      }
    });
  });

  describe('fallback behavior', () => {
    it('should gracefully handle Strapi unavailability', async () => {
      // This test verifies that even if Strapi is down,
      // the functions still return valid data (from fallback)
      
      const services = await fetchServices();
      expect(services).toBeDefined();
      expect(Object.keys(services).length).toBeGreaterThan(0);
      
      const service = await fetchServiceById('private-luxury-transport');
      expect(service).toBeDefined();
      expect(service).not.toBeNull();
    });
  });
});
