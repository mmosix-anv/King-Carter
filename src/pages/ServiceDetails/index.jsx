import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from '../../components/Layout';
import { getServiceById } from '../../data/services';
import { useSEO } from '../../hooks/useSEO';
import { pageSEO } from '../../config/seo';
import styles from './index.module.scss';

const ServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const serviceData = getServiceById(serviceId);

  const seoData = pageSEO.services[serviceId] || {
    title: serviceData?.heroTitle || 'Service Details',
    description: serviceData?.heroTagline || '',
    keywords: 'luxury transportation Atlanta, premium car service'
  };

  useSEO(seoData);

  // Redirect to home page if service not found
  useEffect(() => {
    if (!serviceData) {
      navigate('/', { replace: true });
    }
  }, [serviceData, navigate]);

  // Return null during redirect to avoid rendering invalid content
  if (!serviceData) {
    return null;
  }

  return (
    <Layout>
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

        {/* Highlights Section */}
        {serviceData?.highlights && serviceData.highlights.length > 0 && (
          <div className={styles.highlights}>
            <h2>Service Highlights</h2>
            <ul>
              {serviceData.highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Gallery Section */}
        <div className={styles.gallery}>
          {(serviceData?.images || []).map((image, index) => (
            <div 
              key={index} 
              className={index === 0 ? styles.galleryItemPrimary : styles.galleryItem}
            >
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
    </Layout>
  );
}

export default ServiceDetails;
