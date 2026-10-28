import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem("language");
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 text-center">
          <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full border border-gray-100">
            <h2 className="text-2xl font-bold text-[#1E3A8A] mb-3">Something went wrong</h2>
            <p className="text-gray-600 text-sm mb-6">
              An unexpected error occurred while loading the application.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-semibold py-2.5 px-4 rounded transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded transition-colors text-sm"
              >
                Reset Preferences & Reload
              </button>
            </div>
            {this.state.error && (
              <pre className="mt-6 p-3 bg-red-50 text-red-600 text-xs rounded text-left overflow-x-auto">
                {this.state.error.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
