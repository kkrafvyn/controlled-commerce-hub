import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { isChunkLoadError, reloadForStaleApp } from '@/lib/app-update';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);

    if (isChunkLoadError(error)) {
      reloadForStaleApp();
    }
  }

  private handleReset = () => {
    if (isChunkLoadError(this.state.error)) {
      window.location.reload();
      return;
    }

    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      const isStaleBundle = isChunkLoadError(this.state.error);

      return (
        <Card className="m-4">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {isStaleBundle ? 'A new version is available' : 'Something went wrong'}
            </h2>
            <p className="text-muted-foreground mb-4 max-w-md">
              {isStaleBundle
                ? 'The app was updated while this page was open. Reload to load the latest version.'
                : 'This section encountered an error. You can try refreshing or continue using the rest of the app.'}
            </p>
            <Button onClick={this.handleReset} variant="outline">
              <RefreshCcw className="h-4 w-4 mr-2" />
              {isStaleBundle ? 'Reload App' : 'Try Again'}
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
