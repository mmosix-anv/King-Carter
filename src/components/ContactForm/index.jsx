import React from 'react';
import styles from './index.module.scss';

const ContactForm = () => {
  return (
    <section className={styles.formSection}>
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Want to enquire about private membership?</h2>
        <p className={styles.formSubtitle}>Fill out the form below.</p>
        <p className={styles.formNote}>For all other enquiries, <a href="#">click here</a>.</p>
        
        <form className={styles.form}>
          <select className={styles.input}>
            <option>Salutation</option>
          </select>
          
          <div className={styles.row}>
            <input type="text" placeholder="First name *" className={styles.input} />
            <input type="text" placeholder="Last name *" className={styles.input} />
          </div>
          
          <select className={styles.input}>
            <option>Country of residence *</option>
          </select>
          
          <input type="email" placeholder="Email address *" className={styles.input} />
          
          <div className={styles.row}>
            <select className={styles.input}>
              <option>(+233) Ghana</option>
            </select>
            <input type="tel" placeholder="Phone number *" className={styles.input} />
          </div>
          
          <input type="text" placeholder="How did you hear about us?" className={styles.input} />
          
          <textarea placeholder="Let us know how we can help you... *" className={styles.textarea} rows="5" />
          
          <label className={styles.checkbox}>
            <input type="checkbox" />
            <span>I would like to subscribe to King + Carter's Noted Newsletter</span>
          </label>
          
          <label className={styles.checkbox}>
            <input type="checkbox" />
            <span>I confirm that I have read and agree with the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>.*</span>
          </label>
          
          <p className={styles.required}>* Indicates required field</p>
          
          <button type="submit" className={styles.submitBtn}>Submit</button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
