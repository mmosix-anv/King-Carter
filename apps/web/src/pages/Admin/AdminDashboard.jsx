import { Link } from 'react-router-dom';
import styles from './AdminDashboard.module.scss';

const AdminDashboard = () => {
  const dashboardItems = [
    {
      title: 'Services Management',
      description: 'Manage luxury transport services, content, and images',
      icon: '🚗',
      link: '/admin/services',
      color: '#D4AF37'
    },
    {
      title: 'Navigation Links',
      description: 'Configure website navigation and menu items',
      icon: '🧭',
      link: '/admin/navigation',
      color: '#191919'
    },
    {
      title: 'Global Settings',
      description: 'Manage site-wide settings and configurations',
      icon: '⚙️',
      link: '/admin/settings',
      color: '#6c757d'
    }
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Admin Dashboard</h1>
        <p>Manage your King & Carter Premier website content</p>
      </div>
      
      <div className={styles.grid}>
        {dashboardItems.map((item, index) => (
          <Link key={index} to={item.link} className={styles.card}>
            <div className={styles.cardIcon} style={{ color: item.color }}>
              {item.icon}
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div className={styles.cardArrow}>→</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;