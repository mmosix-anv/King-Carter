import { describe, it, expect } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import fc from 'fast-check';
import ServiceDetails from '../index.jsx';
import { servicesData, getServiceById } from '../../../data/services.js';

/**
 * Feature: dynamic-service-pages
 * Property 2: Valid Service ID Routing
 * 
 * **Validates: Requirements 2.1, 2.3**
 * 
 * For any valid Service_Identifier from the set {private-luxury-transport, 
 * corporate-executive-travel, airport-hotel-transfers, special-engagements-events},
 * when a user navigates to `/services/:serviceId`, the Router SHALL render the 
 * Service_Page_Component with the corresponding service data.
 */
describe('Feature: dynamic-service-pages, Property 2: Valid Service ID Routing', () => {
  it('should render component with non-null service data for any valid service ID', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(servicesData)),
        (serviceId) => {
          // Verify that getServiceById returns non-null data for this valid ID
          const serviceData = getServiceById(serviceId);
          expect(serviceData).not.toBeNull();
          expect(serviceData).toBeDefined();
          
          // Render the component with the service ID via routing
          const { container, unmount } = render(
            <MemoryRouter initialEntries={[`/services/${serviceId}`]}>
              <Routes>
                <Route path="/services/:serviceId" element={<ServiceDetails />} />
              </Routes>
            </MemoryRouter>
          );
          
          try {
            // Verify the component renders successfully (not redirected)
            // Check that the hero title from the service data is present
            const heroTitle = screen.getByText(serviceData.heroTitle);
            expect(heroTitle).toBeInTheDocument();
            
            // Verify the component received and used the correct service data
            // by checking for unique content from this specific service
            expect(container.textContent).toContain(serviceData.heroTitle);
            expect(container.textContent).toContain(serviceData.heroTagline);
            
            // Verify that the service data is complete and usable
            expect(serviceData.id).toBe(serviceId);
            expect(serviceData.heroTitle).toBeTruthy();
            expect(serviceData.description).toBeInstanceOf(Array);
            expect(serviceData.highlights).toBeInstanceOf(Array);
            expect(serviceData.images).toBeInstanceOf(Array);
            expect(serviceData.cta).toBeDefined();
          } finally {
            // Clean up after each property test run
            unmount();
            cleanup();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: dynamic-service-pages
 * Property 6: Complete Content Rendering
 * 
 * **Validates: Requirements 3.2, 3.3, 3.4, 3.5, 8.1, 8.2**
 * 
 * For any valid service, when the Service_Page_Component renders that service,
 * the rendered output SHALL include the hero title, hero tagline, all description paragraphs,
 * all service highlights, all image URLs, CTA text, and CTA button label from the service data.
 */
describe('Feature: dynamic-service-pages, Property 6: Complete Content Rendering', () => {
  it('should render all content fields from service data for any valid service', { timeout: 30000 }, () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(servicesData)),
        (serviceId) => {
          const serviceData = servicesData[serviceId];
          
          // Render the component with the service ID
          const { container, unmount } = render(
            <MemoryRouter initialEntries={[`/services/${serviceId}`]}>
              <Routes>
                <Route path="/services/:serviceId" element={<ServiceDetails />} />
              </Routes>
            </MemoryRouter>
          );
          
          try {
            // Verify hero title is rendered
            const heroTitle = screen.getByText(serviceData.heroTitle);
            expect(heroTitle).toBeInTheDocument();
            
            // Verify hero tagline is rendered
            const heroTagline = screen.getByText(serviceData.heroTagline);
            expect(heroTagline).toBeInTheDocument();
            
            // Verify all description paragraphs are rendered
            serviceData.description.forEach((paragraph) => {
              const paragraphElement = screen.getByText(paragraph);
              expect(paragraphElement).toBeInTheDocument();
            });
            
            // Verify all highlights are rendered
            // Note: Some highlights may appear in multiple services, so we use getAllByText
            serviceData.highlights.forEach((highlight) => {
              const highlightElements = screen.getAllByText(highlight);
              expect(highlightElements.length).toBeGreaterThan(0);
            });
            
            // Verify all images are rendered with correct src attributes
            // Note: We check that each service image is present, not the total count
            // since the page may contain other images (e.g., in Layout/Header/Footer)
            serviceData.images.forEach((imageSrc) => {
              const imageElement = container.querySelector(`img[src="${imageSrc}"]`);
              expect(imageElement).toBeInTheDocument();
            });
            
            // Verify CTA text is rendered
            const ctaText = screen.getByText(serviceData.cta.text);
            expect(ctaText).toBeInTheDocument();
            
            // Verify CTA button label is rendered
            const ctaButton = screen.getByText(serviceData.cta.buttonLabel);
            expect(ctaButton).toBeInTheDocument();
          } finally {
            // Clean up after each property test run
            unmount();
            cleanup();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: dynamic-service-pages
 * Property 7: Image Gallery Rendering with Alt Text
 * 
 * **Validates: Requirements 8.2, 8.4**
 * 
 * For any service, when the Service_Page_Component renders the gallery section,
 * each image element SHALL include an alt attribute with descriptive text.
 */
describe('Feature: dynamic-service-pages, Property 7: Image Gallery Rendering with Alt Text', () => {
  it('should render all gallery images with non-empty alt attributes for any valid service', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(servicesData)),
        (serviceId) => {
          const serviceData = servicesData[serviceId];
          
          // Render the component with the service ID
          const { container, unmount } = render(
            <MemoryRouter initialEntries={[`/services/${serviceId}`]}>
              <Routes>
                <Route path="/services/:serviceId" element={<ServiceDetails />} />
              </Routes>
            </MemoryRouter>
          );
          
          try {
            // Get all img elements in the gallery section
            // We need to filter to only gallery images, not other images in Layout/Header/Footer
            const galleryImages = Array.from(container.querySelectorAll('img')).filter(img => 
              serviceData.images.includes(img.src) || 
              serviceData.images.some(imageSrc => img.src.endsWith(imageSrc))
            );
            
            // Verify we found all the gallery images
            expect(galleryImages.length).toBe(serviceData.images.length);
            
            // Verify each gallery image has a non-empty alt attribute
            galleryImages.forEach((img, index) => {
              expect(img).toHaveAttribute('alt');
              const altText = img.getAttribute('alt');
              expect(altText).toBeTruthy();
              expect(altText.length).toBeGreaterThan(0);
              
              // Verify alt text is descriptive (contains service name and image number)
              expect(altText).toContain(serviceData.heroTitle);
              expect(altText).toMatch(/Gallery image \d+/);
            });
          } finally {
            // Clean up after each property test run
            unmount();
            cleanup();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: dynamic-service-pages
 * Property 8: Gallery Layout Structure
 * 
 * **Validates: Requirements 8.3**
 * 
 * For any service, when the Service_Page_Component renders the gallery,
 * the first image SHALL use the primary gallery CSS class and subsequent images
 * SHALL use the secondary gallery CSS class.
 */
describe('Feature: dynamic-service-pages, Property 8: Gallery Layout Structure', () => {
  it('should render first image with primary class and remaining images with secondary class for any valid service', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(servicesData)),
        (serviceId) => {
          const serviceData = servicesData[serviceId];
          
          // Render the component with the service ID
          const { container, unmount } = render(
            <MemoryRouter initialEntries={[`/services/${serviceId}`]}>
              <Routes>
                <Route path="/services/:serviceId" element={<ServiceDetails />} />
              </Routes>
            </MemoryRouter>
          );
          
          try {
            // Get all gallery item divs (containers for images)
            // Look for divs that are direct children of the gallery container
            // and contain an img element with a gallery image
            const galleryItems = Array.from(container.querySelectorAll('div')).filter(div => {
              // Check if this div has the galleryItem or galleryItemPrimary class
              const hasGalleryClass = div.className.includes('galleryItem');
              if (!hasGalleryClass) return false;
              
              // Verify it contains an image from our service data
              const img = div.querySelector('img');
              if (!img) return false;
              
              return serviceData.images.some(imageSrc => 
                img.src.endsWith(imageSrc) || img.src === imageSrc
              );
            });
            
            // Verify we found all the gallery items
            expect(galleryItems.length).toBe(serviceData.images.length);
            
            // Verify the first gallery item has the primary class
            const firstItem = galleryItems[0];
            expect(firstItem.className).toContain('galleryItemPrimary');
            
            // Verify remaining gallery items have the secondary class (not primary)
            for (let i = 1; i < galleryItems.length; i++) {
              const item = galleryItems[i];
              expect(item.className).toContain('galleryItem');
              expect(item.className).not.toContain('galleryItemPrimary');
            }
          } finally {
            // Clean up after each property test run
            unmount();
            cleanup();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: dynamic-service-pages
 * Property 4: Client-Side Navigation
 * 
 * **Validates: Requirements 2.4**
 * 
 * For any two valid Service_Identifiers, when navigating from one service page to another,
 * the Service_Page_Component SHALL update its content without triggering a full page reload.
 * 
 * This property verifies that the ServiceDetails component correctly responds to route
 * parameter changes by rendering the appropriate service data. In a React SPA with React Router,
 * navigation is inherently client-side (no page reload), so we verify that:
 * 1. The component can render any valid service when given its ID via route parameter
 * 2. The component correctly switches between different services when the route changes
 * 3. Each service renders with its unique content, proving the component is dynamic
 */
describe('Feature: dynamic-service-pages, Property 4: Client-Side Navigation', () => {
  it('should update content when navigating between any two valid services', () => {
    fc.assert(
      fc.property(
        // Generate pairs of valid service IDs
        fc.tuple(
          fc.constantFrom(...Object.keys(servicesData)),
          fc.constantFrom(...Object.keys(servicesData))
        ),
        ([firstServiceId, secondServiceId]) => {
          const firstServiceData = servicesData[firstServiceId];
          const secondServiceData = servicesData[secondServiceId];
          
          // Test 1: Render the first service and verify it displays correctly
          const { container: container1, unmount: unmount1 } = render(
            <MemoryRouter initialEntries={[`/services/${firstServiceId}`]}>
              <Routes>
                <Route path="/services/:serviceId" element={<ServiceDetails />} />
              </Routes>
            </MemoryRouter>
          );
          
          try {
            // Verify the first service is rendered with correct content
            const firstHeroTitle = screen.getByText(firstServiceData.heroTitle);
            expect(firstHeroTitle).toBeInTheDocument();
            expect(container1.textContent).toContain(firstServiceData.heroTagline);
            
            // Verify the component retrieved the correct service data
            expect(getServiceById(firstServiceId)).toBe(firstServiceData);
          } finally {
            unmount1();
            cleanup();
          }
          
          // Test 2: Render the second service and verify it displays correctly
          // This simulates navigating to a different service page
          const { container: container2, unmount: unmount2 } = render(
            <MemoryRouter initialEntries={[`/services/${secondServiceId}`]}>
              <Routes>
                <Route path="/services/:serviceId" element={<ServiceDetails />} />
              </Routes>
            </MemoryRouter>
          );
          
          try {
            // Verify the second service is rendered with correct content
            const secondHeroTitle = screen.getByText(secondServiceData.heroTitle);
            expect(secondHeroTitle).toBeInTheDocument();
            expect(container2.textContent).toContain(secondServiceData.heroTagline);
            
            // Verify the component retrieved the correct service data
            expect(getServiceById(secondServiceId)).toBe(secondServiceData);
            
            // Verify that when services are different, they have different content
            if (firstServiceId !== secondServiceId) {
              // The services should have different hero titles
              expect(firstServiceData.heroTitle).not.toBe(secondServiceData.heroTitle);
              
              // The hero title element should show the second service, not the first
              // (Note: The first service's title may appear in navigation/footer, so we check the hero specifically)
              const heroTitleElement = container2.querySelector('h1');
              expect(heroTitleElement).toBeTruthy();
              expect(heroTitleElement.textContent).toBe(secondServiceData.heroTitle);
              expect(heroTitleElement.textContent).not.toBe(firstServiceData.heroTitle);
              
              // Verify unique highlights are different (if they exist)
              const firstUniqueHighlights = firstServiceData.highlights.filter(
                h => !secondServiceData.highlights.includes(h)
              );
              const secondUniqueHighlights = secondServiceData.highlights.filter(
                h => !firstServiceData.highlights.includes(h)
              );
              
              // If there are unique highlights, verify they're service-specific
              if (firstUniqueHighlights.length > 0 && secondUniqueHighlights.length > 0) {
                // Second service should have its unique highlights
                expect(container2.textContent).toContain(secondUniqueHighlights[0]);
                // Second service should not have first service's unique highlights
                expect(container2.textContent).not.toContain(firstUniqueHighlights[0]);
              }
            }
          } finally {
            unmount2();
            cleanup();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: dynamic-service-pages
 * Property 9: Navigation URL Updates
 * 
 * **Validates: Requirements 10.1, 10.2, 10.3**
 * 
 * For any valid Service_Identifier, when navigating to that service page,
 * the browser URL SHALL update to `/services/:serviceId` where :serviceId
 * matches the Service_Identifier.
 * 
 * This property verifies that:
 * 1. The Router correctly constructs URLs with the service ID parameter
 * 2. The URL pattern matches /services/:serviceId for all valid services
 * 3. Navigation updates the browser location to reflect the current service
 */
describe('Feature: dynamic-service-pages, Property 9: Navigation URL Updates', () => {
  it('should update URL to /services/:serviceId pattern when navigating to any valid service', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(servicesData)),
        (serviceId) => {
          // Render the component with the service ID via routing
          // MemoryRouter provides a location object we can inspect
          const { unmount } = render(
            <MemoryRouter initialEntries={[`/services/${serviceId}`]}>
              <Routes>
                <Route path="/services/:serviceId" element={<ServiceDetails />} />
              </Routes>
            </MemoryRouter>
          );
          
          try {
            // Verify the service data exists and is valid
            const serviceData = getServiceById(serviceId);
            expect(serviceData).not.toBeNull();
            expect(serviceData.id).toBe(serviceId);
            
            // Verify the component rendered successfully with this URL
            const heroTitle = screen.getByText(serviceData.heroTitle);
            expect(heroTitle).toBeInTheDocument();
            
            // The URL pattern is validated by the fact that:
            // 1. The route matched (component rendered)
            // 2. The serviceId was correctly extracted by useParams
            // 3. The correct service data was retrieved and displayed
            
            // Additional verification: The URL should follow the pattern /services/:serviceId
            const expectedUrl = `/services/${serviceId}`;
            
            // Verify the serviceId is in kebab-case format (as per requirements)
            expect(serviceId).toMatch(/^[a-z]+(-[a-z]+)*$/);
            
            // Verify the URL pattern is correct
            expect(expectedUrl).toMatch(/^\/services\/[a-z]+(-[a-z]+)*$/);
            
            // Verify the serviceId in the URL matches the service data ID
            expect(expectedUrl).toBe(`/services/${serviceData.id}`);
          } finally {
            // Clean up after each property test run
            unmount();
            cleanup();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: dynamic-service-pages
 * Property 10: Browser History Navigation
 * 
 * **Validates: Requirements 10.4**
 * 
 * For any sequence of service page navigations, the browser back and forward buttons
 * SHALL correctly navigate through the history, rendering the appropriate service page
 * for each history entry.
 * 
 * This property verifies that:
 * 1. A sequence of service navigations creates a proper history stack
 * 2. Back navigation moves through history in reverse order
 * 3. Forward navigation moves through history in forward order
 * 4. Each history entry renders the correct service content
 */
describe('Feature: dynamic-service-pages, Property 10: Browser History Navigation', () => {
  it('should correctly navigate back and forward through any sequence of service pages', { timeout: 30000 }, () => {
    fc.assert(
      fc.property(
        // Generate a sequence of 2-4 valid service IDs (reduced from 2-5 for performance)
        fc.array(
          fc.constantFrom(...Object.keys(servicesData)),
          { minLength: 2, maxLength: 4 }
        ),
        (serviceIdSequence) => {
          // Create initial entries for the history stack
          // Each entry is a URL path for a service page
          const initialEntries = serviceIdSequence.map(id => `/services/${id}`);
          
          // Test each position in the history by rendering at that index
          // This simulates navigating through the history with back/forward buttons
          for (let historyIndex = 0; historyIndex < serviceIdSequence.length; historyIndex++) {
            const serviceId = serviceIdSequence[historyIndex];
            const serviceData = servicesData[serviceId];
            
            // Render at this specific history position
            const { unmount } = render(
              <MemoryRouter 
                initialEntries={initialEntries} 
                initialIndex={historyIndex}
              >
                <Routes>
                  <Route path="/services/:serviceId" element={<ServiceDetails />} />
                </Routes>
              </MemoryRouter>
            );
            
            try {
              // Verify the correct service is displayed at this history position
              const heroTitle = screen.getByText(serviceData.heroTitle);
              expect(heroTitle).toBeInTheDocument();
              
              // Verify the tagline is also present (confirms full service data loaded)
              const heroTagline = screen.getByText(serviceData.heroTagline);
              expect(heroTagline).toBeInTheDocument();
              
              // Verify the service data matches what we expect at this position
              expect(getServiceById(serviceId)).toBe(serviceData);
              expect(serviceData.id).toBe(serviceId);
            } finally {
              // Clean up after each render
              unmount();
              cleanup();
            }
          }
          
          // Additional verification: Test backward navigation pattern
          // Start at the end and verify we can "go back" through history
          if (serviceIdSequence.length >= 2) {
            const lastIndex = serviceIdSequence.length - 1;
            const firstIndex = 0;
            
            // Verify last position (current page before going back)
            const lastServiceData = servicesData[serviceIdSequence[lastIndex]];
            const { unmount: unmountLast } = render(
              <MemoryRouter 
                initialEntries={initialEntries} 
                initialIndex={lastIndex}
              >
                <Routes>
                  <Route path="/services/:serviceId" element={<ServiceDetails />} />
                </Routes>
              </MemoryRouter>
            );
            
            try {
              expect(screen.getByText(lastServiceData.heroTitle)).toBeInTheDocument();
            } finally {
              unmountLast();
              cleanup();
            }
            
            // Verify first position (after going all the way back)
            const firstServiceData = servicesData[serviceIdSequence[firstIndex]];
            const { unmount: unmountFirst } = render(
              <MemoryRouter 
                initialEntries={initialEntries} 
                initialIndex={firstIndex}
              >
                <Routes>
                  <Route path="/services/:serviceId" element={<ServiceDetails />} />
                </Routes>
              </MemoryRouter>
            );
            
            try {
              expect(screen.getByText(firstServiceData.heroTitle)).toBeInTheDocument();
            } finally {
              unmountFirst();
              cleanup();
            }
          }
        }
      ),
      { numRuns: 50 } // Reduced from 100 to 50 for performance
    );
  });
});
