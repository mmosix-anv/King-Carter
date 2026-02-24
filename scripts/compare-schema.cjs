#!/usr/bin/env node

/**
 * Schema Comparison CLI Tool
 * 
 * Command-line utility to compare local service data with Strapi schema.
 * Validates that all services are compatible with the Strapi backend.
 * 
 * Usage:
 *   node scripts/compare-schema.cjs
 *   npm run compare-schema
 */

const path = require('path');
const fs = require('fs');

// Read and parse the local services file
const servicesPath = path.join(__dirname, '../src/data/services.js');
const servicesContent = fs.readFileSync(servicesPath, 'utf8');

// Extract servicesData from the ES module
// This is a simple extraction - in production you might use a proper parser
const servicesDataMatch = servicesContent.match(/export const servicesData = ({[\s\S]*?});/);
if (!servicesDataMatch) {
  console.error('Error: Could not extract servicesData from services.js');
  process.exit(1);
}

// Use eval to parse the object (safe in this context as we control the source)
let servicesData;
try {
  servicesData = eval(`(${servicesDataMatch[1]})`);
} catch (error) {
  console.error('Error parsing servicesData:', error.message);
  process.exit(1);
}

// Import the comparison utility functions
// Since we're in Node.js and the utility is ES6, we'll inline the logic here

/**
 * Strapi schema definition
 */
const STRAPI_SCHEMA = {
  serviceId: { type: 'uid', required: true },
  heroTitle: { type: 'string', required: true },
  heroTagline: { type: 'text', required: true },
  heroImage: { type: 'string', required: true },
  description: { type: 'json', required: true, expectedFormat: 'array<string>' },
  highlights: { type: 'json', required: true, expectedFormat: 'array<string>' },
  images: { type: 'json', required: true, expectedFormat: 'array<string>' },
  cta: { type: 'json', required: true, expectedFormat: 'object' }
};

/**
 * Field name mappings between local data and Strapi schema
 */
const FIELD_MAPPINGS = {
  'id': 'serviceId'  // Local uses 'id', Strapi uses 'serviceId'
};

const TYPE_MAPPING = {
  'string': ['string', 'text', 'uid'],
  'array': ['json'],
  'object': ['json']
};

function getValueType(value) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function validateJsonFormat(value, expectedFormat) {
  if (expectedFormat === 'array<string>') {
    return Array.isArray(value) && value.every(item => typeof item === 'string');
  }
  
  if (expectedFormat === 'object') {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
  
  return true;
}

function isTypeCompatible(localType, schemaType) {
  const compatibleTypes = TYPE_MAPPING[localType];
  return compatibleTypes && compatibleTypes.includes(schemaType);
}

function compareServiceStructure(serviceData, serviceId = 'unknown') {
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

    if (!fieldSchema) {
      extraFields.push(localFieldName);
      continue;
    }

    const localType = getValueType(fieldValue);

    if (!isTypeCompatible(localType, fieldSchema.type)) {
      discrepancies.push({
        field: strapiFieldName,
        issue: `Type mismatch: local data has ${localType}, schema expects ${fieldSchema.type}`,
        localType,
        strapiType: fieldSchema.type
      });
      continue;
    }

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

function compareAllServices(servicesData) {
  const results = {};
  for (const [serviceId, serviceData] of Object.entries(servicesData)) {
    results[serviceId] = compareServiceStructure(serviceData, serviceId);
  }
  return results;
}

// Run the comparison
console.log('='.repeat(70));
console.log('Data Structure Comparison Report');
console.log('Local Services vs Strapi Schema');
console.log('='.repeat(70));
console.log('');

const results = compareAllServices(servicesData);

let totalServices = 0;
let compatibleServices = 0;
let totalDiscrepancies = 0;

for (const [serviceId, result] of Object.entries(results)) {
  totalServices++;
  
  if (result.compatible) {
    compatibleServices++;
    console.log(`✓ ${serviceId}: Compatible`);
  } else {
    totalDiscrepancies += result.discrepancies.length;
    console.log(`✗ ${serviceId}: ${result.discrepancies.length} issue(s) found`);
    
    if (result.missingFields.length > 0) {
      console.log(`  Missing fields: ${result.missingFields.join(', ')}`);
    }
    
    if (result.extraFields.length > 0) {
      console.log(`  Extra fields: ${result.extraFields.join(', ')}`);
    }
    
    result.discrepancies.forEach(disc => {
      console.log(`  - ${disc.field}: ${disc.issue}`);
      console.log(`    Local: ${disc.localType}, Strapi: ${disc.strapiType}`);
    });
  }
  
  console.log('');
}

console.log('='.repeat(70));
console.log('Summary:');
console.log(`  Total Services: ${totalServices}`);
console.log(`  Compatible: ${compatibleServices}`);
console.log(`  Incompatible: ${totalServices - compatibleServices}`);
console.log(`  Total Discrepancies: ${totalDiscrepancies}`);
console.log('='.repeat(70));

// Exit with error code if there are incompatibilities
if (compatibleServices < totalServices) {
  process.exit(1);
}
