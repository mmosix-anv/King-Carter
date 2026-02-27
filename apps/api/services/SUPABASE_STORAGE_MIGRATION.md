# Supabase Storage Migration

This document describes the migration from local filesystem storage to Supabase Storage for media uploads.

## Overview

The media upload system has been updated to use Supabase Storage instead of storing files locally. This provides:
- Cloud-based storage with automatic backups
- Public URLs for all uploaded files
- Better scalability and reliability
- No need to manage local disk space

## Changes Made

### 1. New Service: `supabaseStorage.js`

Created a new service that handles all Supabase Storage operations:
- **Bucket Management**: Automatically creates the "media" bucket if it doesn't exist
- **Image Processing**: Uses Sharp to create 3 variants (original, thumbnail 300x300, medium 800w)
- **Upload**: Uploads all variants to Supabase Storage
- **Public URLs**: Returns public URLs for all variants
- **Deletion**: Provides method to delete all variants

**Key Methods:**
- `ensureBucket()` - Ensures the media bucket exists
- `generateFilename(originalName, suffix)` - Generates unique filenames with timestamp and random string
- `uploadBuffer(buffer, filename, mimeType)` - Uploads a buffer to Supabase Storage
- `processAndUpload(buffer, originalName, mimeType)` - Processes image and uploads all variants
- `deleteImage(filename)` - Deletes all variants of an image

### 2. Updated: `imageProcessor.js`

Added a new method `processBuffer()` that works with Buffer objects instead of file paths:
- Accepts image buffer and MIME type
- Returns buffers for all variants (original, thumbnail, medium)
- Used by SupabaseStorage service for processing

### 3. Updated: `upload.js` Middleware

Changed from disk storage to memory storage:
- **Before**: `multer.diskStorage()` - saved files to disk
- **After**: `multer.memoryStorage()` - keeps files in memory as buffers
- File validation and size limits remain the same (10MB max)

### 4. Updated: `media.js` Routes

Updated both upload endpoints to use the new SupabaseStorage service:
- Single upload (`POST /api/media/upload`)
- Multiple upload (`POST /api/media/upload-multiple`)

**Changes:**
- Import `supabaseStorage` instead of `imageProcessor`
- Call `supabaseStorage.processAndUpload()` with buffer, originalname, and mimetype
- Store Supabase Storage URLs in database instead of local paths

### 5. Updated Tests

All test files have been updated to reflect the new implementation:
- `media.test.js` - Updated to mock `supabaseStorage` instead of `imageProcessor`
- `upload.test.js` - Updated to test memory storage instead of disk storage
- `imageProcessor.test.js` - Added tests for new `processBuffer()` method
- `supabaseStorage.test.js` - New comprehensive test suite for Supabase Storage service

## Configuration

The Supabase Storage configuration is handled through environment variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for admin operations

**Bucket Configuration:**
- Name: `media`
- Public: Yes (no signed URLs needed)
- File size limit: 10MB

## File Naming Convention

Files are named using the pattern: `{timestamp}-{random}.{ext}`
- **Original**: `1234567890-abc123def456.jpg`
- **Thumbnail**: `1234567890-abc123def456-thumb.jpg`
- **Medium**: `1234567890-abc123def456-medium.jpg`

## Image Variants

All uploaded images are automatically processed into 3 variants:

1. **Original**: Full-size original image
2. **Thumbnail**: 300x300 pixels, cover fit (cropped to square)
3. **Medium**: 800px width, maintains aspect ratio

## Database Schema

The database schema remains unchanged. URLs are stored in:
- `url_original` - Full Supabase Storage URL to original image
- `url_thumbnail` - Full Supabase Storage URL to thumbnail
- `url_medium` - Full Supabase Storage URL to medium variant

Example URL format:
```
https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123.jpg
```

## Backward Compatibility

The API response format remains unchanged, ensuring backward compatibility with existing clients:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "urls": {
      "original": "https://...",
      "thumbnail": "https://...",
      "medium": "https://..."
    },
    "filename": "1234567890-abc123.jpg",
    "originalName": "my-photo.jpg",
    "fileSize": 1024
  }
}
```

## Error Handling

The service includes comprehensive error handling:
- Bucket creation failures
- Upload failures (with automatic cleanup of partial uploads)
- Image processing errors
- Deletion errors (logged but don't throw)

## Migration Notes

### For Existing Deployments

1. **Environment Variables**: Ensure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
2. **Bucket Creation**: The bucket will be created automatically on first upload
3. **Existing Files**: Old local files will remain on disk but new uploads go to Supabase
4. **No Downtime**: The migration can be done without downtime

### For Development

1. Set up Supabase project and get credentials
2. Add environment variables to `.env` file
3. Run tests to verify everything works: `npm test`
4. Test upload functionality manually

## Testing

Run the test suite to verify the implementation:

```bash
npm test
```

Key test files:
- `services/supabaseStorage.test.js` - Tests for Supabase Storage service
- `routes/media.test.js` - Tests for upload endpoints
- `middleware/upload.test.js` - Tests for upload middleware
- `services/imageProcessor.test.js` - Tests for image processing

## Performance Considerations

- **Memory Usage**: Files are kept in memory during upload (max 10MB per file)
- **Processing Time**: Image processing happens before upload (Sharp is fast)
- **Network**: Upload time depends on file size and network speed
- **Concurrent Uploads**: Multiple files are processed sequentially to manage memory

## Security

- Files are validated for type and size before processing
- Only image MIME types are accepted
- 10MB file size limit enforced
- Public bucket (no authentication required for viewing)
- Service role key used for uploads (not exposed to clients)
