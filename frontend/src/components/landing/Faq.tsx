import { useState } from "react";
import { ChevronDown } from "lucide-react";

const preguntas = [
  {
    pregunta: "¿Cómo se define el precio de un proyecto?",
    respuesta:
      "El cliente propone un presupuesto al publicar su idea. Cada developer o equipo que postula puede aceptar ese precio o proponer uno mayor, justificando el alcance. El cliente elige la postulación que prefiera y ese precio queda acordado.",
  },
  {
    pregunta: "¿Puedo postular en equipo?",
    respuesta:
      "Sí. Puedes postular con un equipo que ya tengas formado, o buscar compañeros dentro de la misma plataforma para armar un equipo específico para esa idea.",
  },
  {
    pregunta: "¿Cómo se calcula la dificultad de una idea?",
    respuesta:
      "Un modelo analiza la descripción, el presupuesto y el plazo de la idea para sugerir un nivel de dificultad, ayudando a developers a decidir si postular solo o en equipo.",
  },
  {
    pregunta: "¿Qué pasa si tengo un problema con un pago?",
    respuesta:
      "El pago queda retenido en la plataforma hasta que el proyecto se marca como completado. Ante cualquier disputa, el equipo de administración puede revisar el caso antes de liberar o reembolsar el monto.",
  },
];

export default function Faq() {
  const [abierta, setAbierta] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold gradient-text">
            Preguntas frecuentes
          </h2>
        </div>

        <div className="space-y-3">
          {preguntas.map((p, i) => {
            const estaAbierta = abierta === i;
            return (
              <div
                key={i}
                className={`gradient-border rounded-2xl overflow-hidden transition-all duration-300 ${
                  estaAbierta ? "shadow-lg shadow-[#787FF6]/10" : ""
                }`}
              >
                <button
                  onClick={() => setAbierta(estaAbierta ? null : i)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="font-medium text-[#1F2F98] text-sm">
                    {p.pregunta}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-[#787FF6] transition-transform duration-300 shrink-0 ${
                      estaAbierta ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    estaAbierta ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <div className="px-5 pb-4 text-sm text-slate-500 leading-relaxed">
                    {p.respuesta}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
