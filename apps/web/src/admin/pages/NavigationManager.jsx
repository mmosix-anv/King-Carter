import { useState, useEffect } from 'react';
import FormField from '../../components/AdminFormFields/FormField';
import styles from './NavigationManager.module.scss';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const NavigationManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [navigation, setNavigation] = useState({
    leftLinks: [],
    rightLinks: [],
    ctaButtons: {
      primary: { label: '', url: '', variant: 'primary' },
      secondary: { label: '', url: '', variant: 'secondary' }
    }
  });
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    loadNavigation();
  }, []);

  const loadNavigation = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/nav-links`);
      const data = await response.json();
      
      if (data.success) {
        setNavigation(data.data);
      }
    } catch (error) {
      console.error('Failed to load navigation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = (section) => {
    const newLink = {
      label: '',
      url: '',
      openInNewTab: false
    };

    setNavigation(prev => ({
      ...prev,
      [section]: [...prev[section], newLink]
    }));
  };

  const handleUpdateLink = (section, index, field, value) => {
    setNavigation(prev => ({
      ...prev,
      [section]: prev[section].map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const handleRemoveLink = (section, index) => {
    setNavigation(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleDragStart = (section, index) => {
    setDraggedItem({ section, index });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (section, dropIndex) => {
    if (!draggedItem || draggedItem.section !== section) return;

    const items = [...navigation[section]];
    const [removed] = items.splice(draggedItem.index, 1);
    items.splice(dropIndex, 0, removed);

    setNavigation(prev => ({
      ...prev,
      [section]: items
    }));

    setDraggedItem(null);
  };

  const handleUpdateCTA = (type, field, value) => {
    setNavigation(prev => ({
      ...prev,
      ctaButtons: {
        ...prev.ctaButtons,
        [type]: {
          ...prev.ctaButtons[type],
          [field]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/nav-links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(navigation)
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Navigation saved successfully!');
      } else {
        alert('Failed to save navigation: ' + data.error);
      }
    } catch (error) {
      alert('Failed to save navigation: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading navigation...</div>;
  }

  return (
    <div className={styles.navigationManager}>
      <div className={styles.header}>
        <h1>Navigation Management</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>Left Navigation</h2>
          <div className={styles.linksList}>
            {navigation.leftLinks.map((link, index) => (
              <div
                key={index}
                className={styles.linkItem}
                draggable
                onDragStart={() => handleDragStart('leftLinks', index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop('leftLinks', index)}
              >
                <div className={styles.dragHandle}>⋮⋮</div>
                <div className={styles.linkFields}>
                  <FormField
                    name={`leftLink-label-${index}`}
                    label="Label"
                    value={link.label}
                    onChange={(value) => handleUpdateLink('leftLinks', index, 'label', value)}
                    placeholder="Link label"
                  />
                  <FormField
                    name={`leftLink-url-${index}`}
                    label="URL"
                    value={link.url}
                    onChange={(value) => handleUpdateLink('leftLinks', index, 'url', value)}
                    placeholder="/path or https://..."
                  />
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={link.openInNewTab}
                      onChange={(e) => handleUpdateLink('leftLinks', index, 'openInNewTab', e.target.checked)}
                    />
                    Open in new tab
                  </label>
                </div>
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemoveLink('leftLinks', index)}
                  type="button"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            className={styles.addButton}
            onClick={() => handleAddLink('leftLinks')}
            type="button"
          >
            + Add Left Link
          </button>
        </div>

        <div className={styles.section}>
          <h2>Right Navigation</h2>
          <div className={styles.linksList}>
            {navigation.rightLinks.map((link, index) => (
              <div
                key={index}
                className={styles.linkItem}
                draggable
                onDragStart={() => handleDragStart('rightLinks', index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop('rightLinks', index)}
              >
                <div className={styles.dragHandle}>⋮⋮</div>
                <div className={styles.linkFields}>
                  <FormField
                    name={`rightLink-label-${index}`}
                    label="Label"
                    value={link.label}
                    onChange={(value) => handleUpdateLink('rightLinks', index, 'label', value)}
                    placeholder="Link label"
                  />
                  <FormField
                    name={`rightLink-url-${index}`}
                    label="URL"
                    value={link.url}
                    onChange={(value) => handleUpdateLink('rightLinks', index, 'url', value)}
                    placeholder="/path or https://..."
                  />
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={link.openInNewTab}
                      onChange={(e) => handleUpdateLink('rightLinks', index, 'openInNewTab', e.target.checked)}
                    />
                    Open in new tab
                  </label>
                </div>
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemoveLink('rightLinks', index)}
                  type="button"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            className={styles.addButton}
            onClick={() => handleAddLink('rightLinks')}
            type="button"
          >
            + Add Right Link
          </button>
        </div>

        <div className={styles.section}>
          <h2>CTA Buttons</h2>
          <div className={styles.ctaSection}>
            <h3>Primary CTA</h3>
            <FormField
              name="primaryCta-label"
              label="Label"
              value={navigation.ctaButtons.primary.label}
              onChange={(value) => handleUpdateCTA('primary', 'label', value)}
              placeholder="Get Started"
            />
            <FormField
              name="primaryCta-url"
              label="URL"
              value={navigation.ctaButtons.primary.url}
              onChange={(value) => handleUpdateCTA('primary', 'url', value)}
              placeholder="/contact"
            />
          </div>
          <div className={styles.ctaSection}>
            <h3>Secondary CTA</h3>
            <FormField
              name="secondaryCta-label"
              label="Label"
              value={navigation.ctaButtons.secondary.label}
              onChange={(value) => handleUpdateCTA('secondary', 'label', value)}
              placeholder="Learn More"
            />
            <FormField
              name="secondaryCta-url"
              label="URL"
              value={navigation.ctaButtons.secondary.url}
              onChange={(value) => handleUpdateCTA('secondary', 'url', value)}
              placeholder="/about"
            />
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.saveButton}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Navigation'}
        </button>
      </div>
    </div>
  );
};

export default NavigationManager;
