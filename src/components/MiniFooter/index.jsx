import React from 'react';
import { Link } from 'react-router-dom';
import styles from './index.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>

      <div className={styles.linksSection}>
        <div className={styles.content}>
          <div className={styles.column}>
            <h4 className={styles.heading}>SERVICES</h4>
            <ul className={styles.list}>
              <li>•&nbsp;&nbsp;&nbsp;&nbsp;Private Luxury Transport</li>
              <li>•&nbsp;&nbsp;&nbsp;&nbsp;Corporate & Executive Travel</li>
              <li>•&nbsp;&nbsp;&nbsp;&nbsp;Airport & Hotel Transfers</li>
              <li>•&nbsp;&nbsp;&nbsp;&nbsp;Special Events & Lifestyle Engagements</li>
              <li>•&nbsp;&nbsp;&nbsp;&nbsp;Dedicated Driver Partnerships</li>
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
                <span>Instagram</span>
              </div>
              <div className={styles.socialItem}>
                <img src="/image/mlswdn3c-obyakby.svg" alt="Facebook" />
                <span>Facebook</span>
              </div>
              <div className={styles.socialItem}>
                <img src="/image/mlswdn3c-vd1frbk.svg" alt="Linkedin" />
                <span>Linkedin</span>
              </div>
            </div>
             <div className={styles.socialGrid}>
              <div className={styles.socialItem}>
                 <span>TikTok</span>
              </div>
              <div className={styles.socialItem}>
                 <span>Pinterest</span>
              </div>
             </div>
          </div>

          <div className={styles.column}>
             <div className={styles.enquiryBtn}>
                <div className={styles.iconContainer}>
                  <img src="/image/mlswdn3c-mn4qu50.svg" alt="enquiry" />
                </div>
                <div className={styles.btnTextContainer}>
                   <span className={styles.btnText}>Make an enquiry</span>
                </div>
             </div>
          </div>
        </div>

        <div className={styles.copyrightBar}>
          <p>KINGANDCARTER.COM © 2026 ALL RIGHTS RESERVED.</p>
          <img src="/image/mlswdn3c-d655tz3.svg" className={styles.logoSmall} alt="logo" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
