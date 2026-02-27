# GalleryUpload Component

A comprehensive multiple image upload component with drag-and-drop support, reordering capabilities, batch upload with progress tracking, and queue management.

## Features

- **Multiple File Selection**: Select multiple images at once
- **Drag & Drop**: Drag files directly into the upload area
- **Upload Queue**: Preview and manage images before uploading
- **Drag-to-Reorder**: Reorder both uploaded images and queue items via drag and drop
- **Individual Removal**: Remove images from both uploaded gallery and queue
- **Batch Upload**: Upload all queued images with a single action
- **Progress Tracking**: Visual progress indicators for each uploading image
- **File Validation**: Automatic validation of file type and size
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Label text displayed above the component |
| `name` | `string` | **required** | Field name for form handling |
| `value` | `string[]` | `[]` | Array of current image URLs |
| `onChange` | `function` | - | Callback when images change: `(urls, name) => void` |
| `maxSize` | `number` | `10485760` | Maximum file size in bytes (default: 10MB) |
| `acceptedTypes` | `string[]` | `['image/jpeg', 'image/png', 'image/gif', 'image/webp']` | Accepted MIME types |
| `required` | `boolean` | `false` | Whether the field is required |
| `error` | `string` | `''` | Error message to display |
| `onUpload` | `function` | - | Custom upload handler: `(files) => Promise<urls[]>` |
| `maxFiles` | `number` | `20` | Maximum number of files allowed |

## Usage Examples

### Basic Usage

```jsx
import { useState } from 'react';
import GalleryUpload from './GalleryUpload';

function MyComponent() {
  const [images, setImages] = useState([]);

  const handleChange = (urls, name) => {
    console.log('Images changed:', urls);
    setImages(urls);
  };

  return (
    <GalleryUpload
      label="Service Gallery"
      name="galleryImages"
      value={images}
      onChange={handleChange}
    />
  );
}
```

### With API Upload Handler

```jsx
import { useState } from 'react';
import GalleryUpload from './GalleryUpload';

function MyComponent() {
  const [images, setImages] = useState([]);
  const [token] = useState('your-jwt-token'); // Get from auth context

  const handleUpload = async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

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

    // Return array of URLs
    return data.data.map(item => item.urls.original);
  };

  const handleChange = (urls, name) => {
    setImages(urls);
  };

  return (
    <GalleryUpload
      label="Upload Gallery Images"
      name="serviceImages"
      value={images}
      onChange={handleChange}
      onUpload={handleUpload}
      required
    />
  );
}
```

### In a Form with Validation

```jsx
import { useState } from 'react';
import GalleryUpload from './GalleryUpload';

function ServiceForm() {
  const [formData, setFormData] = useState({
    title: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <GalleryUpload
        label="Service Images"
        name="images"
        value={formData.images}
        onChange={handleImageChange}
        required
        error={errors.images}
        maxFiles={10}
      />
      <button type="submit">Save Service</button>
    </form>
  );
}
```

### Custom File Limits

```jsx
<GalleryUpload
  label="Product Photos"
  name="productPhotos"
  value={images}
  onChange={handleChange}
  maxSize={5242880} // 5MB per file
  maxFiles={5} // Maximum 5 files
  acceptedTypes={['image/jpeg', 'image/png']} // Only JPEG and PNG
/>
```

## User Interactions

### Adding Images

1. **Click to Browse**: Click anywhere in the dropzone to open file browser
2. **Drag & Drop**: Drag image files from your computer and drop into the dropzone
3. **Multiple Selection**: Select multiple files at once in the file browser

### Managing Upload Queue

1. **Preview**: See thumbnail previews of all queued images
2. **Reorder**: Drag queue items to reorder them before upload
3. **Remove**: Click the ✕ button on any queue item to remove it
4. **Upload All**: Click "Upload All" button to upload all queued images

### Managing Uploaded Images

1. **View Gallery**: See all uploaded images in a grid layout
2. **Reorder**: Drag uploaded images to change their order
3. **Remove**: Hover over an image and click the ✕ button to remove it

## Validation

The component automatically validates:

- **File Type**: Only accepts specified image formats
- **File Size**: Rejects files exceeding the maximum size
- **File Count**: Prevents adding more files than the maximum allowed

Validation errors are displayed below the component with clear messages.

## Accessibility

- Proper ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader friendly error messages
- Semantic HTML structure

## Styling

The component uses SCSS modules for scoped styling. Key style features:

- Responsive grid layout for images
- Smooth transitions and hover effects
- Visual feedback for drag operations
- Progress indicators during upload
- Status icons for queue items

## Requirements Satisfied

This component satisfies the following requirements from the Enhanced Admin Panel spec:

- **5.1**: Accept multiple image files in a single selection operation
- **5.2**: Add selected images to the Upload_Queue
- **5.3**: Display preview thumbnails for all images in the Upload_Queue
- **5.4**: Allow reordering images in the Upload_Queue via drag and drop
- **5.5**: Allow removing individual images from the Upload_Queue before upload
- **5.6**: Upload images sequentially or in parallel batches
- **5.7**: Display upload progress for each image in the Upload_Queue

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Uses HTML5 File API and Drag & Drop API

## Dependencies

- `react` (^18.2.0)
- `react-dropzone` (^14.2.3)
- `prop-types` (^15.8.1)
