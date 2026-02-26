import React from 'react';
import styles from './MapSection.module.scss';

const MapSection = () => {
  return (
    <div className={styles.section}>
      <div className={styles.card}>
        <h2>Wherever you are, we are.</h2>
        <p>We're as global as it gets, with 40 offices worldwide. We speak your language, literally (54, to be precise). We're the world's largest luxury concierge group, and we're here for you wherever you are, whenever you need us.</p>
        <button>Apply for membership</button>
        <div className={styles.mapContainer}>
          <img src="/image/mlvh9or1-iiipc18.png" alt="World map with office locations" />
        </div>
      </div>
    </div>
  );
};

export default MapSection;
