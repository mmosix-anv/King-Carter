import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { seoConfig } from '../config/seo';

export const useSEO = ({ title, description, keywords, image, type = 'website' }) => {
  const location = useLocation();
  const fullUrl = `${seoConfig.siteUrl}${location.pathname}`;

  useEffect(() => {
    // Update title
    document.title = title || seoConfig.defaultTitle;

    // Update or create meta tags
    updateMetaTag('description', description || seoConfig.defaultDescription);
    updateMetaTag('keywords', keywords || seoConfig.keywords.join(', '));
    updateMetaTag('author', seoConfig.author);

    // Open Graph tags
    updateMetaTag('og:title', title || seoConfig.defaultTitle, 'property');
    updateMetaTag('og:description', description || seoConfig.defaultDescription, 'property');
    updateMetaTag('og:url', fullUrl, 'property');
    updateMetaTag('og:type', type, 'property');
    updateMetaTag('og:site_name', seoConfig.siteName, 'property');
    if (image) {
      updateMetaTag('og:image', image, 'property');
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    updateMetaTag('twitter:site', seoConfig.twitterHandle, 'name');
    updateMetaTag('twitter:title', title || seoConfig.defaultTitle, 'name');
    updateMetaTag('twitter:description', description || seoConfig.defaultDescription, 'name');
    if (image) {
      updateMetaTag('twitter:image', image, 'name');
    }

    // Canonical URL
    updateLinkTag('canonical', fullUrl);

    // Structured Data
    updateStructuredData();
  }, [title, description, keywords, image, type, fullUrl]);
};

const updateMetaTag = (name, content, attribute = 'name') => {
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
};

const updateLinkTag = (rel, href) => {
  let element = document.querySelector(`link[rel="${rel}"]`);
  
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  
  element.setAttribute('href', href);
};

const updateStructuredData = () => {
  let script = document.querySelector('script[type="application/ld+json"]');
  
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  
  script.textContent = JSON.stringify(seoConfig.organization);
};

export default useSEO;
