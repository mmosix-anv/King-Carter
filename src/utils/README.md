# Schema Comparison Utility

This utility compares local service data structure with the Strapi schema to ensure compatibility and data synchronization.

## Purpose

The schema comparison utility helps verify that:
- Local service data matches the Strapi backend schema
- Field names are correctly mapped between local and Strapi formats
- Field types are compatible
- All required fields are present
- Data formats (arrays, objects) match expectations

## Usage

### Command Line

Run the comparison from the command line:

```bash
node scripts/compare-schema.cjs
```

This will:
1. Load local service data from `src/data/services.js`
2. Compare against the Strapi schema definition
3. Report any discrepancies found
4. Exit with code 0 if compatible, 1 if incompatible

### Programmatic Usage

Import and use the utility functions in your code:

```javascript
import { 
  compareServiceStructure, 
  compareAllServices, 
  generateComparisonReport,
  validateServicesCompatibility 
} from './utils/schemaComparison.js';
import { servicesData } from './data/services.js';

// Compare all services
const results = compareAllServices(servicesData);

// Generate a report
const report = generateComparisonReport(results);
console.log(report);

// Quick validation
const isCompatible = validateServicesCompatibility(servicesData);
if (!isCompatible) {
  console.error('Services are not compatible with Strapi schema!');
}

// Compare a single service
const result = compareServiceStructure(servicesData['private-luxury-transport']);
if (!result.compatible) {
  console.log('Discrepancies:', result.discrepancies);
}
```

## API Reference

### `compareServiceStructure(serviceData, serviceId)`

Compares a single service object against the Strapi schema.

**Parameters:**
- `serviceData` (Object): Service data object to validate
- `serviceId` (string, optional): Service identifier for error reporting

**Returns:** `ComparisonResult` object with:
- `compatible` (boolean): Whether the structure is compatible
- `discrepancies` (Array): List of field discrepancies
- `missingFields` (Array): Fields in schema but not in local data
- `extraFields` (Array): Fields in local data but not in schema

### `compareAllServices(servicesData)`

Compares all services in a services data object.

**Parameters:**
- `servicesData` (Object): Object containing all services (keyed by service ID)

**Returns:** Object mapping service IDs to `ComparisonResult` objects

### `generateComparisonReport(comparisonResults)`

Generates a human-readable report of comparison results.

**Parameters:**
- `comparisonResults` (Object): Results from `compareAllServices()`

**Returns:** String containing formatted report

### `validateServicesCompatibility(servicesData)`

Quick validation check for all services.

**Parameters:**
- `servicesData` (Object): Object containing all services

**Returns:** Boolean - true if all services are compatible, false otherwise

### `getStrapiSchema()`

Returns the Strapi schema definition used for comparison.

**Returns:** Object containing schema definition

## Field Mappings

The utility handles field name differences between local data and Strapi:

| Local Field | Strapi Field | Notes |
|-------------|--------------|-------|
| `id` | `serviceId` | Local uses 'id', Strapi uses 'serviceId' |

All other fields use the same names in both local and Strapi formats.

## Schema Definition

The utility validates against the following Strapi schema:

```javascript
{
  serviceId: { type: 'uid', required: true },
  heroTitle: { type: 'string', required: true },
  heroTagline: { type: 'text', required: true },
  heroImage: { type: 'string', required: true },
  description: { type: 'json', required: true, expectedFormat: 'array<string>' },
  highlights: { type: 'json', required: true, expectedFormat: 'array<string>' },
  images: { type: 'json', required: true, expectedFormat: 'array<string>' },
  cta: { type: 'json', required: true, expectedFormat: 'object' }
}
```

## Validation Rules

The utility checks:

1. **Required Fields**: All required fields must be present
2. **Type Compatibility**: Field types must match schema expectations
3. **String Fields**: Must be non-empty strings
4. **Array Fields**: Must be arrays of strings (for description, highlights, images)
5. **CTA Object**: Must contain `text` and `buttonLabel` properties
6. **Empty Values**: Arrays and strings must not be empty

## Integration with CI/CD

Add to your CI/CD pipeline to ensure data compatibility:

```yaml
# Example GitHub Actions workflow
- name: Validate Service Data
  run: node scripts/compare-schema.cjs
```

The script exits with code 1 if incompatibilities are found, failing the build.

## Requirements

This utility validates:
- **Requirement 5.1**: Migration script uses same service data structure as local services
- **Requirement 5.3**: Service schema matches TypeScript/JSDoc type definitions
- **Requirement 5.4**: API client transforms Strapi responses to match local data structure

## Related Files

- `src/utils/schemaComparison.js` - Main utility module
- `scripts/compare-schema.cjs` - CLI tool
- `src/data/services.js` - Local service data
- `backend/src/api/service/content-types/service/schema.json` - Strapi schema
- `backend/scripts/migrate-services.js` - Migration script that uses this validation
