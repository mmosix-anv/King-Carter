import React from 'react';
import styles from './index.module.scss';

const ContactSection = () => {
  return (
    <div className={styles.contactSection}>
      <div className={styles.contactContainer}>
        <h2 className={styles.contactTitle}>Contact us</h2>
        <form className={styles.contactForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">First name *</label>
              <input type="text" id="firstName" name="firstName" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="lastName">Last name *</label>
              <input type="text" id="lastName" name="lastName" />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email address *</label>
            <input type="email" id="email" name="email" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="message">How can we help? *</label>
            <textarea id="message" name="message" rows="1"></textarea>
          </div>
          
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" name="subscribe" />
              <span>I would like to subscribe to receive communications from King + Carter Experiences</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" name="terms" />
              <span>I confirm that I have read and agree with the Terms & Conditions and Privacy Policy *</span>
            </label>
          </div>

          <button type="submit" className={styles.submitBtn}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ContactSection;
