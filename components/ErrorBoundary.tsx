'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-bold text-red-600">エラーが発生しました</h2>
            <p className="mb-4 text-gray-600">
              {this.state.error?.message || '予期しないエラーが発生しました'}
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="w-full rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
              >
                ページを再読み込み
              </button>
              <button
                onClick={() => (window.location.href = '/dashboard')}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                ダッシュボードに戻る
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

