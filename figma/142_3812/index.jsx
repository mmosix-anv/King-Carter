import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.vector}>
      <p className={styles.whyKingCarter}>Why King & Carter</p>
      <p className={styles.premiumIsFeltInTheDe}>Premium is felt in the details.</p>
      <div className={styles.groups2}>
        <p className={styles.professionalExperien3}>
          <span className={styles.professionalExperien}>
            Professional experience
            <br />
          </span>
          <span className={styles.professionalExperien2}>
            from booking to arrival
          </span>
        </p>
        <img src="../image/mlx6pxfq-hxpyzi5.svg" className={styles.groups} />
      </div>
    </div>
  );
}

export default Component;
