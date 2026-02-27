import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import SettingsForm from '../SettingsForm';

describe('SettingsForm', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    global.localStorage = {
      getItem: vi.fn(() => 'test-token'),
      setItem: vi.fn(),
      removeItem: vi.fn()
    };
    global.alert = vi.fn();
    global.confirm = vi.fn(() => true);
  });

  it('should render settings form with tabs', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: {
          general: { siteTitle: 'Test Site' },
          contact: {},
          seo: {}
        }
      })
    });

    render(<SettingsForm />);

    await waitFor(() => {
      expect(screen.getByText('Global Settings')).toBeInTheDocument();
    });

    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('SEO')).toBeInTheDocument();
  });

  it('should load settings on mount', async () => {
    const mockSettings = {
      success: true,
      data: {
        general: {
          siteTitle: 'My Site',
          contactEmail: 'test@example.com',
          phoneNumber: '555-1234'
        },
        contact: {},
        seo: {}
      }
    };

    global.fetch.mockResolvedValueOnce({
      json: async () => mockSettings
    });

    render(<SettingsForm />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('My Site')).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('555-1234')).toBeInTheDocument();
  });

  it('should switch between tabs', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: { general: {}, contact: {}, seo: {} }
      })
    });

    render(<SettingsForm />);

    await waitFor(() => {
      expect(screen.getByText('General Settings')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Contact'));
    expect(screen.getByText('Contact Information')).toBeInTheDocument();

    fireEvent.click(screen.getByText('SEO'));
    expect(screen.getByText('SEO Settings')).toBeInTheDocument();
    expect(screen.getByText('Basic Meta Tags')).toBeInTheDocument();
  });

  it('should update field values', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: { general: {}, contact: {}, seo: {} }
      })
    });

    render(<SettingsForm />);

    await waitFor(() => {
      expect(screen.getByLabelText('Site Title')).toBeInTheDocument();
    });

    const siteTitleInput = screen.getByLabelText('Site Title');
    fireEvent.change(siteTitleInput, { target: { value: 'New Site Title' } });

    expect(siteTitleInput.value).toBe('New Site Title');
  });

  it('should save settings', async () => {
    global.fetch
      .mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: { general: {}, contact: {}, seo: {} }
        })
      })
      .mockResolvedValueOnce({
        json: async () => ({ success: true })
      });

    render(<SettingsForm />);

    await waitFor(() => {
      expect(screen.getByText('Save Settings')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Save Settings'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/global-settings',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token'
          })
        })
      );
    });

    expect(global.alert).toHaveBeenCalledWith('Settings saved successfully!');
  });

  it('should reset settings to defaults', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: {
          general: { siteTitle: 'Test Site' },
          contact: {},
          seo: {}
        }
      })
    });

    render(<SettingsForm />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Site')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Reset to Defaults'));

    await waitFor(() => {
      const siteTitleInput = screen.getByLabelText('Site Title');
      expect(siteTitleInput.value).toBe('');
    });
  });

  it('should handle save errors', async () => {
    global.fetch
      .mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: { general: {}, contact: {}, seo: {} }
        })
      })
      .mockResolvedValueOnce({
        json: async () => ({ success: false, error: 'Database error' })
      });

    render(<SettingsForm />);

    await waitFor(() => {
      expect(screen.getByText('Save Settings')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Save Settings'));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Failed to save settings: Database error');
    });
  });
});

  it('should validate meta title character limit', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: { general: {}, contact: {}, seo: {} }
      })
    });

    render(<SettingsForm />);

    await waitFor(() => {
      expect(screen.getByText('SEO')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('SEO'));

    const metaTitleInput = screen.getByLabelText('Meta Title');
    expect(metaTitleInput).toHaveAttribute('maxLength', '60');
  });

  it('should validate meta description character limit', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: { general: {}, contact: {}, seo: {} }
      })
    });

    render(<SettingsForm />);

    await waitFor(() => {
      expect(screen.getByText('SEO')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('SEO'));

    const metaDescInput = screen.getByLabelText('Meta Description');
    expect(metaDescInput).toHaveAttribute('maxLength', '160');
  });

  it('should render all SEO subsections', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: { general: {}, contact: {}, seo: {} }
      })
    });

    render(<SettingsForm />);

    await waitFor(() => {
      expect(screen.getByText('SEO')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('SEO'));

    expect(screen.getByText('Basic Meta Tags')).toBeInTheDocument();
    expect(screen.getByText('Open Graph (Facebook)')).toBeInTheDocument();
    expect(screen.getByText('Twitter Card')).toBeInTheDocument();
    expect(screen.getByText('Analytics & Verification')).toBeInTheDocument();
    expect(screen.getAllByText('Custom Meta Tags').length).toBeGreaterThan(0);
  });
