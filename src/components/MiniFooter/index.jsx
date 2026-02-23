import React from 'react';
import { Link } from 'react-router-dom';
import styles from './index.module.scss';
import { servicesData } from '../../data/services';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer}>

      <div className={styles.linksSection}>
        <div className={styles.content}>
          <div className={styles.column}>
            <h4 className={styles.heading}>SERVICES</h4>
            <ul className={styles.list}>
              {Object.values(servicesData).map((service) => (
                <li key={service.id}>
                  <Link to={`/services/${service.id}`}>{service.heroTitle}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>SUPPORT</h4>
            <ul className={styles.list}>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/supplier-code">Supplier Code Of Conduct</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>FOLLOW US</h4>
            <div className={styles.socialGrid}>
              <div className={styles.socialItem}>
                <img src="/image/mlswdn3c-2roa1dr.svg" alt="Instagram" />
              </div>
              <div className={styles.socialItem}>
                <img src="/image/mlswdn3c-obyakby.svg" alt="Facebook" />
              </div>
              <div className={styles.socialItem}>
                <img src="/image/twitter-x.svg" alt="X" />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.copyrightBar}>
          <p>KINGANDCARTER.COM © 2026 ALL RIGHTS RESERVED.</p>
          <div className={styles.rightSection}>
            <button onClick={scrollToTop} className={styles.scrollToTop}>↑</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
