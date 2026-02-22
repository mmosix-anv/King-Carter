import React from 'react';
import styles from './index.module.scss';

const Fleet = () => {
  return (
    <section className={styles.fleet}>
      <h2 className={styles.title}>Our Fleet</h2>
      <p className={styles.description}>
        Modern luxury vehicles selected for comfort, discretion, and performance.
        <br />
        Each vehicle is professionally maintained and presented to reflect our standards.
      </p>
      <button className={styles.viewFleetBtn}>View Fleet</button>
      <img src="/image/mlx4m0c6-tpzg9tm.png" alt="Fleet of luxury vehicles" className={styles.fleetImage} />
    </section>
  );
};

export default Fleet;
