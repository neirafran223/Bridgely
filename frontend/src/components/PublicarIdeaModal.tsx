import { useState } from "react";
import { X, LoaderCircle } from "lucide-react";
import { AxiosError } from "axios";
import { crearIdea } from "../services/ideas";

interface PublicarIdeaModalProps {
  onClose: () => void;
  onCreada: () => void;
}

const categorias = ["Web", "App móvil", "Desktop", "Otro"];

export default function PublicarIdeaModal({
  onClose,
  onCreada,
}: PublicarIdeaModalProps) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState(categorias[0]);
  const [presupuesto, setPresupuesto] = useState("");
  const [plazo, setPlazo] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      await crearIdea({
        titulo,
        descripcion,
        categoria,
        presupuestoPropuesto: Number(presupuesto),
        plazoDeseado: plazo || undefined,
      });
      onCreada();
      onClose();
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      setError(error.response?.data?.error || "Error al publicar la idea");
    } finally {
      setCargando(false);
    }
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

        <h2 className="text-xl font-bold text-[#1F2F98] mb-6">
          Publicar nueva idea
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Título
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className="w-full px-3 py-2.5 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6]"
              placeholder="Ej: App de reservas para barbería"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              rows={4}
              className="w-full px-3 py-2.5 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6] resize-none"
              placeholder="Describe qué necesitas, funcionalidades clave, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Categoría
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6]"
              >
                {categorias.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Presupuesto (CLP)
              </label>
              <input
                type="number"
                value={presupuesto}
                onChange={(e) => setPresupuesto(e.target.value)}
                required
                min={1}
                className="w-full px-3 py-2.5 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6]"
                placeholder="400000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Plazo deseado (opcional)
            </label>
            <input
              type="text"
              value={plazo}
              onChange={(e) => setPlazo(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6]"
              placeholder="Ej: 2 meses"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-[#787FF6] hover:bg-[#6b71e0] text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {cargando && <LoaderCircle size={18} className="animate-spin" />}
            Publicar idea
          </button>
        </form>
      </div>
    </div>
  );
}
