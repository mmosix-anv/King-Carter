import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import NavigationManager from '../NavigationManager';

describe('NavigationManager', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    global.localStorage = {
      getItem: vi.fn(() => 'test-token'),
      setItem: vi.fn(),
      removeItem: vi.fn()
    };
    global.alert = vi.fn();
  });

  it('should render navigation manager', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: {
          leftLinks: [],
          rightLinks: [],
          ctaButtons: {
            primary: { label: '', url: '', variant: 'primary' },
            secondary: { label: '', url: '', variant: 'secondary' }
          }
        }
      })
    });

    render(<NavigationManager />);

    await waitFor(() => {
      expect(screen.getByText('Navigation Management')).toBeInTheDocument();
    });

    expect(screen.getByText('Left Navigation')).toBeInTheDocument();
    expect(screen.getByText('Right Navigation')).toBeInTheDocument();
    expect(screen.getByText('CTA Buttons')).toBeInTheDocument();
  });

  it('should load existing navigation', async () => {
    const mockNavigation = {
      success: true,
      data: {
        leftLinks: [
          { label: 'Home', url: '/', openInNewTab: false }
        ],
        rightLinks: [
          { label: 'Contact', url: '/contact', openInNewTab: false }
        ],
        ctaButtons: {
          primary: { label: 'Get Started', url: '/start', variant: 'primary' },
          secondary: { label: 'Learn More', url: '/about', variant: 'secondary' }
        }
      }
    };

    global.fetch.mockResolvedValueOnce({
      json: async () => mockNavigation
    });

    render(<NavigationManager />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Home')).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('/')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Contact')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Get Started')).toBeInTheDocument();
  });

  it('should add new left link', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: {
          leftLinks: [],
          rightLinks: [],
          ctaButtons: { primary: {}, secondary: {} }
        }
      })
    });

    render(<NavigationManager />);

    await waitFor(() => {
      expect(screen.getByText('+ Add Left Link')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('+ Add Left Link'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Link label')).toBeInTheDocument();
    });
  });

  it('should add new right link', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: {
          leftLinks: [],
          rightLinks: [],
          ctaButtons: { primary: {}, secondary: {} }
        }
      })
    });

    render(<NavigationManager />);

    await waitFor(() => {
      expect(screen.getByText('+ Add Right Link')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('+ Add Right Link'));

    await waitFor(() => {
      const placeholders = screen.getAllByPlaceholderText('Link label');
      expect(placeholders.length).toBeGreaterThan(0);
    });
  });

  it('should update link fields', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: {
          leftLinks: [{ label: '', url: '', openInNewTab: false }],
          rightLinks: [],
          ctaButtons: { primary: {}, secondary: {} }
        }
      })
    });

    render(<NavigationManager />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Link label')).toBeInTheDocument();
    });

    const labelInput = screen.getByPlaceholderText('Link label');
    fireEvent.change(labelInput, { target: { value: 'New Link' } });

    expect(labelInput.value).toBe('New Link');
  });

  it('should remove link', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: {
          leftLinks: [{ label: 'Home', url: '/', openInNewTab: false }],
          rightLinks: [],
          ctaButtons: { primary: {}, secondary: {} }
        }
      })
    });

    render(<NavigationManager />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Home')).toBeInTheDocument();
    });

    const removeButton = screen.getByText('✕');
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByDisplayValue('Home')).not.toBeInTheDocument();
    });
  });

  it('should update CTA buttons', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: {
          leftLinks: [],
          rightLinks: [],
          ctaButtons: {
            primary: { label: '', url: '', variant: 'primary' },
            secondary: { label: '', url: '', variant: 'secondary' }
          }
        }
      })
    });

    render(<NavigationManager />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Get Started')).toBeInTheDocument();
    });

    const primaryLabelInput = screen.getByPlaceholderText('Get Started');
    fireEvent.change(primaryLabelInput, { target: { value: 'Start Now' } });

    expect(primaryLabelInput.value).toBe('Start Now');
  });

  it('should save navigation', async () => {
    global.fetch
      .mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: {
            leftLinks: [],
            rightLinks: [],
            ctaButtons: { primary: {}, secondary: {} }
          }
        })
      })
      .mockResolvedValueOnce({
        json: async () => ({ success: true })
      });

    render(<NavigationManager />);

    await waitFor(() => {
      expect(screen.getByText('Save Navigation')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Save Navigation'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/nav-links',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token'
          })
        })
      );
    });

    expect(global.alert).toHaveBeenCalledWith('Navigation saved successfully!');
  });

  it('should handle save errors', async () => {
    global.fetch
      .mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: {
            leftLinks: [],
            rightLinks: [],
            ctaButtons: { primary: {}, secondary: {} }
          }
        })
      })
      .mockResolvedValueOnce({
        json: async () => ({ success: false, error: 'Database error' })
      });

    render(<NavigationManager />);

    await waitFor(() => {
      expect(screen.getByText('Save Navigation')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Save Navigation'));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Failed to save navigation: Database error');
    });
  });

  it('should toggle open in new tab checkbox', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: {
          leftLinks: [{ label: 'Home', url: '/', openInNewTab: false }],
          rightLinks: [],
          ctaButtons: { primary: {}, secondary: {} }
        }
      })
    });

    render(<NavigationManager />);

    await waitFor(() => {
      expect(screen.getByText('Open in new tab')).toBeInTheDocument();
    });

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });
});
