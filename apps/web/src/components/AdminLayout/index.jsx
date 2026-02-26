import { useState, useEffect } from 'react';
import { Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import styles from './AdminLayout.module.scss';

const AdminLayout = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    navigate('/admin/login');
  };

  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className={styles.adminLayout}>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <img src="/image/mlt04j7r-kvcsgr5.svg" alt="King & Carter Premier" />
          <h1>CMS Admin Portal</h1>
        </div>
        
        <nav className={styles.nav}>
          <Link 
            to="/admin" 
            className={location.pathname === '/admin' ? styles.active : ''}
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/services" 
            className={location.pathname === '/admin/services' ? styles.active : ''}
          >
            Services
          </Link>
          <Link 
            to="/admin/navigation" 
            className={location.pathname === '/admin/navigation' ? styles.active : ''}
          >
            Navigation
          </Link>
          <Link 
            to="/admin/settings" 
            className={location.pathname === '/admin/settings' ? styles.active : ''}
          >
            Settings
          </Link>
        </nav>
        
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Logout
        </button>
      </header>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;