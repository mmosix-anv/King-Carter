import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import fc from 'fast-check';
import Home from '../pages/Home/index.jsx';
import Experience from '../pages/Experience/index.jsx';
import ServiceDetails from '../pages/ServiceDetails/index.jsx';
import ContactForm from '../components/ContactForm/index.jsx';

/**
 * Bug Condition Exploration Test - Inconsistent Button Styling
 * 
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4**
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * 
 * This test encodes the EXPECTED behavior (consistent styling) and will validate
 * the fix when it passes after implementation. Currently, it should FAIL because
 * buttons have inconsistent border-radius values (50px, 999px, 25px, or none) and
 * inconsistent background colors (#000, #191919, #111111).
 * 
 * Expected behavior after fix:
 * - All buttons should have border-radius: 50px
 * - Primary buttons should have background: #000 (or rgb(0, 0, 0))
 * - Secondary buttons should have transparent background
 * 
 * COUNTEREXAMPLES FOUND (documented from test failures):
 * - Experience page secondaryCta: border-radius 999px (should be 50px)
 * - Experience page cardCta: border-radius 999px (should be 50px)
 * - Experience page submitButton: border-radius 999px, background #111111 (should be 50px, #000)
 * - ContactForm submitBtn: border-radius 25px (should be 50px)
 * - ServiceDetails ctaButton: no border-radius, background #191919 (should be 50px, #000)
 * - Home page buttons: border-radius inconsistent across different buttons
 */

describe('Bug Condition Exploration - Inconsistent Button Styling', () => {
  /**
   * Helper function to check if a button has the bug condition
   * Returns true if button has non-standard styling
   */
  const isBugCondition = (element) => {
    const styles = window.getComputedStyle(element);
    const borderRadius = styles.borderRadius;
    const backgroundColor = styles.backgroundColor;
    
    // Check if border-radius is non-standard (not 50px)
    const hasNonStandardRadius = 
      borderRadius === '999px' || 
      borderRadius === '25px' || 
      borderRadius === '0px' ||
      borderRadius === 'none' ||
      !borderRadius.includes('50px');
    
    // Check if primary button (solid background) has non-standard color
    const isNotTransparent = backgroundColor !== 'transparent' && 
                             backgroundColor !== 'rgba(0, 0, 0, 0)';
    const hasNonStandardPrimaryColor = isNotTransparent && 
      backgroundColor !== 'rgb(0, 0, 0)' && 
      backgroundColor !== '#000' &&
      backgroundColor !== '#000000';
    
    return hasNonStandardRadius || hasNonStandardPrimaryColor;
  };

  /**
   * Property 1: Fault Condition - Inconsistent Button Styling
   * 
   * Tests that buttons where isBugCondition(button) returns true have non-standard styling.
   * This test is EXPECTED TO FAIL on unfixed code, proving the bug exists.
   */
  describe('Property 1: Fault Condition - Inconsistent Button Styling', () => {
    it('should detect inconsistent border-radius in Experience page secondaryCta buttons', () => {
      const { container } = render(
        <BrowserRouter>
          <Experience />
        </BrowserRouter>
      );

      // Find secondaryCta buttons in Experience page
      const buttons = container.querySelectorAll('button');
      const secondaryButtons = Array.from(buttons).filter(btn => 
        btn.textContent.includes('Become a member') || 
        btn.textContent.includes('Corporate membership')
      );

      expect(secondaryButtons.length).toBeGreaterThan(0);

      secondaryButtons.forEach(button => {
        const styles = window.getComputedStyle(button);
        const borderRadius = styles.borderRadius;
        
        // EXPECTED BEHAVIOR: border-radius should be 50px
        // CURRENT BUG: border-radius is 999px
        expect(borderRadius).toBe('50px');
      });
    });

    it('should detect inconsistent border-radius in Experience page cardCta buttons', () => {
      const { container } = render(
        <BrowserRouter>
          <Experience />
        </BrowserRouter>
      );

      // Find cardCta buttons
      const buttons = container.querySelectorAll('button');
      const cardButtons = Array.from(buttons).filter(btn => 
        btn.textContent === 'Learn more'
      );

      expect(cardButtons.length).toBeGreaterThan(0);

      cardButtons.forEach(button => {
        const styles = window.getComputedStyle(button);
        const borderRadius = styles.borderRadius;
        
        // EXPECTED BEHAVIOR: border-radius should be 50px
        // CURRENT BUG: border-radius is 999px
        expect(borderRadius).toBe('50px');
      });
    });

    it('should detect inconsistent border-radius and background in Experience page submitButton', () => {
      const { container } = render(
        <BrowserRouter>
          <Experience />
        </BrowserRouter>
      );

      // Find submitButton in the form section
      const buttons = container.querySelectorAll('button');
      const submitButtons = Array.from(buttons).filter(btn => 
        btn.type === 'submit' || btn.textContent.toLowerCase().includes('submit')
      );

      if (submitButtons.length > 0) {
        submitButtons.forEach(button => {
          const styles = window.getComputedStyle(button);
          const borderRadius = styles.borderRadius;
          const backgroundColor = styles.backgroundColor;
          
          // EXPECTED BEHAVIOR: border-radius should be 50px, background should be rgb(0, 0, 0)
          // CURRENT BUG: border-radius is 999px, background is rgb(17, 17, 17) (#111111)
          expect(borderRadius).toBe('50px');
          
          // Check if it's a primary button (not transparent)
          if (backgroundColor !== 'transparent' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
            expect(backgroundColor).toBe('rgb(0, 0, 0)');
          }
        });
      }
    });

    it('should detect inconsistent border-radius in ContactForm submitBtn', () => {
      const { container } = render(
        <BrowserRouter>
          <ContactForm />
        </BrowserRouter>
      );

      // Find submit button
      const submitButton = container.querySelector('button[type="submit"]');
      
      if (submitButton) {
        const styles = window.getComputedStyle(submitButton);
        const borderRadius = styles.borderRadius;
        
        // EXPECTED BEHAVIOR: border-radius should be 50px
        // CURRENT BUG: border-radius is 25px
        expect(borderRadius).toBe('50px');
      }
    });

    it('should detect missing border-radius and non-standard background in ServiceDetails ctaButton', () => {
      const { container } = render(
        <BrowserRouter>
          <ServiceDetails />
        </BrowserRouter>
      );

      // Find CTA button in ServiceDetails
      const buttons = container.querySelectorAll('button');
      const ctaButtons = Array.from(buttons).filter(btn => {
        const styles = window.getComputedStyle(btn);
        return styles.backgroundColor === 'rgb(25, 25, 25)' || // #191919
               btn.textContent.toLowerCase().includes('book') ||
               btn.textContent.toLowerCase().includes('enquire');
      });

      if (ctaButtons.length > 0) {
        ctaButtons.forEach(button => {
          const styles = window.getComputedStyle(button);
          const borderRadius = styles.borderRadius;
          const backgroundColor = styles.backgroundColor;
          
          // EXPECTED BEHAVIOR: border-radius should be 50px, background should be rgb(0, 0, 0)
          // CURRENT BUG: no border-radius, background is rgb(25, 25, 25) (#191919)
          expect(borderRadius).toBe('50px');
          
          // Check if it's a primary button (not transparent)
          if (backgroundColor !== 'transparent' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
            expect(backgroundColor).toBe('rgb(0, 0, 0)');
          }
        });
      }
    });

    it('should detect inconsistent border-radius in Home page bookExperienceBtn (baseline correct)', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // Find the "Book an Experience" button
      const bookButton = Array.from(container.querySelectorAll('a')).find(link => 
        link.textContent === 'Book an Experience'
      );

      if (bookButton) {
        const styles = window.getComputedStyle(bookButton);
        const borderRadius = styles.borderRadius;
        const backgroundColor = styles.backgroundColor;
        
        // This button should already be correct (50px and rgb(0, 0, 0))
        expect(borderRadius).toBe('50px');
        expect(backgroundColor).toBe('rgb(0, 0, 0)');
      }
    });
  });

  /**
   * Property-Based Test: Scoped Bug Condition Check
   * 
   * Uses property-based testing to verify that ALL buttons in the application
   * should have consistent styling (50px border-radius, standard colors).
   * 
   * This test generates different page components and checks their buttons.
   */
  describe('Property-Based: Scoped Bug Condition Across Components', () => {
    it('should verify all buttons have consistent border-radius of 50px', () => {
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

            // Find all buttons and styled links that act as buttons
            const buttons = container.querySelectorAll('button, a[class*="Btn"], a[class*="button"], a[class*="cta"]');
            const buttonArray = Array.from(buttons);

            // Filter out navigation/utility buttons (arrows, dots, etc.)
            const actionButtons = buttonArray.filter(btn => {
              const text = btn.textContent.trim();
              return text.length > 2 && !['‹', '›', '•'].includes(text);
            });

            // Check each button for consistent styling
            actionButtons.forEach(button => {
              const styles = window.getComputedStyle(button);
              const borderRadius = styles.borderRadius;
              
              // EXPECTED: All buttons should have 50px border-radius
              // This will FAIL on unfixed code, documenting the bug
              expect(borderRadius).toBe('50px');
            });
          }
        ),
        { numRuns: 10 } // Run 10 times to check all page combinations
      );
    });

    it('should verify all primary buttons have consistent background color', () => {
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

            // Find all buttons with solid backgrounds (primary buttons)
            const buttons = container.querySelectorAll('button, a[class*="Btn"], a[class*="button"]');
            const buttonArray = Array.from(buttons);

            const primaryButtons = buttonArray.filter(btn => {
              const styles = window.getComputedStyle(btn);
              const bg = styles.backgroundColor;
              // Primary buttons have solid backgrounds (not transparent)
              return bg !== 'transparent' && 
                     bg !== 'rgba(0, 0, 0, 0)' &&
                     bg !== '' &&
                     btn.textContent.trim().length > 2;
            });

            // Check each primary button for consistent background color
            primaryButtons.forEach(button => {
              const styles = window.getComputedStyle(button);
              const backgroundColor = styles.backgroundColor;
              
              // EXPECTED: All primary buttons should have rgb(0, 0, 0) background
              // This will FAIL on unfixed code where some have rgb(25, 25, 25) or rgb(17, 17, 17)
              expect(backgroundColor).toBe('rgb(0, 0, 0)');
            });
          }
        ),
        { numRuns: 10 }
      );
    });
  });
});
