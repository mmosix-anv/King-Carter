import React, { useState } from 'react';
import styles from './index.module.scss';
import { countries } from '../../data/countries';
import { sendFormSubmission } from '../../utils/emailService';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    salutation: '',
    firstName: '',
    lastName: '',
    country: '',
    email: '',
    phoneCode: '+1',
    phone: '',
    hearAbout: '',
    message: '',
    newsletter: false,
    terms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const result = await sendFormSubmission(formData, 'Membership Enquiry');
    
    setIsSubmitting(false);
    setSubmitStatus(result);

    if (result.success) {
      setFormData({
        salutation: '',
        firstName: '',
        lastName: '',
        country: '',
        email: '',
        phoneCode: '+1',
        phone: '',
        hearAbout: '',
        message: '',
        newsletter: false,
        terms: false
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  return (
    <section className={styles.formSection}>
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Want to enquire about private membership?</h2>
        <p className={styles.formSubtitle}>Fill out the form below.</p>
        <p className={styles.formNote}>For all other enquiries, <a href="#">click here</a>.</p>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <select className={styles.input} value={formData.salutation} onChange={(e) => handleChange('salutation', e.target.value)}>
            <option value="">Salutation</option>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Ms">Ms</option>
            <option value="Dr">Dr</option>
            <option value="Prof">Prof</option>
          </select>
          
          <div className={styles.nameRow}>
            <input type="text" placeholder="First name *" className={styles.input} value={formData.firstName} onChange={(e) => handleChange('firstName', e.target.value)} required />
            <input type="text" placeholder="Last name *" className={styles.input} value={formData.lastName} onChange={(e) => handleChange('lastName', e.target.value)} required />
          </div>
          
          <select className={styles.input} value={formData.country} onChange={(e) => handleChange('country', e.target.value)} required>
            <option value="">Country of residence *</option>
            {countries.map((country) => (
              <option key={country.name} value={country.name}>{country.name}</option>
            ))}
          </select>
          
          <input type="email" placeholder="Email address *" className={styles.input} value={formData.email} onChange={(e) => handleChange('email', e.target.value)} required />
          
          <div className={styles.phoneRow}>
            <select className={`${styles.input} ${styles.codeInput}`} value={formData.phoneCode} onChange={(e) => handleChange('phoneCode', e.target.value)}>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>{country.code}</option>
              ))}
            </select>
            <input type="tel" placeholder="Phone number *" className={styles.input} value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} required />
          </div>
          
          <input type="text" placeholder="How did you hear about us?" className={styles.input} value={formData.hearAbout} onChange={(e) => handleChange('hearAbout', e.target.value)} />
          
          <textarea placeholder="Let us know how we can help you... *" className={styles.textarea} rows="5" value={formData.message} onChange={(e) => handleChange('message', e.target.value)} required />
          
          <label className={styles.checkbox}>
            <input type="checkbox" checked={formData.newsletter} onChange={(e) => handleChange('newsletter', e.target.checked)} />
            <span>I would like to subscribe to King + Carter's Noted Newsletter</span>
          </label>
          
          <label className={styles.checkbox}>
            <input type="checkbox" checked={formData.terms} onChange={(e) => handleChange('terms', e.target.checked)} required />
            <span>I confirm that I have read and agree with the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>.*</span>
          </label>
          
          <p className={styles.required}>* Indicates required field</p>
          
          {submitStatus && (
            <div className={submitStatus.success ? styles.successMessage : styles.errorMessage}>
              {submitStatus.message}
            </div>
          )}
          
          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
