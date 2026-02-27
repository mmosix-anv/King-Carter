# Image Processing Service

## Overview

The ImageProcessor service handles image processing operations for the Enhanced Admin Panel, including generating thumbnails, medium-sized versions, and managing image variants.

## Requirements

This service implements requirements 14.1-14.5:
- 14.1: Generate thumbnail version at 300x300 pixels
- 14.2: Generate medium version at 800 pixels wide
- 14.3: Preserve original image
- 14.4: Maintain aspect ratios when generating resized versions
- 14.5: Store image variants with descriptive suffixes in the filename

## Installation

The service requires the Sharp library for image processing. To install:

```bash
# From the root directory of the monorepo
npm install
```

This will install Sharp (^0.33.0) as specified in `apps/api/package.json`.

## Usage

### Import the Service

```javascript
const imageProcessor = require('./services/imageProcessor');
```

### Process an Upload

Generate all image variants (thumbnail and medium) from an uploaded file:

```javascript
const urls = await imageProcessor.processUpload(file);
// Returns:
// {
//   original: '/uploads/image-123.jpg',
//   thumbnail: '/uploads/image-123-thumb.jpg',
//   medium: '/uploads/image-123-medium.jpg'
// }
```

### Generate Thumbnail

Create a 300x300 thumbnail with cover fit:

```javascript
await imageProcessor.generateThumbnail(
  '/uploads/original.jpg',
  '/uploads/original-thumb.jpg'
);
```

### Generate Medium Size

Create an 800px wide medium version maintaining aspect ratio:

```javascript
await imageProcessor.generateMedium(
  '/uploads/original.jpg',
  '/uploads/original-medium.jpg'
);
```

### Delete Image and Variants

Remove an image and all its variants:

```javascript
await imageProcessor.deleteImage('image-123.jpg', 'uploads');
```

## Image Variants

For each uploaded image, three versions are created:

1. **Original**: Unchanged original file
   - Filename: `{basename}{ext}`
   - Example: `image-123.jpg`

2. **Thumbnail**: 300x300 pixels, cover fit
   - Filename: `{basename}-thumb{ext}`
   - Example: `image-123-thumb.jpg`
   - Aspect ratio maintained with center positioning

3. **Medium**: 800px wide, inside fit
   - Filename: `{basename}-medium{ext}`
   - Example: `image-123-medium.jpg`
   - Height calculated to maintain aspect ratio
   - Won't enlarge images smaller than 800px

## Testing

Run the unit tests:

```bash
cd apps/api
npm test services/imageProcessor.test.js
```

Run the integration test:

```bash
cd apps/api
node test-image-processor.js
```

## API Integration

The ImageProcessor is designed to work with Multer file uploads:

```javascript
const multer = require('multer');
const imageProcessor = require('./services/imageProcessor');

app.post('/api/media/upload', upload.single('image'), async (req, res) => {
  try {
    const urls = await imageProcessor.processUpload(req.file);
    res.json({ success: true, data: { urls } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

## Error Handling

- `generateThumbnail()` and `generateMedium()` will throw if Sharp encounters an error
- `processUpload()` will throw if image processing fails
- `deleteImage()` silently ignores ENOENT errors (file not found) but logs other errors

## Dependencies

- **sharp**: ^0.33.0 - High-performance image processing library
