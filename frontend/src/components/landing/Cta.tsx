import { Link } from "react-router-dom";
import { ArrowRight, FilePlus2, Rocket } from "lucide-react";
import Reveal from "../Reveal";
import FluidOrb from "../ui/fluid-orb";

export default function Cta() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] px-6 py-14 sm:px-14 sm:py-18 text-center text-white">
          {/* Animated gradient background */}
          <div
            className="absolute inset-0 animate-gradient"
            style={{
              background:
                "linear-gradient(135deg, #1F2F98 0%, #787FF6 30%, #4ADEDE 60%, #1CA7EC 100%)",
              backgroundSize: "200% 200%",
            }}
          />

          {/* Fluid Orbs */}
          <div className="absolute -top-16 -right-16 opacity-40">
            <FluidOrb size={240} color="#4ADEDE" />
          </div>
          <div className="absolute -bottom-20 -left-20 opacity-30">
            <FluidOrb size={280} color="#B8B5FF" />
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#4ADEDE]/10 blur-3xl animate-pulse-glow" />
          </div>

          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-6 shadow-xl">
              <Rocket size={32} className="text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 drop-shadow-lg">
              ¿Tienes una idea que merece construirse?
            </h2>
            <p className="text-white/85 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed">
              Publica tu proyecto y recibe postulaciones de developers
              verificados, o únete como developer y empieza a ganar con ideas
              reales.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/registro"
                className="inline-flex items-center gap-2.5 bg-white text-[#1F2F98] font-semibold px-7 py-3.5 rounded-xl hover:bg-white/95 transition-all btn-press shadow-xl group"
              >
                <FilePlus2 size={18} className="group-hover:scale-110 transition-transform" />
                Publicar una idea
              </Link>
              <Link
                to="/registro"
                className="inline-flex items-center gap-2.5 bg-[#1F2F98]/80 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-[#1F2F98] transition-all btn-press backdrop-blur-sm shadow-xl group"
              >
                Unirme como developer
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
