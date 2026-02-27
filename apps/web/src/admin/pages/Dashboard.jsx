import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.scss';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalContent: 0,
    draftContent: 0,
    publishedContent: 0,
    mediaCount: 0
  });
  const [recentContent, setRecentContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load services for content stats
      const servicesResponse = await fetch(`${API_BASE_URL}/api/services`);
      const servicesData = await servicesResponse.json();
      
      if (servicesData.success) {
        const services = servicesData.data || [];
        const draftCount = services.filter(s => s.status === 'draft').length;
        const publishedCount = services.filter(s => s.status === 'published').length;
        
        setStats(prev => ({
          ...prev,
          totalContent: services.length,
          draftContent: draftCount,
          publishedContent: publishedCount
        }));

        // Get recent content (last 5)
        const recent = services
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 5);
        setRecentContent(recent);
      }

      // Load media count
      const mediaResponse = await fetch(`${API_BASE_URL}/api/media?limit=1`);
      const mediaData = await mediaResponse.json();
      
      if (mediaData.success && mediaData.pagination) {
        setStats(prev => ({
          ...prev,
          mediaCount: mediaData.pagination.total
        }));
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <p>Welcome to the admin panel</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📄</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.totalContent}</div>
            <div className={styles.statLabel}>Total Content</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>✏️</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.draftContent}</div>
            <div className={styles.statLabel}>Drafts</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.publishedContent}</div>
            <div className={styles.statLabel}>Published</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🖼️</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.mediaCount}</div>
            <div className={styles.statLabel}>Media Files</div>
          </div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h2>Quick Actions</h2>
        <div className={styles.actionsGrid}>
          <Link to="/admin/content/new" className={styles.actionCard}>
            <div className={styles.actionIcon}>➕</div>
            <div className={styles.actionLabel}>Create New Content</div>
          </Link>

          <Link to="/admin/media" className={styles.actionCard}>
            <div className={styles.actionIcon}>📁</div>
            <div className={styles.actionLabel}>Upload Media</div>
          </Link>

          <Link to="/admin/settings" className={styles.actionCard}>
            <div className={styles.actionIcon}>⚙️</div>
            <div className={styles.actionLabel}>Manage Settings</div>
          </Link>

          <Link to="/admin/navigation" className={styles.actionCard}>
            <div className={styles.actionIcon}>🧭</div>
            <div className={styles.actionLabel}>Edit Navigation</div>
          </Link>
        </div>
      </div>

      <div className={styles.recentContent}>
        <h2>Recent Content</h2>
        {recentContent.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No content yet. Create your first content item!</p>
            <Link to="/admin/content/new" className={styles.createButton}>
              Create Content
            </Link>
          </div>
        ) : (
          <div className={styles.contentList}>
            {recentContent.map((item) => (
              <Link 
                key={item.id} 
                to={`/admin/content/${item.id}`}
                className={styles.contentItem}
              >
                <div className={styles.contentInfo}>
                  <div className={styles.contentTitle}>{item.heroTitle}</div>
                  <div className={styles.contentMeta}>
                    <span className={`${styles.status} ${styles[item.status]}`}>
                      {item.status}
                    </span>
                    <span className={styles.date}>
                      Updated {formatDate(item.updatedAt)}
                    </span>
                  </div>
                </div>
                <div className={styles.contentArrow}>→</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
