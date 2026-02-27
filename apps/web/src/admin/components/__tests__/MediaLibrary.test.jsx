import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MediaLibrary from '../MediaLibrary';

// Mock fetch globally
global.fetch = vi.fn();

describe('MediaLibrary Component', () => {
  const mockToken = 'test-jwt-token';
  const mockMediaData = {
    success: true,
    data: {
      media: [
        {
          id: 1,
          filename: 'image-1.jpg',
          originalName: 'photo1.jpg',
          mimeType: 'image/jpeg',
          fileSize: 2048576,
          urls: {
            original: '/uploads/image-1.jpg',
            thumbnail: '/uploads/image-1-thumb.jpg',
            medium: '/uploads/image-1-medium.jpg'
          },
          uploadedBy: 1,
          uploadedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          filename: 'image-2.jpg',
          originalName: 'photo2.jpg',
          mimeType: 'image/jpeg',
          fileSize: 1524288,
          urls: {
            original: '/uploads/image-2.jpg',
            thumbnail: '/uploads/image-2-thumb.jpg',
            medium: '/uploads/image-2-medium.jpg'
          },
          uploadedBy: 1,
          uploadedAt: '2024-01-16T14:20:00Z'
        }
      ],
      totalPages: 1,
      currentPage: 1,
      totalItems: 2
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    fetch.mockResolvedValue({
      json: async () => mockMediaData
    });
  });

  describe('Rendering', () => {
    it('should render the media library title', async () => {
      render(<MediaLibrary mode="manage" token={mockToken} />);
      
      expect(screen.getByText('Media Library')).toBeInTheDocument();
    });

    it('should render search input', async () => {
      render(<MediaLibrary mode="manage" token={mockToken} />);
      
      expect(screen.getByPlaceholderText('Search by filename...')).toBeInTheDocument();
    });

    it('should show loading state initially', () => {
      render(<MediaLibrary mode="manage" token={mockToken} />);
      
      expect(screen.getByText('Loading media...')).toBeInTheDocument();
    });

    it('should render close button when onClose prop provided', () => {
      const onClose = vi.fn();
      render(<MediaLibrary mode="manage" token={mockToken} onClose={onClose} />);
      
      const closeButton = screen.getByLabelText('Close media library');
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Data Fetching', () => {
    it('should fetch media on mount', async () => {
      render(<MediaLibrary mode="manage" token={mockToken} />);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/media?'),
          expect.objectContaining({
            headers: {
              'Authorization': `Bearer ${mockToken}`
            }
          })
        );
      });
    });

    it('should display fetched media items', async () => {
      render(<MediaLibrary mode="manage" token={mockToken} />);

      await waitFor(() => {
        expect(screen.getByText('photo1.jpg')).toBeInTheDocument();
        expect(screen.getByText('photo2.jpg')).toBeInTheDocument();
      });
    });

    it('should display error message on fetch failure', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: false,
          error: { message: 'Failed to load media' }
        })
      });

      render(<MediaLibrary mode="manage" token={mockToken} />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load media')).toBeInTheDocument();
      });
    });

    it('should show empty state when no media exists', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: {
            media: [],
            totalPages: 0,
            currentPage: 1,
            totalItems: 0
          }
        })
      });

      render(<MediaLibrary mode="manage" token={mockToken} />);

      await waitFor(() => {
        expect(screen.getByText('No images in media library')).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    it('should update search query on input change', async () => {
      render(<MediaLibrary mode="manage" token={mockToken} />);

      await waitFor(() => {
        expect(screen.getByText('photo1.jpg')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search by filename...');
      fireEvent.change(searchInput, { target: { value: 'photo1' } });

      expect(searchInput.value).toBe('photo1');
    });

    it('should fetch media with search query on form submit', async () => {
      render(<MediaLibrary mode="manage" token={mockToken} />);

      await waitFor(() => {
        expect(screen.getByText('photo1.jpg')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search by filename...');
      const searchButton = screen.getByText('Search');

      fireEvent.change(searchInput, { target: { value: 'photo1' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('search=photo1'),
          expect.any(Object)
        );
      });
    });
  });

  describe('Pagination', () => {
    it('should render pagination when multiple pages exist', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          ...mockMediaData,
          data: {
            ...mockMediaData.data,
            totalPages: 3,
            currentPage: 1
          }
        })
      });

      render(<MediaLibrary mode="manage" token={mockToken} />);

      await waitFor(() => {
        expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
      });
    });

    it('should disable previous button on first page', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          ...mockMediaData,
          data: {
            ...mockMediaData.data,
            totalPages: 3,
            currentPage: 1
          }
        })
      });

      render(<MediaLibrary mode="manage" token={mockToken} />);

      await waitFor(() => {
        const prevButton = screen.getByLabelText('Previous page');
        expect(prevButton).toBeDisabled();
      });
    });

    it('should navigate to next page when next button clicked', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          ...mockMediaData,
          data: {
            ...mockMediaData.data,
            totalPages: 3,
            currentPage: 1
          }
        })
      });

      render(<MediaLibrary mode="manage" token={mockToken} />);

      await waitFor(() => {
        expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
      });

      const nextButton = screen.getByLabelText('Next page');
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('page=2'),
          expect.any(Object)
        );
      });
    });
  });

  describe('Selection Mode', () => {
    it('should call onSelect with image URL on single select', async () => {
      const onSelect = vi.fn();
      const onClose = vi.fn();

      render(
        <MediaLibrary
          mode="select"
          multiSelect={false}
          onSelect={onSelect}
          onClose={onClose}
          token={mockToken}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('photo1.jpg')).toBeInTheDocument();
      });

      const firstImage = screen.getByAltText('photo1.jpg');
      fireEvent.click(firstImage.closest('[role="button"]'));

      expect(onSelect).toHaveBeenCalledWith('/uploads/image-1.jpg');
      expect(onClose).toHaveBeenCalled();
    });

    it('should allow multiple selection in multi-select mode', async () => {
      const onSelect = vi.fn();

      render(
        <MediaLibrary
          mode="select"
          multiSelect={true}
          onSelect={onSelect}
          token={mockToken}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('photo1.jpg')).toBeInTheDocument();
      });

      const firstImage = screen.getByAltText('photo1.jpg');
      const secondImage = screen.getByAltText('photo2.jpg');

      fireEvent.click(firstImage.closest('[role="button"]'));
      fireEvent.click(secondImage.closest('[role="button"]'));

      await waitFor(() => {
        expect(screen.getByText('2 images selected')).toBeInTheDocument();
      });
    });

    it('should call onSelect with array of URLs on multi-select confirm', async () => {
      const onSelect = vi.fn();
      const onClose = vi.fn();

      render(
        <MediaLibrary
          mode="select"
          multiSelect={true}
          onSelect={onSelect}
          onClose={onClose}
          token={mockToken}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('photo1.jpg')).toBeInTheDocument();
      });

      const firstImage = screen.getByAltText('photo1.jpg');
      fireEvent.click(firstImage.closest('[role="button"]'));

      const confirmButton = screen.getByText('Insert Selected');
      fireEvent.click(confirmButton);

      expect(onSelect).toHaveBeenCalledWith(['/uploads/image-1.jpg']);
      expect(onClose).toHaveBeenCalled();
    });

    it('should clear selection when clear button clicked', async () => {
      render(
        <MediaLibrary
          mode="select"
          multiSelect={true}
          token={mockToken}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('photo1.jpg')).toBeInTheDocument();
      });

      const firstImage = screen.getByAltText('photo1.jpg');
      fireEvent.click(firstImage.closest('[role="button"]'));

      await waitFor(() => {
        expect(screen.getByText('1 image selected')).toBeInTheDocument();
      });

      const clearButton = screen.getByText('Clear Selection');
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(screen.queryByText('1 image selected')).not.toBeInTheDocument();
      });
    });
  });

  describe('Delete Functionality', () => {
    it('should show delete button in manage mode', async () => {
      render(<MediaLibrary mode="manage" token={mockToken} />);

      await waitFor(() => {
        expect(screen.getByText('photo1.jpg')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByLabelText(/Delete/);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });

    it('should not show delete button in select mode', async () => {
      render(<MediaLibrary mode="select" token={mockToken} />);

      await waitFor(() => {
        expect(screen.getByText('photo1.jpg')).toBeInTheDocument();
      });

      const deleteButtons = screen.queryAllByLabelText(/Delete/);
      expect(deleteButtons.length).toBe(0);
    });

    it('should show confirmation dialog when delete clicked', async () => {
      render(<MediaLibrary mode="manage" token={mockToken} />);

      await waitFor(() => {
        expect(screen.getByText('photo1.jpg')).toBeInTheDocument();
      });

      const deleteButton = screen.getByLabelText('Delete photo1.jpg');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText('Delete Image')).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you want to delete "photo1.jpg"/)).toBeInTheDocument();
      });
    });

    it('should delete image when confirmed', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => mockMediaData
      });
      fetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          message: 'Media deleted successfully'
        })
      });

      render(<MediaLibrary mode="manage" token={mockToken} />);

      await waitFor(() => {
        expect(screen.getByText('photo1.jpg')).toBeInTheDocument();
      });

      const deleteButton = screen.getByLabelText('Delete photo1.jpg');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText('Delete Image')).toBeInTheDocument();
      });

      const confirmButton = screen.getByText('Delete');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          '/api/media/1',
          expect.objectContaining({
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${mockToken}`
            }
          })
        );
      });
    });

    it('should close dialog when cancel clicked', async () => {
      render(<MediaLibrary mode="manage" token={mockToken} />);

      await waitFor(() => {
        expect(screen.getByText('photo1.jpg')).toBeInTheDocument();
      });

      const deleteButton = screen.getByLabelText('Delete photo1.jpg');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText('Delete Image')).toBeInTheDocument();
      });

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText('Delete Image')).not.toBeInTheDocument();
      });
    });
  });

  describe('Metadata Display', () => {
    it('should display image filename', async () => {
      render(<MediaLibrary mode="manage" token={mockToken} />);

      await waitFor(() => {
        expect(screen.getByText('photo1.jpg')).toBeInTheDocument();
        expect(screen.getByText('photo2.jpg')).toBeInTheDocument();
      });
    });

    it('should display formatted file size', async () => {
      render(<MediaLibrary mode="manage" token={mockToken} />);

      await waitFor(() => {
        expect(screen.getByText('2.0 MB')).toBeInTheDocument();
        expect(screen.getByText('1.5 MB')).toBeInTheDocument();
      });
    });

    it('should display formatted upload date', async () => {
      render(<MediaLibrary mode="manage" token={mockToken} />);

      await waitFor(() => {
        expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
        expect(screen.getByText('Jan 16, 2024')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', async () => {
      const onClose = vi.fn();
      render(<MediaLibrary mode="manage" token={mockToken} onClose={onClose} />);

      await waitFor(() => {
        expect(screen.getByText('photo1.jpg')).toBeInTheDocument();
      });

      expect(screen.getByLabelText('Close media library')).toBeInTheDocument();
      expect(screen.getByLabelText('Delete photo1.jpg')).toBeInTheDocument();
    });

    it('should support keyboard navigation in select mode', async () => {
      const onSelect = vi.fn();

      render(
        <MediaLibrary
          mode="select"
          multiSelect={false}
          onSelect={onSelect}
          token={mockToken}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('photo1.jpg')).toBeInTheDocument();
      });

      const firstImage = screen.getByAltText('photo1.jpg');
      const imageCard = firstImage.closest('[role="button"]');

      fireEvent.keyDown(imageCard, { key: 'Enter' });

      expect(onSelect).toHaveBeenCalledWith('/uploads/image-1.jpg');
    });
  });
});
