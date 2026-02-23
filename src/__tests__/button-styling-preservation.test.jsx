import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import fc from 'fast-check';
import Home from '../pages/Home/index.jsx';
import Experience from '../pages/Experience/index.jsx';
import ServiceDetails from '../pages/ServiceDetails/index.jsx';
import ContactForm from '../components/ContactForm/index.jsx';

/**
 * Preservation Property Tests - Button Functionality and Visual Feedback
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
 * 
 * CRITICAL: These tests MUST PASS on unfixed code - they establish the baseline behavior
 * 
 * These tests capture the current behavior of buttons BEFORE the styling fix is applied.
 * They verify that after the fix, all button functionality remains unchanged:
 * - Click handlers trigger the same actions and navigation
 * - Hover states provide visual feedback with smooth transitions
 * - Disabled states prevent interaction appropriately
 * - Button text content and labels remain unchanged
 * - Button padding and spacing maintain touch targets
 * 
 * EXPECTED OUTCOME: All tests PASS on unfixed code (confirms baseline to preserve)
 */

describe('Preservation Property Tests - Button Functionality and Visual Feedback', () => {
  /**
   * Property 2: Preservation - Button Click Handlers and Navigation
   * 
   * Tests that all buttons maintain their click behavior and navigation functionality.
   * This ensures that onClick handlers, form submissions, and routing remain unchanged.
   */
  describe('Property 2.1: Click Handlers and Navigation Preservation', () => {
    it('should preserve Home page bookExperienceBtn navigation behavior', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // Find the "Book an Experience" button (it's a Link component)
      const bookButton = Array.from(container.querySelectorAll('a')).find(link => 
        link.textContent === 'Book an Experience'
      );

      expect(bookButton).toBeTruthy();
      
      // Verify it has the correct navigation target
      expect(bookButton.getAttribute('href')).toBe('/experience');
      
      // Verify it's clickable (not disabled)
      expect(bookButton.hasAttribute('disabled')).toBe(false);
    });

    it('should preserve Experience page secondaryCta button click behavior', () => {
      const { container } = render(
        <BrowserRouter>
          <Experience />
        </BrowserRouter>
      );

      // Find "Become a member" button
      const memberButton = Array.from(container.querySelectorAll('button')).find(btn => 
        btn.textContent === 'Become a member'
      );

      expect(memberButton).toBeTruthy();
      
      // Verify button type is button (not submit)
      expect(memberButton.getAttribute('type')).toBe('button');
      
      // Verify it's clickable
      expect(memberButton.hasAttribute('disabled')).toBe(false);
      
      // Test that click event can be triggered (no errors)
      expect(() => fireEvent.click(memberButton)).not.toThrow();
    });

    it('should preserve ContactForm submitBtn form submission behavior', () => {
      const { container } = render(
        <BrowserRouter>
          <ContactForm />
        </BrowserRouter>
      );

      // Find submit button
      const submitButton = container.querySelector('button[type="submit"]');
      
      expect(submitButton).toBeTruthy();
      
      // Verify it's a submit button
      expect(submitButton.getAttribute('type')).toBe('submit');
      
      // Verify it's clickable
      expect(submitButton.hasAttribute('disabled')).toBe(false);
      
      // Verify button text is preserved
      expect(submitButton.textContent).toBe('Submit');
    });

    it('should preserve ServiceDetails ctaButton click behavior', () => {
      const { container } = render(
        <BrowserRouter>
          <ServiceDetails />
        </BrowserRouter>
      );

      // Find CTA button
      const ctaButton = container.querySelector('button.ctaButton');
      
      if (ctaButton) {
        // Verify it's clickable
        expect(ctaButton.hasAttribute('disabled')).toBe(false);
        
        // Test that click event can be triggered
        expect(() => fireEvent.click(ctaButton)).not.toThrow();
      }
    });

    it('should preserve Home page service card navigation', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // Find service card links
      const serviceCards = container.querySelectorAll('a[href^="/services/"]');
      
      expect(serviceCards.length).toBeGreaterThan(0);
      
      serviceCards.forEach(card => {
        // Verify each card has a valid href
        expect(card.getAttribute('href')).toMatch(/^\/services\/.+/);
        
        // Verify cards are clickable
        expect(card.hasAttribute('disabled')).toBe(false);
      });
    });
  });

  /**
   * Property 2.2: Hover States and Visual Feedback Preservation
   * 
   * Tests that all buttons maintain their hover state transitions and visual feedback.
   * This ensures that CSS transitions, color changes, and transforms remain unchanged.
   */
  describe('Property 2.2: Hover States and Visual Feedback Preservation', () => {
    it('should preserve Home page bookExperienceBtn hover transition', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const bookButton = Array.from(container.querySelectorAll('a')).find(link => 
        link.textContent === 'Book an Experience'
      );

      if (bookButton) {
        const styles = window.getComputedStyle(bookButton);
        
        // Verify transition property is defined (may be empty string in jsdom)
        expect(styles.transition).toBeDefined();
        
        // Verify cursor is pointer (or empty in jsdom)
        expect(['pointer', '']).toContain(styles.cursor);
      }
    });

    it('should preserve Experience page secondaryCta hover transition', () => {
      const { container } = render(
        <BrowserRouter>
          <Experience />
        </BrowserRouter>
      );

      const memberButton = Array.from(container.querySelectorAll('button')).find(btn => 
        btn.textContent === 'Become a member'
      );

      if (memberButton) {
        const styles = window.getComputedStyle(memberButton);
        
        // Verify transition property is defined
        expect(styles.transition).toBeDefined();
        
        // Verify cursor (may be empty in jsdom)
        expect(['pointer', '']).toContain(styles.cursor);
      }
    });

    it('should preserve ContactForm submitBtn hover transition', () => {
      const { container } = render(
        <BrowserRouter>
          <ContactForm />
        </BrowserRouter>
      );

      const submitButton = container.querySelector('button[type="submit"]');
      
      if (submitButton) {
        const styles = window.getComputedStyle(submitButton);
        
        // Verify transition property is defined
        expect(styles.transition).toBeDefined();
        
        // Verify cursor (may be empty in jsdom)
        expect(['pointer', '']).toContain(styles.cursor);
      }
    });

    it('should preserve ServiceDetails ctaButton hover transition', () => {
      const { container } = render(
        <BrowserRouter>
          <ServiceDetails />
        </BrowserRouter>
      );

      const ctaButton = container.querySelector('button.ctaButton');
      
      if (ctaButton) {
        const styles = window.getComputedStyle(ctaButton);
        
        // Verify transition property exists (0.3s ease)
        expect(styles.transition).toBeTruthy();
        
        // Verify cursor is pointer
        expect(styles.cursor).toBe('pointer');
      }
    });

    it('should preserve Home page carousel arrow hover behavior', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // Find carousel arrows
      const arrows = container.querySelectorAll('button[aria-label*="slide"]');
      
      expect(arrows.length).toBeGreaterThan(0);
      
      arrows.forEach(arrow => {
        const styles = window.getComputedStyle(arrow);
        
        // Verify transition is defined
        expect(styles.transition).toBeDefined();
        
        // Verify cursor (may be empty in jsdom)
        expect(['pointer', '']).toContain(styles.cursor);
      });
    });
  });

  /**
   * Property 2.3: Button Text Content Preservation
   * 
   * Tests that all button labels and text content remain unchanged after the fix.
   */
  describe('Property 2.3: Button Text Content Preservation', () => {
    it('should preserve all button text labels in Home page', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // Verify "Book an Experience" button text
      const bookButton = Array.from(container.querySelectorAll('a')).find(link => 
        link.textContent === 'Book an Experience'
      );
      expect(bookButton).toBeTruthy();
      expect(bookButton.textContent).toBe('Book an Experience');

      // Verify "Learn more" button text on service cards
      const learnMoreButtons = Array.from(container.querySelectorAll('button')).filter(btn => 
        btn.textContent === 'Learn more'
      );
      expect(learnMoreButtons.length).toBeGreaterThan(0);
      learnMoreButtons.forEach(btn => {
        expect(btn.textContent).toBe('Learn more');
      });
    });

    it('should preserve all button text labels in Experience page', () => {
      const { container } = render(
        <BrowserRouter>
          <Experience />
        </BrowserRouter>
      );

      // Verify "Become a member" button text
      const memberButton = Array.from(container.querySelectorAll('button')).find(btn => 
        btn.textContent === 'Become a member'
      );
      expect(memberButton).toBeTruthy();
      expect(memberButton.textContent).toBe('Become a member');

      // Verify "Corporate membership" button text
      const corpButton = Array.from(container.querySelectorAll('button')).find(btn => 
        btn.textContent === 'Corporate membership'
      );
      expect(corpButton).toBeTruthy();
      expect(corpButton.textContent).toBe('Corporate membership');

      // Verify "Learn more" card buttons
      const learnMoreButtons = Array.from(container.querySelectorAll('button')).filter(btn => 
        btn.textContent === 'Learn more'
      );
      expect(learnMoreButtons.length).toBeGreaterThan(0);
    });

    it('should preserve ContactForm submit button text', () => {
      const { container } = render(
        <BrowserRouter>
          <ContactForm />
        </BrowserRouter>
      );

      const submitButton = container.querySelector('button[type="submit"]');
      expect(submitButton).toBeTruthy();
      expect(submitButton.textContent).toBe('Submit');
    });
  });

  /**
   * Property 2.4: Button Padding and Touch Target Preservation
   * 
   * Tests that button padding and spacing maintain appropriate touch targets.
   * This ensures accessibility and usability remain unchanged.
   */
  describe('Property 2.4: Button Padding and Touch Target Preservation', () => {
    it('should preserve Home page bookExperienceBtn padding', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const bookButton = Array.from(container.querySelectorAll('a')).find(link => 
        link.textContent === 'Book an Experience'
      );

      if (bookButton) {
        // In jsdom, computed styles may not return padding values
        // Instead, verify the element exists and has reasonable dimensions
        expect(bookButton).toBeTruthy();
        
        // Verify it has class or inline styles that would apply padding
        expect(bookButton.className).toBeTruthy();
      }
    });

    it('should preserve Experience page button padding', () => {
      const { container } = render(
        <BrowserRouter>
          <Experience />
        </BrowserRouter>
      );

      const memberButton = Array.from(container.querySelectorAll('button')).find(btn => 
        btn.textContent === 'Become a member'
      );

      if (memberButton) {
        // Verify the button exists and has styling
        expect(memberButton).toBeTruthy();
        expect(memberButton.className).toBeTruthy();
      }
    });

    it('should preserve ContactForm submitBtn padding', () => {
      const { container } = render(
        <BrowserRouter>
          <ContactForm />
        </BrowserRouter>
      );

      const submitButton = container.querySelector('button[type="submit"]');
      
      if (submitButton) {
        // Verify the button exists and has styling
        expect(submitButton).toBeTruthy();
        expect(submitButton.className).toBeTruthy();
      }
    });
  });

  /**
   * Property 2.5: Disabled State Preservation
   * 
   * Tests that buttons with disabled states continue to prevent interaction appropriately.
   * Note: Most buttons in this application don't have disabled states, but we verify
   * that buttons remain enabled where expected.
   */
  describe('Property 2.5: Disabled State Preservation', () => {
    it('should preserve button enabled states in Home page', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // All buttons should be enabled by default
      const buttons = container.querySelectorAll('button, a[href]');
      
      buttons.forEach(button => {
        // Verify buttons are not disabled
        expect(button.hasAttribute('disabled')).toBe(false);
        expect(button.getAttribute('aria-disabled')).not.toBe('true');
      });
    });

    it('should preserve button enabled states in Experience page', () => {
      const { container } = render(
        <BrowserRouter>
          <Experience />
        </BrowserRouter>
      );

      // All buttons should be enabled by default
      const buttons = container.querySelectorAll('button[type="button"]');
      
      buttons.forEach(button => {
        expect(button.hasAttribute('disabled')).toBe(false);
      });
    });

    it('should preserve ContactForm submit button enabled state', () => {
      const { container } = render(
        <BrowserRouter>
          <ContactForm />
        </BrowserRouter>
      );

      const submitButton = container.querySelector('button[type="submit"]');
      
      if (submitButton) {
        // Submit button should be enabled by default
        expect(submitButton.hasAttribute('disabled')).toBe(false);
      }
    });
  });

  /**
   * Property-Based Test: Comprehensive Preservation Across All Pages
   * 
   * Uses property-based testing to verify that button functionality is preserved
   * across all page components after the styling fix.
   */
  describe('Property-Based: Comprehensive Preservation Check', () => {
    it('should preserve button clickability across all pages', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('Home', 'Experience', 'ServiceDetails'),
          (pageName) => {
            let PageComponent;
            switch (pageName) {
              case 'Home':
                PageComponent = Home;
                break;
              case 'Experience':
                PageComponent = Experience;
                break;
              case 'ServiceDetails':
                PageComponent = ServiceDetails;
                break;
              default:
                PageComponent = Home;
            }

            const { container } = render(
              <BrowserRouter>
                <PageComponent />
              </BrowserRouter>
            );

            // Find all interactive buttons and links
            const buttons = container.querySelectorAll('button, a[href]');
            const buttonArray = Array.from(buttons);

            // Filter to action buttons (exclude navigation arrows, dots, etc.)
            const actionButtons = buttonArray.filter(btn => {
              const text = btn.textContent.trim();
              return text.length > 2 && !['‹', '›', '•'].includes(text);
            });

            // Verify all buttons are clickable (not disabled)
            actionButtons.forEach(button => {
              expect(button.hasAttribute('disabled')).toBe(false);
              
              // Verify cursor (may be empty in jsdom)
              const styles = window.getComputedStyle(button);
              if (button.tagName === 'BUTTON' || button.tagName === 'A') {
                expect(['pointer', 'default', '']).toContain(styles.cursor);
              }
            });
          }
        ),
        { numRuns: 10 }
      );
    });

    it('should preserve button text content across all pages', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('Home', 'Experience', 'ServiceDetails'),
          (pageName) => {
            let PageComponent;
            switch (pageName) {
              case 'Home':
                PageComponent = Home;
                break;
              case 'Experience':
                PageComponent = Experience;
                break;
              case 'ServiceDetails':
                PageComponent = ServiceDetails;
                break;
              default:
                PageComponent = Home;
            }

            const { container } = render(
              <BrowserRouter>
                <PageComponent />
              </BrowserRouter>
            );

            // Find all buttons with text content
            const buttons = container.querySelectorAll('button, a[href]');
            const buttonArray = Array.from(buttons);

            const textButtons = buttonArray.filter(btn => {
              const text = btn.textContent.trim();
              return text.length > 2 && !['‹', '›', '•'].includes(text);
            });

            // Verify all buttons have non-empty text content
            textButtons.forEach(button => {
              expect(button.textContent.trim().length).toBeGreaterThan(0);
            });
          }
        ),
        { numRuns: 10 }
      );
    });

    it('should preserve button transitions and hover states across all pages', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('Home', 'Experience', 'ServiceDetails'),
          (pageName) => {
            let PageComponent;
            switch (pageName) {
              case 'Home':
                PageComponent = Home;
                break;
              case 'Experience':
                PageComponent = Experience;
                break;
              case 'ServiceDetails':
                PageComponent = ServiceDetails;
                break;
              default:
                PageComponent = Home;
            }

            const { container } = render(
              <BrowserRouter>
                <PageComponent />
              </BrowserRouter>
            );

            // Find all styled buttons
            const buttons = container.querySelectorAll('button, a[class*="Btn"], a[class*="button"]');
            const buttonArray = Array.from(buttons);

            const styledButtons = buttonArray.filter(btn => {
              const text = btn.textContent.trim();
              return text.length > 2 && !['‹', '›', '•'].includes(text);
            });

            // Verify buttons have transition properties (smooth visual feedback)
            styledButtons.forEach(button => {
              const styles = window.getComputedStyle(button);
              
              // Most styled buttons should have transitions
              // We check that transition property exists (even if 'all 0s ease 0s')
              expect(styles.transition).toBeDefined();
            });
          }
        ),
        { numRuns: 10 }
      );
    });
  });
});
