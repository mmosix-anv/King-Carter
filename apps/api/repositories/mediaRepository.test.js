const MediaRepository = require('./mediaRepository');
const SupabaseDatabase = require('../supabase-database');

// Mock the SupabaseDatabase
jest.mock('../supabase-database');

describe('MediaRepository', () => {
  let mediaRepository;
  let mockPool;
  let mockQuery;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock query function
    mockQuery = jest.fn();
    mockPool = {
      query: mockQuery
    };

    // Mock SupabaseDatabase instance
    SupabaseDatabase.mockImplementation(() => ({
      getPool: () => mockPool,
      close: jest.fn()
    }));

    mediaRepository = new MediaRepository();
  });

  describe('create', () => {
    it('should insert a new media record and return it', async () => {
      const mediaData = {
        filename: 'image-123.jpg',
        originalName: 'my-photo.jpg',
        mimeType: 'image/jpeg',
        fileSize: 2048576,
        urlOriginal: '/uploads/image-123.jpg',
        urlThumbnail: '/uploads/image-123-thumb.jpg',
        urlMedium: '/uploads/image-123-medium.jpg',
        uploadedBy: 1
      };

      const mockResult = {
        rows: [{
          id: 1,
          ...mediaData,
          uploaded_at: '2024-01-01T00:00:00Z'
        }]
      };

      mockQuery.mockResolvedValue(mockResult);

      const result = await mediaRepository.create(mediaData);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO media'),
        [
          mediaData.filename,
          mediaData.originalName,
          mediaData.mimeType,
          mediaData.fileSize,
          mediaData.urlOriginal,
          mediaData.urlThumbnail,
          mediaData.urlMedium,
          mediaData.uploadedBy
        ]
      );
      expect(result).toEqual(mockResult.rows[0]);
    });

    it('should throw error if database insert fails', async () => {
      const mediaData = {
        filename: 'image-123.jpg',
        originalName: 'my-photo.jpg',
        mimeType: 'image/jpeg',
        fileSize: 2048576,
        urlOriginal: '/uploads/image-123.jpg',
        urlThumbnail: '/uploads/image-123-thumb.jpg',
        urlMedium: '/uploads/image-123-medium.jpg',
        uploadedBy: 1
      };

      mockQuery.mockRejectedValue(new Error('Database error'));

      await expect(mediaRepository.create(mediaData)).rejects.toThrow(
        'Failed to create media record: Database error'
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated media records without search', async () => {
      const mockMediaResult = {
        rows: [
          {
            id: 1,
            filename: 'image-1.jpg',
            original_name: 'photo1.jpg',
            mime_type: 'image/jpeg',
            file_size: 1024,
            url_original: '/uploads/image-1.jpg',
            url_thumbnail: '/uploads/image-1-thumb.jpg',
            url_medium: '/uploads/image-1-medium.jpg',
            uploaded_by: 1,
            uploaded_at: '2024-01-01T00:00:00Z'
          }
        ]
      };

      const mockCountResult = {
        rows: [{ total: '1' }]
      };

      mockQuery
        .mockResolvedValueOnce(mockMediaResult)
        .mockResolvedValueOnce(mockCountResult);

      const result = await mediaRepository.findAll({ page: 1, limit: 50 });

      expect(mockQuery).toHaveBeenCalledTimes(2);
      expect(result.media).toEqual(mockMediaResult.rows);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 50,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      });
    });

    it('should return paginated media records with search filter', async () => {
      const mockMediaResult = {
        rows: [
          {
            id: 1,
            filename: 'sunset-123.jpg',
            original_name: 'sunset.jpg',
            mime_type: 'image/jpeg',
            file_size: 1024,
            url_original: '/uploads/sunset-123.jpg',
            url_thumbnail: '/uploads/sunset-123-thumb.jpg',
            url_medium: '/uploads/sunset-123-medium.jpg',
            uploaded_by: 1,
            uploaded_at: '2024-01-01T00:00:00Z'
          }
        ]
      };

      const mockCountResult = {
        rows: [{ total: '1' }]
      };

      mockQuery
        .mockResolvedValueOnce(mockMediaResult)
        .mockResolvedValueOnce(mockCountResult);

      const result = await mediaRepository.findAll({ 
        page: 1, 
        limit: 50, 
        search: 'sunset' 
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE original_name ILIKE $1 OR filename ILIKE $1'),
        expect.arrayContaining(['%sunset%', 50, 0])
      );
      expect(result.media).toEqual(mockMediaResult.rows);
    });

    it('should calculate pagination correctly for multiple pages', async () => {
      const mockMediaResult = { rows: [] };
      const mockCountResult = { rows: [{ total: '150' }] };

      mockQuery
        .mockResolvedValueOnce(mockMediaResult)
        .mockResolvedValueOnce(mockCountResult);

      const result = await mediaRepository.findAll({ page: 2, limit: 50 });

      expect(result.pagination).toEqual({
        page: 2,
        limit: 50,
        total: 150,
        totalPages: 3,
        hasNext: true,
        hasPrev: true
      });
    });

    it('should throw error if database query fails', async () => {
      mockQuery.mockRejectedValue(new Error('Database error'));

      await expect(mediaRepository.findAll()).rejects.toThrow(
        'Failed to fetch media records: Database error'
      );
    });
  });

  describe('findById', () => {
    it('should return media record when found', async () => {
      const mockMedia = {
        id: 1,
        filename: 'image-123.jpg',
        original_name: 'photo.jpg',
        mime_type: 'image/jpeg',
        file_size: 1024,
        url_original: '/uploads/image-123.jpg',
        url_thumbnail: '/uploads/image-123-thumb.jpg',
        url_medium: '/uploads/image-123-medium.jpg',
        uploaded_by: 1,
        uploaded_at: '2024-01-01T00:00:00Z'
      };

      mockQuery.mockResolvedValue({ rows: [mockMedia] });

      const result = await mediaRepository.findById(1);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [1]
      );
      expect(result).toEqual(mockMedia);
    });

    it('should return null when media not found', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await mediaRepository.findById(999);

      expect(result).toBeNull();
    });

    it('should throw error if database query fails', async () => {
      mockQuery.mockRejectedValue(new Error('Database error'));

      await expect(mediaRepository.findById(1)).rejects.toThrow(
        'Failed to fetch media record: Database error'
      );
    });
  });

  describe('delete', () => {
    it('should delete media record and return true', async () => {
      mockQuery.mockResolvedValue({ rowCount: 1 });

      const result = await mediaRepository.delete(1);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM media WHERE id = $1'),
        [1]
      );
      expect(result).toBe(true);
    });

    it('should return false when media not found', async () => {
      mockQuery.mockResolvedValue({ rowCount: 0 });

      const result = await mediaRepository.delete(999);

      expect(result).toBe(false);
    });

    it('should throw error if database query fails', async () => {
      mockQuery.mockRejectedValue(new Error('Database error'));

      await expect(mediaRepository.delete(1)).rejects.toThrow(
        'Failed to delete media record: Database error'
      );
    });
  });

  describe('close', () => {
    it('should close database connection', () => {
      const mockClose = jest.fn();
      SupabaseDatabase.mockImplementation(() => ({
        getPool: () => mockPool,
        close: mockClose
      }));

      const repo = new MediaRepository();
      repo.close();

      expect(mockClose).toHaveBeenCalled();
    });
  });
});
