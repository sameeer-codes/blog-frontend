import { Component } from "react";
import ActionButton from "../ui/ActionButton";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application error boundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] px-4">
          <div className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-soft md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              Unexpected Error
            </p>
            <h1 className="mt-3 text-4xl">Something went wrong while rendering this page.</h1>
            <p className="mt-4 text-base leading-8 text-secondary">
              The page failed safely and the rest of the session is still intact. You can
              retry the render or return to the homepage.
            </p>
            {this.state.error?.message && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-left text-sm leading-7 text-red-700">
                {this.state.error.message}
              </div>
            )}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ActionButton variant="dark" onClick={this.handleReset}>
                Try Again
              </ActionButton>
              <ActionButton to="/" variant="secondary">
                Return Home
              </ActionButton>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
