import { useState, useEffect } from 'react';
import getApiUrl from '../../utils/apiUrl';
import styles from './AdminSettings.module.scss';

const AdminSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  const API_URL = getApiUrl();
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/global-settings`);
      const data = await response.json();
      if (data.data) {
        const settingsObj = {};
        data.data.forEach(setting => {
          settingsObj[setting.key] = setting.value;
        });
        setSettings(settingsObj);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await fetch(`${API_URL}/api/global-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };

  const updateSetting = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.settings}>
      <div className={styles.header}>
        <h2>Global Settings</h2>
        <button onClick={handleSave} className={styles.saveBtn}>
          Save Changes
        </button>
      </div>

      <div className={styles.sections}>
        <div className={styles.section}>
          <h3>Site Information</h3>
          <div className={styles.field}>
            <label>Site Title</label>
            <input
              value={settings.siteTitle || ''}
              onChange={(e) => updateSetting('siteTitle', e.target.value)}
              placeholder="King & Carter Premier"
            />
          </div>
          <div className={styles.field}>
            <label>Site Description</label>
            <textarea
              value={settings.siteDescription || ''}
              onChange={(e) => updateSetting('siteDescription', e.target.value)}
              placeholder="Luxury transport services..."
            />
          </div>
        </div>

        <div className={styles.section}>
          <h3>Contact Information</h3>
          <div className={styles.field}>
            <label>Phone Number</label>
            <input
              value={settings.phoneNumber || ''}
              onChange={(e) => updateSetting('phoneNumber', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div className={styles.field}>
            <label>Email Address</label>
            <input
              value={settings.emailAddress || ''}
              onChange={(e) => updateSetting('emailAddress', e.target.value)}
              placeholder="info@kingcarter.com"
            />
          </div>
          <div className={styles.field}>
            <label>Business Address</label>
            <textarea
              value={settings.businessAddress || ''}
              onChange={(e) => updateSetting('businessAddress', e.target.value)}
              placeholder="123 Luxury Lane, Premium City, PC 12345"
            />
          </div>
        </div>

        <div className={styles.section}>
          <h3>Social Media</h3>
          <div className={styles.field}>
            <label>Facebook URL</label>
            <input
              value={settings.facebookUrl || ''}
              onChange={(e) => updateSetting('facebookUrl', e.target.value)}
              placeholder="https://facebook.com/kingcarter"
            />
          </div>
          <div className={styles.field}>
            <label>Twitter URL</label>
            <input
              value={settings.twitterUrl || ''}
              onChange={(e) => updateSetting('twitterUrl', e.target.value)}
              placeholder="https://twitter.com/kingcarter"
            />
          </div>
          <div className={styles.field}>
            <label>LinkedIn URL</label>
            <input
              value={settings.linkedinUrl || ''}
              onChange={(e) => updateSetting('linkedinUrl', e.target.value)}
              placeholder="https://linkedin.com/company/kingcarter"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;