import { LoaderCircle } from "lucide-react";

interface LoadingSpinnerProps {
  texto?: string;
  tamaño?: "sm" | "md" | "lg";
}

const tamaños = {
  sm: "w-5 h-5",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

export default function LoadingSpinner({ texto, tamaño = "md" }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-label={texto || "Cargando"}>
      <LoaderCircle className={`${tamaños[tamaño]} text-[#787FF6] animate-spin`} />
      {texto && <p className="text-sm text-slate-500">{texto}</p>}
      <span className="sr-only">{texto || "Cargando..."}</span>
    </div>
  );
}
