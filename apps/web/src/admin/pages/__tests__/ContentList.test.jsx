import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ContentList from '../ContentList';

// Mock fetch globally
global.fetch = vi.fn();

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ContentList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'test-token');
  });

  const mockServices = {
    data: {
      'web-dev': {
        id: 'web-dev',
        heroTitle: 'Web Development',
        status: 'published',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      'mobile-dev': {
        id: 'mobile-dev',
        heroTitle: 'Mobile Development',
        status: 'draft',
        updatedAt: '2024-01-14T10:00:00Z'
      }
    }
  };

  it('renders content list with services', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockServices
    });

    render(
      <BrowserRouter>
        <ContentList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Web Development')).toBeInTheDocument();
      expect(screen.getByText('Mobile Development')).toBeInTheDocument();
    });
  });

  it('displays loading state initially', () => {
    global.fetch.mockImplementation(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <ContentList />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading services...')).toBeInTheDocument();
  });

  it('displays error message on fetch failure', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <BrowserRouter>
        <ContentList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it('filters services by status', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockServices
    });

    render(
      <BrowserRouter>
        <ContentList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Web Development')).toBeInTheDocument();
    });

    // Change filter to draft
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          'mobile-dev': mockServices.data['mobile-dev']
        }
      })
    });

    const filterSelect = screen.getByLabelText('Status:');
    fireEvent.change(filterSelect, { target: { value: 'draft' } });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/services?status=draft',
        expect.any(Object)
      );
    });
  });

  it('searches services by title', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockServices
    });

    render(
      <BrowserRouter>
        <ContentList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Web Development')).toBeInTheDocument();
      expect(screen.getByText('Mobile Development')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search by title or ID...');
    fireEvent.change(searchInput, { target: { value: 'Web' } });

    await waitFor(() => {
      expect(screen.getByText('Web Development')).toBeInTheDocument();
      expect(screen.queryByText('Mobile Development')).not.toBeInTheDocument();
    });
  });

  it('navigates to create new service', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: {} })
    });

    render(
      <BrowserRouter>
        <ContentList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Create New Service')).toBeInTheDocument();
    });

    const createButton = screen.getByText('Create New Service');
    fireEvent.click(createButton);

    expect(mockNavigate).toHaveBeenCalledWith('/admin/content/new');
  });

  it('navigates to edit service', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockServices
    });

    render(
      <BrowserRouter>
        <ContentList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Web Development')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/admin/content/web-dev');
  });

  it('opens delete confirmation dialog', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockServices
    });

    render(
      <BrowserRouter>
        <ContentList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Web Development')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Delete Service')).toBeInTheDocument();
      expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
    });
  });

  it('deletes service after confirmation', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockServices
    });

    render(
      <BrowserRouter>
        <ContentList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Web Development')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Delete Service')).toBeInTheDocument();
    });

    // Mock delete API call
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    // Mock refresh call
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          'mobile-dev': mockServices.data['mobile-dev']
        }
      })
    });

    // Use getAllByRole to find the confirm button in the dialog
    const confirmButtons = screen.getAllByRole('button', { name: 'Delete' });
    const confirmButton = confirmButtons.find(btn => 
      btn.className.includes('confirmButton')
    );
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/services/web-dev',
        expect.objectContaining({
          method: 'DELETE'
        })
      );
    });
  });

  it('cancels delete operation', async () => {
    // Fresh mock for this test
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockServices
    });

    const { unmount } = render(
      <BrowserRouter>
        <ContentList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Web Development')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Delete Service')).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Delete Service')).not.toBeInTheDocument();
    });

    unmount();
  });

  it('displays empty state when no services', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: {} })
    });

    const { unmount } = render(
      <BrowserRouter>
        <ContentList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No services found')).toBeInTheDocument();
    });

    unmount();
  });

  it('displays status badges correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockServices
    });

    render(
      <BrowserRouter>
        <ContentList />
      </BrowserRouter>
    );

    await waitFor(() => {
      const statusBadges = screen.getAllByText(/published|draft/i);
      expect(statusBadges.length).toBeGreaterThan(0);
    });
  });

  it('formats dates correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockServices
    });

    const { unmount } = render(
      <BrowserRouter>
        <ContentList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument();
    });

    unmount();
  });

  it('includes authorization token in requests', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockServices
    });

    render(
      <BrowserRouter>
        <ContentList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/services',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token'
          })
        })
      );
    });
  });
});
