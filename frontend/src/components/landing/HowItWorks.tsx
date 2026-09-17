import { useEffect, useRef, useState } from "react";
import pasoPublicar from "../../assets/paso-publicar.jpg";
import pasoPostular from "../../assets/paso-postular.jpg";
import pasoNegociar from "../../assets/paso-negociar.jpg";
import pasoTrabajar from "../../assets/paso-trabajar.jpg";

const pasos = [
  {
    imagen: pasoPublicar,
    titulo: "1. Publica o explora",
    texto:
      "El cliente publica su idea con descripción y presupuesto. El developer explora ideas filtrando por stack y dificultad.",
    color: "from-[#787FF6] to-[#B8B5FF]",
  },
  {
    imagen: pasoPostular,
    titulo: "2. Postula solo o en equipo",
    texto:
      "El developer postula individualmente o arma equipo dentro de la plataforma para proyectos más grandes.",
    color: "from-[#4ADEDE] to-[#7BD5F5]",
  },
  {
    imagen: pasoNegociar,
    titulo: "3. Negocia y acuerda",
    texto:
      "El precio se negocia entre ambas partes. El cliente elige la postulación que más le convenga.",
    color: "from-[#1CA7EC] to-[#787FF6]",
  },
  {
    imagen: pasoTrabajar,
    titulo: "4. Trabajen y reciban pago",
    texto:
      "Coordinan por chat en tiempo real. Al finalizar, el pago se libera con comisión transparente y quedan calificados.",
    color: "from-[#B8B5FF] to-[#4ADEDE]",
  },
];

export default function HowItWorks() {
  const seccionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    if (seccionRef.current) observer.observe(seccionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="como-funciona"
      ref={seccionRef}
      className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24"
    >
      <div className="text-center mb-10 sm:mb-14">
        <h2 className="text-2xl sm:text-3xl font-bold gradient-text">
          Cómo funciona
        </h2>
        <p className="text-slate-500 mt-2 text-sm sm:text-base">
          Un proceso simple, de la idea al proyecto terminado
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6">
        {pasos.map((paso, i) => (
          <div
            key={i}
            className={`paso-card text-center sm:text-left ${visible ? "animate-fade-in-up" : "opacity-0"}`}
            style={{ animationDelay: visible ? `${i * 120}ms` : undefined }}
          >
            <div className="glass rounded-2xl mb-4 overflow-hidden p-3 shadow-lg shadow-[#1F2F98]/5">
              <img
                src={paso.imagen}
                alt=""
                className="w-full h-32 object-contain"
              />
            </div>
            <div className={`inline-block text-xs font-medium text-white px-3 py-1 rounded-full bg-gradient-to-r ${paso.color} mb-2`}>
              Paso {i + 1}
            </div>
            <h3 className="font-bold text-[#1F2F98] mb-2 text-sm sm:text-base">
              {paso.titulo}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">{paso.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
