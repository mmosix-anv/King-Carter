const imageProcessor = require('./imageProcessor');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Mock sharp and fs
jest.mock('sharp');
jest.mock('fs', () => ({
  promises: {
    unlink: jest.fn()
  }
}));

describe('ImageProcessor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateThumbnail', () => {
    it('should generate a 300x300 thumbnail with cover fit', async () => {
      const mockResize = jest.fn().mockReturnThis();
      const mockToFile = jest.fn().mockResolvedValue();
      
      sharp.mockReturnValue({
        resize: mockResize,
        toFile: mockToFile
      });

      await imageProcessor.generateThumbnail('/input/image.jpg', '/output/thumb.jpg');

      expect(sharp).toHaveBeenCalledWith('/input/image.jpg');
      expect(mockResize).toHaveBeenCalledWith(300, 300, {
        fit: 'cover',
        position: 'center'
      });
      expect(mockToFile).toHaveBeenCalledWith('/output/thumb.jpg');
    });
  });

  describe('generateMedium', () => {
    it('should generate an 800w medium image maintaining aspect ratio', async () => {
      const mockResize = jest.fn().mockReturnThis();
      const mockToFile = jest.fn().mockResolvedValue();
      
      sharp.mockReturnValue({
        resize: mockResize,
        toFile: mockToFile
      });

      await imageProcessor.generateMedium('/input/image.jpg', '/output/medium.jpg');

      expect(sharp).toHaveBeenCalledWith('/input/image.jpg');
      expect(mockResize).toHaveBeenCalledWith(800, null, {
        fit: 'inside',
        withoutEnlargement: true
      });
      expect(mockToFile).toHaveBeenCalledWith('/output/medium.jpg');
    });
  });

  describe('processUpload', () => {
    it('should generate all variants and return URLs', async () => {
      const mockFile = {
        path: '/uploads/image-123.jpg',
        filename: 'image-123.jpg'
      };

      const mockResize = jest.fn().mockReturnThis();
      const mockToFile = jest.fn().mockResolvedValue();
      
      sharp.mockReturnValue({
        resize: mockResize,
        toFile: mockToFile
      });

      const result = await imageProcessor.processUpload(mockFile);

      expect(result).toEqual({
        original: '/uploads/image-123.jpg',
        thumbnail: '/uploads/image-123-thumb.jpg',
        medium: '/uploads/image-123-medium.jpg'
      });

      // Verify both variants were generated
      expect(mockToFile).toHaveBeenCalledTimes(2);
      expect(mockToFile).toHaveBeenCalledWith(path.join('/uploads', 'image-123-thumb.jpg'));
      expect(mockToFile).toHaveBeenCalledWith(path.join('/uploads', 'image-123-medium.jpg'));
    });

    it('should handle files with different extensions', async () => {
      const mockFile = {
        path: '/uploads/photo-456.png',
        filename: 'photo-456.png'
      };

      const mockResize = jest.fn().mockReturnThis();
      const mockToFile = jest.fn().mockResolvedValue();
      
      sharp.mockReturnValue({
        resize: mockResize,
        toFile: mockToFile
      });

      const result = await imageProcessor.processUpload(mockFile);

      expect(result).toEqual({
        original: '/uploads/photo-456.png',
        thumbnail: '/uploads/photo-456-thumb.png',
        medium: '/uploads/photo-456-medium.png'
      });
    });
  });

  describe('processBuffer', () => {
    it('should generate all variant buffers from input buffer', async () => {
      const inputBuffer = Buffer.from('test-image-data');
      const thumbnailBuffer = Buffer.from('thumbnail-data');
      const mediumBuffer = Buffer.from('medium-data');

      const mockResize = jest.fn().mockReturnThis();
      const mockToBuffer = jest.fn()
        .mockResolvedValueOnce(thumbnailBuffer)
        .mockResolvedValueOnce(mediumBuffer);
      
      sharp.mockReturnValue({
        resize: mockResize,
        toBuffer: mockToBuffer
      });

      const result = await imageProcessor.processBuffer(inputBuffer, 'image/jpeg');

      expect(result).toEqual({
        original: inputBuffer,
        thumbnail: thumbnailBuffer,
        medium: mediumBuffer
      });

      // Verify sharp was called twice (thumbnail and medium)
      expect(sharp).toHaveBeenCalledTimes(2);
      expect(sharp).toHaveBeenCalledWith(inputBuffer);
      
      // Verify thumbnail resize
      expect(mockResize).toHaveBeenCalledWith(300, 300, {
        fit: 'cover',
        position: 'center'
      });
      
      // Verify medium resize
      expect(mockResize).toHaveBeenCalledWith(800, null, {
        fit: 'inside',
        withoutEnlargement: true
      });
      
      expect(mockToBuffer).toHaveBeenCalledTimes(2);
    });

    it('should handle different image formats', async () => {
      const inputBuffer = Buffer.from('png-image-data');

      const mockResize = jest.fn().mockReturnThis();
      const mockToBuffer = jest.fn()
        .mockResolvedValueOnce(Buffer.from('thumb'))
        .mockResolvedValueOnce(Buffer.from('medium'));
      
      sharp.mockReturnValue({
        resize: mockResize,
        toBuffer: mockToBuffer
      });

      const result = await imageProcessor.processBuffer(inputBuffer, 'image/png');

      expect(result.original).toBe(inputBuffer);
      expect(result.thumbnail).toBeInstanceOf(Buffer);
      expect(result.medium).toBeInstanceOf(Buffer);
    });
  });

  describe('deleteImage', () => {
    it('should delete all image variants', async () => {
      const fsPromises = require('fs').promises;
      fsPromises.unlink.mockResolvedValue();

      await imageProcessor.deleteImage('image-123.jpg', 'uploads');

      expect(fsPromises.unlink).toHaveBeenCalledTimes(3);
      expect(fsPromises.unlink).toHaveBeenCalledWith(path.join('uploads', 'image-123.jpg'));
      expect(fsPromises.unlink).toHaveBeenCalledWith(path.join('uploads', 'image-123-thumb.jpg'));
      expect(fsPromises.unlink).toHaveBeenCalledWith(path.join('uploads', 'image-123-medium.jpg'));
    });

    it('should ignore ENOENT errors for missing files', async () => {
      const fsPromises = require('fs').promises;
      const enoentError = new Error('File not found');
      enoentError.code = 'ENOENT';
      
      fsPromises.unlink
        .mockResolvedValueOnce() // original succeeds
        .mockRejectedValueOnce(enoentError) // thumbnail missing
        .mockResolvedValueOnce(); // medium succeeds

      // Should not throw
      await expect(imageProcessor.deleteImage('image-123.jpg', 'uploads')).resolves.not.toThrow();
    });

    it('should log other errors but continue deletion', async () => {
      const fsPromises = require('fs').promises;
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const otherError = new Error('Permission denied');
      otherError.code = 'EACCES';
      
      fsPromises.unlink
        .mockResolvedValueOnce() // original succeeds
        .mockRejectedValueOnce(otherError) // thumbnail fails with permission error
        .mockResolvedValueOnce(); // medium succeeds

      await imageProcessor.deleteImage('image-123.jpg', 'uploads');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error deleting'),
        otherError
      );

      consoleErrorSpy.mockRestore();
    });

    it('should use default upload directory if not specified', async () => {
      const fsPromises = require('fs').promises;
      fsPromises.unlink.mockResolvedValue();

      await imageProcessor.deleteImage('image-123.jpg');

      expect(fsPromises.unlink).toHaveBeenCalledWith(path.join('uploads', 'image-123.jpg'));
      expect(fsPromises.unlink).toHaveBeenCalledWith(path.join('uploads', 'image-123-thumb.jpg'));
      expect(fsPromises.unlink).toHaveBeenCalledWith(path.join('uploads', 'image-123-medium.jpg'));
    });
  });
});
