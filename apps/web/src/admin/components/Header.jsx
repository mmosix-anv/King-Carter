import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Header.module.scss';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.pageInfo}>
          <h1 className={styles.pageTitle}>Admin Panel</h1>
        </div>

        <div className={styles.userSection}>
          {user && (
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.username || 'Admin'}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={styles.logoutButton}
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
