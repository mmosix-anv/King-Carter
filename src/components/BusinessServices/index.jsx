import React from 'react';
import styles from './index.module.scss';

const BusinessServices = () => {
  return (
    <section className={styles.businessSection}>
      <h2 className={styles.sectionTitle}>Business services</h2>
      
      <div className={styles.cardsGrid}>
        <article className={styles.serviceCard}>
          <img src="/image/mlswdjno-2xyle19.png" className={styles.cardImage} alt="Corporate membership" />
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>Corporate membership</h3>
            <p className={styles.cardText}>
              Bespoke, comprehensive luxury lifestyle management by designated corporate lifestyle 
              managers who grant senior management teams unlimited access to every aspect of our offering.
            </p>
            <button className={styles.learnMore}>Learn more</button>
          </div>
        </article>

        <article className={styles.serviceCard}>
          <img src="/image/mlswdjno-3sk9bmf.png" className={styles.cardImage} alt="Brand events & experiences" />
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>Brand events & experiences</h3>
            <p className={styles.cardText}>
              Quintessentially Experiences builds lasting connections between luxury businesses and high-value 
              audiences by leading the way in events & experience strategy, activations & events, guest 
              management & experiences, and incentives & rewards.
            </p>
            <button className={styles.learnMore}>Learn more</button>
          </div>
        </article>

        <article className={styles.serviceCard}>
          <img src="/image/mlswdjno-4b312zc.png" className={styles.cardImage} alt="Private events" />
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>Private events</h3>
            <p className={styles.cardText}>
              We provide end-to-end event and party planning for clients seeking a truly bespoke service. 
              With offerings worldwide, we create legendary events in the farthest-reaching corners of the world.
            </p>
            <button className={styles.learnMore}>Learn more</button>
          </div>
        </article>
      </div>
    </section>
  );
};

export default BusinessServices;
