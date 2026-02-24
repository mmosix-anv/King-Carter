import React from 'react';
import styles from './index.module.scss';

const ContactSection = () => {
  return (
    <div className={styles.contactSection}>
      <div className={styles.contactContainer}>
        <h2 className={styles.contactTitle}>Let's Elevate Your Travel</h2>
        <p className={styles.contactCopy}>Book with confidence. Arrive with ease.</p>
        <p className={styles.contactSubCopy}>Our team is ready to coordinate your next journey.</p>
        <button className={styles.bookBtn}>Book Now</button>
      </div>
    </div>
  );
};

export default ContactSection;
