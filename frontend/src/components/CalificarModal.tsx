import { useState } from "react";
import { Star, LoaderCircle } from "lucide-react";

interface CalificarModalProps {
  nombre: string;
  onClose: () => void;
  onEnviar: (puntaje: number, comentario: string) => Promise<void>;
}

export default function CalificarModal({
  nombre,
  onClose,
  onEnviar,
}: CalificarModalProps) {
  const [puntaje, setPuntaje] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  async function handleEnviar() {
    if (puntaje === 0) {
      setError("Selecciona un puntaje de 1 a 5");
      return;
    }
    setError("");
    setEnviando(true);
    try {
      await onEnviar(puntaje, comentario);
      onClose();
    } catch (err) {
      setError(
        (err as { response?: { data?: { error?: string } } }).response?.data
          ?.error ?? "Error al enviar la calificación",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2F98]/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <h3 className="text-lg font-bold text-[#1F2F98] mb-1">
          Calificar a {nombre}
        </h3>
        <p className="text-sm text-slate-500 mb-5">
          Cuéntanos tu experiencia con este developer
        </p>

        <div className="flex items-center gap-1 mb-5">
          {[1, 2, 3, 4, 5].map((valor) => (
            <button
              key={valor}
              type="button"
              onClick={() => setPuntaje(valor)}
              onMouseEnter={() => setHover(valor)}
              onMouseLeave={() => setHover(0)}
              className="p-1"
              aria-label={`${valor} estrellas`}
            >
              <Star
                size={28}
                className={
                  (hover || puntaje) >= valor
                    ? "text-amber-500"
                    : "text-slate-300"
                }
                fill="currentColor"
              />
            </button>
          ))}
        </div>

        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Comentario (opcional)"
          maxLength={500}
          rows={3}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#787FF6] mb-4 resize-none"
        />

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={enviando}
            className="px-4 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            onClick={handleEnviar}
            disabled={enviando}
            className="flex items-center gap-2 bg-[#787FF6] hover:bg-[#6b71e0] text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors disabled:opacity-60"
          >
            {enviando && <LoaderCircle size={14} className="animate-spin" />}
            Enviar calificación
          </button>
        </div>
      </div>
    </div>
  );
}