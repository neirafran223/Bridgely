import { Utensils, HeartPulse, ShoppingBag, Layers } from "lucide-react";
import Reveal from "../Reveal";

const proyectos = [
  {
    icono: Utensils,
    rubro: "Comercio",
    titulo: "App de pedidos para restaurante local",
    descripcion:
      "Un restaurante necesitaba un menú digital y pedidos en línea. Tres developers lo armaron como equipo desde el diseño hasta el despliegue.",
    stack: ["React", "Node.js", "PostgreSQL"],
    resultado: "MVP listo en 8 semanas.",
    color: "from-[#787FF6] to-[#B8B5FF]",
  },
  {
    icono: HeartPulse,
    rubro: "Salud",
    titulo: "Plataforma de reservas para clínica",
    descripcion:
      "Sistema de agenda en línea que remplazó las reservas por teléfono, con recordatorios automáticos para los pacientes.",
    stack: ["Next.js", "MongoDB", "Tailwind"],
    resultado: "+2.000 reservas gestionadas al mes.",
    color: "from-[#4ADEDE] to-[#7BD5F5]",
  },
  {
    icono: ShoppingBag,
    rubro: "E-commerce",
    titulo: "Marketplace de artesanías locales",
    descripcion:
      "Un buscador con filtros por zona y artesano, con pagos integrados para pequeños productores de toda la región.",
    stack: ["Flutter", "Firebase", "Stripe"],
    resultado: "40 artesanos publicando en el primer trimestre.",
    color: "from-[#1CA7EC] to-[#4ADEDE]",
  },
];

export default function Projects() {
  return (
    <section
      id="proyectos"
      className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24"
    >
      <div className="text-center mb-10 sm:mb-14">
        <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">
          Proyectos que ya salieron con Bridgely
        </h2>
        <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto">
          Ejemplos reales de la plataforma: una idea, un equipo y un resultado.
          Así se ve un proyecto bien encaminado.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
        {proyectos.map((p, i) => (
          <Reveal key={p.titulo} delay={i * 80}>
            <div className="gradient-border rounded-3xl p-6 sm:p-7 h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#787FF6]/10">
              <div className="flex items-center justify-between mb-5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center shadow-lg`}>
                  <p.icono size={22} className="text-white" />
                </div>
                <span className="text-xs font-medium text-[#1CA7EC] bg-[#1CA7EC]/10 px-3 py-1 rounded-full">
                  {p.rubro}
                </span>
              </div>

              <h3 className="font-bold text-[#1F2F98] mb-2">{p.titulo}</h3>
              <p className="text-sm text-slate-500 mb-4 flex-1 leading-relaxed">
                {p.descripcion}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {p.stack.map((t) => (
                  <span
                    key={t}
                    className="text-xs bg-gradient-to-r from-[#787FF6]/5 to-[#4ADEDE]/5 border border-[#787FF6]/10 text-[#1F2F98] px-2.5 py-1 rounded-lg font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-[#0e9b9b]">
                <Layers size={16} />
                <span>{p.resultado}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
