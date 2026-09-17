import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { Link } from "react-router-dom";
import { Home, RefreshCw, AlertOctagon } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#F0F2FF] via-[#F4F7FE] to-[#E8F4F8] flex flex-col items-center justify-center px-6 relative overflow-hidden">
          {/* Background decor */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#FF7B7B]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#787FF6]/10 rounded-full blur-3xl" />

          <div className="relative z-10 text-center max-w-md">
            {/* Animated icon */}
            <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-[#FF7B7B]/15 to-[#787FF6]/10 flex items-center justify-center animate-scale-in">
              <AlertOctagon size={48} className="text-[#FF7B7B]" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-[#1F2F98] mb-3 animate-fade-in-up">
              Algo salió mal
            </h1>

            {/* Description */}
            <p className="text-slate-500 mb-4 leading-relaxed animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
            </p>

            {/* Error details (dev only) */}
            {this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                <p className="text-xs font-mono text-red-600 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:text-[#1F2F98] hover:border-[#787FF6]/30 font-medium px-5 py-3 rounded-xl transition-all duration-200 group"
              >
                <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                Reintentar
              </button>
              <Link
                to="/"
                className="flex items-center gap-2 bg-gradient-to-r from-[#787FF6] to-[#6b71e0] hover:from-[#6b71e0] hover:to-[#5a60c9] text-white font-medium px-5 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-[#787FF6]/25 group"
              >
                <Home size={18} className="group-hover:scale-110 transition-transform" />
                Ir al inicio
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
