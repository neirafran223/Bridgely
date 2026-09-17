import { useState } from "react";
import { X, Filter, RotateCcw } from "lucide-react";
import type { FiltrosIdeas } from "../services/ideas";

interface FiltrosIdeasModalProps {
  filtrosIniciales: FiltrosIdeas;
  onClose: () => void;
  onAplicar: (filtros: FiltrosIdeas) => void;
  onLimpiar: () => void;
}

export default function FiltrosIdeasModal({
  filtrosIniciales,
  onClose,
  onAplicar,
  onLimpiar,
}: FiltrosIdeasModalProps) {
  const [categoria, setCategoria] = useState(filtrosIniciales.categoria ?? "");
  const [dificultad, setDificultad] = useState(
    filtrosIniciales.dificultad ?? "",
  );
  const [presupuestoMin, setPresupuestoMin] = useState(
    filtrosIniciales.presupuestoMin?.toString() ?? "",
  );
  const [presupuestoMax, setPresupuestoMax] = useState(
    filtrosIniciales.presupuestoMax?.toString() ?? "",
  );

  function handleAplicar(e: React.FormEvent) {
    e.preventDefault();
    onAplicar({
      categoria: categoria.trim() || undefined,
      dificultad: dificultad || undefined,
      presupuestoMin:
        presupuestoMin === "" ? undefined : Number(presupuestoMin),
      presupuestoMax:
        presupuestoMax === "" ? undefined : Number(presupuestoMax),
    });
    onClose();
  }

  function handleLimpiar() {
    onLimpiar();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-[#1F2F98] mb-1">Filtrar ideas</h2>
        <p className="text-slate-500 text-sm mb-6">
          Encuentra proyectos que se ajusten a ti
        </p>

        <form onSubmit={handleAplicar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Categoría
            </label>
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6]"
              placeholder="Ej: Web, App móvil"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Dificultad sugerida
            </label>
            <select
              value={dificultad}
              onChange={(e) => setDificultad(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6]"
            >
              <option value="">Todas</option>
              <option value="basica">Básica</option>
              <option value="intermedia">Intermedia</option>
              <option value="avanzada">Avanzada</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Presupuesto mínimo (CLP)
              </label>
              <input
                type="number"
                value={presupuestoMin}
                onChange={(e) => setPresupuestoMin(e.target.value)}
                min={0}
                className="w-full px-3 py-2.5 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6]"
                placeholder="100000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Presupuesto máximo (CLP)
              </label>
              <input
                type="number"
                value={presupuestoMax}
                onChange={(e) => setPresupuestoMax(e.target.value)}
                min={0}
                className="w-full px-3 py-2.5 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6]"
                placeholder="5000000"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleLimpiar}
              className="flex items-center justify-center gap-2 flex-1 bg-slate-100 hover:bg-slate-200 text-[#1F2F98] font-medium py-3 rounded-xl transition-colors"
            >
              <RotateCcw size={18} />
              Limpiar
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 flex-1 bg-[#787FF6] hover:bg-[#6b71e0] text-white font-medium py-3 rounded-xl transition-colors"
            >
              <Filter size={18} />
              Aplicar filtros
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}