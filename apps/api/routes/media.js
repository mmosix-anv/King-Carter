const express = require('express');
const upload = require('../middleware/upload');
const { verifyToken } = require('../middleware/auth');
const supabaseStorage = require('../services/supabaseStorage');
const MediaRepository = require('../repositories/mediaRepository');

const router = express.Router();

/**
 * POST /api/media/upload
 * Single image upload endpoint with authentication
 * 
 * Requirements: 4.5, 4.6, 12.5, 12.6, 12.7
 * - 4.5: Sends image file to backend API endpoint
 * - 4.6: Returns stored image URL
 * - 12.5: Stores uploaded images in uploads directory
 * - 12.6: Returns image URL in response on success
 * - 12.7: Returns error response with status code on failure
 * 
 * Middleware:
 * - verifyToken: Ensures user is authenticated
 * - upload.single('image'): Handles multipart/form-data file upload
 * 
 * Request:
 * - Content-Type: multipart/form-data
 * - Body: image file (field name: 'image')
 * - Headers: Authorization: Bearer <token>
 * 
 * Response:
 * - success: boolean
 * - data: object containing media record with URLs for all variants
 */
router.post('/upload', verifyToken, upload.single('image'), async (req, res) => {
  const mediaRepository = new MediaRepository();

  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_FILE',
          message: 'No image file provided'
        }
      });
    }

    // Process and upload image to Supabase Storage (generates all variants)
    const urls = await supabaseStorage.processAndUpload(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    // Prepare media data for database
    const mediaData = {
      filename: urls.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      urlOriginal: urls.original,
      urlThumbnail: urls.thumbnail,
      urlMedium: urls.medium,
      uploadedBy: req.userId
    };

    // Store media record in database
    const mediaRecord = await mediaRepository.create(mediaData);

    // Return success response with all image variant URLs
    res.json({
      success: true,
      data: {
        id: mediaRecord.id,
        urls: {
          original: mediaRecord.url_original,
          thumbnail: mediaRecord.url_thumbnail,
          medium: mediaRecord.url_medium
        },
        filename: mediaRecord.filename,
        originalName: mediaRecord.original_name,
        fileSize: mediaRecord.file_size
      }
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    
    // Return error response
    res.status(500).json({
      success: false,
      error: {
        code: 'UPLOAD_ERROR',
        message: 'Failed to upload image',
        details: error.message
      }
    });
  } finally {
    // Clean up database connection
    mediaRepository.close();
  }
});

/**
 * POST /api/media/upload-multiple
 * Multiple image upload endpoint with authentication
 * 
 * Requirements: 5.1, 5.6, 5.8
 * - 5.1: Accepts multiple image files in a single selection operation
 * - 5.6: Uploads images sequentially or in parallel batches
 * - 5.8: Associates uploaded images with Gallery
 * 
 * Middleware:
 * - verifyToken: Ensures user is authenticated
 * - upload.array('images'): Handles multipart/form-data multiple file upload
 * 
 * Request:
 * - Content-Type: multipart/form-data
 * - Body: image files (field name: 'images')
 * - Headers: Authorization: Bearer <token>
 * 
 * Response:
 * - success: boolean
 * - data: array of media records with URLs for all variants
 */
router.post('/upload-multiple', verifyToken, upload.array('images', 10), async (req, res) => {
  const mediaRepository = new MediaRepository();

  try {
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_FILES',
          message: 'No image files provided'
        }
      });
    }

    // Process each uploaded image
    const uploadedMedia = [];
    const errors = [];

    for (const file of req.files) {
      try {
        // Process and upload image to Supabase Storage (generates all variants)
        const urls = await supabaseStorage.processAndUpload(
          file.buffer,
          file.originalname,
          file.mimetype
        );

        // Prepare media data for database
        const mediaData = {
          filename: urls.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          fileSize: file.size,
          urlOriginal: urls.original,
          urlThumbnail: urls.thumbnail,
          urlMedium: urls.medium,
          uploadedBy: req.userId
        };

        // Store media record in database
        const mediaRecord = await mediaRepository.create(mediaData);

        // Add to successful uploads
        uploadedMedia.push({
          id: mediaRecord.id,
          urls: {
            original: mediaRecord.url_original,
            thumbnail: mediaRecord.url_thumbnail,
            medium: mediaRecord.url_medium
          },
          filename: mediaRecord.filename,
          originalName: mediaRecord.original_name,
          fileSize: mediaRecord.file_size
        });

      } catch (error) {
        console.error(`Error processing file ${file.originalname}:`, error);
        errors.push({
          filename: file.originalname,
          error: error.message
        });
      }
    }

    // Return response with successful uploads and any errors
    if (uploadedMedia.length === 0) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'ALL_UPLOADS_FAILED',
          message: 'All image uploads failed',
          details: errors
        }
      });
    }

    res.json({
      success: true,
      data: uploadedMedia,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Error uploading multiple images:', error);
    
    // Return error response
    res.status(500).json({
      success: false,
      error: {
        code: 'UPLOAD_ERROR',
        message: 'Failed to upload images',
        details: error.message
      }
    });
  } finally {
    // Clean up database connection
    mediaRepository.close();
  }
});

/**
 * GET /api/media
 * List all media with pagination and search
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.5
 * - 6.1: Displays all uploaded images in a grid layout with thumbnails
 * - 6.2: Supports pagination when more than 50 images exist
 * - 6.3: Provides a search function to filter images by filename
 * - 6.5: Displays image metadata including filename, upload date, and file size
 * 
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Number of records per page (default: 50)
 * - search: Search term for filtering by filename (optional)
 * 
 * Response:
 * - success: boolean
 * - data: object containing media array and pagination metadata
 */
router.get('/', async (req, res) => {
  const mediaRepository = new MediaRepository();

  try {
    // Parse query parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const search = req.query.search || '';

    // Validate pagination parameters
    if (page < 1) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PAGE',
          message: 'Page number must be greater than 0'
        }
      });
    }

    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_LIMIT',
          message: 'Limit must be between 1 and 100'
        }
      });
    }

    // Fetch media records with pagination and search
    const result = await mediaRepository.findAll({ page, limit, search });

    // Return success response with media records and pagination info
    res.json({
      success: true,
      data: {
        media: result.media.map(record => ({
          id: record.id,
          filename: record.filename,
          originalName: record.original_name,
          mimeType: record.mime_type,
          fileSize: record.file_size,
          urls: {
            original: record.url_original,
            thumbnail: record.url_thumbnail,
            medium: record.url_medium
          },
          uploadedBy: record.uploaded_by,
          uploadedAt: record.uploaded_at
        })),
        pagination: result.pagination
      }
    });

  } catch (error) {
    console.error('Error fetching media:', error);
    
    // Return error response
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch media records',
        details: error.message
      }
    });
  } finally {
    // Clean up database connection
    mediaRepository.close();
  }
});

/**
 * DELETE /api/media/:id
 * Delete a media record and all its file variants
 * 
 * Requirements: 6.6, 6.7
 * - 6.6: Provides a delete function for removing unused images
 * - 6.7: Confirms the action before permanent removal
 * 
 * Middleware:
 * - verifyToken: Ensures user is authenticated
 * 
 * Request:
 * - Headers: Authorization: Bearer <token>
 * - Params: id (media record ID)
 * 
 * Response:
 * - success: boolean
 * - message: string describing the result
 */
router.delete('/:id', verifyToken, async (req, res) => {
  const mediaRepository = new MediaRepository();

  try {
    const mediaId = parseInt(req.params.id, 10);

    // Validate media ID
    if (isNaN(mediaId) || mediaId < 1) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid media ID provided'
        }
      });
    }

    // Fetch media record to get filename for file deletion
    const mediaRecord = await mediaRepository.findById(mediaId);

    if (!mediaRecord) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Media record not found'
        }
      });
    }

    // Delete all file variants from Supabase Storage
    await supabaseStorage.deleteImage(mediaRecord.filename);

    // Delete media record from database
    const deleted = await mediaRepository.delete(mediaId);

    if (!deleted) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'DELETE_FAILED',
          message: 'Failed to delete media record from database'
        }
      });
    }

    // Return success response
    res.json({
      success: true,
      message: 'Media deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting media:', error);
    
    // Return error response
    res.status(500).json({
      success: false,
      error: {
        code: 'DELETE_ERROR',
        message: 'Failed to delete media',
        details: error.message
      }
    });
  } finally {
    // Clean up database connection
    mediaRepository.close();
  }
});

module.exports = { router };
