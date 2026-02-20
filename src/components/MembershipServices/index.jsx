import React from 'react';
import styles from './index.module.scss';

const MembershipServices = () => {
  return (
    <section className={styles.servicesSection}>
      <h2 className={styles.sectionTitle}>Membership services</h2>
      
      <div className={styles.cardsGrid}>
        <article className={styles.serviceCard}>
          <img src="/image/mlussp2r-yr639t0.png" className={styles.cardImage} alt="Travel" />
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>Travel</h3>
            <p className={styles.cardText}>
              Our award-winning in-house travel agency comprises a specialist team well-versed in crafting 
              individualised itineraries to meet any and all travel dreams.
            </p>
            <button className={styles.learnMore}>
              <span>Learn More</span>
            </button>
          </div>
        </article>

        <article className={styles.serviceCard}>
          <img src="/image/mlussp2r-i22xtlu.png" className={styles.cardImage} alt="Restaurants & nightlife" />
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>Restaurants & nightlife</h3>
            <p className={styles.cardText}>
              Relationships with the world's best chefs and restaurants enable exclusive dining opportunities 
              and special new discoveries.
            </p>
            <button className={styles.learnMore}>
              <span>Learn More</span>
            </button>
          </div>
        </article>

        <article className={styles.serviceCard}>
          <img src="/image/mlussp2r-11a30oe.png" className={styles.cardImage} alt="Exclusive access" />
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>Exclusive access</h3>
            <p className={styles.cardText}>
              Make the most of what life has to offer: receive unprecedented access to coveted global 
              happenings, from sport to entertainment to art.
            </p>
            <button className={styles.learnMore}>
              <span>Learn More</span>
            </button>
          </div>
        </article>
      </div>
    </section>
  );
};

export default MembershipServices;
