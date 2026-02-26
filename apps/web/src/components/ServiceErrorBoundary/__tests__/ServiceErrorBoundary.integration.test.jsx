/**
 * Integration tests for ServiceErrorBoundary with service data loading
 * 
 * Tests the error boundary in realistic scenarios where service
 * data loading might fail during rendering.
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ServiceErrorBoundary from '../index.jsx';

// Mock component that throws during render (what error boundaries can catch)
const ServiceDataConsumer = ({ data }) => {
  // Simulate error during rendering if data is invalid
  if (data === 'THROW_ERROR') {
    throw new Error('Failed to render service data');
  }
  
  if (!data) {
    return <div>No data</div>;
  }
  
  return <div>{data.title}</div>;
};

describe('ServiceErrorBoundary Integration', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should allow normal service data rendering to proceed', () => {
    render(
      <BrowserRouter>
        <ServiceErrorBoundary>
          <ServiceDataConsumer data={{ title: 'Test Service' }} />
        </ServiceErrorBoundary>
      </BrowserRouter>
    );

    expect(screen.getByText('Test Service')).toBeInTheDocument();
  });

  it('should catch errors during service data rendering', () => {
    render(
      <BrowserRouter>
        <ServiceErrorBoundary>
          <ServiceDataConsumer data="THROW_ERROR" />
        </ServiceErrorBoundary>
      </BrowserRouter>
    );

    expect(screen.getByText('Unable to Load Service Information')).toBeInTheDocument();
  });

  it('should provide user-friendly error message and actions', () => {
    render(
      <BrowserRouter>
        <ServiceErrorBoundary>
          <ServiceDataConsumer data="THROW_ERROR" />
        </ServiceErrorBoundary>
      </BrowserRouter>
    );

    expect(screen.getByText(/experiencing technical difficulties/i)).toBeInTheDocument();
    expect(screen.getByText('Refresh Page')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('should handle multiple children with mixed success/failure', () => {
    const SuccessComponent = () => <div>Success</div>;
    const FailComponent = () => {
      throw new Error('Fail');
    };

    render(
      <BrowserRouter>
        <ServiceErrorBoundary>
          <SuccessComponent />
          <FailComponent />
        </ServiceErrorBoundary>
      </BrowserRouter>
    );

    // Error boundary should catch the failure
    expect(screen.getByText('Unable to Load Service Information')).toBeInTheDocument();
  });

  it('should handle null or undefined data gracefully', () => {
    render(
      <BrowserRouter>
        <ServiceErrorBoundary>
          <ServiceDataConsumer data={null} />
        </ServiceErrorBoundary>
      </BrowserRouter>
    );

    // Should render without error
    expect(screen.getByText('No data')).toBeInTheDocument();
  });
});
