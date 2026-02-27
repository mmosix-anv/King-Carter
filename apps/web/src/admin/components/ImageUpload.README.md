# ImageUpload Component

A single image upload component with drag-and-drop support, file validation, preview, and upload progress indicator.

## Features

- **Drag & Drop**: Intuitive drag-and-drop interface using React Dropzone
- **File Validation**: Validates file type (JPEG, PNG, GIF, WebP) and size (default 10MB max)
- **Image Preview**: Shows preview of selected image before upload
- **Upload Progress**: Visual progress indicator during upload
- **Remove/Replace Controls**: Easy controls to remove or replace selected image
- **Error Handling**: Clear error messages for validation failures
- **Accessibility**: ARIA labels and keyboard navigation support

## Requirements Validation

This component satisfies the following requirements from the Enhanced Admin Panel spec:

- **Requirement 4.1**: Validates file type is an accepted image format
- **Requirement 4.2**: Validates file size does not exceed 10MB (configurable)
- **Requirement 4.3**: Displays preview of the image after selection
- **Requirement 4.4**: Provides controls to remove or replace the selected image
- **Requirement 4.5**: Sends file to backend API endpoint via onUpload callback
- **Requirement 4.6**: Returns stored image URL through onChange callback
- **Requirement 4.7**: Displays error messages when upload fails

## Usage

### Basic Usage

```jsx
import ImageUpload from './ImageUpload';

function MyForm() {
  const [heroImage, setHeroImage] = useState('');

  const handleImageChange = (url, name) => {
    setHeroImage(url);
  };

  return (
    <ImageUpload
      label="Hero Image"
      name="heroImage"
      value={heroImage}
      onChange={handleImageChange}
      required
    />
  );
}
```

### With Custom Upload Handler

```jsx
import ImageUpload from './ImageUpload';

function MyForm() {
  const [heroImage, setHeroImage] = useState('');

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/media/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error.message);
    }

    return data.data.urls.original;
  };

  const handleImageChange = (url, name) => {
    setHeroImage(url);
  };

  return (
    <ImageUpload
      label="Hero Image"
      name="heroImage"
      value={heroImage}
      onChange={handleImageChange}
      onUpload={handleUpload}
      required
    />
  );
}
```

### With Custom Validation

```jsx
<ImageUpload
  label="Profile Picture"
  name="profilePic"
  value={profilePic}
  onChange={handleChange}
  maxSize={5242880} // 5MB
  acceptedTypes={['image/jpeg', 'image/png']}
  error={validationError}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | string | - | Label text for the upload field |
| `name` | string | **required** | Field name for form handling |
| `value` | string | `''` | Current image URL to display |
| `onChange` | function | - | Callback when image changes: `(url, name) => void` |
| `maxSize` | number | `10485760` | Maximum file size in bytes (default 10MB) |
| `acceptedTypes` | string[] | `['image/jpeg', 'image/png', 'image/gif', 'image/webp']` | Accepted MIME types |
| `required` | boolean | `false` | Whether the field is required |
| `error` | string | `''` | External error message to display |
| `onUpload` | function | - | Custom upload handler: `(file) => Promise<url>` |

## Styling

The component uses SCSS modules with the following customizable classes:

- `.imageUpload` - Main container
- `.dropzone` - Drop zone area
- `.preview` - Image preview
- `.progressBar` - Upload progress bar
- `.error` - Error message

Colors and spacing are inherited from `../styles/base.scss`.

## Accessibility

- Uses semantic HTML with proper labels
- Includes ARIA labels for buttons
- Provides `role="alert"` for error messages
- Supports keyboard navigation
- Screen reader friendly with descriptive text

## API Integration

The component expects the `onUpload` callback to:

1. Accept a File object
2. Upload the file to the backend
3. Return a Promise that resolves to the image URL
4. Throw an error if upload fails

Example backend response format:

```json
{
  "success": true,
  "data": {
    "id": 123,
    "urls": {
      "original": "/uploads/image-1234567890.jpg",
      "thumbnail": "/uploads/image-1234567890-thumb.jpg",
      "medium": "/uploads/image-1234567890-medium.jpg"
    }
  }
}
```

## Notes

- The component uses React Dropzone for drag-and-drop functionality
- Progress indicator simulates upload progress (can be enhanced with XMLHttpRequest for real progress)
- File validation happens client-side before upload
- Preview uses FileReader API to display image before upload
- Component is disabled during upload to prevent multiple submissions
