const sharp = require('sharp');
const crypto = require('crypto');
const path = require('path');
const SupabaseDatabase = require('../supabase-database');

/**
 * SupabaseStorage class handles file uploads to Supabase Storage
 * with automatic image variant generation (original, thumbnail, medium)
 * 
 * Requirements: 14.1, 14.2, 14.3, 14.4, 14.5
 */
class SupabaseStorage {
  constructor() {
    this.db = new SupabaseDatabase();
    this.supabase = this.db.getSupabase();
    this.bucketName = 'media';
  }

  /**
   * Ensure the media bucket exists, create if it doesn't
   * @returns {Promise<void>}
   */
  async ensureBucket() {
    try {
      const { data: buckets, error } = await this.supabase.storage.listBuckets();
      
      if (error) {
        throw new Error(`Failed to list buckets: ${error.message}`);
      }

      const bucketExists = buckets.some(bucket => bucket.name === this.bucketName);

      if (!bucketExists) {
        const { error: createError } = await this.supabase.storage.createBucket(this.bucketName, {
          public: true,
          fileSizeLimit: 10485760 // 10MB
        });

        if (createError) {
          throw new Error(`Failed to create bucket: ${createError.message}`);
        }
      }
    } catch (error) {
      console.error('Error ensuring bucket exists:', error);
      throw error;
    }
  }

  /**
   * Generate a unique filename with timestamp and random string
   * @param {string} originalName - Original filename
   * @param {string} suffix - Optional suffix (e.g., '-thumb', '-medium')
   * @returns {string} Unique filename
   */
  generateFilename(originalName, suffix = '') {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(originalName);
    return `${timestamp}-${randomString}${suffix}${ext}`;
  }

  /**
   * Upload a buffer to Supabase Storage
   * @param {Buffer} buffer - File buffer to upload
   * @param {string} filename - Filename to use in storage
   * @param {string} mimeType - MIME type of the file
   * @returns {Promise<string>} Public URL of the uploaded file
   */
  async uploadBuffer(buffer, filename, mimeType) {
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(filename, buffer, {
        contentType: mimeType,
        upsert: false
      });

    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filename);

    return urlData.publicUrl;
  }

  /**
   * Process and upload an image with all variants (original, thumbnail, medium)
   * @param {Buffer} buffer - Image buffer from multer
   * @param {string} originalName - Original filename
   * @param {string} mimeType - MIME type of the image
   * @returns {Promise<Object>} Object containing public URLs for all variants
   */
  async processAndUpload(buffer, originalName, mimeType) {
    await this.ensureBucket();

    // Generate base filename
    const baseFilename = this.generateFilename(originalName);
    const ext = path.extname(originalName);
    const basename = path.basename(baseFilename, ext);

    // Generate filenames for all variants
    const originalFilename = baseFilename;
    const thumbnailFilename = `${basename}-thumb${ext}`;
    const mediumFilename = `${basename}-medium${ext}`;

    try {
      // Process and upload original
      const originalUrl = await this.uploadBuffer(buffer, originalFilename, mimeType);

      // Generate and upload thumbnail (300x300, cover)
      const thumbnailBuffer = await sharp(buffer)
        .resize(300, 300, {
          fit: 'cover',
          position: 'center'
        })
        .toBuffer();
      const thumbnailUrl = await this.uploadBuffer(thumbnailBuffer, thumbnailFilename, mimeType);

      // Generate and upload medium (800w, maintain aspect ratio)
      const mediumBuffer = await sharp(buffer)
        .resize(800, null, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .toBuffer();
      const mediumUrl = await this.uploadBuffer(mediumBuffer, mediumFilename, mimeType);

      return {
        original: originalUrl,
        thumbnail: thumbnailUrl,
        medium: mediumUrl,
        filename: originalFilename
      };
    } catch (error) {
      // Clean up any uploaded files on error
      await this.deleteFiles([originalFilename, thumbnailFilename, mediumFilename]);
      throw error;
    }
  }

  /**
   * Delete files from Supabase Storage
   * @param {string[]} filenames - Array of filenames to delete
   * @returns {Promise<void>}
   */
  async deleteFiles(filenames) {
    try {
      const { error } = await this.supabase.storage
        .from(this.bucketName)
        .remove(filenames);

      if (error) {
        console.error('Error deleting files:', error);
      }
    } catch (error) {
      console.error('Error in deleteFiles:', error);
    }
  }

  /**
   * Delete an image and all its variants from Supabase Storage
   * @param {string} filename - Base filename of the image to delete
   * @returns {Promise<void>}
   */
  async deleteImage(filename) {
    const ext = path.extname(filename);
    const basename = path.basename(filename, ext);

    // Define all variant filenames
    const variants = [
      filename,
      `${basename}-thumb${ext}`,
      `${basename}-medium${ext}`
    ];

    await this.deleteFiles(variants);
  }
}

module.exports = new SupabaseStorage();
