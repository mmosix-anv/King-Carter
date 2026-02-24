import React from 'react';
import Header from '../Header';
import Footer from '../MiniFooter';
import styles from './index.module.scss';

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.mainContent}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
