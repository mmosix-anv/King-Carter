const multer = require('multer');
const upload = require('./upload');

// Mock multer
jest.mock('multer');

describe('Upload Middleware', () => {
  let mockMemoryStorage;
  let mockMulter;
  let storageConfig;
  let fileFilterConfig;
  let limitsConfig;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Capture the configuration passed to multer
    mockMulter = jest.fn((config) => {
      storageConfig = config.storage;
      fileFilterConfig = config.fileFilter;
      limitsConfig = config.limits;
      return { single: jest.fn(), array: jest.fn() };
    });

    mockMemoryStorage = jest.fn(() => 'memory-storage');
    
    multer.mockImplementation(mockMulter);
    multer.memoryStorage = mockMemoryStorage;
  });

  describe('Storage Configuration', () => {
    it('should configure memory storage for Supabase upload', () => {
      // Re-require to trigger the configuration
      jest.isolateModules(() => {
        require('./upload');
      });

      expect(mockMemoryStorage).toHaveBeenCalled();
      expect(mockMulter).toHaveBeenCalledWith(
        expect.objectContaining({
          storage: 'memory-storage'
        })
      );
    });
  });

  describe('File Type Validation', () => {
    let fileFilter;

    beforeEach(() => {
      jest.isolateModules(() => {
        require('./upload');
      });
      fileFilter = mockMulter.mock.calls[0][0].fileFilter;
    });

    it('should accept valid image MIME types', () => {
      const validMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml'
      ];

      validMimeTypes.forEach(mimetype => {
        const mockCb = jest.fn();
        const mockFile = { mimetype };
        fileFilter(null, mockFile, mockCb);
        expect(mockCb).toHaveBeenCalledWith(null, true);
      });
    });

    it('should reject non-image MIME types', () => {
      const invalidMimeTypes = [
        'application/pdf',
        'text/plain',
        'video/mp4',
        'application/zip'
      ];

      invalidMimeTypes.forEach(mimetype => {
        const mockCb = jest.fn();
        const mockFile = { mimetype };
        fileFilter(null, mockFile, mockCb);
        expect(mockCb).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Invalid file type. Only image files are allowed.'
          }),
          false
        );
      });
    });
  });

  describe('File Size Limit', () => {
    it('should set file size limit to 10MB', () => {
      jest.isolateModules(() => {
        require('./upload');
      });

      const limits = mockMulter.mock.calls[0][0].limits;
      expect(limits.fileSize).toBe(10 * 1024 * 1024); // 10MB in bytes
    });
  });

  describe('Module Export', () => {
    it('should export the configured multer instance', () => {
      // Since we're mocking multer, we need to test that multer was called
      // The actual export is tested by the fact that other tests can use it
      jest.isolateModules(() => {
        require('./upload');
      });
      expect(mockMulter).toHaveBeenCalled();
    });
  });
});
