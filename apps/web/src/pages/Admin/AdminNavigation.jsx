import { useState, useEffect } from 'react';
import getApiUrl from '../../utils/apiUrl';
import styles from './AdminNavigation.module.scss';

const AdminNavigation = () => {
  const [navData, setNavData] = useState({
    leftLinks: [],
    rightLinks: [],
    ctaButtons: { primary: {}, secondary: {} }
  });
  const [loading, setLoading] = useState(true);

  const API_URL = getApiUrl();
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    loadNavigation();
  }, []);

  const loadNavigation = async () => {
    try {
      const response = await fetch(`${API_URL}/api/nav-links`);
      const data = await response.json();
      if (data.data) {
        setNavData(data.data);
      }
    } catch (error) {
      console.error('Error loading navigation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await fetch(`${API_URL}/api/nav-links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(navData)
      });
      alert('Navigation updated successfully!');
    } catch (error) {
      console.error('Error saving navigation:', error);
      alert('Failed to save navigation');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.navigation}>
      <div className={styles.header}>
        <h2>Navigation Management</h2>
        <button onClick={handleSave} className={styles.saveBtn}>
          Save Changes
        </button>
      </div>

      <div className={styles.sections}>
        <div className={styles.section}>
          <h3>Left Navigation Links</h3>
          {navData.leftLinks.map((link, index) => (
            <div key={index} className={styles.linkItem}>
              <input
                placeholder="Label"
                value={link.label || ''}
                onChange={(e) => {
                  const newLinks = [...navData.leftLinks];
                  newLinks[index] = { ...newLinks[index], label: e.target.value };
                  setNavData({ ...navData, leftLinks: newLinks });
                }}
              />
              <input
                placeholder="URL"
                value={link.url || ''}
                onChange={(e) => {
                  const newLinks = [...navData.leftLinks];
                  newLinks[index] = { ...newLinks[index], url: e.target.value };
                  setNavData({ ...navData, leftLinks: newLinks });
                }}
              />
            </div>
          ))}
        </div>

        <div className={styles.section}>
          <h3>Right Navigation Links</h3>
          {navData.rightLinks.map((link, index) => (
            <div key={index} className={styles.linkItem}>
              <input
                placeholder="Label"
                value={link.label || ''}
                onChange={(e) => {
                  const newLinks = [...navData.rightLinks];
                  newLinks[index] = { ...newLinks[index], label: e.target.value };
                  setNavData({ ...navData, rightLinks: newLinks });
                }}
              />
              <input
                placeholder="URL"
                value={link.url || ''}
                onChange={(e) => {
                  const newLinks = [...navData.rightLinks];
                  newLinks[index] = { ...newLinks[index], url: e.target.value };
                  setNavData({ ...navData, rightLinks: newLinks });
                }}
              />
            </div>
          ))}
        </div>

        <div className={styles.section}>
          <h3>CTA Buttons</h3>
          <div className={styles.ctaSection}>
            <h4>Primary Button</h4>
            <input
              placeholder="Label"
              value={navData.ctaButtons.primary.label || ''}
              onChange={(e) => setNavData({
                ...navData,
                ctaButtons: {
                  ...navData.ctaButtons,
                  primary: { ...navData.ctaButtons.primary, label: e.target.value }
                }
              })}
            />
            <input
              placeholder="URL"
              value={navData.ctaButtons.primary.url || ''}
              onChange={(e) => setNavData({
                ...navData,
                ctaButtons: {
                  ...navData.ctaButtons,
                  primary: { ...navData.ctaButtons.primary, url: e.target.value }
                }
              })}
            />
          </div>
          
          <div className={styles.ctaSection}>
            <h4>Secondary Button</h4>
            <input
              placeholder="Label"
              value={navData.ctaButtons.secondary.label || ''}
              onChange={(e) => setNavData({
                ...navData,
                ctaButtons: {
                  ...navData.ctaButtons,
                  secondary: { ...navData.ctaButtons.secondary, label: e.target.value }
                }
              })}
            />
            <input
              placeholder="URL"
              value={navData.ctaButtons.secondary.url || ''}
              onChange={(e) => setNavData({
                ...navData,
                ctaButtons: {
                  ...navData.ctaButtons,
                  secondary: { ...navData.ctaButtons.secondary, url: e.target.value }
                }
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavigation;