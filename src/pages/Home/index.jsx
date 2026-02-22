import React from 'react';
import { Link } from 'react-router-dom';
import { servicesData } from '../../data/services';
import Layout from '../../components/Layout';
import styles from './index.module.scss';

const services = Object.values(servicesData).map((service) => ({
  id: service.id,
  title: service.heroTitle,
  image: service.heroImage,
  link: `/services/${service.id}`,
}));

const whyItems = [
  { id: 1, description: 'A calm, professional experience from booking to arrival' },
  { id: 2, description: 'Discreet, reliable, and well-presented drivers' },
  { id: 3, description: 'Clean, modern vehicles designed for comfort' },
  { id: 4, description: 'Personalized coordination for every engagement' },
  { id: 5, description: 'A brand rooted in service, not spectacle' },
];

const Home = () => {
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

        <section className={styles.services}>
          <h2 className={styles.sectionTitle}>Services</h2>
          <div className={styles.gridContainer}>
            {services.map((service) => (
              <Link key={service.id} to={service.link} className={styles.card}>
                <img src={service.image} alt={service.title} className={styles.cardImage} />
                <div className={styles.cardOverlay}>
                  <h3 className={styles.cardTitle}>{service.title}</h3>
                  <button className={styles.learnMoreBtn}>Learn more</button>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.whyKingCarter}>
          <h2 className={styles.sectionTitle}>Why King & Carter</h2>
          <p className={styles.sectionSubtitle}>Premium is felt in the details</p>
          <div className={styles.whyGrid}>
            {whyItems.map((item) => (
              <div key={item.id} className={styles.whyItem}>
                <div className={styles.circle}>
                  <p className={styles.whyText}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Home;
