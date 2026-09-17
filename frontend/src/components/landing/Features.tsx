import { useState } from "react";
import {
  Briefcase,
  Code2,
  Sparkles,
  Users,
  MessageSquare,
  Star,
  Filter,
  Wallet,
} from "lucide-react";
import clienteImg from "../../assets/cliente-illustration.jpg";
import developerImg from "../../assets/developer-illustration.jpg";

type Vista = "cliente" | "developer";

const featuresCliente = [
  {
    icono: Sparkles,
    titulo: "Sugerencia de dificultad",
    texto:
      "Un modelo analiza tu idea y sugiere su nivel de complejidad automáticamente.",
  },
  {
    icono: Users,
    titulo: "Postulaciones individuales o en equipo",
    texto:
      "Recibe propuestas de developers solos o equipos completos según el tamaño del proyecto.",
  },
  {
    icono: MessageSquare,
    titulo: "Chat en tiempo real",
    texto:
      "Coordina directamente con el developer o equipo aceptado, sin salir de la plataforma.",
  },
  {
    icono: Star,
    titulo: "Reputación verificada",
    texto:
      "Revisa la calificación de cada developer antes de aceptar su postulación.",
  },
];

const featuresDeveloper = [
  {
    icono: Filter,
    titulo: "Filtros por stack y dificultad",
    texto:
      "Encuentra ideas que calzan con tus tecnologías preferidas y tu nivel de experiencia.",
  },
  {
    icono: Users,
    titulo: "Arma o únete a un equipo",
    texto:
      "Forma equipo dentro de la plataforma o postula con un grupo que ya tienes armado.",
  },
  {
    icono: Wallet,
    titulo: "Negocia tu propuesta",
    texto:
      "Ajusta el precio propuesto por el cliente según el alcance real del trabajo.",
  },
  {
    icono: Star,
    titulo: "Construye tu reputación",
    texto:
      "Cada proyecto bien calificado mejora tu visibilidad frente a nuevos clientes.",
  },
];

export default function Features() {
  const [vista, setVista] = useState<Vista>("cliente");
  const features = vista === "cliente" ? featuresCliente : featuresDeveloper;
  const imagen = vista === "cliente" ? clienteImg : developerImg;

  return (
    <section id="features" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold gradient-text">
            Funcionalidades pensadas para cada rol
          </h2>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Elige tu perfil para ver qué te ofrece Bridgely
          </p>
        </div>

        <div className="flex justify-center mb-10 sm:mb-12">
          <div className="inline-flex glass rounded-xl p-1 w-full sm:w-auto max-w-sm sm:max-w-none shadow-lg shadow-[#1F2F98]/5">
            <button
              onClick={() => setVista("cliente")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                vista === "cliente"
                  ? "bg-gradient-to-r from-[#787FF6] to-[#6b71e0] text-white shadow-md shadow-[#787FF6]/25"
                  : "text-slate-500 hover:text-[#1F2F98] hover:bg-white/50"
              }`}
            >
              <Briefcase size={16} />
              Clientes
            </button>
            <button
              onClick={() => setVista("developer")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                vista === "developer"
                  ? "bg-gradient-to-r from-[#4ADEDE] to-[#1CA7EC] text-white shadow-md shadow-[#4ADEDE]/25"
                  : "text-slate-500 hover:text-[#1F2F98] hover:bg-white/50"
              }`}
            >
              <Code2 size={16} />
              Developers
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 items-center">
          <div className="glass rounded-3xl p-4 sm:p-6 shadow-xl shadow-[#1F2F98]/5">
            <img
              src={imagen}
              alt=""
              className="w-full max-w-xs sm:max-w-md mx-auto transition-transform duration-500 hover:scale-105"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                className="gradient-border rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#787FF6]/10"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#787FF6]/15 to-[#4ADEDE]/10 flex items-center justify-center mb-3">
                  <f.icono size={20} className="text-[#787FF6]" />
                </div>
                <h3 className="font-bold text-[#1F2F98] text-sm mb-2">
                  {f.titulo}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
