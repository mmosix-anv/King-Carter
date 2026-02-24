/**
 * Lifecycle hooks for service content type
 * Provides custom validation for JSON fields and required string fields
 * 
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7
 */

/**
 * Validates that a value is a non-empty string
 * @param {any} value - The value to validate
 * @param {string} fieldName - The name of the field being validated
 * @throws {Error} If validation fails
 */
function validateNonEmptyString(value, fieldName) {
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }
  
  if (value.trim().length === 0) {
    throw new Error(`${fieldName} must be a non-empty string`);
  }
}

/**
 * Validates that a value is a valid URL string
 * @param {any} value - The value to validate
 * @param {string} fieldName - The name of the field being validated
 * @throws {Error} If validation fails
 */
function validateUrl(value, fieldName) {
  validateNonEmptyString(value, fieldName);
  
  // Simple URL validation - starts with / or http(s)://
  if (!value.startsWith('/') && !value.startsWith('http://') && !value.startsWith('https://')) {
    throw new Error(`${fieldName} must be a valid URL (starting with /, http://, or https://)`);
  }
}

/**
 * Validates that a value is a non-empty array of strings
 * @param {any} value - The value to validate
 * @param {string} fieldName - The name of the field being validated
 * @throws {Error} If validation fails
 */
function validateStringArray(value, fieldName) {
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }
  
  if (value.length === 0) {
    throw new Error(`${fieldName} must contain at least one item`);
  }
  
  for (let i = 0; i < value.length; i++) {
    if (typeof value[i] !== 'string') {
      throw new Error(`${fieldName}[${i}] must be a string`);
    }
    if (value[i].trim().length === 0) {
      throw new Error(`${fieldName}[${i}] must be a non-empty string`);
    }
  }
}

/**
 * Validates that a value is an array of valid URL strings
 * @param {any} value - The value to validate
 * @param {string} fieldName - The name of the field being validated
 * @throws {Error} If validation fails
 */
function validateUrlArray(value, fieldName) {
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }
  
  if (value.length === 0) {
    throw new Error(`${fieldName} must contain at least one item`);
  }
  
  for (let i = 0; i < value.length; i++) {
    if (typeof value[i] !== 'string') {
      throw new Error(`${fieldName}[${i}] must be a string`);
    }
    if (value[i].trim().length === 0) {
      throw new Error(`${fieldName}[${i}] must be a non-empty string`);
    }
    // Validate URL format
    if (!value[i].startsWith('/') && !value[i].startsWith('http://') && !value[i].startsWith('https://')) {
      throw new Error(`${fieldName}[${i}] must be a valid URL (starting with /, http://, or https://)`);
    }
  }
}

/**
 * Validates that a value is a valid CTA object
 * @param {any} value - The value to validate
 * @throws {Error} If validation fails
 */
function validateCTA(value) {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('cta must be an object');
  }
  
  if (!value.hasOwnProperty('text')) {
    throw new Error('cta must have a text property');
  }
  
  if (!value.hasOwnProperty('buttonLabel')) {
    throw new Error('cta must have a buttonLabel property');
  }
  
  if (typeof value.text !== 'string' || value.text.trim().length === 0) {
    throw new Error('cta.text must be a non-empty string');
  }
  
  if (typeof value.buttonLabel !== 'string' || value.buttonLabel.trim().length === 0) {
    throw new Error('cta.buttonLabel must be a non-empty string');
  }
}

/**
 * Validates service data before create or update
 * @param {object} event - The lifecycle event object
 */
async function validateServiceData(event) {
  const { data } = event.params;
  
  // Validate serviceId (required field)
  if (data.serviceId !== undefined) {
    validateNonEmptyString(data.serviceId, 'serviceId');
  }
  
  // Validate heroTitle (required field)
  if (data.heroTitle !== undefined) {
    validateNonEmptyString(data.heroTitle, 'heroTitle');
  }
  
  // Validate heroTagline (required field)
  if (data.heroTagline !== undefined) {
    validateNonEmptyString(data.heroTagline, 'heroTagline');
  }
  
  // Validate heroImage (required field, must be URL)
  if (data.heroImage !== undefined) {
    validateUrl(data.heroImage, 'heroImage');
  }
  
  // Validate featuredImage (required field, must be URL)
  if (data.featuredImage !== undefined) {
    validateUrl(data.featuredImage, 'featuredImage');
  }
  
  // Validate description array
  if (data.description !== undefined) {
    validateStringArray(data.description, 'description');
  }
  
  // Validate highlights array
  if (data.highlights !== undefined) {
    validateStringArray(data.highlights, 'highlights');
  }
  
  // Validate images array (must be URLs)
  if (data.images !== undefined) {
    validateUrlArray(data.images, 'images');
  }
  
  // Validate cta object
  if (data.cta !== undefined) {
    validateCTA(data.cta);
  }
}

module.exports = {
  beforeCreate: validateServiceData,
  beforeUpdate: validateServiceData,
};
