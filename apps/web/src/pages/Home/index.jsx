import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchServices } from '../../data/strapiServices';
import Layout from '../../components/Layout';
import Fleet from '../../components/Fleet';
import WhoWeAre from '../../components/WhoWeAre';
import ServiceErrorBoundary from '../../components/ServiceErrorBoundary';
import { useSEO } from '../../hooks/useSEO';
import { pageSEO } from '../../config/seo';
import styles from './index.module.scss';

const whyItems = [
  { 
    id: 1, 
    line1: 'Professional experience',
    line2: 'from booking to arrival'
  },
  { 
    id: 2, 
    line1: 'Discreet, reliable, and',
    line2: 'well-presented drivers'
  },
  { 
    id: 3, 
    line1: 'Clean, modern vehicles',
    line2: 'designed for comfort'
  },
  { 
    id: 4, 
    line1: 'Personalized coordination',
    line2: 'for every engagement'
  },
  { 
    id: 5, 
    line1: 'A brand rooted in',
    line2: 'service, not spectacle'
  },
];

const Home = () => {
  const [services, setServices] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState(null);

  useSEO(pageSEO.home);

  useEffect(() => {
    fetchServices()
      .then(data => {
        const servicesList = Object.values(data).map(service => ({
          id: service.id,
          title: service.heroTitle,
          image: service.featuredImage,
          link: `/services/${service.id}`,
        }));
        setServices(servicesList);
      })
      .catch(error => {
        console.error('Failed to load services:', error);
        setError(error);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % whyItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Throw error during render so error boundary can catch it
  if (error) {
    throw error;
  }

  return (
    <Layout>
      <main className={styles.homepage}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Premium service,<br />Delivered with Intention</h1>
            <p className={styles.heroSubtitle}>Private transport experiences shaped by hospitality, discretion, and modern elegance.</p>
          </div>
        </section>

        <section className={styles.intro}>
          <div className={styles.introContent}>
            <p className={styles.introText}>
              King & Carter Premier provides elevated ground transportation for individuals, executives, and organizations who value comfort, reliability, and thoughtful service.
            </p>
            <Link to="/experience" className={styles.bookExperienceBtn}>Book an Experience</Link>
          </div>
        </section>

        <ServiceErrorBoundary>
          <section className={styles.services}>
            <h2 className={styles.sectionTitle}>Services</h2>
            <div className={styles.gridContainer}>
              {services.map((service) => (
                <Link 
                  key={service.id} 
                  to={service.link} 
                  className={styles.card}
                  style={{ backgroundImage: `url(${service.image})` }}
                >
                  <div className={styles.cardOverlay}>
                    <h3 className={styles.cardTitle}>{service.title}</h3>
                    <button className={styles.learnMoreBtn}>Learn more</button>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </ServiceErrorBoundary>

        <Fleet />

        <WhoWeAre />

        <section className={styles.whyKingCarter}>
          <h2 className={styles.sectionTitle}>Why King & Carter</h2>
          <p className={styles.sectionSubtitle}>Premium is felt in the details.</p>
          <div className={styles.carouselContainer}>
            <button 
              className={styles.carouselArrow}
              onClick={() => goToSlide((currentSlide - 1 + whyItems.length) % whyItems.length)}
              aria-label="Previous slide"
            >
              ‹
            </button>
            <div className={styles.carouselTrack}>
              {whyItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`${styles.whyFeature} ${index === currentSlide ? styles.active : ''}`}
                >
                  <p className={styles.featureText}>
                    {item.line1}
                    <br />
                    {item.line2}
                  </p>
                </div>
              ))}
            </div>
            <button 
              className={styles.carouselArrow}
              onClick={() => goToSlide((currentSlide + 1) % whyItems.length)}
              aria-label="Next slide"
            >
              ›
            </button>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Home;
