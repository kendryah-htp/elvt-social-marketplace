import React from 'react';
import { AlertTriangle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

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
    // Could integrate with analytics/logging service here
  }

  handleRefresh = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = createPageUrl('Home');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen elvt-gradient flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <AlertTriangle className="w-8 h-8" style={{ color: 'var(--accent)' }} />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Something Went Wrong
            </h2>
            <p className="mb-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
              We encountered an unexpected error. Try refreshing or return home to continue.
            </p>
            <div className="flex gap-3 flex-col sm:flex-row">
              <Button
                onClick={this.handleRefresh}
                className="flex-1 font-semibold"
                style={{ backgroundColor: 'var(--accent)', color: 'white' }}
              >
                Refresh Page
              </Button>
              <Button
                onClick={() => window.location.href = createPageUrl('Home')}
                variant="outline"
                className="flex-1 font-semibold"
                style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}