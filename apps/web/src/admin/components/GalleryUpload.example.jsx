import { useState } from 'react';
import GalleryUpload from './GalleryUpload';

/**
 * GalleryUpload Component Examples
 * 
 * This file demonstrates various usage patterns for the GalleryUpload component.
 */

// Example 1: Basic Usage
export function BasicExample() {
  const [images, setImages] = useState([]);

  const handleChange = (urls, name) => {
    console.log('Images changed:', { urls, name });
    setImages(urls);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px' }}>
      <h2>Basic Gallery Upload</h2>
      <GalleryUpload
        label="Upload Multiple Images"
        name="basicGallery"
        value={images}
        onChange={handleChange}
      />
      <p>Current images: {images.length}</p>
    </div>
  );
}

// Example 2: Required Field with Validation
export function RequiredExample() {
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (urls, name) => {
    setImages(urls);
    setError(''); // Clear error when images are added
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (images.length === 0) {
      setError('At least one image is required');
      return;
    }
    console.log('Form submitted with images:', images);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px' }}>
      <h2>Required Field Example</h2>
      <form onSubmit={handleSubmit}>
        <GalleryUpload
          label="Service Gallery Images"
          name="serviceGallery"
          value={images}
          onChange={handleChange}
          required
          error={error}
        />
        <button type="submit" style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
          Submit
        </button>
      </form>
    </div>
  );
}

// Example 3: With Custom Upload Handler
export function CustomUploadExample() {
  const [images, setImages] = useState([]);

  // Simulated API upload function
  const handleUpload = async (files) => {
    console.log('Uploading files:', files.map(f => f.name));
    
    // Simulate API call with delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success - return mock URLs
        const mockUrls = files.map((file, index) => 
          `/uploads/${Date.now()}-${index}-${file.name}`
        );
        resolve(mockUrls);
        
        // Simulate error (uncomment to test error handling)
        // reject(new Error('Upload failed: Server error'));
      }, 3000);
    });
  };

  const handleChange = (urls, name) => {
    console.log('Upload complete:', urls);
    setImages(urls);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px' }}>
      <h2>Custom Upload Handler Example</h2>
      <GalleryUpload
        label="Product Images"
        name="productGallery"
        value={images}
        onChange={handleChange}
        onUpload={handleUpload}
      />
      {images.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Uploaded Images:</h3>
          <ul>
            {images.map((url, index) => (
              <li key={index}>{url}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Example 4: Custom Limits and Restrictions
export function CustomLimitsExample() {
  const [images, setImages] = useState([]);

  const handleChange = (urls, name) => {
    setImages(urls);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px' }}>
      <h2>Custom Limits Example</h2>
      <p>Only JPEG and PNG files, max 5MB per file, maximum 5 files</p>
      <GalleryUpload
        label="Portfolio Images"
        name="portfolioGallery"
        value={images}
        onChange={handleChange}
        maxSize={5242880} // 5MB
        maxFiles={5}
        acceptedTypes={['image/jpeg', 'image/png']}
      />
    </div>
  );
}

// Example 5: Pre-populated Gallery
export function PrePopulatedExample() {
  const [images, setImages] = useState([
    '/uploads/existing-image-1.jpg',
    '/uploads/existing-image-2.jpg',
    '/uploads/existing-image-3.jpg'
  ]);

  const handleChange = (urls, name) => {
    setImages(urls);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px' }}>
      <h2>Pre-populated Gallery Example</h2>
      <p>Edit existing gallery - reorder or remove images, add new ones</p>
      <GalleryUpload
        label="Edit Service Gallery"
        name="editGallery"
        value={images}
        onChange={handleChange}
      />
    </div>
  );
}

// Example 6: With Real API Integration
export function APIIntegrationExample() {
  const [images, setImages] = useState([]);
  const [token] = useState('your-jwt-token-here'); // In real app, get from auth context

  const handleUpload = async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await fetch('/api/media/upload-multiple', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error.message || 'Upload failed');
      }

      // Return array of original image URLs
      return data.data.map(item => item.urls.original);
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleChange = (urls, name) => {
    setImages(urls);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px' }}>
      <h2>API Integration Example</h2>
      <GalleryUpload
        label="Upload to Server"
        name="serverGallery"
        value={images}
        onChange={handleChange}
        onUpload={handleUpload}
        required
      />
      {images.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Uploaded Images ({images.length}):</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
            {images.map((url, index) => (
              <img 
                key={index} 
                src={url} 
                alt={`Uploaded ${index + 1}`}
                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Example 7: In a Complete Service Form
export function ServiceFormExample() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: []
  });
  const [errors, setErrors] = useState({});

  const handleImageChange = (urls, name) => {
    setFormData(prev => ({
      ...prev,
      [name]: urls
    }));
    // Clear error when images are added
    if (urls.length > 0) {
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.title) {
      newErrors.title = 'Title is required';
    }
    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    console.log('Form submitted:', formData);
    alert('Service saved successfully!');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px' }}>
      <h2>Complete Service Form Example</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            Service Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              borderColor: errors.title ? 'red' : '#ccc'
            }}
          />
          {errors.title && (
            <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.title}</span>
          )}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              border: '1px solid #ccc', 
              borderRadius: '4px'
            }}
          />
        </div>

        <GalleryUpload
          label="Service Gallery Images"
          name="images"
          value={formData.images}
          onChange={handleImageChange}
          required
          error={errors.images}
          maxFiles={10}
        />

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <button 
            type="submit" 
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Save Service
          </button>
          <button 
            type="button" 
            onClick={() => {
              setFormData({ title: '', description: '', images: [] });
              setErrors({});
            }}
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: '#6c757d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

// Main demo component that shows all examples
export default function GalleryUploadExamples() {
  const [activeExample, setActiveExample] = useState('basic');

  const examples = {
    basic: <BasicExample />,
    required: <RequiredExample />,
    upload: <CustomUploadExample />,
    limits: <CustomLimitsExample />,
    prepopulated: <PrePopulatedExample />,
    api: <APIIntegrationExample />,
    form: <ServiceFormExample />
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>GalleryUpload Component Examples</h1>
      
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveExample('basic')}>Basic</button>
        <button onClick={() => setActiveExample('required')}>Required</button>
        <button onClick={() => setActiveExample('upload')}>Custom Upload</button>
        <button onClick={() => setActiveExample('limits')}>Custom Limits</button>
        <button onClick={() => setActiveExample('prepopulated')}>Pre-populated</button>
        <button onClick={() => setActiveExample('api')}>API Integration</button>
        <button onClick={() => setActiveExample('form')}>Service Form</button>
      </div>

      {examples[activeExample]}
    </div>
  );
}
