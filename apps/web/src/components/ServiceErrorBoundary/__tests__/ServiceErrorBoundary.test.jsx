/**
 * Tests for ServiceErrorBoundary component
 * 
 * Validates that the error boundary correctly catches errors
 * and displays user-friendly fallback UI.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ServiceErrorBoundary from '../index.jsx';

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Normal content</div>;
};

describe('ServiceErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for cleaner test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should render children when no error occurs', () => {
    render(
      <ServiceErrorBoundary>
        <div>Test content</div>
      </ServiceErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should display error UI when child component throws', () => {
    render(
      <ServiceErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ServiceErrorBoundary>
    );

    expect(screen.getByText('Unable to Load Service Information')).toBeInTheDocument();
    expect(screen.getByText(/experiencing technical difficulties/i)).toBeInTheDocument();
  });

  it('should display retry button in error state', () => {
    render(
      <ServiceErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ServiceErrorBoundary>
    );

    const retryButton = screen.getByText('Refresh Page');
    expect(retryButton).toBeInTheDocument();
  });

  it('should display contact link in error state', () => {
    render(
      <ServiceErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ServiceErrorBoundary>
    );

    const contactLink = screen.getByText('Contact Us');
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute('href', '/contact');
  });

  it('should log error details when error is caught', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error');

    render(
      <ServiceErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ServiceErrorBoundary>
    );

    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
