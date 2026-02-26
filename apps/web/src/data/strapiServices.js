/**
 * Service Data Fetching Module
 * 
 * Provides functions for fetching service data from custom CMS
 * with automatic fallback to local data when CMS is unavailable.
 */

import { createCMSClient } from '../api/cmsClient.js';

// Create a singleton client instance for reuse across requests
let clientInstance = null;

/**
 * Gets or creates the CMS client instance
 * 
 * @private
 * @returns {CMSClient} Configured CMS client
 */
function getClient() {
  if (!clientInstance) {
    clientInstance = createCMSClient();
  }
  return clientInstance;
}

/**
 * Fetches all services from CMS
 * 
 * @returns {Promise<Record<string, ServiceData>>} Services data object
 */
export async function fetchServices() {
  const client = getClient();
  return await client.fetchServices();
}

/**
 * Fetches a single service by ID from CMS
 * 
 * @param {string} serviceId - The service identifier
 * @returns {Promise<ServiceData|null>} Service data or null if not found
 */
export async function fetchServiceById(serviceId) {
  const client = getClient();
  return await client.fetchServiceById(serviceId);
}

/**
 * Fetches navigation links from CMS
 * 
 * @returns {Promise<Object>} Navigation links data
 */
export async function fetchNavLinks() {
  const client = getClient();
  return await client.fetchNavLinks();
}

/**
 * Fetches global settings from CMS
 * 
 * @returns {Promise<Object>} Global settings data
 */
export async function fetchGlobalSettings() {
  const client = getClient();
  return await client.fetchGlobalSettings();
}
