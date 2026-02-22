import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../index';

/**
 * Unit tests for Header component navigation integration
 * 
 * Tests verify:
 * - Service links navigate to correct dynamic URLs
 * - All three service links are present in the dropdown
 * - Links use the correct service identifiers
 * 
 * Requirements: 10.1, 10.2
 */

describe('Header Navigation Integration', () => {
  const renderHeader = () => {
    return render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
  };

  const openServicesDropdown = () => {
    const servicesDropdown = screen.getByText(/S E R V I C E S/i);
    fireEvent.mouseEnter(servicesDropdown.parentElement);
  };

  describe('Service Navigation Links', () => {
    it('should have Private Transport link with correct dynamic route', () => {
      renderHeader();
      openServicesDropdown();
      
      const privateTransportLink = screen.getByRole('link', { name: /private transport/i });
      expect(privateTransportLink).toBeDefined();
      expect(privateTransportLink.getAttribute('href')).toBe('/services/private-luxury-transport');
    });

    it('should have Special Events link with correct dynamic route', () => {
      renderHeader();
      openServicesDropdown();
      
      const specialEventsLink = screen.getByRole('link', { name: /special events/i });
      expect(specialEventsLink).toBeDefined();
      expect(specialEventsLink.getAttribute('href')).toBe('/services/special-engagements-events');
    });

    it('should have Corporate Travel link with correct dynamic route', () => {
      renderHeader();
      openServicesDropdown();
      
      const corporateTravelLink = screen.getByRole('link', { name: /corporate travel/i });
      expect(corporateTravelLink).toBeDefined();
      expect(corporateTravelLink.getAttribute('href')).toBe('/services/corporate-executive-travel');
    });

    it('should have all three service links in the dropdown', () => {
      renderHeader();
      openServicesDropdown();
      
      const privateTransportLink = screen.getByRole('link', { name: /private transport/i });
      const specialEventsLink = screen.getByRole('link', { name: /special events/i });
      const corporateTravelLink = screen.getByRole('link', { name: /corporate travel/i });
      
      expect(privateTransportLink).toBeDefined();
      expect(specialEventsLink).toBeDefined();
      expect(corporateTravelLink).toBeDefined();
    });

    it('should use correct service identifiers matching the services data', () => {
      renderHeader();
      openServicesDropdown();
      
      // Verify that the links use the exact service IDs from servicesData
      const links = [
        { name: /private transport/i, expectedHref: '/services/private-luxury-transport' },
        { name: /special events/i, expectedHref: '/services/special-engagements-events' },
        { name: /corporate travel/i, expectedHref: '/services/corporate-executive-travel' }
      ];
      
      links.forEach(({ name, expectedHref }) => {
        const link = screen.getByRole('link', { name });
        expect(link.getAttribute('href')).toBe(expectedHref);
      });
    });
  });

  describe('Other Navigation Links', () => {
    it('should have About Us link', () => {
      renderHeader();
      
      // The link text is "A B O U T   U S" with spaces
      const aboutLink = screen.getByRole('link', { name: /A B O U T.*U S/i });
      expect(aboutLink).toBeDefined();
      expect(aboutLink.getAttribute('href')).toBe('/about');
    });

    it('should have Experience link', () => {
      renderHeader();
      
      // The link text is "E X P E R I E N C E" with spaces
      const experienceLink = screen.getByRole('link', { name: /E X P E R I E N C E/i });
      expect(experienceLink).toBeDefined();
      expect(experienceLink.getAttribute('href')).toBe('/experience');
    });

    it('should have Contact link', () => {
      renderHeader();
      
      // The link text is "C O N TA C T" with spaces
      const contactLink = screen.getByRole('link', { name: /C O N TA C T/i });
      expect(contactLink).toBeDefined();
      expect(contactLink.getAttribute('href')).toBe('/contact');
    });
  });
});
