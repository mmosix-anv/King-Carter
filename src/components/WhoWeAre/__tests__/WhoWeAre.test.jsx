import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import WhoWeAre from '../index';

describe('WhoWeAre Component', () => {
  const renderComponent = () => {
    render(
      <BrowserRouter>
        <WhoWeAre />
      </BrowserRouter>
    );
  };

  it('renders title and content', () => {
    renderComponent();
    expect(screen.getByText(/Who We Are/i)).toBeDefined();
    expect(
      screen.getByText(/True luxury is not loud, it is intentional/i)
    ).toBeDefined();
  });

  it('has Learn More About Us link to About page', () => {
    renderComponent();
    const link = screen.getByRole('link', { name: /Learn More About Us/i });
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('/about');
  });
});
