import React from 'react';
import styles from './index.module.scss';

const WhoWeAre = () => {
  return (
    <div className={styles.foundersSection}>
      <div className={styles.foundersContent}>
        <h2 className={styles.foundersTitle}>Who We Are</h2>
        <p className={styles.foundersText}>
          <span className={styles.textBold}>
            King & Carter Premier is built on a simple belief:
          </span>
          {' '}
          <span className={styles.textNormal}>
            True luxury is not loud, it is intentional.
          </span>
        </p>
        <p className={styles.foundersText}>
          <span className={styles.textBold}>
            Inspired by world-class hospitality, we focus on calm,
          </span>
          {' '}
          <span className={styles.textNormal}>
            well-coordinated experiences rather than excess. Every journey is designed to feel seamless, personal, and refined.
          </span>
        </p>
        <button className={styles.learnMoreBtn}>Learn More About Us</button>
      </div>
      <div className={styles.foundersImageContainer}>
        <img src="/image/mlx5o61c-lhkp6aq.png" className={styles.foundersImage} alt="Who We Are" />
      </div>
    </div>
  );
};

export default WhoWeAre;
