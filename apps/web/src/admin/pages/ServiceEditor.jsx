import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import FormField from '../../components/AdminFormFields/FormField';
import Select from '../../components/AdminFormFields/Select';
import WYSIWYGEditor from '../components/WYSIWYGEditor';
import ImageUpload from '../components/ImageUpload';
import GalleryUpload from '../components/GalleryUpload';
import { useNotification } from '../components/NotificationContainer';
import styles from './ServiceEditor.module.scss';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

/**
 * ServiceEditor Component
 * 
 * A comprehensive form for creating and editing service content with rich text editing,
 * image uploads, and draft/publish workflow.
 * 
 * Features:
 * - Form fields for service metadata (ID, hero title, tagline)
 * - Image uploads for hero and featured images
 * - WYSIWYG editors for description and highlights
 * - Gallery upload for multiple service images
 * - CTA configuration
 * - Draft/Publish workflow with status management
 * - API integration for save operations
 * - Success/error notifications
 * - Redirect on successful save
 */
const ServiceEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const isEditMode = Boolean(id);

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    heroTitle: '',
    heroTagline: '',
    heroImage: '',
    featuredImage: '',
    description: '',
    highlights: '',
    images: [],
    ctaText: '',
    ctaButton: '',
    status: 'draft',
    createdAt: null,
    createdBy: null,
    updatedAt: null,
    updatedBy: null
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load service data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      loadService(id);
    }
  }, [id, isEditMode]);

  const loadService = async (serviceId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/services/${serviceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to load service:', response.status, errorText);
        throw new Error(`Failed to load service (${response.status}): ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Loaded service data:', result);
      
      if (!result.success || !result.data) {
        throw new Error('Invalid response format from server');
      }
      
      const service = result.data;

      // Convert description array to HTML
      const descriptionHtml = Array.isArray(service.description)
        ? service.description.map(p => `<p>${p}</p>`).join('')
        : service.description || '';

      // Convert highlights array to HTML list
      const highlightsHtml = Array.isArray(service.highlights)
        ? `<ul>${service.highlights.map(h => `<li>${h}</li>`).join('')}</ul>`
        : service.highlights || '';

      setFormData({
        id: service.id || '',
        heroTitle: service.heroTitle || '',
        heroTagline: service.heroTagline || '',
        heroImage: service.heroImage || '',
        featuredImage: service.featuredImage || '',
        description: descriptionHtml,
        highlights: highlightsHtml,
        images: service.images || [],
        ctaText: service.cta?.text || '',
        ctaButton: service.cta?.buttonLabel || '',
        status: service.status || 'draft',
        createdAt: service.createdAt,
        createdBy: service.createdBy,
        updatedAt: service.updatedAt,
        updatedBy: service.updatedBy
      });
    } catch (error) {
      console.error('Error loading service:', error);
      showError(`Failed to load service: ${error.message}`);
      // Optionally redirect back to content list after showing error
      setTimeout(() => {
        navigate('/admin/content');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (value, name) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.id.trim()) {
      newErrors.id = 'Service ID is required';
    }

    if (!formData.heroTitle.trim()) {
      newErrors.heroTitle = 'Hero title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const serializeContent = () => {
    // Serialize WYSIWYG content to format expected by API
    
    // Convert description HTML to array of paragraphs
    const descriptionDiv = document.createElement('div');
    descriptionDiv.innerHTML = formData.description;
    const descriptionParagraphs = Array.from(descriptionDiv.querySelectorAll('p'))
      .map(p => p.textContent.trim())
      .filter(text => text.length > 0);

    // Convert highlights HTML to array of strings
    const highlightsDiv = document.createElement('div');
    highlightsDiv.innerHTML = formData.highlights;
    const highlightsList = Array.from(highlightsDiv.querySelectorAll('li'))
      .map(li => li.textContent.trim())
      .filter(text => text.length > 0);

    return {
      id: formData.id,
      heroTitle: formData.heroTitle,
      heroTagline: formData.heroTagline,
      heroImage: formData.heroImage,
      featuredImage: formData.featuredImage,
      description: descriptionParagraphs,
      highlights: highlightsList,
      images: formData.images,
      cta: {
        text: formData.ctaText,
        buttonLabel: formData.ctaButton
      },
      status: formData.status
    };
  };

  const handleSave = async (publishStatus) => {
    if (!validateForm()) {
      showError('Please fix the errors in the form');
      return;
    }

    setSaving(true);

    try {
      // Update status based on which button was clicked
      const dataToSave = {
        ...serializeContent(),
        status: publishStatus
      };

      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSave)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save service');
      }

      await response.json();
      
      // Show success notification
      const action = publishStatus === 'published' ? 'published' : 'saved as draft';
      showSuccess(`Service ${action} successfully`);

      // Redirect to content list after a short delay
      setTimeout(() => {
        navigate('/admin/content');
      }, 1500);

    } catch (error) {
      console.error('Error saving service:', error);
      showError(error.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAsDraft = () => {
    handleSave('draft');
  };

  const handlePublish = () => {
    handleSave('published');
  };

  const handleImageUpload = async (file) => {
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/api/media/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    const result = await response.json();
    return result.data.urls.original;
  };

  const handleGalleryUpload = async (files) => {
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await fetch(`${API_BASE_URL}/api/media/upload-multiple`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    const result = await response.json();
    return result.data.map(item => item.urls.original);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading service...</p>
      </div>
    );
  }

  return (
    <div className={styles.serviceEditor}>
      <div className={styles.header}>
        <h1>{isEditMode ? 'Edit Service' : 'Create New Service'}</h1>
        <div className={styles.statusBadge} data-status={formData.status}>
          {formData.status === 'published' ? 'Published' : 'Draft'}
        </div>
      </div>

      {/* Audit Trail */}
      {isEditMode && (formData.createdAt || formData.updatedAt) && (
        <div className={styles.auditTrail}>
          {formData.createdAt && (
            <div className={styles.auditItem}>
              <span className={styles.auditLabel}>Created:</span>
              <span className={styles.auditValue}>
                {new Date(formData.createdAt).toLocaleString()}
                {formData.createdBy && ` by User ${formData.createdBy}`}
              </span>
            </div>
          )}
          {formData.updatedAt && (
            <div className={styles.auditItem}>
              <span className={styles.auditLabel}>Last Modified:</span>
              <span className={styles.auditValue}>
                {new Date(formData.updatedAt).toLocaleString()}
                {formData.updatedBy && ` by User ${formData.updatedBy}`}
              </span>
            </div>
          )}
        </div>
      )}

      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        {/* Service ID */}
        <FormField
          label="Service ID"
          name="id"
          value={formData.id}
          onChange={handleFieldChange}
          placeholder="e.g., web-development"
          required
          error={errors.id}
          disabled={isEditMode}
        />

        {/* Hero Title */}
        <FormField
          label="Hero Title"
          name="heroTitle"
          value={formData.heroTitle}
          onChange={handleFieldChange}
          placeholder="Enter hero title"
          required
          error={errors.heroTitle}
        />

        {/* Hero Tagline */}
        <FormField
          label="Hero Tagline"
          name="heroTagline"
          value={formData.heroTagline}
          onChange={handleFieldChange}
          placeholder="Enter hero tagline"
        />

        {/* Hero Image */}
        <ImageUpload
          label="Hero Image"
          name="heroImage"
          value={formData.heroImage}
          onChange={handleFieldChange}
          onUpload={handleImageUpload}
        />

        {/* Featured Image */}
        <ImageUpload
          label="Featured Image"
          name="featuredImage"
          value={formData.featuredImage}
          onChange={handleFieldChange}
          onUpload={handleImageUpload}
        />

        {/* Description */}
        <WYSIWYGEditor
          label="Description"
          value={formData.description}
          onChange={(html) => handleFieldChange(html, 'description')}
          placeholder="Enter service description..."
        />

        {/* Highlights */}
        <WYSIWYGEditor
          label="Highlights"
          value={formData.highlights}
          onChange={(html) => handleFieldChange(html, 'highlights')}
          placeholder="Enter service highlights..."
        />

        {/* Gallery Images */}
        <GalleryUpload
          label="Gallery Images"
          name="images"
          value={formData.images}
          onChange={handleFieldChange}
          onUpload={handleGalleryUpload}
        />

        {/* CTA Text */}
        <FormField
          label="Call-to-Action Text"
          name="ctaText"
          value={formData.ctaText}
          onChange={handleFieldChange}
          placeholder="Enter CTA text"
        />

        {/* CTA Button Label */}
        <FormField
          label="CTA Button Label"
          name="ctaButton"
          value={formData.ctaButton}
          onChange={handleFieldChange}
          placeholder="Enter button label"
        />

        {/* Status Selector */}
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleFieldChange}
          options={[
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' }
          ]}
        />

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => navigate('/admin/content')}
            className={styles.cancelButton}
            disabled={saving}
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleSaveAsDraft}
            className={styles.draftButton}
            disabled={saving}
          >
            {saving && formData.status === 'draft' ? 'Saving...' : 'Save as Draft'}
          </button>
          
          <button
            type="button"
            onClick={handlePublish}
            className={styles.publishButton}
            disabled={saving}
          >
            {saving && formData.status === 'published' ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  );
};

ServiceEditor.propTypes = {};

export default ServiceEditor;
