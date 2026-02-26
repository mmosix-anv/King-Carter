/**
 * Strapi Configuration Module
 * 
 * Provides environment-specific configuration for Strapi API client.
 * Handles environment variables, defaults, and logging configuration.
 * 
 * @module config/strapi
 */

/**
 * @typedef {Object} StrapiEnvironmentConfig
 * @property {string} apiUrl - The base URL for the Strapi API
 * @property {number} timeout - Request timeout in milliseconds
 * @property {boolean} enableDetailedLogging - Whether to enable detailed error logging
 * @property {boolean} requireExplicitConfig - Whether explicit configuration is required
 */

/**
 * Get Strapi configuration based on environment variables and environment type.
 * 
 * Configuration sources:
 * - VITE_STRAPI_URL: Strapi API base URL
 * - VITE_STRAPI_TIMEOUT: Request timeout in milliseconds
 * - NODE_ENV or import.meta.env.MODE: Environment detection
 * 
 * Defaults:
 * - Development: http://localhost:1337, 5000ms timeout, detailed logging
 * - Production: No default URL (must be explicit), 10000ms timeout, minimal logging
 * 
 * @returns {StrapiEnvironmentConfig} Configuration object for Strapi client
 * 
 * @example
 * // In development (no env vars set)
 * const config = getStrapiConfig();
 * // { apiUrl: 'http://localhost:1337', timeout: 5000, enableDetailedLogging: true, requireExplicitConfig: false }
 * 
 * @example
 * // In production with env var
 * // VITE_STRAPI_URL=https://api.example.com
 * const config = getStrapiConfig();
 * // { apiUrl: 'https://api.example.com', timeout: 10000, enableDetailedLogging: false, requireExplicitConfig: true }
 */
export function getStrapiConfig() {
  // Detect environment - check both NODE_ENV and Vite's import.meta.env.MODE
  const isDevelopment = 
    (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') ||
    (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'development');

  // Read environment variables
  const envUrl = typeof import.meta !== 'undefined' 
    ? import.meta.env?.VITE_STRAPI_URL 
    : (typeof process !== 'undefined' ? process.env?.VITE_STRAPI_URL : undefined);
  
  const envTimeout = typeof import.meta !== 'undefined'
    ? import.meta.env?.VITE_STRAPI_TIMEOUT
    : (typeof process !== 'undefined' ? process.env?.VITE_STRAPI_TIMEOUT : undefined);

  // Determine API URL based on environment
  let apiUrl;
  if (envUrl) {
    // Use explicit environment variable if provided
    apiUrl = envUrl;
  } else if (isDevelopment) {
    // Development default: localhost
    apiUrl = 'http://localhost:1337';
  } else {
    // Production: no default, must be explicit
    // Return empty string to signal missing configuration
    apiUrl = '';
  }

  // Determine timeout based on environment
  const timeout = envTimeout 
    ? parseInt(envTimeout, 10) 
    : (isDevelopment ? 5000 : 10000);

  // Configure logging based on environment
  const enableDetailedLogging = isDevelopment;
  const requireExplicitConfig = !isDevelopment;

  return {
    apiUrl,
    timeout,
    enableDetailedLogging,
    requireExplicitConfig
  };
}
