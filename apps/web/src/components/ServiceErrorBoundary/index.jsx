/**
 * Service Error Boundary Component
 * 
 * Catches errors that occur during service data loading and displays
 * a user-friendly fallback UI. This provides graceful degradation when
 * both Strapi and fallback mechanisms fail unexpectedly.
 * 
 * @module components/ServiceErrorBoundary
 */

import React from 'react';
import styles from './index.module.scss';

class ServiceErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Service data loading error:', error, errorInfo);
    
    // In production, you might want to send this to an error reporting service
    if (import.meta.env.MODE === 'development') {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <h2 className={styles.errorTitle}>Unable to Load Service Information</h2>
            <p className={styles.errorMessage}>
              We're experiencing technical difficulties loading service data. 
              Please try refreshing the page or contact us directly for assistance.
            </p>
            <div className={styles.errorActions}>
              <button 
                className={styles.retryButton}
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
              <a 
                href="/contact" 
                className={styles.contactButton}
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ServiceErrorBoundary;
