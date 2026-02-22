# Implementation Plan: Dynamic Service Pages

## Overview

This implementation plan transforms the existing static ServiceDetails page into a dynamic, data-driven system that renders four distinct luxury transportation service pages. The approach follows an incremental pattern: create the data layer, refactor the component to be dynamic, configure routing, add error handling, and integrate navigation. Each step builds on the previous work and validates functionality through code execution.

## Tasks

- [x] 1. Create centralized service data structure
  - Create `src/data/services.js` file with servicesData object
  - Define all four services with complete data: private-luxury-transport, corporate-executive-travel, airport-hotel-transfers, special-engagements-events
  - Include all required fields: id, heroTitle, heroTagline, heroImage, description (1-5 paragraphs), highlights (3-10 items), images (5-10 URLs), cta object with text and buttonLabel
  - Implement `getServiceById(serviceId)` helper function
  - Add JSDoc type definitions for ServiceData structure
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 7.5, 8.5_

- [x] 1.1 Write property test for service data structure completeness
  - **Property 1: Service Data Structure Completeness**
  - **Validates: Requirements 1.2, 1.3, 1.4, 1.5, 8.5**
  - Use fast-check to verify all services have required fields with correct types and constraints
  - Tag: `Feature: dynamic-service-pages, Property 1: Service Data Structure Completeness`

- [x] 2. Refactor ServiceDetails component to be dynamic
  - Import `useParams` and `useNavigate` hooks from react-router-dom
  - Import `getServiceById` from `src/data/services.js`
  - Extract serviceId from URL parameters using `useParams()`
  - Retrieve service data using `getServiceById(serviceId)`
  - Replace all hardcoded content with dynamic data from serviceData object
  - Update hero section to use `serviceData.heroTitle`, `serviceData.heroTagline`, and `serviceData.heroImage`
  - Update description section to map over `serviceData.description` array
  - Update highlights section to map over `serviceData.highlights` array
  - Update gallery section to map over `serviceData.images` array with proper primary/secondary CSS classes
  - Update CTA section to use `serviceData.cta.text` and `serviceData.cta.buttonLabel`
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 8.1, 8.2, 8.3, 9.1, 9.2_

- [x] 2.1 Write property test for data retrieval
  - **Property 5: Data Retrieval**
  - **Validates: Requirements 3.1**
  - Use fast-check to verify getServiceById returns non-null data for all valid service IDs
  - Tag: `Feature: dynamic-service-pages, Property 5: Data Retrieval`

- [x] 2.2 Write property test for complete content rendering
  - **Property 6: Complete Content Rendering**
  - **Validates: Requirements 3.2, 3.3, 3.4, 3.5, 8.1, 8.2**
  - Use fast-check to verify rendered component contains all content fields from service data
  - Tag: `Feature: dynamic-service-pages, Property 6: Complete Content Rendering`

- [x] 2.3 Write property test for image gallery rendering with alt text
  - **Property 7: Image Gallery Rendering with Alt Text**
  - **Validates: Requirements 8.2, 8.4**
  - Use fast-check to verify all rendered img elements have non-empty alt attributes
  - Tag: `Feature: dynamic-service-pages, Property 7: Image Gallery Rendering with Alt Text`

- [x] 2.4 Write property test for gallery layout structure
  - **Property 8: Gallery Layout Structure**
  - **Validates: Requirements 8.3**
  - Use fast-check to verify first image has primary class, remaining images have secondary class
  - Tag: `Feature: dynamic-service-pages, Property 8: Gallery Layout Structure`

- [x] 2.5 Write unit tests for ServiceDetails component
  - Test that Layout wrapper is rendered
  - Test that useParams hook correctly extracts serviceId
  - Test that all content sections render with service data
  - Test that images have descriptive alt attributes
  - Test defensive rendering with optional chaining for missing fields
  - _Requirements: 3.2, 3.3, 3.4, 3.5, 8.4_

- [x] 3. Implement error handling for invalid service IDs
  - Add useEffect hook to detect null serviceData
  - Implement redirect to home page ("/") using navigate() when serviceData is null
  - Use `replace: true` option to prevent back button issues
  - Return null during redirect to avoid rendering invalid content
  - Add optional chaining and fallback values for defensive rendering
  - _Requirements: 2.2, 3.6_

- [x] 3.1 Write property test for invalid service ID handling
  - **Property 3: Invalid Service ID Handling**
  - **Validates: Requirements 2.2**
  - Use fast-check to generate random strings excluding valid service IDs
  - Verify getServiceById returns null for invalid IDs
  - Tag: `Feature: dynamic-service-pages, Property 3: Invalid Service ID Handling`

- [x] 3.2 Write unit tests for error handling
  - Test redirect behavior with null service data
  - Test that component returns null while redirecting
  - Test fallback rendering for missing optional fields
  - _Requirements: 2.2, 3.6_

- [x] 4. Configure dynamic routing in App.jsx
  - Import ServiceDetails component
  - Add dynamic route: `<Route path="/services/:serviceId" element={<ServiceDetails />} />`
  - Add redirect from old route: `<Route path="/service-details" element={<Navigate to="/services/private-luxury-transport" replace />} />`
  - Ensure route is placed correctly within Routes component
  - _Requirements: 2.1, 2.3, 2.4, 10.1, 10.2, 10.3, 10.4_

- [x] 4.1 Write property test for valid service ID routing
  - **Property 2: Valid Service ID Routing**
  - **Validates: Requirements 2.1, 2.3**
  - Use fast-check to select from valid service IDs
  - Verify rendering component with each ID produces non-null service data
  - Tag: `Feature: dynamic-service-pages, Property 2: Valid Service ID Routing`

- [x] 4.2 Write property test for client-side navigation
  - **Property 4: Client-Side Navigation**
  - **Validates: Requirements 2.4**
  - Use fast-check to generate pairs of valid service IDs
  - Verify navigating between services updates content without page reload
  - Tag: `Feature: dynamic-service-pages, Property 4: Client-Side Navigation`

- [x] 4.3 Write property test for navigation URL updates
  - **Property 9: Navigation URL Updates**
  - **Validates: Requirements 10.1, 10.2, 10.3**
  - Use fast-check to select from valid service IDs
  - Verify navigating to service updates URL to match pattern /services/:serviceId
  - Tag: `Feature: dynamic-service-pages, Property 9: Navigation URL Updates`

- [x] 4.4 Write property test for browser history navigation
  - **Property 10: Browser History Navigation**
  - **Validates: Requirements 10.4**
  - Use fast-check to generate sequence of valid service IDs
  - Verify back/forward navigation renders correct services in order
  - Tag: `Feature: dynamic-service-pages, Property 10: Browser History Navigation`

- [x] 4.5 Write integration tests for routing
  - Test that all four service routes render correctly
  - Test that old /service-details route redirects to valid service
  - Test browser back/forward navigation between services
  - _Requirements: 2.1, 2.3, 2.4, 10.4_

- [x] 5. Checkpoint - Verify core functionality
  - Manually test all four service pages in browser: /services/private-luxury-transport, /services/corporate-executive-travel, /services/airport-hotel-transfers, /services/special-engagements-events
  - Verify each page displays correct content (title, tagline, description, highlights, images, CTA)
  - Test invalid service ID redirects to home page
  - Test browser back/forward navigation
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Update navigation links throughout the application
  - Search for any existing links to /service-details
  - Update links to use new dynamic route pattern: /services/:serviceId
  - Ensure all service links use correct service identifiers
  - Test navigation from other pages (e.g., home page, services overview)
  - _Requirements: 10.1, 10.2_

- [x] 6.1 Write unit tests for navigation integration
  - Test that service links navigate to correct URLs
  - Test that clicking service links updates the URL
  - _Requirements: 10.1, 10.2_

- [x] 7. Verify responsive layout preservation
  - Confirm all existing CSS module styles are still applied
  - Test mobile viewport rendering (single column layout)
  - Test desktop viewport rendering (grid gallery layout)
  - Verify no visual regressions from refactoring
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 7.1 Write unit tests for responsive behavior
  - Test that CSS module classes are applied correctly
  - Test gallery layout structure (primary and secondary images)
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 8. Final checkpoint - Complete validation
  - Run all tests (unit tests and property tests)
  - Verify all four services render correctly with complete content
  - Test all navigation scenarios (direct URL, links, back/forward)
  - Test error handling with invalid service IDs
  - Verify responsive behavior on multiple viewport sizes
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests use fast-check library with minimum 100 iterations
- All property tests are tagged with feature name and property number
- Checkpoints ensure incremental validation at key milestones
- The implementation maintains all existing responsive behaviors and styling
- Service data is bundled with the application (no API calls required)
