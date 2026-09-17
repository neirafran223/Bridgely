import { useEffect, useState } from "react";

interface ToastProps {
  mensaje: string;
  tipo?: "exito" | "error" | "info";
  duracion?: number;
  alCerrar: () => void;
}

const estilos = {
  exito: "bg-emerald-50 border-emerald-200 text-emerald-700",
  error: "bg-red-50 border-red-200 text-red-700",
  info: "bg-blue-50 border-blue-200 text-blue-700",
};

export default function Toast({ mensaje, tipo = "exito", duracion = 3000, alCerrar }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(alCerrar, 300);
    }, duracion);
    return () => clearTimeout(timer);
  }, [duracion, alCerrar]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 max-w-sm px-5 py-3 rounded-xl border shadow-lg transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      } ${estilos[tipo]}`}
      role="alert"
      aria-live="assertive"
    >
      <p className="text-sm font-medium">{mensaje}</p>
    </div>
  );
}
