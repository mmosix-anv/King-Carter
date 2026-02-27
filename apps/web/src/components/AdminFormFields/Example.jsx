import { useState } from 'react';
import { FormField, TextArea, Select, LoadingSpinner, ConfirmDialog } from './index';

/**
 * Example usage of AdminFormFields components
 * This file demonstrates all features and can be used for visual testing
 */
const AdminFormFieldsExample = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    email: '',
    metaDescription: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleChange = (value, name) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title) {
      newErrors.title = 'Title is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.status) {
      newErrors.status = 'Please select a status';
    }

    if (formData.metaDescription && formData.metaDescription.length > 160) {
      newErrors.metaDescription = 'Meta description must be 160 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      // Simulate async operation
      setTimeout(() => {
        setIsLoading(false);
        alert('Form is valid! Data: ' + JSON.stringify(formData, null, 2));
      }, 2000);
    }
  };

  const handleDelete = () => {
    setShowConfirmDialog(true);
  };

  const confirmDelete = () => {
    setShowConfirmDialog(false);
    alert('Item deleted!');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
      <h2>Admin Form Fields Example</h2>
      
      {/* Loading Spinner Examples */}
      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Loading Spinners</h3>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginTop: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Small</p>
            <LoadingSpinner size="small" />
          </div>
          <div>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Medium</p>
            <LoadingSpinner size="medium" />
          </div>
          <div>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Large</p>
            <LoadingSpinner size="large" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <FormField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter title"
          required={true}
          error={errors.title}
        />

        <FormField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="user@example.com"
          required={true}
          error={errors.email}
        />

        <TextArea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description"
          rows={4}
        />

        <TextArea
          label="Meta Description"
          name="metaDescription"
          value={formData.metaDescription}
          onChange={handleChange}
          placeholder="SEO meta description"
          maxLength={160}
          rows={3}
          error={errors.metaDescription}
        />

        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={[
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' },
            { value: 'archived', label: 'Archived' }
          ]}
          placeholder="Select status"
          required={true}
          error={errors.status}
        />

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <button 
            type="submit"
            style={{
              background: '#191919',
              color: '#fff',
              border: '1px solid #191919',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Submit Form
          </button>
          
          <button 
            type="button"
            onClick={handleDelete}
            style={{
              background: '#e74c3c',
              color: '#fff',
              border: '1px solid #e74c3c',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Delete Item
          </button>
        </div>
      </form>

      {/* Loading Overlay */}
      {isLoading && (
        <LoadingSpinner 
          overlay={true} 
          message="Saving your changes..." 
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmDialog(false)}
        variant="danger"
      />
    </div>
  );
};

export default AdminFormFieldsExample;
