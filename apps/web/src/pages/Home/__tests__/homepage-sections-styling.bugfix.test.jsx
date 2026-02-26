import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../index';

/**
 * Bug Condition Exploration Test
 * 
 * **Validates: Requirements 1.1, 1.6 (Primary bugs), 1.2, 1.3, 1.4, 1.5, 1.7 (CSS issues)**
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bugs exist.
 * 
 * This test verifies the EXPECTED BEHAVIOR (correct state after fix):
 * - "Why King & Carter" section should display all 5 items in a row without carousel
 * - "Who We Are" text should flow naturally (not contain manual line breaks)
 * 
 * COUNTEREXAMPLES FOUND ON UNFIXED CODE:
 * 1. Carousel navigation: Found 2 buttons (Previous/Next) - should have 0
 * 2. Manual line breaks: Found 3 <br> tags in "Who We Are" - should have 0
 * 
 * NOTE: CSS styling issues (padding, margins, positioning) exist in SCSS files but
 * cannot be fully validated in JSDOM environment. These will be verified visually
 * and through browser-based testing.
 * 
 * When run on UNFIXED code, this test will FAIL, proving the bugs exist.
 * When run on FIXED code, this test will PASS, confirming the fix works.
 */
describe('Homepage Sections Styling - Bug Condition Exploration', () => {
  const renderHome = () => {
    return render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  };

  describe('Why King & Carter Section - Bug Conditions', () => {
    it('should display all 5 feature items without carousel navigation', () => {
      const { container } = renderHome();
      
      // Find the "Why King & Carter" section
      const whySection = screen.getByText('Why King & Carter').closest('section');
      expect(whySection).toBeInTheDocument();
      
      // EXPECTED BEHAVIOR: All 5 items should be visible (no carousel)
      // BUG CONDITION: Currently shows carousel with navigation buttons
      // COUNTEREXAMPLE: Found 2 carousel buttons (Previous and Next)
      const carouselButtons = whySection.querySelectorAll('button[aria-label="Previous"], button[aria-label="Next"]');
      expect(carouselButtons.length).toBe(0); // Should have NO carousel buttons
      
      // EXPECTED BEHAVIOR: All 5 feature items should be rendered simultaneously
      // BUG CONDITION: Only 1 item visible at a time due to carousel state management
      const featureItems = [
        'Professional experience',
        'Discreet, reliable, and',
        'Clean, modern vehicles',
        'Personalized coordination',
        'A brand rooted in'
      ];
      
      // All items should be visible in the DOM (not hidden by carousel logic)
      featureItems.forEach(text => {
        const elements = screen.queryAllByText(text, { exact: false });
        expect(elements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Who We Are Section - Bug Conditions', () => {
    it('should allow text to flow naturally without manual line breaks', () => {
      const { container } = renderHome();
      
      // Find the "Who We Are" section
      const whoWeAreSection = screen.getByText('Who We Are').closest('div[class*="foundersSection"]');
      
      // EXPECTED BEHAVIOR: Text flows naturally without <br> tags
      // BUG CONDITION: Manual line breaks in text content
      // COUNTEREXAMPLE: Found 3 <br> tags in the section
      const brTags = whoWeAreSection.querySelectorAll('br');
      
      expect(brTags.length).toBe(0); // Should have NO manual line breaks
    });
  });
});
