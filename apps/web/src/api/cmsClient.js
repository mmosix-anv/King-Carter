/**
 * Custom CMS API Client
 * Replaces Strapi integration with custom backend
 */

const CMS_BASE_URL = import.meta.env.VITE_CMS_URL || 'http://localhost:3001';

class CMSClient {
  constructor() {
    this.baseURL = CMS_BASE_URL;
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
      console.warn(`CMS request failed: ${error.message}`);
      throw error;
    }
  }

  async fetchServices() {
    try {
      const response = await this._makeRequest('/api/services');
      
      // Transform to expected format
      const transformed = {};
      response.data.forEach(service => {
        transformed[service.id] = service;
      });

      return transformed;
    } catch (error) {
      // Fallback to local data
      const { servicesData } = await import('../data/services.js');
      return servicesData;
    }
  }

  async fetchServiceById(serviceId) {
    try {
      const response = await this._makeRequest(`/api/services/${serviceId}`);
      return response.data[0] || null;
    } catch (error) {
      // Fallback to local data
      const { servicesData } = await import('../data/services.js');
      return servicesData[serviceId] || null;
    }
  }

  async fetchNavLinks() {
    try {
      const response = await this._makeRequest('/api/nav-links');
      return response.data;
    } catch (error) {
      // Fallback data
      return {
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
    }
  }

  async fetchGlobalSettings() {
    try {
      const response = await this._makeRequest('/api/global-settings');
      return response.data;
    } catch (error) {
      return {};
    }
  }
}

export function createCMSClient() {
  return new CMSClient();
}

export { CMSClient };