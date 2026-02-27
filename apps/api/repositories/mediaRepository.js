const SupabaseDatabase = require('../supabase-database');

/**
 * MediaRepository handles database operations for media records
 * Supports pagination, search, and CRUD operations for the media library
 */
class MediaRepository {
  constructor() {
    this.db = new SupabaseDatabase();
  }

  /**
   * Create a new media record in the database
   * @param {Object} mediaData - Media information
   * @param {string} mediaData.filename - Unique filename
   * @param {string} mediaData.originalName - Original uploaded filename
   * @param {string} mediaData.mimeType - MIME type (e.g., 'image/jpeg')
   * @param {number} mediaData.fileSize - File size in bytes
   * @param {string} mediaData.urlOriginal - URL to original image
   * @param {string} mediaData.urlThumbnail - URL to thumbnail variant
   * @param {string} mediaData.urlMedium - URL to medium variant
   * @param {number} mediaData.uploadedBy - User ID who uploaded the file
   * @returns {Promise<Object>} Created media record with id
   */
  async create(mediaData) {
    const {
      filename,
      originalName,
      mimeType,
      fileSize,
      urlOriginal,
      urlThumbnail,
      urlMedium,
      uploadedBy
    } = mediaData;

    const query = `
      INSERT INTO media (
        filename, 
        original_name, 
        mime_type, 
        file_size, 
        url_original, 
        url_thumbnail, 
        url_medium, 
        uploaded_by,
        uploaded_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const params = [
      filename,
      originalName,
      mimeType,
      fileSize,
      urlOriginal,
      urlThumbnail,
      urlMedium,
      uploadedBy
    ];

    try {
      const result = await this.db.getPool().query(query, params);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create media record: ${error.message}`);
    }
  }

  /**
   * Find all media records with pagination and optional search
   * @param {Object} options - Query options
   * @param {number} options.page - Page number (1-indexed)
   * @param {number} options.limit - Number of records per page
   * @param {string} options.search - Optional search term for filename
   * @returns {Promise<Object>} Object containing media array and pagination info
   */
  async findAll(options = {}) {
    const { page = 1, limit = 50, search = '' } = options;
    const offset = (page - 1) * limit;

    // Build query with optional search filter
    let query = `
      SELECT 
        id,
        filename,
        original_name,
        mime_type,
        file_size,
        url_original,
        url_thumbnail,
        url_medium,
        uploaded_by,
        uploaded_at
      FROM media
    `;

    const params = [];
    
    if (search) {
      query += ` WHERE original_name ILIKE $1 OR filename ILIKE $1`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY uploaded_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    // Count query for total records
    let countQuery = `SELECT COUNT(*) as total FROM media`;
    const countParams = [];
    
    if (search) {
      countQuery += ` WHERE original_name ILIKE $1 OR filename ILIKE $1`;
      countParams.push(`%${search}%`);
    }

    try {
      const [mediaResult, countResult] = await Promise.all([
        this.db.getPool().query(query, params),
        this.db.getPool().query(countQuery, countParams)
      ]);

      const total = parseInt(countResult.rows[0].total, 10);
      const totalPages = Math.ceil(total / limit);

      return {
        media: mediaResult.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch media records: ${error.message}`);
    }
  }

  /**
   * Find a single media record by ID
   * @param {number} id - Media record ID
   * @returns {Promise<Object|null>} Media record or null if not found
   */
  async findById(id) {
    const query = `
      SELECT 
        id,
        filename,
        original_name,
        mime_type,
        file_size,
        url_original,
        url_thumbnail,
        url_medium,
        uploaded_by,
        uploaded_at
      FROM media
      WHERE id = $1
    `;

    try {
      const result = await this.db.getPool().query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch media record: ${error.message}`);
    }
  }

  /**
   * Delete a media record by ID
   * @param {number} id - Media record ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async delete(id) {
    const query = `DELETE FROM media WHERE id = $1 RETURNING id`;

    try {
      const result = await this.db.getPool().query(query, [id]);
      return result.rowCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete media record: ${error.message}`);
    }
  }

  /**
   * Close database connection
   */
  close() {
    this.db.close();
  }
}

module.exports = MediaRepository;
