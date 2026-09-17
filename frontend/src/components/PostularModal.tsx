import { useEffect, useState } from "react";
import { X, LoaderCircle, Users } from "lucide-react";
import { AxiosError } from "axios";
import { crearPostulacion } from "../services/postulaciones";
import { obtenerMisEquipos } from "../services/equipos";
import type { Equipo } from "../services/equipos";

interface PostularModalProps {
  ideaId: string;
  ideaTitulo: string;
  presupuestoOriginal: number;
  onClose: () => void;
  onPostulada: () => void;
}

export default function PostularModal({
  ideaId,
  ideaTitulo,
  presupuestoOriginal,
  onClose,
  onPostulada,
}: PostularModalProps) {
  const [tipo, setTipo] = useState<"individual" | "equipo">("individual");
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [equipoId, setEquipoId] = useState("");
  const [cargandoEquipos, setCargandoEquipos] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [precio, setPrecio] = useState(String(presupuestoOriginal));
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const equiposDisponibles = equipos.filter((e) =>
    e.miembros.every((m) => m.estado === "aceptado"),
  );

  useEffect(() => {
    async function cargarEquipos() {
      setCargandoEquipos(true);
      try {
        const data = await obtenerMisEquipos();
        setEquipos(data);
      } finally {
        setCargandoEquipos(false);
      }
    }
    cargarEquipos();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      await crearPostulacion({
        ideaId,
        mensaje,
        precioPropuesto: Number(precio),
        equipoId: tipo === "equipo" ? equipoId : undefined,
      });
      onPostulada();
      onClose();
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      setError(
        axiosError.response?.data?.error || "Error al postular",
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-[#1F2F98] mb-1">
          Postular a esta idea
        </h2>
        <p className="text-slate-500 text-sm mb-6">{ideaTitulo}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Postular como
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTipo("individual")}
                className={`py-2.5 rounded-xl border font-medium text-sm transition-colors ${
                  tipo === "individual"
                    ? "border-[#787FF6] bg-[#787FF6]/10 text-[#1F2F98]"
                    : "border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                Individual
              </button>
              <button
                type="button"
                onClick={() => setTipo("equipo")}
                className={`py-2.5 rounded-xl border font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                  tipo === "equipo"
                    ? "border-[#787FF6] bg-[#787FF6]/10 text-[#1F2F98]"
                    : "border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                <Users size={16} />
                Con un equipo
              </button>
            </div>
          </div>

          {tipo === "equipo" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Selecciona un equipo
              </label>
              {cargandoEquipos ? (
                <p className="text-sm text-slate-400">Cargando equipos...</p>
              ) : equiposDisponibles.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No tienes equipos listos para postular. Todos tus miembros
                  deben haber aceptado la invitación.
                </p>
              ) : (
                <select
                  value={equipoId}
                  onChange={(e) => setEquipoId(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6]"
                >
                  <option value="">Selecciona un equipo</option>
                  {equiposDisponibles.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nombre} ({e.miembros.length} miembros)
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mensaje
            </label>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              required
              rows={4}
              className="w-full px-3 py-2.5 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6] resize-none"
              placeholder="Cuéntale al cliente por qué eres una buena opción para este proyecto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tu propuesta de precio (CLP)
            </label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
              min={1}
              className="w-full px-3 py-2.5 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6]"
            />
            <p className="text-xs text-slate-400 mt-1">
              El cliente propuso ${presupuestoOriginal.toLocaleString("es-CL")}.
              Puedes mantenerlo o proponer otro.
            </p>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={cargando || (tipo === "equipo" && !equipoId)}
            className="w-full bg-[#787FF6] hover:bg-[#6b71e0] text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {cargando && <LoaderCircle size={18} className="animate-spin" />}
            Enviar postulación
          </button>
        </form>
      </div>
    </div>
  );
}