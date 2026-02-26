import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createApiClient } from '../../api/apiClient';
import styles from './index.module.scss';

const Header = () => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navLinks, setNavLinks] = useState(null);
  const [servicesData, setServicesData] = useState({});

  useEffect(() => {
    const client = createApiClient();
    
    // Fetch navigation links
    client.fetchNavLinks().then(setNavLinks);
    
    // Fetch services for dropdown
    client.fetchServices().then(setServicesData);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Fallback data while loading
  const defaultNavLinks = {
    leftLinks: [
      { label: 'Services', url: '/services', openInNewTab: false },
      { label: 'About Us', url: '/about', openInNewTab: false }
    ],
    rightLinks: [
      { label: 'Experience', url: '#', openInNewTab: false },
      { label: 'Contact', url: '/contact', openInNewTab: false }
    ],
    ctaButtons: {
      primary: { label: 'Become a member', url: '#', variant: 'primary' },
      secondary: { label: 'Login', url: '/login', variant: 'secondary' }
    }
  };

  const links = navLinks || defaultNavLinks;

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
            {links.leftLinks.map((link, index) => {
              // Special handling for Services dropdown
              if (link.label.toLowerCase() === 'services') {
                return (
                  <div 
                    key={index}
                    className={styles.servicesDropdown}
                    onMouseEnter={() => setIsServicesOpen(true)}
                    onMouseLeave={() => setIsServicesOpen(false)}
                    onClick={() => setIsServicesOpen(!isServicesOpen)}
                  >
                    <span className={styles.navLink}>
                      {link.label.toUpperCase().split('').join(' ')}
                    </span>
                    {isServicesOpen && Object.keys(servicesData).length > 0 && (
                      <div className={styles.dropdownMenu}>
                        {Object.values(servicesData).map((service) => (
                          <Link 
                            key={service.id} 
                            to={`/services/${service.id}`} 
                            className={styles.dropdownItem}
                          >
                            {service.heroTitle}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              
              // Regular link
              return (
                <Link 
                  key={index}
                  to={link.url} 
                  className={styles.navLink}
                  target={link.openInNewTab ? '_blank' : undefined}
                  rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                >
                  {link.label.toUpperCase().split('').join(' ')}
                </Link>
              );
            })}
          </div>

          <div className={styles.navRight}>
            {links.rightLinks.map((link, index) => (
              <Link 
                key={index}
                to={link.url} 
                className={styles.navLink}
                target={link.openInNewTab ? '_blank' : undefined}
                rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
              >
                {link.label.toUpperCase().split('').join(' ')}
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.authContainer}>
          <div className={styles.memberBtnWrapper}>
            <Link to={links.ctaButtons.primary.url} className={styles.becomeAMember}>
              {links.ctaButtons.primary.label}
            </Link>
          </div>
          <div className={styles.loginWrapper}>
            <span className={styles.divider}>|</span>
            <Link to={links.ctaButtons.secondary.url} className={styles.loginLink}>
              {links.ctaButtons.secondary.label}
            </Link>
            <img src="/image/mlt04j7r-9o1telc.svg" className={styles.arrowIcon} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
