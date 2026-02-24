# Implementation Plan: Strapi Services Integration

## Overview

This implementation plan breaks down the Strapi services integration into discrete, sequential tasks. The approach follows a bottom-up strategy: build core validation and utilities first, then implement the migration script, API client, and finally wire everything together with comprehensive testing.

The implementation uses JavaScript/TypeScript as specified in the design document and includes 20 property-based tests to validate correctness properties across all components.

## Tasks

- [ ] 1. Set up project structure and validation utilities
  - [x] 1.1 Create validation module with service data validators
    - Create `src/api/validators/serviceValidator.js`
    - Implement `validateServiceData()` function for single service validation
    - Implement `validateServiceArray()` function for array validation
    - Include detailed error reporting with field names and messages
    - _Requirements: 6.1, 6.3, 6.4, 6.5, 10.5_

  - [ ]* 1.2 Write property test for non-empty string field validation
    - **Property 2: Non-Empty String Field Validation**
    - **Validates: Requirements 1.2, 1.3**
    - Test that heroTitle, heroTagline, and heroImage reject empty/whitespace strings
    - _Requirements: 1.2, 1.3_

  - [ ]* 1.3 Write property test for array field structure validation
    - **Property 3: Array Field Structure Validation**
    - **Validates: Requirements 1.4, 1.5, 1.6, 6.5**
    - Test that description, highlights, and images reject non-arrays and non-string elements
    - _Requirements: 1.4, 1.5, 1.6, 6.5_

  - [ ]* 1.4 Write property test for CTA object structure validation
    - **Property 4: CTA Object Structure Validation**
    - **Validates: Requirements 1.7**
    - Test that cta field requires object with text and buttonLabel properties
    - _Requirements: 1.7_

  - [ ]* 1.5 Write unit tests for validation module
    - Test valid service data passes validation
    - Test each field type validation (strings, arrays, objects)
    - Test edge cases (empty arrays, null values, undefined fields)
    - _Requirements: 6.1, 6.3, 6.5_

- [ ] 2. Create environment configuration module
  - [x] 2.1 Implement Strapi configuration module
    - Create `src/config/strapi.js`
    - Implement `getStrapiConfig()` function
    - Read `VITE_STRAPI_URL` and `VITE_STRAPI_TIMEOUT` environment variables
    - Provide environment-specific defaults (localhost for dev, explicit for prod)
    - Include logging configuration based on environment
    - _Requirements: 3.1, 3.2, 7.1, 7.2, 7.3, 7.4_

  - [ ]* 2.2 Write unit tests for configuration module
    - Test environment variable reading
    - Test default values per environment
    - Test production requires explicit configuration
    - Test development uses localhost default
    - _Requirements: 3.1, 3.2, 7.3, 7.4_

- [ ] 3. Enhance Strapi service content type schema
  - [x] 3.1 Update service schema with validation constraints
    - Modify `backend/src/api/service/content-types/service/schema.json`
    - Add unique constraint to serviceId field
    - Add validation for required string fields
    - Add custom validation for JSON fields (description, highlights, images, cta)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [x] 3.2 Add lifecycle hooks for service validation
    - Create `backend/src/api/service/content-types/service/lifecycles.js`
    - Implement beforeCreate hook to validate service data
    - Implement beforeUpdate hook to validate service data
    - Use validation logic consistent with frontend validators
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [ ]* 3.3 Write property test for service ID uniqueness
    - **Property 1: Service ID Uniqueness**
    - **Validates: Requirements 1.1**
    - Test that duplicate serviceId values are rejected or trigger updates
    - _Requirements: 1.1_

- [ ] 4. Implement migration script with idempotency
  - [x] 4.1 Create migration script module
    - Create `backend/scripts/migrate-services.js`
    - Implement `migrateServices()` function with options (dryRun, validate, force)
    - Check for existing services by serviceId before creating
    - Update existing services instead of creating duplicates
    - Validate service data before database operations
    - Return detailed results (created, updated, failed counts and errors)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 9.1, 9.2, 9.3, 9.4, 9.5, 10.1, 10.2_

  - [x] 4.2 Add CLI wrapper for migration script
    - Create command-line interface with argument parsing
    - Support --dry-run, --validate, and --force flags
    - Display formatted results and errors
    - _Requirements: 10.1, 10.2_

  - [ ]* 4.3 Write property test for migration idempotency
    - **Property 5: Migration Idempotency**
    - **Validates: Requirements 2.1, 9.1, 9.2**
    - Test that running migration multiple times produces same final state
    - _Requirements: 2.1, 9.1, 9.2_

  - [ ]* 4.4 Write property test for migration update behavior
    - **Property 6: Migration Update Behavior**
    - **Validates: Requirements 2.2, 9.3**
    - Test that existing services are updated rather than duplicated
    - _Requirements: 2.2, 9.3_

  - [ ]* 4.5 Write property test for migration error resilience
    - **Property 7: Migration Error Resilience**
    - **Validates: Requirements 2.3**
    - Test that migration continues processing valid services when some fail
    - _Requirements: 2.3_

  - [ ]* 4.6 Write property test for migration result reporting
    - **Property 8: Migration Result Reporting**
    - **Validates: Requirements 2.4**
    - Test that reported counts match actual database operations
    - _Requirements: 2.4_

  - [ ]* 4.7 Write property test for migration pre-validation
    - **Property 9: Migration Pre-Validation**
    - **Validates: Requirements 2.5**
    - Test that invalid data is rejected before database operations
    - _Requirements: 2.5_

  - [ ]* 4.8 Write property test for timestamp preservation
    - **Property 19: Timestamp Preservation on Update**
    - **Validates: Requirements 9.4, 9.5**
    - Test that createdAt remains unchanged and updatedAt is modified on updates
    - _Requirements: 9.4, 9.5_

  - [ ]* 4.9 Write unit tests for migration script
    - Test creating new services
    - Test updating existing services
    - Test dry-run mode doesn't modify database
    - Test validation mode checks without changes
    - Test error handling for invalid data
    - Test result reporting accuracy
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 9.1, 9.2, 9.3, 10.1, 10.2_

- [x] 5. Checkpoint - Ensure migration script tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement API client with fallback mechanism
  - [x] 6.1 Create Strapi API client module
    - Create `src/api/strapiClient.js`
    - Implement `StrapiClient` class with constructor accepting config
    - Implement `fetchServices()` method to get all services
    - Implement `fetchServiceById()` method to get single service
    - Implement `healthCheck()` method to verify Strapi connectivity
    - Implement `validateData()` method to check data integrity
    - Transform Strapi response format to match local data structure
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 5.4, 6.1, 6.4, 8.1, 8.2, 10.3, 10.4_

  - [x] 6.2 Implement error handling and fallback logic
    - Handle network errors (ECONNREFUSED, ETIMEDOUT, DNS failures)
    - Handle HTTP errors (4xx, 5xx status codes)
    - Handle invalid response formats
    - Trigger fallback to local data on any error
    - Log errors appropriately based on environment
    - _Requirements: 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 6.2, 6.3, 7.1, 7.2, 7.5_

  - [x] 6.3 Integrate response validation into API client
    - Call validation functions on all Strapi responses
    - Trigger fallback if validation fails
    - Log validation errors with details
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 6.4 Write property test for API client fallback on failure
    - **Property 10: API Client Fallback on Failure**
    - **Validates: Requirements 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 6.2, 6.3, 7.5**
    - Test that all error conditions trigger fallback to local data
    - _Requirements: 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 6.2, 6.3, 7.5_

  - [ ]* 6.5 Write property test for response structure validation
    - **Property 11: Response Structure Validation**
    - **Validates: Requirements 6.1**
    - Test that invalid responses trigger fallback mechanism
    - _Requirements: 6.1_

  - [ ]* 6.6 Write property test for service ID matching
    - **Property 12: Service ID Matching**
    - **Validates: Requirements 6.4**
    - Test that mismatched serviceId in response triggers fallback
    - _Requirements: 6.4_

  - [ ]* 6.7 Write property test for fallback data completeness
    - **Property 13: Fallback Data Completeness**
    - **Validates: Requirements 4.4, 4.5**
    - Test that all local services contain required fields
    - _Requirements: 4.4, 4.5_

  - [ ]* 6.8 Write property test for validation error reporting
    - **Property 20: Validation Error Reporting**
    - **Validates: Requirements 10.5**
    - Test that validation errors include specific field details
    - _Requirements: 10.5_

  - [ ]* 6.9 Write unit tests for API client
    - Test successful service fetching
    - Test service filtering by ID
    - Test network error handling
    - Test HTTP error handling
    - Test invalid response handling
    - Test fallback mechanism triggering
    - Test environment-specific logging
    - Test health check functionality
    - Test data validation functionality
    - _Requirements: 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 6.1, 6.2, 6.3, 7.1, 7.2, 10.3, 10.4_

- [x] 7. Checkpoint - Ensure API client tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Update frontend to use new API client
  - [x] 8.1 Refactor existing service data fetching
    - Update `src/data/strapiServices.js` or create new integration point
    - Replace existing fetch logic with new `StrapiClient`
    - Initialize client with configuration from `getStrapiConfig()`
    - Ensure fallback to local `src/data/services.js` data
    - _Requirements: 3.1, 3.2, 4.1, 4.2, 5.4_

  - [x] 8.2 Add error boundary for service data loading
    - Wrap service data consumers with error boundary
    - Display user-friendly message if both Strapi and fallback fail
    - Log errors for debugging
    - _Requirements: 7.5_

  - [ ]* 8.3 Write integration tests for frontend service loading
    - Test successful loading from Strapi
    - Test fallback to local data
    - Test error boundary behavior
    - _Requirements: 4.1, 4.2, 7.5_

- [ ] 9. Configure Strapi CORS and API settings
  - [x] 9.1 Update Strapi middleware configuration
    - Modify `backend/config/middlewares.js`
    - Configure CORS to allow frontend domain
    - Set allowed methods (GET, OPTIONS)
    - Set allowed headers (Content-Type, Authorization)
    - _Requirements: 8.4_

  - [x] 9.2 Verify API endpoint configuration
    - Ensure `/api/services` endpoint is exposed
    - Verify filtering by serviceId works
    - Check response format matches expected structure
    - Verify JSON content-type headers
    - _Requirements: 8.1, 8.2, 8.3, 8.5_

  - [ ]* 9.3 Write property test for service filtering
    - **Property 16: Service Filtering**
    - **Validates: Requirements 8.2**
    - Test that serviceId filtering returns at most one service
    - _Requirements: 8.2_

  - [ ]* 9.4 Write property test for consistent service ordering
    - **Property 17: Consistent Service Ordering**
    - **Validates: Requirements 8.3**
    - Test that service order is consistent across requests
    - _Requirements: 8.3_

  - [ ]* 9.5 Write property test for JSON response format
    - **Property 18: JSON Response Format**
    - **Validates: Requirements 8.5**
    - Test that responses have correct content-type and valid JSON
    - _Requirements: 8.5_

- [ ] 10. Implement data synchronization verification
  - [x] 10.1 Create data structure comparison utility
    - Create utility to compare local services with Strapi schema
    - Verify field names and types match
    - Report any discrepancies
    - _Requirements: 5.1, 5.3, 5.4_

  - [ ]* 10.2 Write property test for data structure synchronization
    - **Property 14: Data Structure Synchronization**
    - **Validates: Requirements 5.1, 5.4**
    - Test that data can be transformed between formats without loss
    - _Requirements: 5.1, 5.4_

  - [ ]* 10.3 Write property test for migration sync capability
    - **Property 15: Migration Sync Capability**
    - **Validates: Requirements 5.2**
    - Test that local data changes sync to Strapi via migration
    - _Requirements: 5.2_

- [ ] 11. Add comprehensive documentation
  - [x] 11.1 Document API client usage
    - Add JSDoc comments to all public methods
    - Create usage examples in comments
    - Document configuration options
    - _Requirements: 3.1, 3.2_

  - [x] 11.2 Document migration script usage
    - Add README for migration script
    - Document command-line flags
    - Provide usage examples
    - _Requirements: 2.1, 2.2, 10.1, 10.2_

  - [x] 11.3 Document environment configuration
    - List all environment variables
    - Document defaults per environment
    - Provide setup instructions
    - _Requirements: 3.1, 3.2, 7.3, 7.4_

- [ ] 12. Final integration and end-to-end testing
  - [x] 12.1 Run migration script to populate Strapi
    - Execute migration with actual service data
    - Verify all services created successfully
    - Check Strapi admin panel for data
    - _Requirements: 2.1, 2.4, 5.2_

  - [x] 12.2 Test complete flow from frontend to Strapi
    - Start Strapi backend
    - Start frontend application
    - Verify services load from Strapi
    - Stop Strapi and verify fallback works
    - _Requirements: 4.1, 4.2, 7.5, 8.1_

  - [ ]* 12.3 Write end-to-end integration tests
    - Test full migration → API fetch flow
    - Test CORS headers present
    - Test health check detects availability
    - _Requirements: 8.4, 10.3_

- [x] 13. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property-based tests use fast-check library with minimum 100 iterations
- All 20 correctness properties from the design are covered
- Migration script must be idempotent and safe to run multiple times
- API client must gracefully degrade to local data on any error
- Environment configuration ensures different behavior in dev vs production
- Testing strategy includes both property-based tests and unit tests for comprehensive coverage
