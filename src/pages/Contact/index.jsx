import React, { useState } from 'react';
import MiniLayout from '../../components/MiniLayout';
import styles from './Contact.module.scss';

const Contact = () => {
  const [formData, setFormData] = useState({
    salutation: '',
    firstName: '',
    lastName: '',
    country: '',
    email: '',
    phoneCode: '+233',
    phone: '',
    hearAbout: '',
    message: '',
    newsletter: false,
    terms: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <MiniLayout>
      <div style={{background: '#000', width: '100%'}}>
        <div className={styles.contact} style={{maxWidth: '1400px', margin: '0 auto'}}>
          <div className={styles.formSection}>
            <h1>Start your journey with King + Carter</h1>
            <p className={styles.subtitle}>Apply for a private membership with the world's leading luxury lifestyle management group to enjoy 24/7 personalised concierge support. The best part? The whole process takes no more than 48 hours.</p>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.row}>
                <select value={formData.salutation} onChange={(e) => setFormData({...formData, salutation: e.target.value})}>
                  <option value="">Salutation</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                </select>
                <input type="text" placeholder="First name *" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
                <input type="text" placeholder="Last name *" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
              </div>
              
              <select value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} required>
                <option value="">Country of residence *</option>
                <option value="Ghana">Ghana</option>
                <option value="UK">United Kingdom</option>
                <option value="US">United States</option>
              </select>
              
              <input type="email" placeholder="Email address *" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              
              <div className={styles.row}>
                <select value={formData.phoneCode} onChange={(e) => setFormData({...formData, phoneCode: e.target.value})}>
                  <option value="+233">(+233) Ghana</option>
                  <option value="+44">(+44) UK</option>
                  <option value="+1">(+1) US</option>
                </select>
                <input type="tel" placeholder="Phone number *" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
              </div>
              
              <input type="text" placeholder="How did you hear about us?" value={formData.hearAbout} onChange={(e) => setFormData({...formData, hearAbout: e.target.value})} />
              
              <textarea placeholder="Let us know how we can help you... *" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required></textarea>
              
              <label className={styles.checkbox}>
                <input type="checkbox" checked={formData.newsletter} onChange={(e) => setFormData({...formData, newsletter: e.target.checked})} />
                <span>I would like to subscribe to King + Carter's Noted Newsletter</span>
              </label>
              
              <label className={styles.checkbox}>
                <input type="checkbox" checked={formData.terms} onChange={(e) => setFormData({...formData, terms: e.target.checked})} required />
                <span>I confirm that I have read and agree with the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a> *</span>
              </label>
              
              <p className={styles.required}>* Indicates required field</p>
              
              <button type="submit">Submit Form</button>
            </form>
          </div>
          
          <div className={styles.infoSection}>
            <div className={styles.steps}>
              <h2>What to expect next</h2>
              <div className={styles.step}>
                <span className={styles.badge}>01</span>
                <div>
                  <h3>Submit your application</h3>
                  <p>Fill out the application form with some details about yourself and how we can help you.</p>
                </div>
              </div>
              <div className={styles.step}>
                <span className={styles.badge}>02</span>
                <div>
                  <h3>Speak to our team</h3>
                  <p>A member of our team will be in touch to explore what a King + Carter membership can do for you.</p>
                </div>
              </div>
              <div className={styles.step}>
                <span className={styles.badge}>03</span>
                <div>
                  <h3>Start your membership</h3>
                  <p>If we're the right fit for you, we'll set up your membership and you can start enjoying your personalised concierge support straight away.</p>
                </div>
              </div>
            </div>
            
            <div className={styles.testimonials}>
              <h2>What our members say</h2>
              <p className={styles.quote}>"King + Carter has become an indispensable part of my life, both professionally and personally."</p>
              <div className={styles.dots}>
                <span className={styles.active}></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MiniLayout>
  );
};

export default Contact;
