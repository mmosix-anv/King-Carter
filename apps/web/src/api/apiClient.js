import getApiUrl from '../utils/apiUrl.js';
import { servicesData } from '../data/services.js';

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
      // Return fallback data when API is unavailable
      console.log('Using fallback services data');
      return servicesData;
    }
  }

  async fetchServiceById(serviceId) {
    try {
      const response = await this._makeRequest(`/api/services/${serviceId}`);
      return response.data || null;
    } catch (error) {
      // Return fallback data when API is unavailable
      console.log(`Using fallback data for service: ${serviceId}`);
      return servicesData[serviceId] || null;
    }
  }

  async fetchNavLinks() {
    const fallbackNavLinks = {
      leftLinks: [
        { label: 'Services', url: '/services', openInNewTab: false },
        { label: 'About Us', url: '/about', openInNewTab: false }
      ],
      rightLinks: [
        { label: 'Experience', url: '/experience', openInNewTab: false },
        { label: 'Contact', url: '/contact', openInNewTab: false }
      ],
      ctaButtons: {
        primary: { label: 'Become a member', url: '/membership', variant: 'primary' },
        secondary: { label: 'Login', url: '/login', variant: 'secondary' }
      }
    };

    try {
      const response = await this._makeRequest('/api/nav-links');
      return response.data || fallbackNavLinks;
    } catch (error) {
      console.log('Using fallback navigation data');
      return fallbackNavLinks;
    }
  }
}

export function createApiClient() {
  return new ApiClient();
}

export { ApiClient };