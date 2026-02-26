/**
 * Data Structure Comparison Utility
 * 
 * Compares local service data structure with Strapi schema to verify compatibility.
 * Ensures field names and types match between local services and Strapi backend.
 * 
 * Requirements: 5.1, 5.3, 5.4
 * 
 * @module utils/schemaComparison
 */

/**
 * @typedef {Object} FieldDiscrepancy
 * @property {string} field - Field name
 * @property {string} issue - Description of the discrepancy
 * @property {string} localType - Type in local data
 * @property {string} strapiType - Expected type in Strapi schema
 */

/**
 * @typedef {Object} ComparisonResult
 * @property {boolean} compatible - Whether structures are compatible
 * @property {FieldDiscrepancy[]} discrepancies - List of discrepancies found
 * @property {string[]} missingFields - Fields in schema but not in local data
 * @property {string[]} extraFields - Fields in local data but not in schema
 */

/**
 * Strapi schema definition for services
 * Based on backend/src/api/service/content-types/service/schema.json
 */
const STRAPI_SCHEMA = {
  serviceId: { type: 'uid', required: true },
  heroTitle: { type: 'string', required: true },
  heroTagline: { type: 'text', required: true },
  heroImage: { type: 'string', required: true },
  featuredImage: { type: 'string', required: true },
  description: { type: 'json', required: true, expectedFormat: 'array<string>' },
  highlights: { type: 'json', required: true, expectedFormat: 'array<string>' },
  images: { type: 'json', required: true, expectedFormat: 'array<string>' },
  cta: { type: 'json', required: true, expectedFormat: 'object' }
};

/**
 * Field name mappings between local data and Strapi schema
 * Local field name -> Strapi field name
 */
const FIELD_MAPPINGS = {
  'id': 'serviceId'  // Local uses 'id', Strapi uses 'serviceId'
};

/**
 * Maps local data types to Strapi schema types
 */
const TYPE_MAPPING = {
  'string': ['string', 'text', 'uid'],
  'array': ['json'],
  'object': ['json']
};

/**
 * Gets the JavaScript type of a value
 * 
 * @private
 * @param {*} value - Value to check
 * @returns {string} Type name ('string', 'array', 'object', 'number', etc.)
 */
function getValueType(value) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

/**
 * Validates that a JSON field matches expected format
 * 
 * @private
 * @param {*} value - Value to validate
 * @param {string} expectedFormat - Expected format (e.g., 'array<string>', 'object')
 * @returns {boolean} Whether value matches expected format
 */
function validateJsonFormat(value, expectedFormat) {
  if (expectedFormat === 'array<string>') {
    return Array.isArray(value) && value.every(item => typeof item === 'string');
  }
  
  if (expectedFormat === 'object') {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
  
  return true;
}

/**
 * Checks if a local type is compatible with a Strapi schema type
 * 
 * @private
 * @param {string} localType - Type from local data
 * @param {string} schemaType - Type from Strapi schema
 * @returns {boolean} Whether types are compatible
 */
function isTypeCompatible(localType, schemaType) {
  const compatibleTypes = TYPE_MAPPING[localType];
  return compatibleTypes && compatibleTypes.includes(schemaType);
}

/**
 * Compares a single service object against the Strapi schema
 * 
 * @param {Object} serviceData - Service data object to validate
 * @param {string} serviceId - Service identifier (for error reporting)
 * @returns {ComparisonResult} Comparison result
 */
export function compareServiceStructure(serviceData, serviceId = 'unknown') {
  const discrepancies = [];
  const missingFields = [];
  const extraFields = [];

  // Check for missing required fields (accounting for field mappings)
  for (const [strapiFieldName, fieldSchema] of Object.entries(STRAPI_SCHEMA)) {
    // Check if field exists directly or via mapping
    const localFieldName = Object.keys(FIELD_MAPPINGS).find(
      key => FIELD_MAPPINGS[key] === strapiFieldName
    ) || strapiFieldName;
    
    if (fieldSchema.required && !(localFieldName in serviceData)) {
      missingFields.push(strapiFieldName);
      discrepancies.push({
        field: strapiFieldName,
        issue: 'Required field missing in local data',
        localType: 'undefined',
        strapiType: fieldSchema.type
      });
    }
  }

  // Check each field in local data
  for (const [localFieldName, fieldValue] of Object.entries(serviceData)) {
    // Map local field name to Strapi field name if mapping exists
    const strapiFieldName = FIELD_MAPPINGS[localFieldName] || localFieldName;
    const fieldSchema = STRAPI_SCHEMA[strapiFieldName];

    // Check for extra fields not in schema
    if (!fieldSchema) {
      extraFields.push(localFieldName);
      continue;
    }

    const localType = getValueType(fieldValue);

    // Check type compatibility
    if (!isTypeCompatible(localType, fieldSchema.type)) {
      discrepancies.push({
        field: strapiFieldName,
        issue: `Type mismatch: local data has ${localType}, schema expects ${fieldSchema.type}`,
        localType,
        strapiType: fieldSchema.type
      });
      continue;
    }

    // For JSON fields, validate the expected format
    if (fieldSchema.type === 'json' && fieldSchema.expectedFormat) {
      if (!validateJsonFormat(fieldValue, fieldSchema.expectedFormat)) {
        discrepancies.push({
          field: strapiFieldName,
          issue: `JSON format mismatch: expected ${fieldSchema.expectedFormat}`,
          localType: `${localType} (invalid format)`,
          strapiType: `${fieldSchema.type} (${fieldSchema.expectedFormat})`
        });
      }
    }

    // Validate string fields are non-empty
    if (fieldSchema.type === 'string' || fieldSchema.type === 'text' || fieldSchema.type === 'uid') {
      if (typeof fieldValue === 'string' && fieldValue.trim() === '') {
        discrepancies.push({
          field: strapiFieldName,
          issue: 'String field is empty',
          localType: 'string (empty)',
          strapiType: fieldSchema.type
        });
      }
    }

    // Validate array fields are non-empty
    if (fieldSchema.expectedFormat && fieldSchema.expectedFormat.startsWith('array')) {
      if (Array.isArray(fieldValue) && fieldValue.length === 0) {
        discrepancies.push({
          field: strapiFieldName,
          issue: 'Array field is empty',
          localType: 'array (empty)',
          strapiType: `${fieldSchema.type} (${fieldSchema.expectedFormat})`
        });
      }
    }

    // Special validation for CTA object
    if (strapiFieldName === 'cta' && typeof fieldValue === 'object' && fieldValue !== null) {
      if (!fieldValue.text || typeof fieldValue.text !== 'string') {
        discrepancies.push({
          field: 'cta.text',
          issue: 'CTA object missing or invalid text property',
          localType: getValueType(fieldValue.text),
          strapiType: 'string'
        });
      }
      if (!fieldValue.buttonLabel || typeof fieldValue.buttonLabel !== 'string') {
        discrepancies.push({
          field: 'cta.buttonLabel',
          issue: 'CTA object missing or invalid buttonLabel property',
          localType: getValueType(fieldValue.buttonLabel),
          strapiType: 'string'
        });
      }
    }
  }

  return {
    compatible: discrepancies.length === 0,
    discrepancies,
    missingFields,
    extraFields
  };
}

/**
 * Compares all services in a services data object against the Strapi schema
 * 
 * @param {Object.<string, Object>} servicesData - Object containing all services
 * @returns {Object.<string, ComparisonResult>} Comparison results for each service
 * 
 * @example
 * import { servicesData } from '../data/services.js';
 * import { compareAllServices } from './schemaComparison.js';
 * 
 * const results = compareAllServices(servicesData);
 * for (const [serviceId, result] of Object.entries(results)) {
 *   if (!result.compatible) {
 *     console.log(`Service ${serviceId} has issues:`, result.discrepancies);
 *   }
 * }
 */
export function compareAllServices(servicesData) {
  const results = {};

  for (const [serviceId, serviceData] of Object.entries(servicesData)) {
    results[serviceId] = compareServiceStructure(serviceData, serviceId);
  }

  return results;
}

/**
 * Generates a human-readable report of comparison results
 * 
 * @param {Object.<string, ComparisonResult>} comparisonResults - Results from compareAllServices
 * @returns {string} Formatted report
 * 
 * @example
 * const results = compareAllServices(servicesData);
 * const report = generateComparisonReport(results);
 * console.log(report);
 */
export function generateComparisonReport(comparisonResults) {
  const lines = [];
  
  lines.push('='.repeat(70));
  lines.push('Data Structure Comparison Report');
  lines.push('Local Services vs Strapi Schema');
  lines.push('='.repeat(70));
  lines.push('');

  let totalServices = 0;
  let compatibleServices = 0;
  let totalDiscrepancies = 0;

  for (const [serviceId, result] of Object.entries(comparisonResults)) {
    totalServices++;
    
    if (result.compatible) {
      compatibleServices++;
      lines.push(`✓ ${serviceId}: Compatible`);
    } else {
      totalDiscrepancies += result.discrepancies.length;
      lines.push(`✗ ${serviceId}: ${result.discrepancies.length} issue(s) found`);
      
      if (result.missingFields.length > 0) {
        lines.push(`  Missing fields: ${result.missingFields.join(', ')}`);
      }
      
      if (result.extraFields.length > 0) {
        lines.push(`  Extra fields: ${result.extraFields.join(', ')}`);
      }
      
      result.discrepancies.forEach(disc => {
        lines.push(`  - ${disc.field}: ${disc.issue}`);
        lines.push(`    Local: ${disc.localType}, Strapi: ${disc.strapiType}`);
      });
    }
    
    lines.push('');
  }

  lines.push('='.repeat(70));
  lines.push('Summary:');
  lines.push(`  Total Services: ${totalServices}`);
  lines.push(`  Compatible: ${compatibleServices}`);
  lines.push(`  Incompatible: ${totalServices - compatibleServices}`);
  lines.push(`  Total Discrepancies: ${totalDiscrepancies}`);
  lines.push('='.repeat(70));

  return lines.join('\n');
}

/**
 * Validates that local services data is compatible with Strapi schema
 * 
 * Convenience function that compares all services and returns a simple pass/fail result.
 * 
 * @param {Object.<string, Object>} servicesData - Object containing all services
 * @returns {boolean} True if all services are compatible, false otherwise
 * 
 * @example
 * import { servicesData } from '../data/services.js';
 * import { validateServicesCompatibility } from './schemaComparison.js';
 * 
 * if (!validateServicesCompatibility(servicesData)) {
 *   console.error('Local services are not compatible with Strapi schema!');
 * }
 */
export function validateServicesCompatibility(servicesData) {
  const results = compareAllServices(servicesData);
  return Object.values(results).every(result => result.compatible);
}

/**
 * Gets the Strapi schema definition
 * 
 * Useful for debugging and documentation purposes.
 * 
 * @returns {Object} Strapi schema definition
 */
export function getStrapiSchema() {
  return { ...STRAPI_SCHEMA };
}
