# MediaLibrary Component

A comprehensive media library browser component for viewing, searching, selecting, and managing uploaded images.

## Features

- **Grid Layout**: Displays images in a responsive grid with thumbnails
- **Pagination**: Handles large media libraries with 50 images per page
- **Search**: Filter images by filename
- **Two Modes**:
  - `manage`: Full media management with delete capabilities
  - `select`: Image selection for inserting into content
- **Selection Modes**:
  - Single select: Click to immediately select and close
  - Multi-select: Select multiple images and confirm
- **Image Metadata**: Displays filename, upload date, and file size
- **Delete Functionality**: Remove images with confirmation dialog
- **Responsive Design**: Adapts to desktop, tablet, and mobile viewports

## Usage

### Basic Usage (Manage Mode)

```jsx
import MediaLibrary from './MediaLibrary';

function MediaPage() {
  const token = 'your-jwt-token'; // Get from auth context

  return (
    <MediaLibrary
      mode="manage"
      token={token}
    />
  );
}
```

### Selection Mode (Single Select)

```jsx
import { useState } from 'react';
import MediaLibrary from './MediaLibrary';

function ContentEditor() {
  const [showLibrary, setShowLibrary] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const token = 'your-jwt-token';

  const handleSelect = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowLibrary(false);
  };

  return (
    <div>
      <button onClick={() => setShowLibrary(true)}>
        Choose Image
      </button>

      {showLibrary && (
        <MediaLibrary
          mode="select"
          multiSelect={false}
          onSelect={handleSelect}
          onClose={() => setShowLibrary(false)}
          token={token}
        />
      )}

      {selectedImage && (
        <img src={selectedImage} alt="Selected" />
      )}
    </div>
  );
}
```

### Selection Mode (Multi-Select)

```jsx
import { useState } from 'react';
import MediaLibrary from './MediaLibrary';

function GalleryEditor() {
  const [showLibrary, setShowLibrary] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const token = 'your-jwt-token';

  const handleSelect = (imageUrls) => {
    setGalleryImages([...galleryImages, ...imageUrls]);
    setShowLibrary(false);
  };

  return (
    <div>
      <button onClick={() => setShowLibrary(true)}>
        Add Images to Gallery
      </button>

      {showLibrary && (
        <MediaLibrary
          mode="select"
          multiSelect={true}
          onSelect={handleSelect}
          onClose={() => setShowLibrary(false)}
          token={token}
        />
      )}

      <div className="gallery">
        {galleryImages.map((url, index) => (
          <img key={index} src={url} alt={`Gallery ${index}`} />
        ))}
      </div>
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'select' \| 'manage'` | `'manage'` | Display mode - 'select' for choosing images, 'manage' for full management |
| `onSelect` | `function` | - | Callback when image(s) selected. Receives single URL (single select) or array of URLs (multi-select) |
| `multiSelect` | `boolean` | `false` | Allow selecting multiple images (only in 'select' mode) |
| `token` | `string` | - | JWT token for authenticated API requests |
| `onClose` | `function` | - | Callback to close the media library (typically used in modal/overlay scenarios) |

## API Integration

The component expects the following API endpoints:

### GET /api/media

Fetch paginated media list with optional search.

**Query Parameters:**
- `page` (number): Current page number
- `limit` (number): Items per page (default: 50)
- `search` (string, optional): Search query for filename filtering

**Response:**
```json
{
  "success": true,
  "data": {
    "media": [
      {
        "id": 123,
        "filename": "image-1234567890.jpg",
        "originalName": "my-photo.jpg",
        "mimeType": "image/jpeg",
        "fileSize": 2048576,
        "urls": {
          "original": "/uploads/image-1234567890.jpg",
          "thumbnail": "/uploads/image-1234567890-thumb.jpg",
          "medium": "/uploads/image-1234567890-medium.jpg"
        },
        "uploadedBy": 1,
        "uploadedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "totalPages": 5,
    "currentPage": 1,
    "totalItems": 234
  }
}
```

### DELETE /api/media/:id

Delete a media item and its associated files.

**Response:**
```json
{
  "success": true,
  "message": "Media deleted successfully"
}
```

## Styling

The component uses SCSS modules for styling. Key style classes:

- `.mediaLibrary` - Main container
- `.mediaGrid` - Responsive grid layout
- `.mediaCard` - Individual image card
- `.selected` - Selected state styling
- `.selectable` - Clickable cursor for select mode

## Accessibility

- Keyboard navigation support in select mode
- ARIA labels for buttons and actions
- Focus management for interactive elements
- Screen reader friendly error and loading states
- Confirmation dialog for destructive actions

## Requirements Validation

This component satisfies the following requirements:

- **6.1**: Displays all uploaded images in a grid layout with thumbnails
- **6.2**: Supports pagination when more than 50 images exist
- **6.3**: Provides a search function to filter images by filename
- **6.4**: Allows inserting selected images into content (select mode)
- **6.5**: Displays image metadata including filename, upload date, and file size
- **6.6**: Provides a delete function for removing unused images
- **6.7**: Confirms deletion action before permanent removal

## Notes

- The component handles both single and multi-select scenarios
- In single-select mode, clicking an image immediately triggers selection
- In multi-select mode, users can select multiple images and confirm
- Delete functionality is only available in 'manage' mode
- The component is fully responsive and works on mobile devices
- Loading and error states are handled gracefully
- Empty state provides helpful feedback when no images exist
