import { Link } from "react-router-dom";
import { Home, ArrowLeft, AlertTriangle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F2FF] via-[#F4F7FE] to-[#E8F4F8] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decor */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#787FF6]/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#4ADEDE]/10 rounded-full blur-3xl" />

      <div className="relative z-10 text-center max-w-md">
        {/* Animated icon */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-[#787FF6]/15 to-[#4ADEDE]/10 flex items-center justify-center animate-scale-in">
          <AlertTriangle size={48} className="text-[#787FF6]" />
        </div>

        {/* Error code */}
        <h1 className="text-8xl font-bold gradient-text mb-4 animate-fade-in-up">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#1F2F98] mb-3 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          Página no encontrada
        </h2>

        {/* Description */}
        <p className="text-slate-500 mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          Lo sentimos, la página que buscas no existe o fue movida a otro lugar.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:text-[#1F2F98] hover:border-[#787FF6]/30 font-medium px-5 py-3 rounded-xl transition-all duration-200 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Volver atrás
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
