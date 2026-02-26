import React from 'react';
import styles from './index.module.scss';

const MembershipCards = () => {
  return (
    <div className={styles.cardSection}>
      <div className={styles.card}>
        <img src="/image/mlurno5w-9oadrei.png" className={styles.cardImage} alt="Private membership" />
        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>Private membership</h3>
          <p className={styles.cardDescription}>
            Bespoke concierge and lifestyle management services for discerning individuals seeking highly 
            personalised, one-to-one attention, access to the inaccessible, and the invaluable gift of time.
          </p>
          <button className={styles.cardButton}>
            <span>Learn More</span>
            <img src="/image/mlurno5p-vuiz017.svg" alt="arrow" />
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <img src="/image/mlurno5w-ndxzwwf.png" className={styles.cardImage} alt="Corporate membership" />
        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>Corporate membership</h3>
          <p className={styles.cardDescription}>
            Extending our service beyond individuals, we leverage our unique positioning to help brands and 
            businesses better serve and connect with their audiences and staff.
          </p>
          <button className={styles.cardButton}>
            <span>Learn More</span>
            <img src="/image/mlurno5p-cowk3kh.svg" alt="arrow" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipCards;
