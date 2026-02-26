import getApiUrl from '../utils/apiUrl.js';

class ApiClient {
  constructor() {
    this.baseURL = getApiUrl();
  }

  async _makeRequest(endpoint) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.warn(`API request failed for ${endpoint}:`, error.message);
      throw error;
    }
  }

  async fetchServices() {
    try {
      const response = await this._makeRequest('/api/services');
      return response.data || {};
    } catch (error) {
      // Return empty object on error - components will handle fallback
      return {};
    }
  }

  async fetchServiceById(serviceId) {
    try {
      const response = await this._makeRequest(`/api/services/${serviceId}`);
      return response.data || null;
    } catch (error) {
      return null;
    }
  }

  async fetchNavLinks() {
    try {
      const response = await this._makeRequest('/api/nav-links');
      return response.data || null;
    } catch (error) {
      return null;
    }
  }
}

export function createApiClient() {
  return new ApiClient();
}

export { ApiClient };