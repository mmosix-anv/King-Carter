import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import ServiceErrorBoundary from '../../components/ServiceErrorBoundary';
import { createApiClient } from '../../api/apiClient';
import { useSEO } from '../../hooks/useSEO';
import { pageSEO } from '../../config/seo';
import styles from './index.module.scss';

const ServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const client = createApiClient();
    client.fetchServiceById(serviceId)
      .then(data => {
        setServiceData(data);
        setLoading(false);
        if (!data) navigate('/', { replace: true });
      })
      .catch(error => {
        console.error('Failed to load service:', error);
        setLoading(false);
        setError(error);
      });
  }, [serviceId, navigate]);

  const seoData = pageSEO.services[serviceId] || {
    title: serviceData?.heroTitle || 'Service Details',
    description: serviceData?.heroTagline || '',
    keywords: 'luxury transportation Atlanta, premium car service'
  };

  useSEO(seoData);

  // Throw error during render so error boundary can catch it
  if (error) {
    throw error;
  }

  if (loading || !serviceData) {
    return null;
  }

  return (
    <Layout>
      <ServiceErrorBoundary>
        <div className={styles.serviceDetails}>
          {/* Hero Section */}
          <div 
            className={styles.heroSection}
            style={{ backgroundImage: `url(${serviceData?.heroImage || ''})` }}
          >
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>{serviceData?.heroTitle || 'Service'}</h1>
            </div>
          </div>

          {/* Description Section */}
          <div className={styles.description}>
            <p className={styles.designedForIndividua3}>
              {serviceData?.heroTagline || ''}
            </p>
            {(serviceData?.description || []).map((paragraph, index) => (
              <p key={index} className={styles.loremIpsumDolorSitAm4}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Highlights Section - NEW STANDALONE SECTION */}
          {serviceData?.highlights && serviceData.highlights.length > 0 && (
            <div className={styles.highlightsSection}>
              <div className={styles.highlightsContainer}>
                <h2 className={styles.highlightsTitle}>Service Highlights</h2>
                <div className={styles.highlightsGrid}>
                  {serviceData.highlights.map((highlight, index) => (
                    <div key={index} className={styles.highlightCard}>
                      <div className={styles.highlightIcon}>✓</div>
                      <p className={styles.highlightText}>{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Gallery Section */}
          <div className={styles.gallery}>
            {(serviceData?.images || []).map((image, index) => (
              <div key={index} className={styles.galleryItem}>
                <img
                  src={image}
                  className={styles.galleryImage}
                  alt={`${serviceData?.heroTitle || 'Service'} - Gallery image ${index + 1}`}
                />
              </div>
            ))}
          </div>

          {/* CTA Section */}
          {serviceData?.cta && (
            <div className={styles.cta}>
              <p className={styles.ctaText}>{serviceData.cta.text || ''}</p>
              <button className={styles.ctaButton}>{serviceData.cta.buttonLabel || 'Book Now'}</button>
            </div>
          )}
        </div>
      </ServiceErrorBoundary>
    </Layout>
  );
}

export default ServiceDetails;
