import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen elvt-gradient flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--accent)' }} />
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Something Went Wrong
            </h2>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="w-full"
              style={{ backgroundColor: 'var(--accent)', color: 'white' }}
            >
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}