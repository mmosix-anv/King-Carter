# Fix Homepage Sections Styling - Bugfix Design

## Overview

The homepage contains two sections with CSS styling and layout defects: "Why King & Carter" and "Who We Are". The "Why King & Carter" section incorrectly implements a carousel pattern when it should display all 5 feature items in a horizontal row, and uses absolute positioning with hardcoded margins that cause alignment issues. The "Who We Are" section has excessive padding values and manual line breaks that create rigid, non-responsive text formatting. This fix will replace the carousel with a flexbox row layout, remove absolute positioning, normalize padding values to match the reference design, and allow text to flow naturally.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the styling defects - when rendering the "Why King & Carter" or "Who We Are" sections with incorrect CSS properties
- **Property (P)**: The desired behavior - sections should use flexbox layouts, consistent padding, natural text flow, and match reference design spacing
- **Preservation**: Existing responsive behavior, content display, font families, color schemes, and button functionality that must remain unchanged
- **Carousel Pattern**: The current implementation in "Why King & Carter" that shows one item at a time with navigation arrows
- **Absolute Positioning**: CSS positioning that removes elements from normal document flow, causing the alignment issues in feature text
- **Manual Line Breaks**: Hardcoded `<br>` tags or similar in "Who We Are" text that prevent natural text wrapping

## Bug Details

### Fault Condition

The bug manifests when the homepage sections are rendered with incorrect CSS properties. The styling system is either using the wrong layout pattern (carousel vs row), applying hardcoded positioning values that don't scale, or using excessive padding that doesn't match the design specifications.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type SectionRenderContext
  OUTPUT: boolean
  
  RETURN (input.sectionName == "Why King & Carter" AND 
          (input.layout == "carousel" OR
           input.padding == "106px 330px 139px" OR
           input.subtitlePosition.left == "243px" OR
           input.featureTextPosition.left == "52px"))
         OR
         (input.sectionName == "Who We Are" AND
          (input.padding == "135px 208px 91px" OR
           input.textContainsManualBreaks == true OR
           input.textMargin == "29px"))
END FUNCTION
```

### Examples

- **Why King & Carter - Carousel Issue**: User views homepage → sees carousel with arrows showing 1 of 5 items → Expected: all 5 items displayed in a horizontal row
- **Why King & Carter - Padding Issue**: Section renders with padding "106px 330px 139px" → creates uneven spacing → Expected: consistent, centered padding matching reference design
- **Why King & Carter - Subtitle Alignment**: Subtitle positioned with "left: 243px" → misaligned on different screen sizes → Expected: center-aligned subtitle without fixed margins
- **Why King & Carter - Absolute Positioning**: Feature text uses "left: 52px" absolute positioning → breaks layout flow → Expected: flexbox layout without absolute positioning
- **Who We Are - Excessive Padding**: Section renders with padding "135px 208px 91px" → too much whitespace → Expected: padding matching reference design proportions
- **Who We Are - Manual Line Breaks**: Text contains hardcoded breaks → rigid formatting → Expected: text flows naturally based on container width
- **Who We Are - Incorrect Margins**: Text elements have "29px" margins → spacing doesn't match design → Expected: margins matching reference spacing

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Mobile responsive behavior must continue to work (items wrap in "Why King & Carter", content stacks in "Who We Are")
- All text content must remain displayed correctly (section titles, subtitles, feature items, body text)
- Button functionality and hover effects must continue to work
- Font family (Inter) and color scheme must remain consistent
- Image display in "Who We Are" section must remain unchanged
- All 5 feature items in "Why King & Carter" must continue to display with correct content

**Scope:**
All rendering contexts that do NOT involve the specific CSS properties being fixed should be completely unaffected. This includes:
- Other homepage sections not mentioned in the requirements
- Navigation, footer, and other page components
- JavaScript functionality and interactivity
- Content management and data fetching

## Hypothesized Root Cause

Based on the bug description, the most likely issues are:

1. **Incorrect Component Choice**: The "Why King & Carter" section may be using a Carousel component when it should use a simple flex container
   - Developer may have initially prototyped with a carousel and never refactored
   - Component library may have been misapplied

2. **Hardcoded CSS Values**: Both sections use specific pixel values that don't match the design system
   - Padding values (106px 330px 139px, 135px 208px 91px) appear arbitrary
   - Positioning values (left: 243px, left: 52px) suggest manual adjustments rather than systematic layout
   - Margin value (29px) doesn't align with design token spacing

3. **Absolute Positioning Misuse**: Feature text in "Why King & Carter" uses absolute positioning
   - This removes elements from document flow
   - Causes alignment issues across different viewport sizes
   - Suggests a quick fix attempt rather than proper flexbox implementation

4. **Manual Content Formatting**: "Who We Are" text contains hardcoded line breaks
   - Content may have been copied from design mockup with breaks preserved
   - CMS or content entry process may be inserting breaks
   - Developer may have manually added breaks to match mockup at one screen size

## Correctness Properties

Property 1: Fault Condition - Homepage Sections Display Correct Layout and Spacing

_For any_ rendering context where the bug condition holds (isBugCondition returns true), the fixed styling SHALL display "Why King & Carter" with all 5 items in a flexbox row without carousel navigation, use consistent centered padding, center-align the subtitle without fixed margins, and avoid absolute positioning; and SHALL display "Who We Are" with padding matching reference design, naturally flowing text without manual breaks, and correct spacing between elements.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7**

Property 2: Preservation - Non-Styling Functionality and Content

_For any_ rendering context where the bug condition does NOT hold (isBugCondition returns false), the fixed code SHALL produce exactly the same behavior as the original code, preserving responsive mobile layouts, all text content display, button functionality and hover effects, font families, color schemes, and image display.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: Likely `src/components/Homepage.tsx` or similar component file, and associated CSS/styled-components

**Components**: "Why King & Carter" section and "Who We Are" section

**Specific Changes**:
1. **Replace Carousel with Flex Row**: Remove carousel component/logic from "Why King & Carter"
   - Replace with a flex container: `display: flex; flex-direction: row; justify-content: center;`
   - Ensure all 5 items render as direct children
   - Add `flex-wrap: wrap` for responsive behavior

2. **Normalize Padding Values**: Update padding to match reference design
   - "Why King & Carter": Replace `padding: 106px 330px 139px` with consistent values (e.g., `padding: 80px 40px` or design system tokens)
   - "Who We Are": Replace `padding: 135px 208px 91px` with consistent values matching reference proportions

3. **Fix Subtitle Alignment**: Remove fixed positioning from subtitle
   - Remove `left: 243px` or similar positioning
   - Use `text-align: center` or flexbox centering on parent container
   - Ensure subtitle is in normal document flow

4. **Remove Absolute Positioning**: Convert feature text to flexbox layout
   - Remove `position: absolute; left: 52px` from feature items
   - Use flexbox properties for spacing: `gap`, `padding`, or `margin`
   - Ensure items are in normal document flow

5. **Remove Manual Line Breaks**: Clean up "Who We Are" text content
   - Remove `<br>` tags or `\n` characters from text strings
   - Allow text to wrap naturally based on container width
   - Ensure paragraph elements handle text flow

6. **Update Text Margins**: Adjust spacing between text elements in "Who We Are"
   - Replace `margin: 29px` with values matching reference design
   - Use consistent spacing tokens (e.g., `margin-bottom: 24px` or `1.5rem`)

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the styling bugs on unfixed code by capturing screenshots and computed styles, then verify the fix produces correct layouts and preserves existing functionality across different viewport sizes.

### Exploratory Fault Condition Checking

**Goal**: Surface counterexamples that demonstrate the styling bugs BEFORE implementing the fix. Confirm or refute the root cause analysis by inspecting the actual DOM structure and CSS properties. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that render the homepage sections and inspect computed styles, DOM structure, and visual layout. Capture screenshots at different viewport sizes. Run these tests on the UNFIXED code to observe the defects and confirm root causes.

**Test Cases**:
1. **Carousel Detection Test**: Render "Why King & Carter" section and check for carousel navigation elements (will find carousel on unfixed code)
2. **Padding Inspection Test**: Query computed padding values for both sections (will show 106px 330px 139px and 135px 208px 91px on unfixed code)
3. **Positioning Inspection Test**: Check for absolute positioning on subtitle and feature text (will find left: 243px and left: 52px on unfixed code)
4. **Line Break Detection Test**: Inspect "Who We Are" text content for `<br>` tags or manual breaks (will find breaks on unfixed code)
5. **Visual Layout Test**: Capture screenshots showing only 1 item visible in carousel vs all 5 items (will show carousel behavior on unfixed code)

**Expected Counterexamples**:
- Carousel component renders with navigation arrows and shows 1 of 5 items
- Computed styles show exact padding values: 106px 330px 139px and 135px 208px 91px
- Subtitle and feature text have absolute positioning with hardcoded left values
- Text content contains manual line breaks preventing natural flow
- Possible causes: wrong component used, hardcoded CSS values, absolute positioning misuse, manual content formatting

### Fix Checking

**Goal**: Verify that for all rendering contexts where the bug condition holds, the fixed styling produces the expected layout and spacing.

**Pseudocode:**
```
FOR ALL context WHERE isBugCondition(context) DO
  result := renderSections_fixed(context)
  ASSERT expectedBehavior(result)
  // All 5 items visible in row
  // Consistent padding matching reference
  // Centered subtitle without fixed positioning
  // Flexbox layout without absolute positioning
  // Natural text flow without manual breaks
  // Correct spacing matching reference
END FOR
```

### Preservation Checking

**Goal**: Verify that for all rendering contexts where the bug condition does NOT hold, the fixed code produces the same result as the original code.

**Pseudocode:**
```
FOR ALL context WHERE NOT isBugCondition(context) DO
  ASSERT renderSections_original(context) = renderSections_fixed(context)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across different viewport sizes and contexts
- It catches edge cases like specific mobile breakpoints that manual tests might miss
- It provides strong guarantees that responsive behavior, content display, and functionality are unchanged

**Test Plan**: Observe behavior on UNFIXED code first for mobile responsive layouts, button interactions, and content display, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Mobile Responsive Preservation**: Observe that items wrap on mobile in unfixed code, verify this continues after fix
2. **Content Display Preservation**: Observe all text content displays correctly on unfixed code, verify nothing is lost after fix
3. **Button Functionality Preservation**: Observe button hover effects and click behavior on unfixed code, verify unchanged after fix
4. **Font and Color Preservation**: Observe Inter font and color scheme on unfixed code, verify consistency after fix

### Unit Tests

- Test that "Why King & Carter" renders 5 items without carousel component
- Test that computed padding values match reference design specifications
- Test that subtitle is centered without absolute positioning
- Test that feature items use flexbox layout
- Test that "Who We Are" text contains no manual line breaks
- Test that text margins match reference design values

### Property-Based Tests

- Generate random viewport widths and verify all 5 items remain visible (no carousel)
- Generate random content lengths and verify text flows naturally without breaks
- Generate random screen sizes and verify responsive wrapping behavior is preserved
- Test that padding scales appropriately across viewport range

### Integration Tests

- Test full homepage render with both sections displaying correct layouts
- Test responsive behavior at mobile, tablet, and desktop breakpoints
- Test that visual spacing matches reference design screenshots
- Test that button interactions work correctly in "Who We Are" section
- Test that no layout shifts occur during page load
