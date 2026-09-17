import { Rocket, Users, Star, Globe } from "lucide-react";
import Reveal from "../Reveal";

const metricas = [
  {
    icono: Rocket,
    valor: "120+",
    etiqueta: "Proyectos entregados",
    color: "from-[#787FF6] to-[#B8B5FF]",
  },
  {
    icono: Users,
    valor: "340+",
    etiqueta: "Developers verificados",
    color: "from-[#4ADEDE] to-[#7BD5F5]",
  },
  {
    icono: Star,
    valor: "98%",
    etiqueta: "Clientes satisfechos",
    color: "from-[#1CA7EC] to-[#787FF6]",
  },
  {
    icono: Globe,
    valor: "12+",
    etiqueta: "Países conectando",
    color: "from-[#B8B5FF] to-[#4ADEDE]",
  },
];

export default function Stats() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-[#1F2F98]/8">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/60 to-white/80 backdrop-blur-xl" />
          <div className="absolute inset-0 border border-white/40 rounded-3xl" />

          <div className="relative p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {metricas.map((m) => (
              <div key={m.etiqueta} className="text-center group">
                <div
                  className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <m.icono size={22} className="text-white" />
                </div>
                <p className="text-3xl sm:text-4xl font-bold gradient-text">
                  {m.valor}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {m.etiqueta}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
