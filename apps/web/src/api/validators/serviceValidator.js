/**
 * Service Data Validator Module
 * 
 * Provides validation functions for service data to ensure data integrity
 * across Strapi integration, migration scripts, and API responses.
 * 
 * Validates: Requirements 6.1, 6.3, 6.4, 6.5, 10.5
 */

/**
 * @typedef {Object} ValidationError
 * @property {string} field - The field name that failed validation
 * @property {string} message - Human-readable error message
 * @property {*} value - The invalid value that was provided
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether the validation passed
 * @property {ValidationError[]} errors - Array of validation errors (empty if valid)
 */

/**
 * Validates that a value is a non-empty string
 * @param {*} value - Value to validate
 * @returns {boolean} True if value is a non-empty string
 */
function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validates that a value is an array of non-empty strings
 * @param {*} value - Value to validate
 * @returns {boolean} True if value is an array of non-empty strings
 */
function isStringArray(value) {
  return Array.isArray(value) && 
         value.length > 0 && 
         value.every(item => isNonEmptyString(item));
}

/**
 * Validates that a value is a valid URL string
 * @param {*} value - Value to validate
 * @returns {boolean} True if value is a valid URL format
 */
function isValidUrl(value) {
  if (!isNonEmptyString(value)) return false;
  // Simple URL validation - starts with / or http(s)://
  return value.startsWith('/') || value.startsWith('http://') || value.startsWith('https://');
}

/**
 * Validates that a value is an array of valid URL strings
 * @param {*} value - Value to validate
 * @returns {boolean} True if value is an array of valid URLs
 */
function isUrlArray(value) {
  return Array.isArray(value) && 
         value.length > 0 && 
         value.every(item => isValidUrl(item));
}

/**
 * Validates a single service data object
 * 
 * Checks all required fields according to the service schema:
 * - id/serviceId: non-empty string
 * - heroTitle: non-empty string
 * - heroTagline: non-empty string
 * - heroImage: valid URL string
 * - description: array of non-empty strings
 * - highlights: array of non-empty strings
 * - images: array of valid URL strings
 * - cta: object with text and buttonLabel properties
 * 
 * @param {*} data - Service data object to validate
 * @returns {ValidationResult} Validation result with errors if any
 */
export function validateServiceData(data) {
  const errors = [];

  // Check if data is an object
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return {
      valid: false,
      errors: [{
        field: 'data',
        message: 'Service data must be an object',
        value: data
      }]
    };
  }

  // Validate serviceId or id field
  const serviceId = data.serviceId || data.id;
  if (!isNonEmptyString(serviceId)) {
    errors.push({
      field: 'serviceId',
      message: 'serviceId must be a non-empty string',
      value: serviceId
    });
  }

  // Validate heroTitle
  if (!isNonEmptyString(data.heroTitle)) {
    errors.push({
      field: 'heroTitle',
      message: 'heroTitle must be a non-empty string',
      value: data.heroTitle
    });
  }

  // Validate heroTagline
  if (!isNonEmptyString(data.heroTagline)) {
    errors.push({
      field: 'heroTagline',
      message: 'heroTagline must be a non-empty string',
      value: data.heroTagline
    });
  }

  // Validate heroImage
  if (!isValidUrl(data.heroImage)) {
    errors.push({
      field: 'heroImage',
      message: 'heroImage must be a valid URL string',
      value: data.heroImage
    });
  }

  // Validate featuredImage
  if (!isValidUrl(data.featuredImage)) {
    errors.push({
      field: 'featuredImage',
      message: 'featuredImage must be a valid URL string',
      value: data.featuredImage
    });
  }

  // Validate description array
  if (!isStringArray(data.description)) {
    errors.push({
      field: 'description',
      message: 'description must be an array of non-empty strings',
      value: data.description
    });
  }

  // Validate highlights array
  if (!isStringArray(data.highlights)) {
    errors.push({
      field: 'highlights',
      message: 'highlights must be an array of non-empty strings',
      value: data.highlights
    });
  }

  // Validate images array
  if (!isUrlArray(data.images)) {
    errors.push({
      field: 'images',
      message: 'images must be an array of valid URL strings',
      value: data.images
    });
  }

  // Validate cta object
  if (!data.cta || typeof data.cta !== 'object' || Array.isArray(data.cta)) {
    errors.push({
      field: 'cta',
      message: 'cta must be an object',
      value: data.cta
    });
  } else {
    // Validate cta.text
    if (!isNonEmptyString(data.cta.text)) {
      errors.push({
        field: 'cta.text',
        message: 'cta.text must be a non-empty string',
        value: data.cta.text
      });
    }

    // Validate cta.buttonLabel
    if (!isNonEmptyString(data.cta.buttonLabel)) {
      errors.push({
        field: 'cta.buttonLabel',
        message: 'cta.buttonLabel must be a non-empty string',
        value: data.cta.buttonLabel
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates an array of service data objects
 * 
 * Validates each service in the array and aggregates all errors.
 * Also checks for duplicate serviceIds across the array.
 * 
 * @param {*} data - Array of service data objects or object with services
 * @returns {ValidationResult} Validation result with all errors
 */
export function validateServiceArray(data) {
  const errors = [];

  // Handle different input formats
  let servicesArray = [];
  
  if (Array.isArray(data)) {
    servicesArray = data;
  } else if (data && typeof data === 'object') {
    // Handle object with service IDs as keys
    servicesArray = Object.values(data);
  } else {
    return {
      valid: false,
      errors: [{
        field: 'data',
        message: 'Service data must be an array or object',
        value: data
      }]
    };
  }

  // Check if array is empty
  if (servicesArray.length === 0) {
    return {
      valid: false,
      errors: [{
        field: 'data',
        message: 'Service array cannot be empty',
        value: data
      }]
    };
  }

  // Track serviceIds to check for duplicates
  const serviceIds = new Set();
  const duplicateIds = new Set();

  // Validate each service
  servicesArray.forEach((service, index) => {
    const result = validateServiceData(service);
    
    if (!result.valid) {
      // Add index information to errors
      result.errors.forEach(error => {
        errors.push({
          ...error,
          field: `[${index}].${error.field}`,
          message: `Service at index ${index}: ${error.message}`
        });
      });
    }

    // Check for duplicate serviceIds
    const serviceId = service?.serviceId || service?.id;
    if (serviceId) {
      if (serviceIds.has(serviceId)) {
        duplicateIds.add(serviceId);
      } else {
        serviceIds.add(serviceId);
      }
    }
  });

  // Report duplicate serviceIds
  if (duplicateIds.size > 0) {
    duplicateIds.forEach(id => {
      errors.push({
        field: 'serviceId',
        message: `Duplicate serviceId found: ${id}`,
        value: id
      });
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
