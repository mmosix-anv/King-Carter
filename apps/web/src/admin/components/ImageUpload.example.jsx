import { useState } from 'react';
import ImageUpload from './ImageUpload';

/**
 * ImageUpload Component Examples
 * 
 * This file demonstrates various usage patterns for the ImageUpload component.
 */

// Example 1: Basic Usage
export function BasicExample() {
  const [image, setImage] = useState('');

  const handleChange = (url, name) => {
    console.log('Image changed:', { url, name });
    setImage(url);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px' }}>
      <h2>Basic Image Upload</h2>
      <ImageUpload
        label="Upload Image"
        name="basicImage"
        value={image}
        onChange={handleChange}
      />
      <p>Current value: {image || 'No image selected'}</p>
    </div>
  );
}

// Example 2: Required Field with Validation
export function RequiredExample() {
  const [image, setImage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (url, name) => {
    setImage(url);
    setError(''); // Clear error when image is selected
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!image) {
      setError('Image is required');
      return;
    }
    console.log('Form submitted with image:', image);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px' }}>
      <h2>Required Field Example</h2>
      <form onSubmit={handleSubmit}>
        <ImageUpload
          label="Hero Image"
          name="heroImage"
          value={image}
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
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);

  // Simulated API upload function
  const handleUpload = async (file) => {
    console.log('Uploading file:', file.name);
    
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success
        const mockUrl = `/uploads/${Date.now()}-${file.name}`;
        resolve(mockUrl);
        
        // Simulate error (uncomment to test error handling)
        // reject(new Error('Upload failed: Server error'));
      }, 2000);
    });
  };

  const handleChange = (url, name) => {
    console.log('Upload complete:', url);
    setImage(url);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px' }}>
      <h2>Custom Upload Handler Example</h2>
      <ImageUpload
        label="Featured Image"
        name="featuredImage"
        value={image}
        onChange={handleChange}
        onUpload={handleUpload}
      />
      {image && <p>Uploaded to: {image}</p>}
    </div>
  );
}

// Example 4: Custom Size and Type Restrictions
export function CustomValidationExample() {
  const [image, setImage] = useState('');

  const handleChange = (url, name) => {
    setImage(url);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px' }}>
      <h2>Custom Validation Example</h2>
      <p>Only JPEG and PNG files, max 5MB</p>
      <ImageUpload
        label="Profile Picture"
        name="profilePic"
        value={image}
        onChange={handleChange}
        maxSize={5242880} // 5MB
        acceptedTypes={['image/jpeg', 'image/png']}
      />
    </div>
  );
}

// Example 5: Multiple Upload Fields in a Form
export function FormExample() {
  const [formData, setFormData] = useState({
    heroImage: '',
    featuredImage: '',
    thumbnailImage: ''
  });

  const handleImageChange = (url, name) => {
    setFormData(prev => ({
      ...prev,
      [name]: url
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px' }}>
      <h2>Multiple Upload Fields Example</h2>
      <form onSubmit={handleSubmit}>
        <ImageUpload
          label="Hero Image"
          name="heroImage"
          value={formData.heroImage}
          onChange={handleImageChange}
          required
        />
        
        <ImageUpload
          label="Featured Image"
          name="featuredImage"
          value={formData.featuredImage}
          onChange={handleImageChange}
        />
        
        <ImageUpload
          label="Thumbnail"
          name="thumbnailImage"
          value={formData.thumbnailImage}
          onChange={handleImageChange}
          maxSize={2097152} // 2MB for thumbnails
        />
        
        <button type="submit" style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
          Save All Images
        </button>
      </form>
    </div>
  );
}

// Example 6: With Real API Integration
export function APIIntegrationExample() {
  const [image, setImage] = useState('');
  const [token] = useState('your-jwt-token-here'); // In real app, get from auth context

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/media/upload', {
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

      // Return the original image URL
      return data.data.urls.original;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleChange = (url, name) => {
    setImage(url);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px' }}>
      <h2>API Integration Example</h2>
      <ImageUpload
        label="Upload to Server"
        name="serverImage"
        value={image}
        onChange={handleChange}
        onUpload={handleUpload}
        required
      />
      {image && (
        <div style={{ marginTop: '1rem' }}>
          <p>Image uploaded successfully!</p>
          <img src={image} alt="Uploaded" style={{ maxWidth: '200px' }} />
        </div>
      )}
    </div>
  );
}

// Main demo component that shows all examples
export default function ImageUploadExamples() {
  const [activeExample, setActiveExample] = useState('basic');

  const examples = {
    basic: <BasicExample />,
    required: <RequiredExample />,
    upload: <CustomUploadExample />,
    validation: <CustomValidationExample />,
    form: <FormExample />,
    api: <APIIntegrationExample />
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>ImageUpload Component Examples</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => setActiveExample('basic')}>Basic</button>
        <button onClick={() => setActiveExample('required')}>Required</button>
        <button onClick={() => setActiveExample('upload')}>Custom Upload</button>
        <button onClick={() => setActiveExample('validation')}>Custom Validation</button>
        <button onClick={() => setActiveExample('form')}>Form</button>
        <button onClick={() => setActiveExample('api')}>API Integration</button>
      </div>

      {examples[activeExample]}
    </div>
  );
}
