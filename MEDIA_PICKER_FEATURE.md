# Media Picker Feature

## Overview

Added a comprehensive media picker to the Service Editor that allows admins to:
1. Browse existing media from the library
2. Upload new images directly
3. Preview selected images
4. Manually enter image URLs

## Components Created

### MediaPicker Component (`client/src/components/MediaPicker.tsx`)

A modal dialog with three tabs:

#### Library Tab
- Displays all uploaded media in a grid
- Click to select an image
- Visual indication of selected image (border + checkmark)
- Hover effect for better UX

#### Upload File Tab
- Drag and drop style upload area
- Instant upload to Supabase Storage
- Automatic database record creation
- Preview of uploaded image
- Progress indication

#### Upload from URL Tab
- Input field for image URL
- Downloads image from URL
- Uploads to Supabase Storage
- Saves to media library
- Preview of uploaded image
- Press Enter or click Upload button

## Features

### In Service Editor

1. **Browse Media Button** - Opens the media picker modal
2. **Manual URL Input** - Still allows direct URL entry
3. **Image Preview** - Shows current hero image
4. **Remove Image** - X button to clear the image

### In Media Picker

1. **Tabbed Interface** - Switch between library, file upload, and URL upload
2. **Grid Layout** - Responsive grid of images
3. **Selection State** - Visual feedback for selected image
4. **Upload Progress** - Loading state during upload
5. **Auto-refresh** - Library updates after upload
6. **URL Upload** - Download images from external URLs
7. **Enter Key Support** - Press Enter to upload from URL

## Usage

### For Admins

1. Go to Service Editor (`/admin/services/:id`)
2. In the Hero Image section, click "Browse Media"
3. Choose from three options:
   - **Library**: Select from existing images
   - **Upload File**: Upload from your computer
   - **Upload from URL**: Enter an image URL to download and save
4. Click "Select Image" to apply
5. Image URL is automatically populated

### Technical Flow

```
User clicks "Browse Media"
  ↓
MediaPicker opens with 3 tabs
  ↓
User selects from library OR uploads file OR uploads from URL
  ↓
If file upload: File → Supabase Storage → Database record
If URL upload: Fetch URL → Blob → Supabase Storage → Database record
  ↓
User clicks "Select Image"
  ↓
URL passed back to ServiceEditor
  ↓
Form field updated
```

## Database Integration

### Media Table Fields Used
- `id` - UUID
- `filename` - Generated filename
- `original_name` - User's filename
- `storage_path` - Path in Supabase Storage
- `public_url` - CDN URL for display
- `mime_type` - File type
- `file_size` - Size in bytes
- `uploaded_by` - Admin user ID
- `uploaded_at` - Timestamp

### Supabase Storage
- Bucket: `media`
- Path: `media/{timestamp}-{random}.{ext}`
- Public access enabled
- 10MB file size limit

## Benefits

1. **Better UX** - Visual selection vs typing URLs
2. **Reusability** - Existing images can be reused
3. **Organization** - All media in one place
4. **Validation** - Only uploaded images are guaranteed to work
5. **Speed** - No need to upload same image multiple times
6. **URL Import** - Easily import images from external sources
7. **Centralized Storage** - All images stored in Supabase, not external links

## Future Enhancements

Potential improvements:
- Image search/filter
- Bulk upload
- Image editing (crop, resize)
- Alt text management
- Usage tracking (which services use which images)
- Folder organization
- Image optimization on upload
