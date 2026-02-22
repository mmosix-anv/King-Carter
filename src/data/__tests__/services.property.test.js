import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { getServiceById, servicesData } from '../services.js';

/**
 * Feature: dynamic-service-pages
 * Property 1: Service Data Structure Completeness
 * 
 * **Validates: Requirements 1.2, 1.3, 1.4, 1.5, 8.5**
 * 
 * For any service in the Service_Data_Store, the service data SHALL include all required fields:
 * - Service_Identifier in kebab-case format
 * - heroTitle
 * - heroTagline
 * - heroImage
 * - description array with 1-5 paragraphs
 * - highlights array with 3-10 items
 * - images array with 5-10 URLs
 * - cta object with text and buttonLabel fields
 */
describe('Feature: dynamic-service-pages, Property 1: Service Data Structure Completeness', () => {
  it('should have complete data structure for all services', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(servicesData)),
        (serviceId) => {
          const service = getServiceById(serviceId);
          
          // Assert service exists
          expect(service).toBeTruthy();
          
          // Assert id is in kebab-case format
          expect(service.id).toMatch(/^[a-z]+(-[a-z]+)*$/);
          expect(service.id).toBe(serviceId);
          
          // Assert required string fields exist and are non-empty
          expect(service.heroTitle).toBeTruthy();
          expect(typeof service.heroTitle).toBe('string');
          expect(service.heroTitle.length).toBeGreaterThan(0);
          
          expect(service.heroTagline).toBeTruthy();
          expect(typeof service.heroTagline).toBe('string');
          expect(service.heroTagline.length).toBeGreaterThan(0);
          
          expect(service.heroImage).toBeTruthy();
          expect(typeof service.heroImage).toBe('string');
          expect(service.heroImage.length).toBeGreaterThan(0);
          
          // Assert description is array with 1-5 paragraphs
          expect(Array.isArray(service.description)).toBe(true);
          expect(service.description.length).toBeGreaterThanOrEqual(1);
          expect(service.description.length).toBeLessThanOrEqual(5);
          service.description.forEach((paragraph) => {
            expect(typeof paragraph).toBe('string');
            expect(paragraph.length).toBeGreaterThan(0);
          });
          
          // Assert highlights is array with 3-10 items
          expect(Array.isArray(service.highlights)).toBe(true);
          expect(service.highlights.length).toBeGreaterThanOrEqual(3);
          expect(service.highlights.length).toBeLessThanOrEqual(10);
          service.highlights.forEach((highlight) => {
            expect(typeof highlight).toBe('string');
            expect(highlight.length).toBeGreaterThan(0);
          });
          
          // Assert images is array with 5-10 URLs
          expect(Array.isArray(service.images)).toBe(true);
          expect(service.images.length).toBeGreaterThanOrEqual(5);
          expect(service.images.length).toBeLessThanOrEqual(10);
          service.images.forEach((image) => {
            expect(typeof image).toBe('string');
            expect(image.length).toBeGreaterThan(0);
          });
          
          // Assert cta object exists with required fields
          expect(service.cta).toBeTruthy();
          expect(typeof service.cta).toBe('object');
          
          expect(service.cta.text).toBeTruthy();
          expect(typeof service.cta.text).toBe('string');
          expect(service.cta.text.length).toBeGreaterThan(0);
          
          expect(service.cta.buttonLabel).toBeTruthy();
          expect(typeof service.cta.buttonLabel).toBe('string');
          expect(service.cta.buttonLabel.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: dynamic-service-pages
 * Property 5: Data Retrieval
 * 
 * **Validates: Requirements 3.1**
 * 
 * For any valid Service_Identifier, when the Service_Page_Component receives that identifier,
 * it SHALL successfully retrieve the corresponding service data from the Service_Data_Store.
 */
describe('Feature: dynamic-service-pages, Property 5: Data Retrieval', () => {
  it('should return non-null data for all valid service IDs', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(servicesData)),
        (serviceId) => {
          const service = getServiceById(serviceId);
          
          // Assert that getServiceById returns non-null data for valid service IDs
          expect(service).not.toBeNull();
          expect(service).toBeTruthy();
          expect(typeof service).toBe('object');
          
          // Verify the returned service has the correct ID
          expect(service.id).toBe(serviceId);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: dynamic-service-pages
 * Property 3: Invalid Service ID Handling
 * 
 * **Validates: Requirements 2.2**
 * 
 * For any string that is not a valid Service_Identifier, when provided as the serviceId URL parameter,
 * the Router SHALL redirect to the home page or 404 page rather than rendering invalid content.
 * 
 * This test verifies that getServiceById returns null for invalid service IDs.
 */
describe('Feature: dynamic-service-pages, Property 3: Invalid Service ID Handling', () => {
  it('should return null for invalid service IDs', () => {
    const validServiceIds = Object.keys(servicesData);
    
    fc.assert(
      fc.property(
        // Generate random strings that are NOT valid service IDs
        fc.string({ minLength: 1, maxLength: 50 }).filter(str => !validServiceIds.includes(str)),
        (invalidServiceId) => {
          const service = getServiceById(invalidServiceId);
          
          // Assert that getServiceById returns null for invalid service IDs
          expect(service).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });
  
  it('should return null for empty string', () => {
    const service = getServiceById('');
    expect(service).toBeNull();
  });
  
  it('should return null for undefined', () => {
    const service = getServiceById(undefined);
    expect(service).toBeNull();
  });
  
  it('should return null for null', () => {
    const service = getServiceById(null);
    expect(service).toBeNull();
  });
});
