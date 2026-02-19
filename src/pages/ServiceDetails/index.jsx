import React from 'react';
import Layout from '../../components/Layout';
import styles from './index.module.scss';

const ServiceDetails = () => {
  return (
    <Layout>
      <div className={styles.serviceDetails}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Private Luxury Transport</h1>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ServiceDetails;