import { Component } from "react";

/**
 * Last-resort safety net. If any screen throws while rendering, React would
 * otherwise unmount the whole tree and leave a blank white page. This catches
 * that, logs it for debugging, and shows a friendly recovery screen instead so
 * the user is never stranded.
 *
 * Error boundaries must be class components — only they can implement
 * getDerivedStateFromError / componentDidCatch.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Caught by ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      const home = import.meta.env.BASE_URL || "/";
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
          <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
          <p className="text-muted-foreground max-w-md mb-6">
            The page hit an unexpected error. Reloading usually fixes it.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="btn-primary px-6 py-3"
            >
              Reload page
            </button>
            <a href={home} className="btn-outline px-6 py-3">
              Back to home
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
