# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Fault Condition** - Inconsistent Button Styling
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate inconsistent border-radius and background-color values
  - **Scoped PBT Approach**: Scope the property to concrete failing cases across known button elements
  - Navigate through the application and use browser DevTools to inspect button elements
  - Test that buttons where isBugCondition(button) returns true have non-standard styling:
    - Experience page secondaryCta: border-radius should be 999px (not 50px)
    - Experience page submitButton: border-radius should be 999px and background should be #111111 (not 50px and #000)
    - ContactForm submitBtn: border-radius should be 25px (not 50px)
    - ServiceDetails ctaButton: no border-radius and background #191919 (not 50px and #000)
    - MapSection buttons: border-radius should be 999px (not 50px)
    - InfoSection buttons: border-radius should be 999px (not 50px)
    - Hero buttons: border-radius should be 999px (not 50px)
    - AppDownload buttons: border-radius should be 999px (not 50px)
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found (specific border-radius and background-color values that differ from standard)
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Button Functionality and Visual Feedback
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for all button interactions
  - Document current click behavior for each button (navigation, form submission, actions)
  - Document current hover states (transitions, color changes, transforms)
  - Document current disabled states where applicable
  - Write tests capturing observed behavior patterns:
    - Click handlers trigger the same actions and navigation
    - Hover states provide visual feedback with smooth transitions
    - Disabled states prevent interaction appropriately
    - Button text content and labels remain unchanged
    - Button padding and spacing maintain touch targets
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 3. Fix for inconsistent button styling

  - [x] 3.1 Update Experience page button styles
    - Open src/pages/Experience/index.module.scss
    - Change `.secondaryCta` border-radius from `999px` to `50px`
    - Change `.cardCta` border-radius from `999px` to `50px`
    - Change `.submitButton` border-radius from `999px` to `50px`
    - Change `.submitButton` background from `#111111` to `#000`
    - Change other button border-radius values from `999px` to `50px`
    - _Bug_Condition: isBugCondition(button) where button.borderRadius IN ['999px'] OR button.backgroundColor = '#111111'_
    - _Expected_Behavior: button.borderRadius = '50px' AND button.backgroundColor = '#000' for primary buttons_
    - _Preservation: Button click handlers, hover states, disabled states, text content remain unchanged_
    - _Requirements: 2.1, 2.2, 2.4_

  - [x] 3.2 Update ContactForm button styles
    - Open src/components/ContactForm/index.module.scss
    - Change `.submitBtn` border-radius from `25px` to `50px`
    - _Bug_Condition: isBugCondition(button) where button.borderRadius = '25px'_
    - _Expected_Behavior: button.borderRadius = '50px'_
    - _Preservation: Form submission behavior and button functionality remain unchanged_
    - _Requirements: 2.1, 2.4_

  - [x] 3.3 Update ServiceDetails button styles
    - Open src/pages/ServiceDetails/index.module.scss
    - Add `border-radius: 50px` to `.ctaButton`
    - Change `.ctaButton` background from `#191919` to `#000`
    - Update hover state background accordingly
    - _Bug_Condition: isBugCondition(button) where button.borderRadius = 'none' OR button.backgroundColor = '#191919'_
    - _Expected_Behavior: button.borderRadius = '50px' AND button.backgroundColor = '#000'_
    - _Preservation: Button navigation and hover transitions remain unchanged_
    - _Requirements: 2.1, 2.2, 2.4_

  - [x] 3.4 Update MapSection button styles
    - Open src/components/MapSection/MapSection.module.scss
    - Change button border-radius from `999px` to `50px`
    - _Bug_Condition: isBugCondition(button) where button.borderRadius = '999px'_
    - _Expected_Behavior: button.borderRadius = '50px'_
    - _Preservation: Button functionality and interactions remain unchanged_
    - _Requirements: 2.1, 2.4_

  - [x] 3.5 Update InfoSection button styles
    - Open src/components/InfoSection/InfoSection.module.scss
    - Change button border-radius from `999px` to `50px`
    - _Bug_Condition: isBugCondition(button) where button.borderRadius = '999px'_
    - _Expected_Behavior: button.borderRadius = '50px'_
    - _Preservation: Button functionality and interactions remain unchanged_
    - _Requirements: 2.1, 2.4_

  - [x] 3.6 Update Hero button styles
    - Open src/components/Hero/Hero.module.scss
    - Change button border-radius from `999px` to `50px`
    - _Bug_Condition: isBugCondition(button) where button.borderRadius = '999px'_
    - _Expected_Behavior: button.borderRadius = '50px'_
    - _Preservation: Button functionality and interactions remain unchanged_
    - _Requirements: 2.1, 2.4_

  - [x] 3.7 Update AppDownload button styles
    - Open src/components/AppDownload/AppDownload.module.scss
    - Change button border-radius from `999px` to `50px`
    - _Bug_Condition: isBugCondition(button) where button.borderRadius = '999px'_
    - _Expected_Behavior: button.borderRadius = '50px'_
    - _Preservation: Button functionality and interactions remain unchanged_
    - _Requirements: 2.1, 2.4_

  - [x] 3.8 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Consistent Button Styling
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Inspect all previously failing buttons and verify:
      - All buttons now have border-radius: 50px
      - Primary buttons now have background-color: #000
      - Secondary buttons maintain transparent backgrounds
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 3.9 Verify preservation tests still pass
    - **Property 2: Preservation** - Button Functionality and Visual Feedback
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - Verify all button click handlers still work correctly
    - Verify all hover states and transitions are preserved
    - Verify disabled states still function properly
    - Verify button text and spacing remain unchanged
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
