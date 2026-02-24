/**
 * Service Data Fetching Module
 * 
 * Provides functions for fetching service data from Strapi CMS
 * with automatic fallback to local data when Strapi is unavailable.
 * 
 * This module uses the StrapiClient for all API communication,
 * which handles configuration, validation, error handling, and fallback logic.
 * 
 * @module data/strapiServices
 */

import { createStrapiClient } from '../api/strapiClient.js';

// Create a singleton client instance for reuse across requests
let clientInstance = null;

/**
 * Gets or creates the Strapi client instance
 * 
 * @private
 * @returns {StrapiClient} Configured Strapi client
 */
function getClient() {
  if (!clientInstance) {
    clientInstance = createStrapiClient();
  }
  return clientInstance;
}

/**
 * Fetches all services from Strapi
 * 
 * Returns service data as an object with serviceId as keys.
 * Automatically falls back to local data if Strapi is unavailable.
 * 
 * @returns {Promise<Record<string, ServiceData>>} Services data object
 * 
 * @example
 * const services = await fetchServices();
 * // { 'private-luxury-transport': {...}, 'corporate-executive-travel': {...}, ... }
 */
export async function fetchServices() {
  const client = getClient();
  return await client.fetchServices();
}

/**
 * Fetches a single service by ID from Strapi
 * 
 * Returns the service data if found, or null if not found.
 * Automatically falls back to local data if Strapi is unavailable.
 * 
 * @param {string} serviceId - The service identifier
 * @returns {Promise<ServiceData|null>} Service data or null if not found
 * 
 * @example
 * const service = await fetchServiceById('private-luxury-transport');
 * // { id: 'private-luxury-transport', heroTitle: '...', ... }
 */
export async function fetchServiceById(serviceId) {
  const client = getClient();
  return await client.fetchServiceById(serviceId);
}
