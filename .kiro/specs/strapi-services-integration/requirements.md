# Requirements Document

## Introduction

This document defines requirements for fixing the Strapi services content type and integrating it properly with the main King & Carter Premier web application. Currently, the Strapi backend has a services content type with migration scripts, but the integration is incomplete. The main application has fallback logic to use local service data when Strapi is unavailable, but the system needs proper configuration, validation, and production-ready integration.

## Glossary

- **Strapi_Backend**: The Strapi CMS backend application located in the backend directory
- **Main_Application**: The React frontend application that consumes service data
- **Service_Content_Type**: The Strapi collection type that stores service information
- **Migration_Script**: Scripts that populate Strapi with initial service data
- **API_Client**: The module in the main application that fetches data from Strapi
- **Fallback_Mechanism**: Logic that uses local service data when Strapi is unavailable
- **Service_Schema**: The JSON schema defining the structure of service content in Strapi
- **Environment_Configuration**: Settings that control API URLs and behavior across environments

## Requirements

### Requirement 1: Service Content Type Schema Validation

**User Story:** As a developer, I want the Strapi service content type to properly validate all required fields, so that data integrity is maintained.

#### Acceptance Criteria

1. THE Service_Content_Type SHALL validate that serviceId is unique across all service entries
2. THE Service_Content_Type SHALL validate that heroTitle is a non-empty string
3. THE Service_Content_Type SHALL validate that heroTagline is a non-empty string
4. THE Service_Content_Type SHALL validate that description is a valid JSON array of strings
5. THE Service_Content_Type SHALL validate that highlights is a valid JSON array of strings
6. THE Service_Content_Type SHALL validate that images is a valid JSON array of strings
7. THE Service_Content_Type SHALL validate that cta is a valid JSON object containing text and buttonLabel properties

### Requirement 2: Migration Script Reliability

**User Story:** As a developer, I want reliable migration scripts that can safely populate Strapi with service data, so that I can initialize or reset the database consistently.

#### Acceptance Criteria

1. WHEN the migration script is executed, THE Migration_Script SHALL check if services already exist before creating duplicates
2. WHEN a service with the same serviceId exists, THE Migration_Script SHALL update the existing service instead of creating a duplicate
3. IF the migration fails for any service, THEN THE Migration_Script SHALL log the specific error and continue with remaining services
4. WHEN the migration completes, THE Migration_Script SHALL report the number of services created, updated, and failed
5. THE Migration_Script SHALL validate service data structure before attempting to create entries

### Requirement 3: API Client Configuration

**User Story:** As a developer, I want the API client to use environment-specific configuration, so that the application works correctly in development, staging, and production.

#### Acceptance Criteria

1. THE API_Client SHALL read the Strapi URL from environment variables
2. WHERE no environment variable is set, THE API_Client SHALL use a sensible default for the current environment
3. THE API_Client SHALL include proper error handling for network failures
4. THE API_Client SHALL include proper error handling for malformed responses
5. WHEN Strapi returns an error response, THE API_Client SHALL log the error details and use the fallback mechanism

### Requirement 4: Fallback Mechanism Reliability

**User Story:** As a user, I want the application to continue working even when Strapi is unavailable, so that I can always access service information.

#### Acceptance Criteria

1. WHEN the Strapi API is unreachable, THE API_Client SHALL return local service data
2. WHEN the Strapi API returns invalid data, THE API_Client SHALL return local service data
3. WHEN using fallback data, THE API_Client SHALL log a warning message
4. THE Fallback_Mechanism SHALL ensure data structure matches the expected format
5. FOR ALL service IDs in local data, THE Fallback_Mechanism SHALL provide complete service information

### Requirement 5: Service Data Synchronization

**User Story:** As a content manager, I want to ensure that local service data and Strapi data remain synchronized, so that the fallback mechanism provides accurate information.

#### Acceptance Criteria

1. THE Migration_Script SHALL use the same service data structure as the local services file
2. WHEN local service data is updated, THE Migration_Script SHALL be able to sync changes to Strapi
3. THE Service_Schema SHALL match the TypeScript/JSDoc type definitions in the local services file
4. THE API_Client SHALL transform Strapi responses to match the local data structure exactly

### Requirement 6: API Response Validation

**User Story:** As a developer, I want API responses to be validated before use, so that the application doesn't break due to unexpected data formats.

#### Acceptance Criteria

1. WHEN the API_Client receives a response from Strapi, THE API_Client SHALL validate the response structure
2. IF the response is missing required fields, THEN THE API_Client SHALL use the fallback mechanism
3. IF the response contains invalid JSON in description, highlights, images, or cta fields, THEN THE API_Client SHALL use the fallback mechanism
4. THE API_Client SHALL validate that serviceId matches the requested service
5. THE API_Client SHALL validate that all array fields contain only strings

### Requirement 7: Environment-Specific Behavior

**User Story:** As a developer, I want different behavior in development versus production, so that I can develop locally without requiring Strapi while ensuring production reliability.

#### Acceptance Criteria

1. WHERE the environment is development, THE API_Client SHALL log detailed error messages
2. WHERE the environment is production, THE API_Client SHALL log minimal error information to avoid exposing internals
3. WHERE the environment is development, THE API_Client SHALL use localhost as the default Strapi URL
4. WHERE the environment is production, THE API_Client SHALL require an explicit Strapi URL configuration
5. WHERE Strapi is unavailable in production, THE API_Client SHALL use fallback data without throwing errors

### Requirement 8: Service API Endpoints

**User Story:** As a frontend developer, I want properly configured Strapi API endpoints, so that I can fetch services efficiently.

#### Acceptance Criteria

1. THE Strapi_Backend SHALL expose a GET endpoint at /api/services that returns all services
2. THE Strapi_Backend SHALL expose a GET endpoint at /api/services with filtering by serviceId
3. WHEN fetching all services, THE Strapi_Backend SHALL return services in a consistent order
4. THE Strapi_Backend SHALL include proper CORS configuration for the main application domain
5. THE Strapi_Backend SHALL return responses in JSON format with proper content-type headers

### Requirement 9: Data Migration Idempotency

**User Story:** As a developer, I want migration scripts to be idempotent, so that I can run them multiple times safely.

#### Acceptance Criteria

1. WHEN the migration script runs multiple times, THE Migration_Script SHALL produce the same final state
2. THE Migration_Script SHALL not create duplicate services on subsequent runs
3. THE Migration_Script SHALL update existing services with new data on subsequent runs
4. THE Migration_Script SHALL preserve the createdAt timestamp of existing services
5. THE Migration_Script SHALL update the updatedAt timestamp when modifying existing services

### Requirement 10: Testing and Validation Tools

**User Story:** As a developer, I want tools to test and validate the Strapi integration, so that I can verify everything works correctly.

#### Acceptance Criteria

1. THE Migration_Script SHALL provide a dry-run mode that reports what would be changed without making changes
2. THE Migration_Script SHALL provide a validation mode that checks data integrity without modifying data
3. THE API_Client SHALL provide a health check function that verifies Strapi connectivity
4. THE API_Client SHALL provide a validation function that checks if Strapi data matches local data structure
5. WHEN validation fails, THE validation function SHALL report specific discrepancies
