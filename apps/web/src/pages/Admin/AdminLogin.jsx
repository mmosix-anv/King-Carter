import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import getApiUrl from '../../utils/apiUrl';
import styles from './AdminLogin.module.scss';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${getApiUrl()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin');
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Login failed');
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginForm}>
        <div className={styles.logoContainer}>
          <img src="/image/mlt04j7r-kvcsgr5.svg" alt="King & Carter Premier" />
        </div>
        
        <h2>CMS Admin Portal</h2>
        
        <div className={styles.defaultCredentials}>
          <h4>Default Login Credentials:</h4>
          <p>Username: admin</p>
          <p>Password: admin123</p>
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;