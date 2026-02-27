const jwt = require('jsonwebtoken');

// Mock dependencies before requiring the route
jest.mock('../services/supabaseStorage', () => ({
  processAndUpload: jest.fn(),
  deleteImage: jest.fn()
}));
jest.mock('../repositories/mediaRepository');
jest.mock('../middleware/upload', () => {
  return {
    single: jest.fn(() => (req, res, next) => {
      // Simulate multer adding file to request with buffer
      if (req.body.hasFile) {
        req.file = {
          buffer: Buffer.from('fake-image-data'),
          originalname: 'test-image.jpg',
          mimetype: 'image/jpeg',
          size: 1024
        };
      }
      next();
    }),
    array: jest.fn(() => (req, res, next) => {
      // Simulate multer adding files array to request with buffers
      if (req.body.hasFiles) {
        req.files = req.body.mockFiles || [];
      }
      next();
    })
  };
});

const supabaseStorage = require('../services/supabaseStorage');
const MediaRepository = require('../repositories/mediaRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

describe('Media Upload Route Logic', () => {
  let mockMediaRepository;
  let req, res;

  beforeEach(() => {
    // Mock MediaRepository instance
    mockMediaRepository = {
      create: jest.fn(),
      close: jest.fn()
    };
    MediaRepository.mockImplementation(() => mockMediaRepository);

    // Mock request and response objects
    req = {
      headers: {},
      body: {},
      file: null,
      files: null,
      userId: 1
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('successful upload', () => {
    it('should process image and return URLs for all variants', async () => {
      // Setup
      req.file = {
        buffer: Buffer.from('fake-image-data'),
        originalname: 'test-image.jpg',
        mimetype: 'image/jpeg',
        size: 1024
      };

      supabaseStorage.processAndUpload.mockResolvedValue({
        original: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123.jpg',
        thumbnail: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123-thumb.jpg',
        medium: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123-medium.jpg',
        filename: '1234567890-abc123.jpg'
      });

      mockMediaRepository.create.mockResolvedValue({
        id: 1,
        filename: '1234567890-abc123.jpg',
        original_name: 'test-image.jpg',
        mime_type: 'image/jpeg',
        file_size: 1024,
        url_original: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123.jpg',
        url_thumbnail: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123-thumb.jpg',
        url_medium: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123-medium.jpg',
        uploaded_by: 1,
        uploaded_at: new Date()
      });

      // Simulate the route handler logic
      const { router } = require('./media');
      const routeHandler = router.stack.find(layer => 
        layer.route && layer.route.path === '/upload' && layer.route.methods.post
      ).route.stack[2].handle; // Get the actual handler (after verifyToken and upload middleware)

      await routeHandler(req, res);

      // Assertions
      expect(supabaseStorage.processAndUpload).toHaveBeenCalledWith(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
      expect(mockMediaRepository.create).toHaveBeenCalledWith({
        filename: '1234567890-abc123.jpg',
        originalName: 'test-image.jpg',
        mimeType: 'image/jpeg',
        fileSize: 1024,
        urlOriginal: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123.jpg',
        urlThumbnail: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123-thumb.jpg',
        urlMedium: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123-medium.jpg',
        uploadedBy: 1
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          id: 1,
          urls: {
            original: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123.jpg',
            thumbnail: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123-thumb.jpg',
            medium: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123-medium.jpg'
          },
          filename: '1234567890-abc123.jpg',
          originalName: 'test-image.jpg',
          fileSize: 1024
        })
      });
      expect(mockMediaRepository.close).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should return 400 when no file is provided', async () => {
      // No file in request
      req.file = null;

      const { router } = require('./media');
      const routeHandler = router.stack.find(layer => 
        layer.route && layer.route.path === '/upload' && layer.route.methods.post
      ).route.stack[2].handle;

      await routeHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'NO_FILE',
          message: 'No image file provided'
        }
      });
      expect(mockMediaRepository.close).toHaveBeenCalled();
    });

    it('should return 500 when image processing fails', async () => {
      req.file = {
        buffer: Buffer.from('fake-image-data'),
        originalname: 'test-image.jpg',
        mimetype: 'image/jpeg',
        size: 1024
      };

      supabaseStorage.processAndUpload.mockRejectedValue(new Error('Processing failed'));

      const { router } = require('./media');
      const routeHandler = router.stack.find(layer => 
        layer.route && layer.route.path === '/upload' && layer.route.methods.post
      ).route.stack[2].handle;

      await routeHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'UPLOAD_ERROR',
          message: 'Failed to upload image',
          details: 'Processing failed'
        }
      });
      expect(mockMediaRepository.close).toHaveBeenCalled();
    });

    it('should return 500 when database operation fails', async () => {
      req.file = {
        buffer: Buffer.from('fake-image-data'),
        originalname: 'test-image.jpg',
        mimetype: 'image/jpeg',
        size: 1024
      };

      supabaseStorage.processAndUpload.mockResolvedValue({
        original: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123.jpg',
        thumbnail: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123-thumb.jpg',
        medium: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123-medium.jpg',
        filename: '1234567890-abc123.jpg'
      });

      mockMediaRepository.create.mockRejectedValue(new Error('Database error'));

      const { router } = require('./media');
      const routeHandler = router.stack.find(layer => 
        layer.route && layer.route.path === '/upload' && layer.route.methods.post
      ).route.stack[2].handle;

      await routeHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'UPLOAD_ERROR',
          message: 'Failed to upload image',
          details: 'Database error'
        }
      });
      expect(mockMediaRepository.close).toHaveBeenCalled();
    });
  });
});

describe('Multiple Media Upload Route Logic', () => {
  let mockMediaRepository;
  let req, res;

  beforeEach(() => {
    // Mock MediaRepository instance
    mockMediaRepository = {
      create: jest.fn(),
      close: jest.fn()
    };
    MediaRepository.mockImplementation(() => mockMediaRepository);

    // Mock request and response objects
    req = {
      headers: {},
      body: {},
      files: null,
      userId: 1
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('successful multiple upload', () => {
    it('should process multiple images and return array of URLs', async () => {
      // Setup
      req.files = [
        {
          buffer: Buffer.from('fake-image-data-1'),
          originalname: 'test-image-1.jpg',
          mimetype: 'image/jpeg',
          size: 1024
        },
        {
          buffer: Buffer.from('fake-image-data-2'),
          originalname: 'test-image-2.jpg',
          mimetype: 'image/jpeg',
          size: 2048
        }
      ];

      supabaseStorage.processAndUpload
        .mockResolvedValueOnce({
          original: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123.jpg',
          thumbnail: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123-thumb.jpg',
          medium: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123-medium.jpg',
          filename: '1234567890-abc123.jpg'
        })
        .mockResolvedValueOnce({
          original: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-def456.jpg',
          thumbnail: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-def456-thumb.jpg',
          medium: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-def456-medium.jpg',
          filename: '1234567890-def456.jpg'
        });

      mockMediaRepository.create
        .mockResolvedValueOnce({
          id: 1,
          filename: '1234567890-abc123.jpg',
          original_name: 'test-image-1.jpg',
          mime_type: 'image/jpeg',
          file_size: 1024,
          url_original: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123.jpg',
          url_thumbnail: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123-thumb.jpg',
          url_medium: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123-medium.jpg',
          uploaded_by: 1,
          uploaded_at: new Date()
        })
        .mockResolvedValueOnce({
          id: 2,
          filename: '1234567890-def456.jpg',
          original_name: 'test-image-2.jpg',
          mime_type: 'image/jpeg',
          file_size: 2048,
          url_original: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-def456.jpg',
          url_thumbnail: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-def456-thumb.jpg',
          url_medium: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-def456-medium.jpg',
          uploaded_by: 1,
          uploaded_at: new Date()
        });

      // Simulate the route handler logic
      const { router } = require('./media');
      const routeHandler = router.stack.find(layer => 
        layer.route && layer.route.path === '/upload-multiple' && layer.route.methods.post
      ).route.stack[2].handle;

      await routeHandler(req, res);

      // Assertions
      expect(supabaseStorage.processAndUpload).toHaveBeenCalledTimes(2);
      expect(mockMediaRepository.create).toHaveBeenCalledTimes(2);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: [
          expect.objectContaining({
            id: 1,
            urls: {
              original: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123.jpg',
              thumbnail: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123-thumb.jpg',
              medium: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123-medium.jpg'
            },
            filename: '1234567890-abc123.jpg',
            originalName: 'test-image-1.jpg',
            fileSize: 1024
          }),
          expect.objectContaining({
            id: 2,
            urls: {
              original: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-def456.jpg',
              thumbnail: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-def456-thumb.jpg',
              medium: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-def456-medium.jpg'
            },
            filename: '1234567890-def456.jpg',
            originalName: 'test-image-2.jpg',
            fileSize: 2048
          })
        ],
        errors: undefined
      });
      expect(mockMediaRepository.close).toHaveBeenCalled();
    });

    it('should handle partial success with some files failing', async () => {
      req.files = [
        {
          buffer: Buffer.from('fake-image-data-1'),
          originalname: 'test-image-1.jpg',
          mimetype: 'image/jpeg',
          size: 1024
        },
        {
          buffer: Buffer.from('fake-image-data-2'),
          originalname: 'test-image-2.jpg',
          mimetype: 'image/jpeg',
          size: 2048
        }
      ];

      supabaseStorage.processAndUpload
        .mockResolvedValueOnce({
          original: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123.jpg',
          thumbnail: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123-thumb.jpg',
          medium: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123-medium.jpg',
          filename: '1234567890-abc123.jpg'
        })
        .mockRejectedValueOnce(new Error('Processing failed for second image'));

      mockMediaRepository.create.mockResolvedValueOnce({
        id: 1,
        filename: '1234567890-abc123.jpg',
        original_name: 'test-image-1.jpg',
        mime_type: 'image/jpeg',
        file_size: 1024,
        url_original: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123.jpg',
        url_thumbnail: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123-thumb.jpg',
        url_medium: 'https://vorjmpkirjpgeawkpfen.supabase.co/storage/v1/object/public/media/1234567890-abc123-medium.jpg',
        uploaded_by: 1,
        uploaded_at: new Date()
      });

      const { router } = require('./media');
      const routeHandler = router.stack.find(layer => 
        layer.route && layer.route.path === '/upload-multiple' && layer.route.methods.post
      ).route.stack[2].handle;

      await routeHandler(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: [
          expect.objectContaining({
            id: 1,
            filename: '1234567890-abc123.jpg'
          })
        ],
        errors: [
          {
            filename: 'test-image-2.jpg',
            error: 'Processing failed for second image'
          }
        ]
      });
      expect(mockMediaRepository.close).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should return 400 when no files are provided', async () => {
      req.files = null;

      const { router } = require('./media');
      const routeHandler = router.stack.find(layer => 
        layer.route && layer.route.path === '/upload-multiple' && layer.route.methods.post
      ).route.stack[2].handle;

      await routeHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'NO_FILES',
          message: 'No image files provided'
        }
      });
      expect(mockMediaRepository.close).toHaveBeenCalled();
    });

    it('should return 400 when empty files array is provided', async () => {
      req.files = [];

      const { router } = require('./media');
      const routeHandler = router.stack.find(layer => 
        layer.route && layer.route.path === '/upload-multiple' && layer.route.methods.post
      ).route.stack[2].handle;

      await routeHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'NO_FILES',
          message: 'No image files provided'
        }
      });
      expect(mockMediaRepository.close).toHaveBeenCalled();
    });

    it('should return 500 when all uploads fail', async () => {
      req.files = [
        {
          buffer: Buffer.from('fake-image-data'),
          originalname: 'test-image-1.jpg',
          mimetype: 'image/jpeg',
          size: 1024
        }
      ];

      supabaseStorage.processAndUpload.mockRejectedValue(new Error('Processing failed'));

      const { router } = require('./media');
      const routeHandler = router.stack.find(layer => 
        layer.route && layer.route.path === '/upload-multiple' && layer.route.methods.post
      ).route.stack[2].handle;

      await routeHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'ALL_UPLOADS_FAILED',
          message: 'All image uploads failed',
          details: [
            {
              filename: 'test-image-1.jpg',
              error: 'Processing failed'
            }
          ]
        }
      });
      expect(mockMediaRepository.close).toHaveBeenCalled();
    });
  });
});

describe('Media List Route Logic', () => {
  let mockMediaRepository;
  let req, res;

  beforeEach(() => {
    // Mock MediaRepository instance
    mockMediaRepository = {
      findAll: jest.fn(),
      close: jest.fn()
    };
    MediaRepository.mockImplementation(() => mockMediaRepository);

    // Mock request and response objects
    req = {
      query: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('successful media list retrieval', () => {
    it('should return paginated media list with default parameters', async () => {
      // Setup - no query parameters, should use defaults
      const mockMediaData = {
        media: [
          {
            id: 1,
            filename: 'image-123.jpg',
            original_name: 'test-image-1.jpg',
            mime_type: 'image/jpeg',
            file_size: 1024,
            url_original: '/uploads/image-123.jpg',
            url_thumbnail: '/uploads/image-123-thumb.jpg',
            url_medium: '/uploads/image-123-medium.jpg',
            uploaded_by: 1,
            uploaded_at: new Date('2024-01-01')
          },
          {
            id: 2,
            filename: 'image-456.jpg',
            original_name: 'test-image-2.jpg',
            mime_type: 'image/png',
            file_size: 2048,
            url_original: '/uploads/image-456.jpg',
            url_thumbnail: '/uploads/image-456-thumb.jpg',
            url_medium: '/uploads/image-456-medium.jpg',
            uploaded_by: 1,
            uploaded_at: new Date('2024-01-02')
          }
        ],
        pagination: {
          page: 1,
          limit: 50,
          total: 2,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      };

      mockMediaRepository.findAll.mockResolvedValue(mockMediaData);

      const { router } = require('./media');
      const routeHandler = router.stack.find(layer => 
        layer.route && layer.route.path === '/' && layer.route.methods.get
      ).route.stack[0].handle;

      await routeHandler(req, res);

      // Assertions
      expect(mockMediaRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 50,
        search: ''
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          media: [
            {
              id: 1,
              filename: 'image-123.jpg',
              originalName: 'test-image-1.jpg',
              mimeType: 'image/jpeg',
              fileSize: 1024,
              urls: {
                original: '/uploads/image-123.jpg',
                thumbnail: '/uploads/image-123-thumb.jpg',
                medium: '/uploads/image-123-medium.jpg'
              },
              uploadedBy: 1,
              uploadedAt: new Date('2024-01-01')
            },
            {
              id: 2,
              filename: 'image-456.jpg',
              originalName: 'test-image-2.jpg',
              mimeType: 'image/png',
              fileSize: 2048,
              urls: {
                original: '/uploads/image-456.jpg',
                thumbnail: '/uploads/image-456-thumb.jpg',
                medium: '/uploads/image-456-medium.jpg'
              },
              uploadedBy: 1,
              uploadedAt: new Date('2024-01-02')
            }
          ],
          pagination: mockMediaData.pagination
        }
      });
      expect(mockMediaRepository.close).toHaveBeenCalled();
    });

    it('should return paginated media list with custom page and limit', async () => {
      req.query = { page: '2', limit: '10' };

      const mockMediaData = {
        media: [],
        pagination: {
          page: 2,
          limit: 10,
          total: 15,
          totalPages: 2,
          hasNext: false,
          hasPrev: true
        }
      };

      mockMediaRepository.findAll.mockResolvedValue(mockMediaData);

      const { router } = require('./media');
      const routeHandler = router.stack.find(layer => 
        layer.route && layer.route.path === '/' && layer.route.methods.get
      ).route.stack[0].handle;

      await routeHandler(req, res);

      expect(mockMediaRepository.findAll).toHaveBeenCalledWith({
        page: 2,
        limit: 10,
        search: ''
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          media: [],
          pagination: mockMediaData.pagination
        }
      });
      expect(mockMediaRepository.close).toHaveBeenCalled();
    });

    it('should return filtered media list with search parameter', async () => {
      req.query = { search: 'vacation' };

      const mockMediaData = {
        media: [
          {
            id: 5,
            filename: 'image-789.jpg',
            original_name: 'vacation-photo.jpg',
            mime_type: 'image/jpeg',
            file_size: 3072,
            url_original: '/uploads/image-789.jpg',
            url_thumbnail: '/uploads/image-789-thumb.jpg',
            url_medium: '/uploads/image-789-medium.jpg',
            uploaded_by: 1,
            uploaded_at: new Date('2024-01-03')
          }
        ],
        pagination: {
          page: 1,
          limit: 50,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      };

      mockMediaRepository.findAll.mockResolvedValue(mockMediaData);

      const { router } = require('./media');
      const routeHandler = router.stack.find(layer => 
        layer.route && layer.route.path === '/' && layer.route.methods.get
      ).route.stack[0].handle;

      await routeHandler(req, res);

      expect(mockMediaRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 50,
        search: 'vacation'
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          media: [
            {
              id: 5,
              filename: 'image-789.jpg',
              originalName: 'vacation-photo.jpg',
              mimeType: 'image/jpeg',
              fileSize: 3072,
              urls: {
                original: '/uploads/image-789.jpg',
                thumbnail: '/uploads/image-789-thumb.jpg',
                medium: '/uploads/image-789-medium.jpg'
              },
              uploadedBy: 1,
              uploadedAt: new Date('2024-01-03')
            }
          ],
          pagination: mockMediaData.pagination
        }
      });
      expect(mockMediaRepository.close).toHaveBeenCalled();
    });
  });

  describe('validation and error handling', () => {
    it('should return 400 when page is less than 1', async () => {
      req.query = { page: '0' };

      const { router } = require('./media');
      const routeHandler = router.stack.find(layer => 
        layer.route && layer.route.path === '/' && layer.route.methods.get
      ).route.stack[0].handle;

      await routeHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INVALID_PAGE',
          message: 'Page number must be greater than 0'
        }
      });
      expect(mockMediaRepository.close).toHaveBeenCalled();
    });

    it('should return 400 when limit is less than 1', async () => {
      req.query = { limit: '0' };

      const { router } = require('./media');
      const routeHandler = router.stack.find(layer => 
        layer.route && layer.route.path === '/' && layer.route.methods.get
      ).route.stack[0].handle;

      await routeHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INVALID_LIMIT',
          message: 'Limit must be between 1 and 100'
        }
      });
      expect(mockMediaRepository.close).toHaveBeenCalled();
    });

    it('should return 400 when limit exceeds 100', async () => {
      req.query = { limit: '101' };

      const { router } = require('./media');
      const routeHandler = router.stack.find(layer => 
        layer.route && layer.route.path === '/' && layer.route.methods.get
      ).route.stack[0].handle;

      await routeHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INVALID_LIMIT',
          message: 'Limit must be between 1 and 100'
        }
      });
      expect(mockMediaRepository.close).toHaveBeenCalled();
    });

    it('should return 500 when database operation fails', async () => {
      mockMediaRepository.findAll.mockRejectedValue(new Error('Database connection failed'));

      const { router } = require('./media');
      const routeHandler = router.stack.find(layer => 
        layer.route && layer.route.path === '/' && layer.route.methods.get
      ).route.stack[0].handle;

      await routeHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch media records',
          details: 'Database connection failed'
        }
      });
      expect(mockMediaRepository.close).toHaveBeenCalled();
    });

    it('should handle invalid page parameter gracefully', async () => {
      req.query = { page: 'invalid' };

      const mockMediaData = {
        media: [],
        pagination: {
          page: 1,
          limit: 50,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      };

      mockMediaRepository.findAll.mockResolvedValue(mockMediaData);

      const { router } = require('./media');
      const routeHandler = router.stack.find(layer => 
        layer.route && layer.route.path === '/' && layer.route.methods.get
      ).route.stack[0].handle;

      await routeHandler(req, res);

      // Should default to page 1 when invalid
      expect(mockMediaRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 50,
        search: ''
      });
      expect(mockMediaRepository.close).toHaveBeenCalled();
    });
  });
});
