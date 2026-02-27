const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

/**
 * ImageProcessor class handles image processing operations including
 * generating thumbnails, medium-sized versions, and managing image variants.
 * 
 * Requirements: 14.1, 14.2, 14.3, 14.4, 14.5
 */
class ImageProcessor {
  /**
   * Generate a thumbnail version of an image (300x300, maintain aspect ratio)
   * @param {string} inputPath - Path to the original image
   * @param {string} outputPath - Path where thumbnail should be saved
   * @returns {Promise<void>}
   */
  async generateThumbnail(inputPath, outputPath) {
    await sharp(inputPath)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center'
      })
      .toFile(outputPath);
  }

  /**
   * Generate a medium-sized version of an image (800w, maintain aspect ratio)
   * @param {string} inputPath - Path to the original image
   * @param {string} outputPath - Path where medium image should be saved
   * @returns {Promise<void>}
   */
  async generateMedium(inputPath, outputPath) {
    await sharp(inputPath)
      .resize(800, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toFile(outputPath);
  }

  /**
   * Process an uploaded image by generating all variants (thumbnail and medium)
   * @param {Object} file - Multer file object
   * @returns {Promise<Object>} Object containing URLs for all image variants
   */
  async processUpload(file) {
    const originalPath = file.path;
    const filename = file.filename;
    const ext = path.extname(filename);
    const basename = path.basename(filename, ext);
    const uploadDir = path.dirname(originalPath);

    // Generate paths for variants
    const thumbnailFilename = `${basename}-thumb${ext}`;
    const mediumFilename = `${basename}-medium${ext}`;
    const thumbnailPath = path.join(uploadDir, thumbnailFilename);
    const mediumPath = path.join(uploadDir, mediumFilename);

    // Generate image variants
    await this.generateThumbnail(originalPath, thumbnailPath);
    await this.generateMedium(originalPath, mediumPath);

    // Return URLs for all variants (relative to uploads directory)
    return {
      original: `/uploads/${filename}`,
      thumbnail: `/uploads/${thumbnailFilename}`,
      medium: `/uploads/${mediumFilename}`
    };
  }

  /**
   * Process an image buffer by generating all variants (thumbnail and medium)
   * @param {Buffer} buffer - Image buffer
   * @param {string} mimeType - MIME type of the image
   * @returns {Promise<Object>} Object containing buffers for all image variants
   */
  async processBuffer(buffer, mimeType) {
    // Generate thumbnail buffer (300x300, maintain aspect ratio)
    const thumbnailBuffer = await sharp(buffer)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center'
      })
      .toBuffer();

    // Generate medium buffer (800w, maintain aspect ratio)
    const mediumBuffer = await sharp(buffer)
      .resize(800, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toBuffer();

    return {
      original: buffer,
      thumbnail: thumbnailBuffer,
      medium: mediumBuffer
    };
  }

  /**
   * Delete an image and all its variants
   * @param {string} filename - Base filename of the image to delete
   * @param {string} uploadDir - Directory where images are stored (default: 'uploads')
   * @returns {Promise<void>}
   */
  async deleteImage(filename, uploadDir = 'uploads') {
    const ext = path.extname(filename);
    const basename = path.basename(filename, ext);

    // Define all variant filenames
    const variants = [
      filename,
      `${basename}-thumb${ext}`,
      `${basename}-medium${ext}`
    ];

    // Delete all variants
    const deletePromises = variants.map(async (variant) => {
      const filePath = path.join(uploadDir, variant);
      try {
        await fs.unlink(filePath);
      } catch (error) {
        // Ignore errors if file doesn't exist
        if (error.code !== 'ENOENT') {
          console.error(`Error deleting ${filePath}:`, error);
        }
      }
    });

    await Promise.all(deletePromises);
  }
}

module.exports = new ImageProcessor();
