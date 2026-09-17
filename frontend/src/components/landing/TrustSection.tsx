import { Lock, Percent, ShieldCheck as ShieldIcon } from "lucide-react";
import trustImg from "../../assets/trust-shield.jpg";

const puntos = [
  {
    icono: Lock,
    titulo: "Precio acordado antes de empezar",
    texto:
      "El monto queda fijado al aceptar una postulación, sin sorpresas para ninguna de las partes.",
    color: "from-[#787FF6] to-[#B8B5FF]",
  },
  {
    icono: Percent,
    titulo: "Comisión transparente",
    texto:
      "Bridgely cobra una comisión clara sobre cada transacción, visible desde antes de aceptar.",
    color: "from-[#4ADEDE] to-[#7BD5F5]",
  },
  {
    icono: ShieldIcon,
    titulo: "Pago liberado al finalizar",
    texto:
      "El pago se gestiona dentro de la plataforma y se libera cuando el proyecto se marca como completado.",
    color: "from-[#1CA7EC] to-[#4ADEDE]",
  },
];

export default function TrustSection() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#787FF6]/10 to-[#4ADEDE]/10 rounded-3xl blur-2xl" />
          <img
            src={trustImg}
            alt=""
            className="relative w-full max-w-xs sm:max-w-sm mx-auto drop-shadow-xl"
          />
        </div>

        <div className="text-center lg:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-3">
            Pagos seguros, de principio a fin
          </h2>
          <p className="text-slate-500 mb-8 text-sm sm:text-base">
            Diseñado para que clientes y developers trabajen con confianza
          </p>

          <div className="space-y-6 text-left">
            {puntos.map((p, i) => (
              <div key={i} className="flex gap-4 group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <p.icono size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1F2F98] mb-1 text-sm sm:text-base">
                    {p.titulo}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{p.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
