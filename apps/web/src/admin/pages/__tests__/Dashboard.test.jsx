import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Dashboard', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('should render dashboard with stats', async () => {
    global.fetch
      .mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: [
            { id: '1', heroTitle: 'Service 1', status: 'published', updatedAt: '2024-01-01' },
            { id: '2', heroTitle: 'Service 2', status: 'draft', updatedAt: '2024-01-02' }
          ]
        })
      })
      .mockResolvedValueOnce({
        json: async () => ({
          success: true,
          pagination: { total: 10 }
        })
      });

    renderWithRouter(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    expect(screen.getByText('Total Content')).toBeInTheDocument();
    expect(screen.getByText('Drafts')).toBeInTheDocument();
    expect(screen.getByText('Published')).toBeInTheDocument();
    expect(screen.getByText('Media Files')).toBeInTheDocument();
  });

  it('should display correct statistics', async () => {
    global.fetch
      .mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: [
            { id: '1', heroTitle: 'Service 1', status: 'published', updatedAt: '2024-01-01' },
            { id: '2', heroTitle: 'Service 2', status: 'draft', updatedAt: '2024-01-02' },
            { id: '3', heroTitle: 'Service 3', status: 'published', updatedAt: '2024-01-03' }
          ]
        })
      })
      .mockResolvedValueOnce({
        json: async () => ({
          success: true,
          pagination: { total: 25 }
        })
      });

    renderWithRouter(<Dashboard />);

    await waitFor(() => {
      const statValues = screen.getAllByText(/^\d+$/);
      expect(statValues.length).toBeGreaterThan(0);
    });

    // Check that stats are displayed (values will be in the DOM)
    expect(screen.getByText('3')).toBeInTheDocument(); // Total content
    expect(screen.getByText('1')).toBeInTheDocument(); // Drafts
    expect(screen.getByText('2')).toBeInTheDocument(); // Published
    expect(screen.getByText('25')).toBeInTheDocument(); // Media files
  });

  it('should display quick actions', async () => {
    global.fetch
      .mockResolvedValueOnce({
        json: async () => ({ success: true, data: [] })
      })
      .mockResolvedValueOnce({
        json: async () => ({ success: true, pagination: { total: 0 } })
      });

    renderWithRouter(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    });

    expect(screen.getByText('Create New Content')).toBeInTheDocument();
    expect(screen.getByText('Upload Media')).toBeInTheDocument();
    expect(screen.getByText('Manage Settings')).toBeInTheDocument();
    expect(screen.getByText('Edit Navigation')).toBeInTheDocument();
  });

  it('should display recent content', async () => {
    global.fetch
      .mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: [
            { id: '1', heroTitle: 'Recent Service', status: 'published', updatedAt: '2024-01-15' }
          ]
        })
      })
      .mockResolvedValueOnce({
        json: async () => ({ success: true, pagination: { total: 0 } })
      });

    renderWithRouter(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Recent Content')).toBeInTheDocument();
    });

    expect(screen.getByText('Recent Service')).toBeInTheDocument();
    expect(screen.getByText('published')).toBeInTheDocument();
  });

  it('should show empty state when no content exists', async () => {
    global.fetch
      .mockResolvedValueOnce({
        json: async () => ({ success: true, data: [] })
      })
      .mockResolvedValueOnce({
        json: async () => ({ success: true, pagination: { total: 0 } })
      });

    renderWithRouter(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('No content yet. Create your first content item!')).toBeInTheDocument();
    });

    expect(screen.getByText('Create Content')).toBeInTheDocument();
  });

  it('should format dates correctly', async () => {
    global.fetch
      .mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: [
            { id: '1', heroTitle: 'Service', status: 'published', updatedAt: '2024-01-15T10:00:00Z' }
          ]
        })
      })
      .mockResolvedValueOnce({
        json: async () => ({ success: true, pagination: { total: 0 } })
      });

    renderWithRouter(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Updated/)).toBeInTheDocument();
    });

    // Date should be formatted as "Jan 15, 2024" or similar
    expect(screen.getByText(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/)).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    global.fetch
      .mockRejectedValueOnce(new Error('Network error'))
      .mockRejectedValueOnce(new Error('Network error'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithRouter(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    // Should still render the dashboard even with errors
    expect(screen.getByText('Total Content')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('should limit recent content to 5 items', async () => {
    const manyServices = Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      heroTitle: `Service ${i + 1}`,
      status: 'published',
      updatedAt: `2024-01-${String(i + 1).padStart(2, '0')}`
    }));

    global.fetch
      .mockResolvedValueOnce({
        json: async () => ({ success: true, data: manyServices })
      })
      .mockResolvedValueOnce({
        json: async () => ({ success: true, pagination: { total: 0 } })
      });

    renderWithRouter(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Recent Content')).toBeInTheDocument();
    });

    // Should only show 5 most recent items
    const contentItems = screen.getAllByText(/Service \d+/);
    expect(contentItems.length).toBeLessThanOrEqual(5);
  });
});
