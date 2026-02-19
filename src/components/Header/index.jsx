import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './index.module.scss';

const Header = () => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={styles.header}>
      {!isMobileMenuOpen && (
        <div className={styles.burgerMenu} onClick={toggleMobileMenu}>
          <div className={`${styles.burgerLine} ${isMobileMenuOpen ? styles.open : ''}`}></div>
          <div className={`${styles.burgerLine} ${isMobileMenuOpen ? styles.open : ''}`}></div>
          <div className={`${styles.burgerLine} ${isMobileMenuOpen ? styles.open : ''}`}></div>
        </div>
      )}

      {isMobileMenuOpen && (
        <button className={styles.closeBtn} onClick={() => setIsMobileMenuOpen(false)}>×</button>
      )}

      <Link to="/" className={styles.logoContainer}>
        <img src="/image/mlt04j7r-kvcsgr5.svg" className={styles.logo} alt="King & Carter" />
      </Link>

      <div className={`${styles.navContainer} ${isMobileMenuOpen ? styles.navOpen : ''}`}>
        <div className={styles.navLinksWrapper}>
          <div className={styles.navLeft}>
            <div 
              className={styles.servicesDropdown}
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
              onClick={() => setIsServicesOpen(!isServicesOpen)} // For mobile click
            >
              <span className={styles.navLink}>S E R V I C E S</span>
              {isServicesOpen && (
                <div className={styles.dropdownMenu}>
                  <Link to="/services/transport" className={styles.dropdownItem}>Private Transport</Link>
                  <Link to="/services/events" className={styles.dropdownItem}>Special Events</Link>
                  <Link to="/services/corporate" className={styles.dropdownItem}>Corporate Travel</Link>
                </div>
              )}
            </div>
            <Link to="/about" className={styles.navLink}>A B O U T &nbsp; U S</Link>
          </div>

          <div className={styles.navRight}>
            <Link to="/experience" className={styles.navLink}>E X P E R I E N C E</Link>
            <Link to="/contact" className={styles.navLink}>C O N TA C T</Link>
          </div>
        </div>

        <div className={styles.authContainer}>
          <div className={styles.memberBtnWrapper}>
            <Link to="/membership" className={styles.becomeAMember}>Become a member</Link>
          </div>
          <div className={styles.loginWrapper}>
            <span className={styles.divider}>|</span>
            <Link to="/login" className={styles.loginLink}>Login</Link>
            <img src="/image/mlt04j7r-9o1telc.svg" className={styles.arrowIcon} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
