import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.rightColumn}>
      <div className={styles.leftColumn}>
        <p className={styles.whoWeAre}>Who We Are</p>
        <p className={styles.kingCarterPremierIsB3}>
          <span className={styles.kingCarterPremierIsB}>
            King & Carter Premier is built on a simple belief:
            <br />
          </span>
          <span className={styles.kingCarterPremierIsB2}>
            True luxury is not loud, it is intentional.
          </span>
        </p>
        <p className={styles.inspiredByWorldClass2}>
          <span className={styles.kingCarterPremierIsB}>
            Inspired by world-class hospitality, we focus on calm,
            <br />
          </span>
          <span className={styles.inspiredByWorldClass}>
            well-coordinated experiences rather than excess. Every
            <br />
          </span>
          <span className={styles.inspiredByWorldClass}>
            journey is designed to feel seamless, personal, and refined.
          </span>
        </p>
        <div className={styles.clip}>
          <p className={styles.learnMoreAboutUs}>Learn More About Us</p>
        </div>
      </div>
    </div>
  );
}

export default Component;
