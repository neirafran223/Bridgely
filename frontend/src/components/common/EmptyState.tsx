import { AlertTriangle, RefreshCw } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  titulo: string;
  descripcion: string;
  accion?: {
    texto: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon, titulo, descripcion, accion }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        {icon || <AlertTriangle size={28} className="text-slate-400" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-1">{titulo}</h3>
      <p className="text-sm text-slate-500 max-w-sm">{descripcion}</p>
      {accion && (
        <button
          onClick={accion.onClick}
          className="mt-4 flex items-center gap-2 bg-[#787FF6] hover:bg-[#6b71e0] text-white font-medium px-4 py-2 rounded-xl transition-colors text-sm"
        >
          <RefreshCw size={14} />
          {accion.texto}
        </button>
      )}
    </div>
  );
}
