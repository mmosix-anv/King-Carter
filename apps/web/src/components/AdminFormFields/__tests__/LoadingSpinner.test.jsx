import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders without overlay by default', () => {
    render(<LoadingSpinner />);
    
    const status = screen.getByRole('status');
    expect(status).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with overlay when overlay prop is true', () => {
    const { container } = render(<LoadingSpinner overlay={true} />);
    
    const overlay = container.querySelector('[role="status"]');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass('overlay');
  });

  it('displays custom message when provided', () => {
    render(<LoadingSpinner message="Processing your request..." />);
    
    expect(screen.getByText('Processing your request...')).toBeInTheDocument();
  });

  it('applies correct size class', () => {
    const { container, rerender } = render(<LoadingSpinner size="small" />);
    
    let spinner = container.querySelector('.spinner');
    expect(spinner).toHaveClass('small');

    rerender(<LoadingSpinner size="large" />);
    spinner = container.querySelector('.spinner');
    expect(spinner).toHaveClass('large');
  });

  it('defaults to medium size', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spinner = container.querySelector('.spinner');
    expect(spinner).toHaveClass('medium');
  });

  it('has proper accessibility attributes', () => {
    render(<LoadingSpinner />);
    
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
  });
});
