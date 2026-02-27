import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './AdminLayout.module.scss';

const AdminLayout = ({ children }) => {
  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <div className={styles.mainWrapper}>
        <Header />
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
