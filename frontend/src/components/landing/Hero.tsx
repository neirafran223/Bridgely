import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Code2 } from "lucide-react";
import heroImg from "../../assets/hero-illustration.jpg";
import FluidOrb from "../ui/fluid-orb";

export default function Hero() {
  return (
    <section className="relative px-4 sm:px-6 pt-4 pb-8">
      <div
        className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] min-h-[520px] sm:min-h-[600px] lg:min-h-[680px] flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, #7BD5F5 0%, #787FF6 40%, #B8B5FF 60%, #1F2F98 100%)",
          backgroundSize: "200% 200%",
          clipPath: "polygon(0 0, 100% 0, 100% 88%, 0 100%)",
        }}
      >
        {/* Fluid Orbs */}
        <div className="absolute top-10 right-10 sm:top-16 sm:right-20 opacity-60">
          <FluidOrb size={280} color="#7BD5F5" />
        </div>
        <div className="absolute bottom-20 left-10 sm:bottom-24 sm:left-16 opacity-50">
          <FluidOrb size={200} color="#B8B5FF" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 hidden lg:block">
          <FluidOrb size={400} color="#4ADEDE" />
        </div>

        {/* Decorative orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white/10 blur-2xl animate-float" />
        <div className="absolute bottom-32 right-16 w-48 h-48 rounded-full bg-[#4ADEDE]/20 blur-2xl animate-float-delayed" />

        <img
          src={heroImg}
          alt=""
          className="absolute inset-0 w-full h-full object-contain object-center"
          style={{ mixBlendMode: "multiply" }}
        />

        <div className="relative z-10 max-w-2xl mx-auto text-center px-4 sm:px-6">
          <span className="inline-block bg-white/20 text-white text-xs font-medium px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm border border-white/20 animate-fade-in-up">
            Para clientes y developers
          </span>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] animate-fade-in-up"
            style={{ animationDelay: "120ms" }}
          >
            Conecta tu idea con quien puede construirla
          </h1>
          <p
            className="text-white/90 mt-5 text-base sm:text-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] animate-fade-in-up leading-relaxed"
            style={{ animationDelay: "240ms" }}
          >
            Publica tu proyecto, negocia el presupuesto y trabaja con developers
            verificados, con pagos seguros dentro de la plataforma.
          </p>
          <div
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mt-8 animate-fade-in-up"
            style={{ animationDelay: "360ms" }}
          >
            <Link
              to="/registro"
              className="flex items-center gap-2.5 bg-white text-[#1F2F98] font-medium px-6 py-3.5 rounded-xl hover:bg-white/95 transition-all btn-press justify-center shadow-xl text-sm sm:text-base group"
            >
              <Briefcase size={18} className="group-hover:scale-110 transition-transform" />
              Publicar una idea
            </Link>
            <Link
              to="/registro"
              className="flex items-center gap-2.5 bg-[#1F2F98]/90 text-white font-medium px-6 py-3.5 rounded-xl hover:bg-[#1F2F98] transition-all btn-press justify-center shadow-xl backdrop-blur-sm text-sm sm:text-base group"
            >
              <Code2 size={18} className="group-hover:scale-110 transition-transform" />
              Postular como developer
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
