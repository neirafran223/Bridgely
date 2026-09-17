import { Star, Quote, ThumbsUp } from "lucide-react";
import Reveal from "../Reveal";

const testimonios = [
  {
    nombre: "María González",
    perfil: "Cliente · Dueña de Cafetería Norte",
    iniciales: "MG",
    color: "from-[#787FF6] to-[#1CA7EC]",
    texto:
      "Publicar mi idea y elegir postulación fue muy simple. El precio quedó fijado desde el primer día y recibí avisos claros en cada avance. Mi página de compra virtual lista en tiempo récord.",
    rol: "cliente",
  },
  {
    nombre: "Andrés Soto",
    perfil: "Developer Full Stack",
    iniciales: "AS",
    color: "from-[#1CA7EC] to-[#4ADEDE]",
    texto:
      "Como desarrollador me gusta que definan el alcance antes de aceptar. Me uní a un equipo por la plataforma para un proyecto grande y las tarifas se dividieron sin discusiones.",
    rol: "developer",
  },
  {
    nombre: "Laura Reyes",
    perfil: "Cliente · Fundadora de Verdetextil",
    iniciales: "LR",
    color: "from-[#4ADEDE] to-[#1F2F98]",
    texto:
      "Tenía un presupuesto ajustado y developers que entendieron eso, propusieron un alcance a la medida. El pago solo se liberó cuando recibí el proyecto terminado y funcionando.",
    rol: "cliente",
  },
  {
    nombre: "Carlos Medina",
    perfil: "Developer móvil",
    iniciales: "CM",
    color: "from-[#B8B5FF] to-[#787FF6]",
    texto:
      "La calificación de dificultad me ayudó a saber si postular solo o buscar aliados. Hoy formo parte de una comunidad activa de developers verificados con proyectos constantes.",
    rol: "developer",
  },
];

function StarRating() {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={15} className="fill-[#F59E0B] text-[#F59E0B]" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section
      id="testimonios"
      className="relative py-16 sm:py-24 overflow-hidden"
    >
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-[#F0F2FF]/50 to-white/0" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">
            Clientes y developers que confían en Bridgely
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto">
            Historia reales de la comunidad: ideas cumplidas y proyectos bien
            pagados.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonios.map((t, i) => (
            <Reveal key={t.nombre} delay={i * 70}>
              <article className="gradient-border rounded-3xl p-6 sm:p-7 h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#787FF6]/10">
                <div className="relative mb-4">
                  <Quote size={34} className="text-[#787FF6]/20" />
                </div>

                <StarRating />

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed flex-1">
                  "{t.texto}"
                </p>

                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-100/80">
                  <div
                    className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg`}
                  >
                    {t.iniciales}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#1F2F98] text-sm">
                      {t.nombre}
                    </p>
                    <p className="text-xs text-slate-500">{t.perfil}</p>
                  </div>
                  <span
                    className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                      t.rol === "cliente"
                        ? "bg-[#1CA7EC]/10 text-[#1CA7EC]"
                        : "bg-[#787FF6]/10 text-[#787FF6]"
                    }`}
                  >
                    <ThumbsUp size={12} />
                    {t.rol === "cliente" ? "Cliente" : "Developer"}
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
