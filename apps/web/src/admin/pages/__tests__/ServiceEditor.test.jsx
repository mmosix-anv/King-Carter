import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ServiceEditor from '../ServiceEditor';

global.fetch = vi.fn();

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ServiceEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('adminToken', 'test-token');
  });

  it('renders create mode correctly', () => {
    render(
      <MemoryRouter initialEntries={['/admin/content/new']}>
        <Routes>
          <Route path="/admin/content/new" element={<ServiceEditor />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Create New Service')).toBeInTheDocument();
  });
});
