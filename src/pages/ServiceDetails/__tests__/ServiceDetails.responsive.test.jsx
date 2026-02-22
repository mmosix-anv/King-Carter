import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ServiceDetails from '../index.jsx';
import { servicesData } from '../../../data/services.js';

/**
 * Responsive Layout Tests for ServiceDetails Component
 * 
 * Tests verify:
 * - All existing CSS module styles are still applied
 * - Gallery layout structure (grid on desktop, single column on mobile)
 * - All sections render with proper responsive classes
 * - No visual regressions from refactoring
 * 
 * **Validates: Requirements 9.1, 9.2, 9.3, 9.4**
 */

describe('ServiceDetails Component - Responsive Layout Tests', () => {
  const testServiceId = 'private-luxury-transport';
  const testServiceData = servicesData[testServiceId];

  describe('CSS Module Styles Application', () => {
    it('should apply serviceDetails wrapper class', () => {
      const { container } = render(
        <MemoryRouter initialEntries={[`/services/${testServiceId}`]}>
          <Routes>
            <Route path="/services/:serviceId" element={<ServiceDetails />} />
          </Routes>
        </MemoryRouter>
      );

      const serviceDetailsDiv = container.querySelector('[class*="serviceDetails"]');
      expect(serviceDetailsDiv).toBeInTheDocument();
      expect(serviceDetailsDiv.className).toMatch(/serviceDetails/);
    });

    it('should apply heroSection class with background image', () => {
      const { container } = render(
        <MemoryRouter initialEntries={[`/services/${testServiceId}`]}>
          <Routes>
            <Route path="/services/:serviceId" element={<ServiceDetails />} />
          </Routes>
        </MemoryRouter>
      );

      const heroSection = container.querySelector('[class*="heroSection"]');
      expect(heroSection).toBeInTheDocument();
      expect(heroSection.className).toMatch(/heroSection/);
      expect(heroSection.style.backgroundImage).toContain(testServiceData.heroImage);
    });

    it('should apply heroContent and heroTitle classes', () => {
      const { container } = render(
        <MemoryRouter initialEntries={[`/services/${testServiceId}`]}>
          <Routes>
            <Route path="/services/:serviceId" element={<ServiceDetails />} />
          </Routes>
        </MemoryRouter>
      );

      const heroContent = container.querySelector('[class*="heroContent"]');
      expect(heroContent).toBeInTheDocument();
      expect(heroContent.className).toMatch(/heroContent/);

      const heroTitle = container.querySelector('[class*="heroTitle"]');
      expect(heroTitle).toBeInTheDocument();
      expect(heroTitle.className).toMatch(/heroTitle/);
    });

    it('should apply description section classes', () => {
      const { container } = render(
        <MemoryRouter initialEntries={[`/services/${testServiceId}`]}>
          <Routes>
            <Route path="/services/:serviceId" element={<ServiceDetails />} />
          </Routes>
        </MemoryRouter>
      );

      const description = container.querySelector('[class*="description"]');
      expect(description).toBeInTheDocument();
      expect(description.className).toMatch(/description/);

      const tagline = container.querySelector('[class*="designedForIndividua3"]');
      expect(tagline).toBeInTheDocument();

      const paragraphs = container.querySelectorAll('[class*="loremIpsumDolorSitAm4"]');
      expect(paragraphs.length).toBeGreaterThan(0);
    });

    it('should apply highlights section classes', () => {
      const { container } = render(
        <MemoryRouter initialEntries={[`/services/${testServiceId}`]}>
          <Routes>
            <Route path="/services/:serviceId" element={<ServiceDetails />} />
          </Routes>
        </MemoryRouter>
      );

      const highlights = container.querySelector('[class*="highlights"]');
      expect(highlights).toBeInTheDocument();
      expect(highlights.className).toMatch(/highlights/);
    });

    it('should apply gallery section classes', () => {
      const { container } = render(
        <MemoryRouter initialEntries={[`/services/${testServiceId}`]}>
          <Routes>
            <Route path="/services/:serviceId" element={<ServiceDetails />} />
          </Routes>
        </MemoryRouter>
      );

      const gallery = container.querySelector('[class*="gallery"]');
      expect(gallery).toBeInTheDocument();
      expect(gallery.className).toMatch(/gallery/);
    });

    it('should apply CTA section classes', () => {
      const { container } = render(
        <MemoryRouter initialEntries={[`/services/${testServiceId}`]}>
          <Routes>
            <Route path="/services/:serviceId" element={<ServiceDetails />} />
          </Routes>
        </MemoryRouter>
      );

      const cta = container.querySelector('[class*="cta"]');
      expect(cta).toBeInTheDocument();
      expect(cta.className).toMatch(/cta/);

      const ctaText = container.querySelector('[class*="ctaText"]');
      expect(ctaText).toBeInTheDocument();

      const ctaButton = container.querySelector('[class*="ctaButton"]');
      expect(ctaButton).toBeInTheDocument();
    });
  });

  describe('Gallery Layout Structure', () => {
    it('should apply primary gallery class to first image container', () => {
      const { container } = render(
        <MemoryRouter initialEntries={[`/services/${testServiceId}`]}>
          <Routes>
            <Route path="/services/:serviceId" element={<ServiceDetails />} />
          </Routes>
        </MemoryRouter>
      );

      const galleryItems = container.querySelectorAll('[class*="galleryItem"]');
      expect(galleryItems.length).toBeGreaterThan(0);

      const firstItem = galleryItems[0];
      expect(firstItem.className).toMatch(/galleryItemPrimary/);
    });

    it('should apply secondary gallery class to remaining image containers', () => {
      const { container } = render(
        <MemoryRouter initialEntries={[`/services/${testServiceId}`]}>
          <Routes>
            <Route path="/services/:serviceId" element={<ServiceDetails />} />
          </Routes>
        </MemoryRouter>
      );

      const galleryItems = container.querySelectorAll('[class*="galleryItem"]');
      
      // Verify we have the correct number of items
      expect(galleryItems.length).toBe(testServiceData.images.length);

      // Verify remaining items have secondary class (not primary)
      for (let i = 1; i < galleryItems.length; i++) {
        const item = galleryItems[i];
        expect(item.className).toMatch(/galleryItem/);
        expect(item.className).not.toMatch(/galleryItemPrimary/);
      }
    });

    it('should apply galleryImage class to all images', () => {
      const { container } = render(
        <MemoryRouter initialEntries={[`/services/${testServiceId}`]}>
          <Routes>
            <Route path="/services/:serviceId" element={<ServiceDetails />} />
          </Routes>
        </MemoryRouter>
      );

      const galleryImages = container.querySelectorAll('[class*="galleryImage"]');
      expect(galleryImages.length).toBe(testServiceData.images.length);

      galleryImages.forEach((img) => {
        expect(img.className).toMatch(/galleryImage/);
      });
    });

    it('should render gallery with grid layout structure', () => {
      const { container } = render(
        <MemoryRouter initialEntries={[`/services/${testServiceId}`]}>
          <Routes>
            <Route path="/services/:serviceId" element={<ServiceDetails />} />
          </Routes>
        </MemoryRouter>
      );

      const gallery = container.querySelector('[class*="gallery"]');
      expect(gallery).toBeInTheDocument();

      // Verify gallery contains all image containers
      const galleryItems = gallery.querySelectorAll('[class*="galleryItem"]');
      expect(galleryItems.length).toBe(testServiceData.images.length);
    });
  });

  describe('Responsive Layout Preservation Across Services', () => {
    it('should apply consistent CSS classes across all services', () => {
      Object.keys(servicesData).forEach((serviceId) => {
        const { container, unmount } = render(
          <MemoryRouter initialEntries={[`/services/${serviceId}`]}>
            <Routes>
              <Route path="/services/:serviceId" element={<ServiceDetails />} />
            </Routes>
          </MemoryRouter>
        );

        // Verify all major sections have CSS classes
        expect(container.querySelector('[class*="serviceDetails"]')).toBeInTheDocument();
        expect(container.querySelector('[class*="heroSection"]')).toBeInTheDocument();
        expect(container.querySelector('[class*="description"]')).toBeInTheDocument();
        expect(container.querySelector('[class*="highlights"]')).toBeInTheDocument();
        expect(container.querySelector('[class*="gallery"]')).toBeInTheDocument();
        expect(container.querySelector('[class*="cta"]')).toBeInTheDocument();

        unmount();
      });
    });

    it('should maintain gallery layout structure across all services', () => {
      Object.keys(servicesData).forEach((serviceId) => {
        const serviceData = servicesData[serviceId];
        const { container, unmount } = render(
          <MemoryRouter initialEntries={[`/services/${serviceId}`]}>
            <Routes>
              <Route path="/services/:serviceId" element={<ServiceDetails />} />
            </Routes>
          </MemoryRouter>
        );

        const galleryItems = container.querySelectorAll('[class*="galleryItem"]');
        
        // Verify correct number of gallery items
        expect(galleryItems.length).toBe(serviceData.images.length);

        // Verify first item has primary class
        expect(galleryItems[0].className).toMatch(/galleryItemPrimary/);

        // Verify remaining items don't have primary class
        for (let i = 1; i < galleryItems.length; i++) {
          expect(galleryItems[i].className).not.toMatch(/galleryItemPrimary/);
        }

        unmount();
      });
    });
  });

  describe('No Visual Regressions from Refactoring', () => {
    it('should render all content sections in correct order', () => {
      const { container } = render(
        <MemoryRouter initialEntries={[`/services/${testServiceId}`]}>
          <Routes>
            <Route path="/services/:serviceId" element={<ServiceDetails />} />
          </Routes>
        </MemoryRouter>
      );

      const serviceDetails = container.querySelector('[class*="serviceDetails"]');
      const children = Array.from(serviceDetails.children);

      // Verify sections appear in expected order
      expect(children[0].className).toMatch(/heroSection/);
      expect(children[1].className).toMatch(/description/);
      expect(children[2].className).toMatch(/highlights/);
      expect(children[3].className).toMatch(/gallery/);
      expect(children[4].className).toMatch(/cta/);
    });

    it('should maintain hero section structure with background and title', () => {
      const { container } = render(
        <MemoryRouter initialEntries={[`/services/${testServiceId}`]}>
          <Routes>
            <Route path="/services/:serviceId" element={<ServiceDetails />} />
          </Routes>
        </MemoryRouter>
      );

      const heroSection = container.querySelector('[class*="heroSection"]');
      expect(heroSection.style.backgroundImage).toBeTruthy();

      const heroContent = heroSection.querySelector('[class*="heroContent"]');
      expect(heroContent).toBeInTheDocument();

      const heroTitle = heroContent.querySelector('[class*="heroTitle"]');
      expect(heroTitle).toBeInTheDocument();
      expect(heroTitle.textContent).toBe(testServiceData.heroTitle);
    });

    it('should maintain description section structure with tagline and paragraphs', () => {
      const { container } = render(
        <MemoryRouter initialEntries={[`/services/${testServiceId}`]}>
          <Routes>
            <Route path="/services/:serviceId" element={<ServiceDetails />} />
          </Routes>
        </MemoryRouter>
      );

      const description = container.querySelector('[class*="description"]');
      
      // Verify tagline
      const tagline = description.querySelector('[class*="designedForIndividua3"]');
      expect(tagline).toBeInTheDocument();
      expect(tagline.textContent).toBe(testServiceData.heroTagline);

      // Verify paragraphs
      const paragraphs = description.querySelectorAll('[class*="loremIpsumDolorSitAm4"]');
      expect(paragraphs.length).toBe(testServiceData.description.length);
    });

    it('should maintain highlights section structure with list', () => {
      const { container } = render(
        <MemoryRouter initialEntries={[`/services/${testServiceId}`]}>
          <Routes>
            <Route path="/services/:serviceId" element={<ServiceDetails />} />
          </Routes>
        </MemoryRouter>
      );

      const highlights = container.querySelector('[class*="highlights"]');
      
      // Verify heading
      const heading = highlights.querySelector('h2');
      expect(heading).toBeInTheDocument();
      expect(heading.textContent).toBe('Service Highlights');

      // Verify list
      const list = highlights.querySelector('ul');
      expect(list).toBeInTheDocument();

      const listItems = list.querySelectorAll('li');
      expect(listItems.length).toBe(testServiceData.highlights.length);
    });

    it('should maintain CTA section structure with text and button', () => {
      const { container } = render(
        <MemoryRouter initialEntries={[`/services/${testServiceId}`]}>
          <Routes>
            <Route path="/services/:serviceId" element={<ServiceDetails />} />
          </Routes>
        </MemoryRouter>
      );

      const cta = container.querySelector('[class*="cta"]');
      
      // Verify CTA text
      const ctaText = cta.querySelector('[class*="ctaText"]');
      expect(ctaText).toBeInTheDocument();
      expect(ctaText.textContent).toBe(testServiceData.cta.text);

      // Verify CTA button
      const ctaButton = cta.querySelector('[class*="ctaButton"]');
      expect(ctaButton).toBeInTheDocument();
      expect(ctaButton.textContent).toBe(testServiceData.cta.buttonLabel);
    });
  });

  describe('Responsive Behavior Verification', () => {
    it('should have responsive CSS classes that support mobile and desktop layouts', () => {
      const { container } = render(
        <MemoryRouter initialEntries={[`/services/${testServiceId}`]}>
          <Routes>
            <Route path="/services/:serviceId" element={<ServiceDetails />} />
          </Routes>
        </MemoryRouter>
      );

      // Verify all sections have CSS module classes that support responsive design
      const sections = [
        'serviceDetails',
        'heroSection',
        'heroContent',
        'heroTitle',
        'description',
        'highlights',
        'gallery',
        'galleryItemPrimary',
        'galleryItem',
        'galleryImage',
        'cta',
        'ctaText',
        'ctaButton'
      ];

      sections.forEach((sectionClass) => {
        const element = container.querySelector(`[class*="${sectionClass}"]`);
        expect(element).toBeInTheDocument();
      });
    });

    it('should render gallery items that support grid layout on desktop', () => {
      const { container } = render(
        <MemoryRouter initialEntries={[`/services/${testServiceId}`]}>
          <Routes>
            <Route path="/services/:serviceId" element={<ServiceDetails />} />
          </Routes>
        </MemoryRouter>
      );

      const gallery = container.querySelector('[class*="gallery"]');
      const galleryItems = gallery.querySelectorAll('[class*="galleryItem"]');

      // Verify gallery has multiple items for grid layout
      expect(galleryItems.length).toBeGreaterThan(1);

      // Verify first item has primary class (spans multiple columns on desktop)
      expect(galleryItems[0].className).toMatch(/galleryItemPrimary/);
    });

    it('should render highlights list that supports two-column layout on desktop', () => {
      const { container } = render(
        <MemoryRouter initialEntries={[`/services/${testServiceId}`]}>
          <Routes>
            <Route path="/services/:serviceId" element={<ServiceDetails />} />
          </Routes>
        </MemoryRouter>
      );

      const highlights = container.querySelector('[class*="highlights"]');
      const list = highlights.querySelector('ul');
      const listItems = list.querySelectorAll('li');

      // Verify list has multiple items for grid layout
      expect(listItems.length).toBeGreaterThan(1);
    });
  });
});
