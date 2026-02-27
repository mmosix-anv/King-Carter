import { useState, useEffect } from 'react';
import FormField from '../../components/AdminFormFields/FormField';
import TextArea from '../../components/AdminFormFields/TextArea';
import ImageUpload from '../components/ImageUpload';
import styles from './SettingsForm.module.scss';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const SettingsForm = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      siteTitle: '',
      contactEmail: '',
      phoneNumber: ''
    },
    contact: {
      address: '',
      businessHours: ''
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      twitterCard: 'summary_large_image',
      gaId: '',
      gscCode: '',
      customMeta: ''
    }
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/global-settings`);
      const data = await response.json();
      
      if (data.success) {
        setSettings(prevSettings => ({
          general: { ...prevSettings.general, ...data.data.general },
          contact: { ...prevSettings.contact, ...data.data.contact },
          seo: { ...prevSettings.seo, ...data.data.seo }
        }));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/global-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings: ' + data.error);
      }
    } catch (error) {
      alert('Failed to save settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset settings to defaults?')) {
      setSettings({
        general: {
          siteTitle: '',
          contactEmail: '',
          phoneNumber: ''
        },
        contact: {
          address: '',
          businessHours: ''
        },
        seo: {
          metaTitle: '',
          metaDescription: '',
          ogTitle: '',
          ogDescription: '',
          ogImage: '',
          twitterCard: 'summary_large_image',
          gaId: '',
          gscCode: '',
          customMeta: ''
        }
      });
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading settings...</div>;
  }

  return (
    <div className={styles.settingsForm}>
      <div className={styles.header}>
        <h1>Global Settings</h1>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'general' ? styles.active : ''}`}
          onClick={() => setActiveTab('general')}
        >
          General
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'contact' ? styles.active : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          Contact
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'seo' ? styles.active : ''}`}
          onClick={() => setActiveTab('seo')}
        >
          SEO
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'general' && (
          <div className={styles.section}>
            <h2>General Settings</h2>
            <FormField
              name="siteTitle"
              label="Site Title"
              value={settings.general.siteTitle}
              onChange={(value) => handleChange('general', 'siteTitle', value)}
              placeholder="Enter site title"
            />
            <FormField
              name="contactEmail"
              label="Contact Email"
              type="email"
              value={settings.general.contactEmail}
              onChange={(value) => handleChange('general', 'contactEmail', value)}
              placeholder="contact@example.com"
            />
            <FormField
              name="phoneNumber"
              label="Phone Number"
              value={settings.general.phoneNumber}
              onChange={(value) => handleChange('general', 'phoneNumber', value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        )}

        {activeTab === 'contact' && (
          <div className={styles.section}>
            <h2>Contact Information</h2>
            <TextArea
              name="address"
              label="Address"
              value={settings.contact.address}
              onChange={(value) => handleChange('contact', 'address', value)}
              placeholder="Enter business address"
              rows={3}
            />
            <TextArea
              name="businessHours"
              label="Business Hours"
              value={settings.contact.businessHours}
              onChange={(value) => handleChange('contact', 'businessHours', value)}
              placeholder="Mon-Fri: 9am-5pm"
              rows={3}
            />
          </div>
        )}

        {activeTab === 'seo' && (
          <div className={styles.section}>
            <h2>SEO Settings</h2>
            <p className={styles.sectionDescription}>
              Configure search engine optimization settings for your website.
            </p>
            
            <div className={styles.subsection}>
              <h3>Basic Meta Tags</h3>
              <FormField
                name="metaTitle"
                label="Meta Title"
                value={settings.seo.metaTitle}
                onChange={(value) => handleChange('seo', 'metaTitle', value)}
                placeholder="Enter meta title"
                maxLength={60}
              />
              <TextArea
                name="metaDescription"
                label="Meta Description"
                value={settings.seo.metaDescription}
                onChange={(value) => handleChange('seo', 'metaDescription', value)}
                placeholder="Enter meta description"
                maxLength={160}
                rows={3}
              />
            </div>

            <div className={styles.subsection}>
              <h3>Open Graph (Facebook)</h3>
              <FormField
                name="ogTitle"
                label="OG Title"
                value={settings.seo.ogTitle}
                onChange={(value) => handleChange('seo', 'ogTitle', value)}
                placeholder="Enter Open Graph title"
              />
              <TextArea
                name="ogDescription"
                label="OG Description"
                value={settings.seo.ogDescription}
                onChange={(value) => handleChange('seo', 'ogDescription', value)}
                placeholder="Enter Open Graph description"
                rows={3}
              />
              <ImageUpload
                name="ogImage"
                label="OG Image"
                value={settings.seo.ogImage}
                onChange={(url) => handleChange('seo', 'ogImage', url)}
                mode="single"
              />
            </div>

            <div className={styles.subsection}>
              <h3>Twitter Card</h3>
              <FormField
                name="twitterCard"
                label="Twitter Card Type"
                value={settings.seo.twitterCard}
                onChange={(value) => handleChange('seo', 'twitterCard', value)}
                placeholder="summary_large_image"
              />
            </div>

            <div className={styles.subsection}>
              <h3>Analytics & Verification</h3>
              <FormField
                name="gaId"
                label="Google Analytics ID"
                value={settings.seo.gaId}
                onChange={(value) => handleChange('seo', 'gaId', value)}
                placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
              />
              <FormField
                name="gscCode"
                label="Google Search Console Verification Code"
                value={settings.seo.gscCode}
                onChange={(value) => handleChange('seo', 'gscCode', value)}
                placeholder="Enter verification code"
              />
            </div>

            <div className={styles.subsection}>
              <h3>Custom Meta Tags</h3>
              <TextArea
                name="customMeta"
                label="Custom Meta Tags"
                value={settings.seo.customMeta}
                onChange={(value) => handleChange('seo', 'customMeta', value)}
                placeholder="Enter custom meta tags (HTML)"
                rows={6}
              />
              <p className={styles.helpText}>
                Add any additional meta tags or scripts here. They will be inserted in the &lt;head&gt; section.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.saveButton}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        <button
          className={styles.resetButton}
          onClick={handleReset}
          disabled={saving}
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

export default SettingsForm;
