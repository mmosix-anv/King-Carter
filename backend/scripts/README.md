# Service Migration Script

Idempotent migration script that populates Strapi with service data from the local services file. This script ensures data integrity through validation, supports multiple operation modes, and provides detailed reporting.

## Overview

The migration script (`migrate-services.js`) synchronizes service data between your local services file (`src/data/services.js`) and the Strapi CMS database. It's designed to be run multiple times safely (idempotent) and provides several modes for different use cases.

**Key Features:**
- Idempotent: Safe to run multiple times without creating duplicates
- Validation: Pre-validates all data before database operations
- Flexible modes: Dry-run, validation-only, and force-update options
- Detailed reporting: Shows exactly what was created, updated, or failed
- Error resilience: Continues processing valid services even if some fail

## Requirements

- Node.js 14 or higher
- Strapi backend running (for actual migration, not needed for validation mode)
- Access to Strapi database

## Usage

### Basic Migration

Run the migration to create new services (skips existing services):

```bash
node backend/scripts/migrate-services.js
```

This will:
- Validate all service data
- Create new services that don't exist
- Skip services that already exist
- Report results with counts and any errors

### Command-Line Flags

#### `--dry-run`

Preview what changes would be made without actually modifying the database:

```bash
node backend/scripts/migrate-services.js --dry-run
```

**Use this when:**
- You want to see what would happen before running the actual migration
- Testing the script with new data
- Verifying which services would be created or updated

**Output example:**
```
→ Private Luxury Transport: Would create new service
→ Corporate & Executive Travel: Would update existing service (ID: 1)
```

#### `--validate`

Check data integrity without any database operations:

```bash
node backend/scripts/migrate-services.js --validate
```

**Use this when:**
- You want to verify service data structure is valid
- Checking for data errors before migration
- Running as part of CI/CD validation

**Output example:**
```
✓ private-luxury-transport: Valid
✗ corporate-executive-travel: INVALID
  - heroTitle must be a non-empty string
  - description must be a non-empty array
```

#### `--force`

Update existing services instead of skipping them:

```bash
node backend/scripts/migrate-services.js --force
```

**Use this when:**
- You've updated service data and want to sync changes to Strapi
- You need to overwrite existing services with new content
- Performing a full data refresh

**Important:** This will overwrite existing service data in Strapi with data from the local file.

#### `--help` or `-h`

Display help information:

```bash
node backend/scripts/migrate-services.js --help
```

### Combining Flags

You can combine flags for different behaviors:

```bash
# Preview what would be updated without making changes
node backend/scripts/migrate-services.js --dry-run --force

# Validate data, then run migration with force update
node backend/scripts/migrate-services.js --validate && \
node backend/scripts/migrate-services.js --force
```

## Common Scenarios

### Initial Setup

When setting up Strapi for the first time:

```bash
# 1. Validate data is correct
node backend/scripts/migrate-services.js --validate

# 2. Preview what will be created
node backend/scripts/migrate-services.js --dry-run

# 3. Run the actual migration
node backend/scripts/migrate-services.js
```

### Updating Service Content

When you've modified service data in `src/data/services.js`:

```bash
# 1. Validate the updated data
node backend/scripts/migrate-services.js --validate

# 2. Preview the updates
node backend/scripts/migrate-services.js --dry-run --force

# 3. Apply the updates
node backend/scripts/migrate-services.js --force
```

### Troubleshooting Data Issues

When you suspect data problems:

```bash
# Run validation to see specific errors
node backend/scripts/migrate-services.js --validate
```

Fix any reported errors in `src/data/services.js`, then re-run validation.

### CI/CD Integration

In automated pipelines:

```bash
# Validate as part of tests
npm run test && node backend/scripts/migrate-services.js --validate

# Deploy: validate then migrate
node backend/scripts/migrate-services.js --validate && \
node backend/scripts/migrate-services.js --force
```

## Output and Results

### Success Output

```
============================================================
Service Migration Script
============================================================
MODE: Migration (applying changes)

✓ Private Luxury Transport: Created new service
↻ Corporate & Executive Travel: Updated existing service
→ Airport & Hotel Transfers: Already exists (use --force to update)
✓ Special Engagements & Events: Created new service

============================================================
Migration Summary:
  Created: 2
  Updated: 1
  Failed: 0
============================================================
```

### Error Output

```
============================================================
Service Migration Script
============================================================
MODE: Migration (applying changes)

✓ Private Luxury Transport: Created new service
✗ Corporate & Executive Travel: Validation failed
  - heroTitle must be a non-empty string
  - cta.buttonLabel must be a non-empty string

============================================================
Migration Summary:
  Created: 1
  Updated: 0
  Failed: 1

Errors:
  - corporate-executive-travel: Validation failed: heroTitle must be a non-empty string, cta.buttonLabel must be a non-empty string
============================================================
```

### Exit Codes

- `0`: Success (all services processed without errors)
- `1`: Failure (one or more services failed validation or migration)

## Data Validation

The script validates all service data before database operations. Each service must have:

### Required String Fields
- `id`: Non-empty string (kebab-case identifier)
- `heroTitle`: Non-empty string
- `heroTagline`: Non-empty string
- `heroImage`: Non-empty string (image path or URL)

### Required Array Fields
- `description`: Non-empty array of non-empty strings
- `highlights`: Non-empty array of non-empty strings
- `images`: Non-empty array of non-empty strings

### Required Object Fields
- `cta`: Object with two properties:
  - `text`: Non-empty string
  - `buttonLabel`: Non-empty string

### Validation Errors

Common validation errors and how to fix them:

| Error | Cause | Fix |
|-------|-------|-----|
| `id must be a non-empty string` | Missing or empty id field | Add valid id in kebab-case format |
| `heroTitle must be a non-empty string` | Empty or whitespace-only title | Provide meaningful title text |
| `description must be a non-empty array` | Not an array or empty array | Ensure description is array with at least one string |
| `description must contain only non-empty strings` | Array contains non-string or empty values | Remove empty strings and ensure all items are strings |
| `cta must be an object` | cta is null, array, or primitive | Provide object with text and buttonLabel |
| `cta.text must be a non-empty string` | Missing or empty cta.text | Add text property to cta object |

## Idempotency

The script is designed to be idempotent, meaning you can run it multiple times safely:

- **First run**: Creates all services
- **Subsequent runs**: Skips existing services (unless `--force` is used)
- **With `--force`**: Updates existing services with new data

### How It Works

1. For each service in the local data file:
   - Validates the service data structure
   - Queries Strapi for existing service with matching `serviceId`
   - If exists and `--force` is used: Updates the service
   - If exists and `--force` is not used: Skips the service
   - If doesn't exist: Creates new service

2. Timestamps are managed automatically:
   - `createdAt`: Set on creation, preserved on updates
   - `updatedAt`: Set on creation, updated on modifications

## Integration with Strapi

### Running Within Strapi Context

The script is designed to run within Strapi's context and uses Strapi's entity service API:

```javascript
// Check for existing service
const existingServices = await strapi.entityService.findMany('api::service.service', {
  filters: { serviceId: serviceData.id },
  limit: 1
});

// Create new service
await strapi.entityService.create('api::service.service', {
  data: { /* service data */ }
});

// Update existing service
await strapi.entityService.update('api::service.service', existingService.id, {
  data: { /* updated service data */ }
});
```

### Running from Strapi Admin

You can also run the script from Strapi's admin panel or as part of Strapi's lifecycle hooks if needed.

## Troubleshooting

### Script Fails to Connect to Database

**Error:** `Cannot read property 'entityService' of undefined`

**Solution:** Ensure you're running the script in Strapi's context or that Strapi is properly initialized.

### Services Not Updating

**Problem:** Running the script doesn't update existing services

**Solution:** Use the `--force` flag to update existing services:
```bash
node backend/scripts/migrate-services.js --force
```

### Validation Errors

**Problem:** Script reports validation errors

**Solution:** 
1. Run with `--validate` flag to see all errors
2. Fix the data in `src/data/services.js`
3. Re-run validation until all services pass
4. Then run the actual migration

### Partial Migration Failures

**Problem:** Some services succeed, others fail

**Behavior:** The script continues processing all services even if some fail. Check the error summary at the end for details on which services failed and why.

**Solution:** Fix the failing services in the source data and re-run the migration. Successfully migrated services will be skipped (unless using `--force`).

## Best Practices

1. **Always validate first**: Run `--validate` before actual migration
2. **Use dry-run for safety**: Preview changes with `--dry-run` before applying
3. **Keep data synchronized**: When updating local services, use `--force` to sync to Strapi
4. **Check exit codes**: In scripts, check the exit code to detect failures
5. **Review error messages**: Read the detailed error output to understand what failed
6. **Backup before force updates**: Consider backing up Strapi data before using `--force`

## Related Documentation

- [API Client Usage](../../src/api/README.md) - How to fetch services from Strapi
- [Environment Configuration](../../docs/environment-config.md) - Setting up Strapi URLs
- [Service Data Structure](../../src/data/services.js) - Local service data format
- [Strapi Service Schema](../src/api/service/content-types/service/schema.json) - Database schema

## Requirements Satisfied

This migration script satisfies the following requirements:

- **2.1**: Checks if services exist before creating duplicates
- **2.2**: Updates existing services instead of creating duplicates
- **2.3**: Logs specific errors and continues with remaining services
- **2.4**: Reports number of services created, updated, and failed
- **2.5**: Validates service data structure before attempting to create entries
- **9.1, 9.2**: Produces same final state when run multiple times (idempotency)
- **9.3**: Updates existing services with new data on subsequent runs
- **9.4, 9.5**: Preserves createdAt and updates updatedAt timestamps
- **10.1**: Provides dry-run mode that reports changes without making them
- **10.2**: Provides validation mode that checks data integrity without modifying data
