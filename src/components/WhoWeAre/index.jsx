import React from 'react';
import styles from './index.module.scss';

const WhoWeAre = () => {
  return (
    <section className={styles.foundersSection}>
      <div className={styles.foundersContainer}>
        <div className={styles.foundersContent}>
          <h2 className={styles.foundersTitle}>Who We Are</h2>
          <p className={styles.foundersText}>
            King & Carter Premier is built on a simple belief:<br />
            True luxury is not loud, it is intentional.
          </p>
          <p className={styles.foundersText}>
            Inspired by world-class hospitality, we focus on calm, well-coordinated experiences rather than excess. Every journey is designed to feel seamless, personal, and refined.
          </p>
          <button className={styles.learnMoreBtn}>Learn More About Us</button>
        </div>
        <img src="/image/MixBlendGroups.png" className={styles.foundersImage} alt="Who We Are" />
      </div>
    </section>
  );
};

export default WhoWeAre;
