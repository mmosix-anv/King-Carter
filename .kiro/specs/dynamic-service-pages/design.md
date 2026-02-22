# Design Document: Dynamic Service Pages

## Overview

This design transforms the existing static ServiceDetails page into a dynamic, data-driven system that renders four distinct luxury transportation service pages. The solution leverages React Router's dynamic routing capabilities with URL parameters, a centralized service data structure, and the existing component architecture to create maintainable, scalable service pages.

The design maintains the existing visual presentation and responsive behavior while introducing data-driven content rendering. Each service page will be accessible via a unique URL pattern (`/services/:serviceId`) and will dynamically render service-specific content including hero sections, descriptions, highlights, image galleries, and calls-to-action.

### Key Design Principles

- **Data-Driven Architecture**: Centralize all service content in a single data structure for easy maintenance
- **Component Reusability**: Transform the existing ServiceDetails component into a dynamic template
- **URL-Based Navigation**: Use React Router's dynamic routing for clean, bookmarkable URLs
- **Responsive Preservation**: Maintain all existing responsive behaviors and styling
- **Graceful Degradation**: Handle invalid routes and missing data appropriately

## Architecture

### System Components

The system consists of four primary architectural layers:

1. **Routing Layer**: React Router configuration with dynamic route parameters
2. **Data Layer**: Centralized service data structure with typed content
3. **Presentation Layer**: Dynamic ServiceDetails component that renders based on route parameters
4. **Navigation Layer**: Integration points for linking to service pages from other components

### Component Hierarchy

```
App (Router)
  └── Route: /services/:serviceId
        └── ServiceDetails (Dynamic Component)
              ├── Layout (Existing wrapper)
              ├── Hero Section (Dynamic background + title)
              ├── Description Section (Dynamic tagline + paragraphs)
              ├── Highlights Section (Dynamic bullet list)
              ├── Gallery Section (Dynamic images)
              └── CTA Section (Dynamic text + button)
```

### Data Flow

1. User navigates to `/services/:serviceId`
2. React Router extracts `serviceId` parameter from URL
3. ServiceDetails component receives `serviceId` via `useParams()` hook
4. Component queries service data store using `serviceId`
5. If service found: render dynamic content
6. If service not found: redirect to 404 or home page
7. Component renders with service-specific data

### Technology Stack

- **React 19.2.0**: Component framework
- **React Router DOM 7.13.0**: Client-side routing with dynamic parameters
- **Vite**: Build tool and development server
- **SCSS Modules**: Component-scoped styling (existing pattern)
- **JavaScript (ES6+)**: Implementation language

## Components and Interfaces

### Service Data Structure

The service data will be stored in a JavaScript module that exports a structured object. This approach provides type safety through JSDoc comments and enables easy imports throughout the application.

**File Location**: `src/data/services.js`

**Data Schema**:

```javascript
/**
 * @typedef {Object} ServiceData
 * @property {string} id - Unique identifier in kebab-case
 * @property {string} heroTitle - Main title displayed in hero section
 * @property {string} heroTagline - Subtitle/tagline in hero or description
 * @property {string} heroImage - URL to hero background image
 * @property {string[]} description - Array of paragraph strings
 * @property {string[]} highlights - Array of service highlight strings
 * @property {string[]} images - Array of image URLs for gallery (5-10 images)
 * @property {Object} cta - Call-to-action configuration
 * @property {string} cta.text - CTA promotional text
 * @property {string} cta.buttonLabel - Text for CTA button
 */

/**
 * Service data store containing all service information
 * @type {Object.<string, ServiceData>}
 */
export const servicesData = {
  'private-luxury-transport': { /* ... */ },
  'corporate-executive-travel': { /* ... */ },
  'airport-hotel-transfers': { /* ... */ },
  'special-engagements-events': { /* ... */ }
};

/**
 * Retrieves service data by ID
 * @param {string} serviceId - The service identifier
 * @returns {ServiceData|null} Service data or null if not found
 */
export const getServiceById = (serviceId) => {
  return servicesData[serviceId] || null;
};
```

### Dynamic ServiceDetails Component

The ServiceDetails component will be refactored to accept dynamic data through React Router's `useParams` hook.

**Component Interface**:

```javascript
/**
 * Dynamic service details page component
 * Renders service-specific content based on URL parameter
 * 
 * Route: /services/:serviceId
 * 
 * @component
 * @returns {JSX.Element} Rendered service page or redirect
 */
const ServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const serviceData = getServiceById(serviceId);
  
  // Handle invalid service ID
  if (!serviceData) {
    // Redirect to home page or 404
  }
  
  return (
    <Layout>
      <HeroSection data={serviceData} />
      <DescriptionSection data={serviceData} />
      <HighlightsSection highlights={serviceData.highlights} />
      <GallerySection images={serviceData.images} />
      <CTASection cta={serviceData.cta} />
    </Layout>
  );
};
```

### Sub-Components

While the initial implementation may inline all sections within ServiceDetails, the design supports future extraction into sub-components:

- **HeroSection**: Renders hero background image and title
- **DescriptionSection**: Renders tagline and description paragraphs
- **HighlightsSection**: Renders bulleted list of service highlights
- **GallerySection**: Renders image gallery with primary and secondary images
- **CTASection**: Renders call-to-action text and button

### Router Configuration

**Updated App.jsx routing**:

```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ServiceDetails from './pages/ServiceDetails';

function App() {
  return (
    <Router>
      <Routes>
        {/* Existing routes */}
        <Route path="/services/:serviceId" element={<ServiceDetails />} />
        {/* Optional: Redirect old route */}
        <Route path="/service-details" element={<Navigate to="/services/private-luxury-transport" replace />} />
      </Routes>
    </Router>
  );
}
```

## Data Models

### Service Content Model

Each service in the data store follows this structure:

```javascript
{
  id: 'private-luxury-transport',
  heroTitle: 'Private Luxury Transport',
  heroTagline: 'Designed for individuals and families seeking comfort, privacy, and reliability.',
  heroImage: '/image/mlto3mo6-h6nuqqp.png',
  description: [
    'Our private luxury transport service offers a discreet, personalized travel experience tailored to your preferences.',
    'Whether for daily commutes, special occasions, or leisure travel, we provide premium vehicles and professional chauffeurs dedicated to your comfort and privacy.'
  ],
  highlights: [
    'Discreet Chauffeurs',
    'Premium SUVs',
    'Privacy-Focused Travel',
    'Flexible Scheduling',
    'Door-to-Door Service',
    'Refined Presentation'
  ],
  images: [
    '/image/mltqxr0s-tvy6qwy.png',  // Primary image
    '/image/mltqxr0s-0ykx36e.png',
    '/image/mltqxr0s-5bj4l8e.png',
    '/image/mltqxr0s-koo2o1u.png',
    '/image/mltqxr0s-hynsmyb.png',
    '/image/mltqxr0s-3fog7d9.png',
    '/image/mltqxr0s-ch5rmk1.png'
  ],
  cta: {
    text: 'Travel, Thoughtfully Arranged',
    buttonLabel: 'Book Private Transport'
  }
}
```

### Service Identifiers

The system uses four predefined service identifiers:

- `private-luxury-transport`
- `corporate-executive-travel`
- `airport-hotel-transfers`
- `special-engagements-events`

These identifiers serve as:
- Object keys in the service data store
- URL path parameters for routing
- Validation tokens for route guards

### Validation Rules

- Service ID must match one of the four predefined identifiers
- Each service must have all required fields populated
- Description array must contain 1-5 paragraphs
- Highlights array must contain 3-10 items
- Images array must contain 5-10 URLs
- All image URLs must be valid strings (validation at runtime)


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Service Data Structure Completeness

*For any* service in the Service_Data_Store, the service data SHALL include all required fields: a Service_Identifier in kebab-case format, heroTitle, heroTagline, heroImage, description array with 1-5 paragraphs, highlights array with 3-10 items, images array with 5-10 URLs, and a cta object with text and buttonLabel fields.

**Validates: Requirements 1.2, 1.3, 1.4, 1.5, 8.5**

### Property 2: Valid Service ID Routing

*For any* valid Service_Identifier from the set {private-luxury-transport, corporate-executive-travel, airport-hotel-transfers, special-engagements-events}, when a user navigates to `/services/:serviceId`, the Router SHALL render the Service_Page_Component with the corresponding service data.

**Validates: Requirements 2.1, 2.3**

### Property 3: Invalid Service ID Handling

*For any* string that is not a valid Service_Identifier, when provided as the serviceId URL parameter, the Router SHALL redirect to the home page or 404 page rather than rendering invalid content.

**Validates: Requirements 2.2**

### Property 4: Client-Side Navigation

*For any* two valid Service_Identifiers, when navigating from one service page to another, the Service_Page_Component SHALL update its content without triggering a full page reload.

**Validates: Requirements 2.4**

### Property 5: Data Retrieval

*For any* valid Service_Identifier, when the Service_Page_Component receives that identifier, it SHALL successfully retrieve the corresponding service data from the Service_Data_Store.

**Validates: Requirements 3.1**

### Property 6: Complete Content Rendering

*For any* valid service, when the Service_Page_Component renders that service, the rendered output SHALL include the hero title, hero tagline, all description paragraphs, all service highlights, all image URLs, CTA text, and CTA button label from the service data.

**Validates: Requirements 3.2, 3.3, 3.4, 3.5, 8.1, 8.2**

### Property 7: Image Gallery Rendering with Alt Text

*For any* service, when the Service_Page_Component renders the gallery section, each image element SHALL include an alt attribute with descriptive text.

**Validates: Requirements 8.2, 8.4**

### Property 8: Gallery Layout Structure

*For any* service, when the Service_Page_Component renders the gallery, the first image SHALL use the primary gallery CSS class and subsequent images SHALL use the secondary gallery CSS class.

**Validates: Requirements 8.3**

### Property 9: Navigation URL Updates

*For any* valid Service_Identifier, when navigating to that service page, the browser URL SHALL update to `/services/:serviceId` where :serviceId matches the Service_Identifier.

**Validates: Requirements 10.1, 10.2, 10.3**

### Property 10: Browser History Navigation

*For any* sequence of service page navigations, the browser back and forward buttons SHALL correctly navigate through the history, rendering the appropriate service page for each history entry.

**Validates: Requirements 10.4**

## Error Handling

### Invalid Service ID

When a user navigates to `/services/:serviceId` with an invalid service identifier:

1. The `getServiceById()` function returns `null`
2. The ServiceDetails component detects the null value
3. The component uses React Router's `useNavigate()` hook to redirect to the home page (`/`)
4. Alternative: Redirect to a dedicated 404 page if one exists

**Implementation Pattern**:
```javascript
const ServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const serviceData = getServiceById(serviceId);
  
  useEffect(() => {
    if (!serviceData) {
      navigate('/', { replace: true });
    }
  }, [serviceData, navigate]);
  
  if (!serviceData) {
    return null; // Render nothing while redirecting
  }
  
  // Render service content
};
```

### Missing or Malformed Data

If service data exists but is missing required fields:

1. Use optional chaining (`?.`) to safely access nested properties
2. Provide fallback values for missing strings (empty string or default text)
3. Provide fallback arrays for missing lists (empty array)
4. Log warnings to console in development mode for debugging

**Defensive Rendering Pattern**:
```javascript
<h1>{serviceData?.heroTitle || 'Service'}</h1>
<p>{serviceData?.heroTagline || ''}</p>
{(serviceData?.highlights || []).map((highlight, index) => (
  <li key={index}>{highlight}</li>
))}
```

### Image Loading Failures

When an image fails to load:

1. Each `<img>` element includes a descriptive `alt` attribute
2. The browser's default broken image handling displays the alt text
3. CSS can be applied to style broken image states if needed

**Image Rendering Pattern**:
```javascript
<img 
  src={imageUrl} 
  alt={`${serviceData.heroTitle} - Gallery image ${index + 1}`}
  className={styles.galleryImage}
/>
```

### Network Errors

Since service data is bundled with the application (not fetched from an API):

- No network error handling is required for data retrieval
- Image loading failures are handled by browser defaults and alt text
- Future API integration would require loading states and error boundaries

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests to ensure comprehensive coverage:

- **Unit Tests**: Verify specific examples, edge cases, component integration, and UI behavior
- **Property Tests**: Verify universal properties across all service data and routing scenarios

### Unit Testing

Unit tests will focus on:

1. **Specific Service Content**: Verify that each of the four services has the correct specific content (Requirements 4.x, 5.x, 6.x, 7.x)
   - Test that "Private Luxury Transport" service has exact title, tagline, and highlights
   - Test that each service has at least the minimum required highlights
   - Test that CTA text and button labels are present for each service

2. **Component Integration**: Verify that ServiceDetails integrates correctly with Layout and Router
   - Test that Layout wrapper is rendered
   - Test that useParams hook correctly extracts serviceId
   - Test that useNavigate hook is available for redirects

3. **Edge Cases**:
   - Test redirect behavior with null service data
   - Test rendering with empty arrays (edge case for defensive coding)
   - Test that old `/service-details` route redirects to a valid service page

4. **Responsive Behavior** (Requirements 9.x):
   - Test that CSS module classes are applied correctly
   - Test that mobile viewport renders single-column layout
   - Test that desktop viewport renders grid gallery layout
   - Use testing library with viewport mocking or visual regression tests

5. **Error States**:
   - Test that missing service data triggers redirect
   - Test that images have alt attributes
   - Test fallback rendering for missing optional fields

### Property-Based Testing

Property-based tests will use a JavaScript PBT library (recommended: **fast-check** for JavaScript/React projects) to verify universal properties:

**Library Selection**: `fast-check` (npm package)
- Mature, well-maintained library for JavaScript
- Integrates with Jest, Vitest, and other test runners
- Supports custom generators for complex data structures

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with feature name and property number
- Tag format: `Feature: dynamic-service-pages, Property {N}: {description}`

**Property Test Coverage**:

1. **Property 1 - Service Data Structure Completeness**:
   - Generator: Iterate over all services in servicesData
   - Assertion: Each service has all required fields with correct types and constraints
   - Tag: `Feature: dynamic-service-pages, Property 1: Service Data Structure Completeness`

2. **Property 2 - Valid Service ID Routing**:
   - Generator: Select from valid service IDs
   - Assertion: Rendering component with each ID produces non-null service data
   - Tag: `Feature: dynamic-service-pages, Property 2: Valid Service ID Routing`

3. **Property 3 - Invalid Service ID Handling**:
   - Generator: Generate random strings excluding valid service IDs
   - Assertion: getServiceById returns null for invalid IDs
   - Tag: `Feature: dynamic-service-pages, Property 3: Invalid Service ID Handling`

4. **Property 4 - Client-Side Navigation**:
   - Generator: Generate pairs of valid service IDs
   - Assertion: Navigating between services updates content without page reload
   - Tag: `Feature: dynamic-service-pages, Property 4: Client-Side Navigation`

5. **Property 5 - Data Retrieval**:
   - Generator: Select from valid service IDs
   - Assertion: getServiceById returns non-null data for each valid ID
   - Tag: `Feature: dynamic-service-pages, Property 5: Data Retrieval`

6. **Property 6 - Complete Content Rendering**:
   - Generator: Select from valid service IDs
   - Assertion: Rendered component contains all content fields from service data
   - Tag: `Feature: dynamic-service-pages, Property 6: Complete Content Rendering`

7. **Property 7 - Image Gallery Rendering with Alt Text**:
   - Generator: Select from valid service IDs
   - Assertion: All rendered img elements have non-empty alt attributes
   - Tag: `Feature: dynamic-service-pages, Property 7: Image Gallery Rendering with Alt Text`

8. **Property 8 - Gallery Layout Structure**:
   - Generator: Select from valid service IDs
   - Assertion: First image has primary class, remaining images have secondary class
   - Tag: `Feature: dynamic-service-pages, Property 8: Gallery Layout Structure`

9. **Property 9 - Navigation URL Updates**:
   - Generator: Select from valid service IDs
   - Assertion: Navigating to service updates URL to match pattern
   - Tag: `Feature: dynamic-service-pages, Property 9: Navigation URL Updates`

10. **Property 10 - Browser History Navigation**:
    - Generator: Generate sequence of valid service IDs
    - Assertion: Back/forward navigation renders correct services in order
    - Tag: `Feature: dynamic-service-pages, Property 10: Browser History Navigation`

**Example Property Test Structure**:

```javascript
import fc from 'fast-check';
import { getServiceById, servicesData } from '../data/services';

describe('Feature: dynamic-service-pages, Property 1: Service Data Structure Completeness', () => {
  it('should have complete data structure for all services', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(servicesData)),
        (serviceId) => {
          const service = getServiceById(serviceId);
          
          // Assert all required fields exist
          expect(service).toBeTruthy();
          expect(service.id).toMatch(/^[a-z]+(-[a-z]+)*$/); // kebab-case
          expect(service.heroTitle).toBeTruthy();
          expect(service.heroTagline).toBeTruthy();
          expect(service.heroImage).toBeTruthy();
          expect(Array.isArray(service.description)).toBe(true);
          expect(service.description.length).toBeGreaterThanOrEqual(1);
          expect(service.description.length).toBeLessThanOrEqual(5);
          expect(Array.isArray(service.highlights)).toBe(true);
          expect(service.highlights.length).toBeGreaterThanOrEqual(3);
          expect(service.highlights.length).toBeLessThanOrEqual(10);
          expect(Array.isArray(service.images)).toBe(true);
          expect(service.images.length).toBeGreaterThanOrEqual(5);
          expect(service.images.length).toBeLessThanOrEqual(10);
          expect(service.cta).toBeTruthy();
          expect(service.cta.text).toBeTruthy();
          expect(service.cta.buttonLabel).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Test Organization

```
src/
  __tests__/
    data/
      services.test.js          # Unit tests for service data content
      services.property.test.js # Property tests for data structure
    pages/
      ServiceDetails.test.jsx          # Unit tests for component
      ServiceDetails.property.test.jsx # Property tests for rendering
    integration/
      routing.test.jsx          # Integration tests for routing
      routing.property.test.jsx # Property tests for navigation
```

### Testing Tools

- **Test Runner**: Vitest (already in project, Vite-native)
- **React Testing**: @testing-library/react
- **Property Testing**: fast-check
- **Router Testing**: React Router testing utilities
- **Coverage Target**: 90%+ for critical paths (data retrieval, routing, rendering)

