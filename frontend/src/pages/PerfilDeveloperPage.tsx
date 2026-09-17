import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  LoaderCircle,
  Save,
  Plus,
  Trash2,
  Code2,
  Briefcase,
  Clock,
  Link2,
} from "lucide-react";
import { AxiosError } from "axios";
import DashboardLayout from "../components/DashboardLayout";
import { ProfileSkeleton } from "../components/common/LoadingSkeletons";
import { useAuth } from "../context/AuthContext";
import {
  obtenerMiPerfil,
  actualizarMiPerfil,
  agregarStackAlPerfil,
  quitarStackDelPerfil,
} from "../services/developers";
import type { PerfilDeveloper } from "../services/developers";

const disponibilidades = [
  { valor: "full_time", label: "Tiempo completo" },
  { valor: "part_time", label: "Medio tiempo" },
  { valor: "por_horas", label: "Por horas" },
];

const niveles = [
  { valor: "basico", label: "Básico" },
  { valor: "intermedio", label: "Intermedio" },
  { valor: "avanzado", label: "Avanzado" },
];

export default function PerfilDeveloperPage() {
  const { usuario } = useAuth();
  const [perfil, setPerfil] = useState<PerfilDeveloper | null>(null);
  const [cargando, setCargando] = useState(true);

  const [experiencia, setExperiencia] = useState("");
  const [disponibilidad, setDisponibilidad] = useState("");
  const [portafolio, setPortafolio] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const [stackNombre, setStackNombre] = useState("");
  const [stackTipo, setStackTipo] = useState<"preferido" | "experiencia">(
    "preferido",
  );
  const [stackNivel, setStackNivel] = useState<
    "basico" | "intermedio" | "avanzado"
  >("intermedio");
  const [guardandoStack, setGuardandoStack] = useState(false);
  const [errorStack, setErrorStack] = useState("");
  const [quitandoStackId, setQuitandoStackId] = useState<string | null>(null);

  async function cargarPerfil() {
    try {
      const data = await obtenerMiPerfil();
      setPerfil(data);
      setExperiencia(data.experienciaAnios?.toString() ?? "");
      setDisponibilidad(data.disponibilidad ?? "");
      setPortafolio(data.portafolioUrl ?? "");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarPerfil();
  }, []);

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setExito("");
    setGuardando(true);

    try {
      const actualizado = await actualizarMiPerfil({
        experienciaAnios: experiencia === "" ? null : Number(experiencia),
        disponibilidad: disponibilidad || null,
        portafolioUrl: portafolio || null,
      });
      setPerfil(actualizado);
      setExito("Perfil actualizado correctamente");
    } catch (err) {
      const e = err as AxiosError<{ error: string }>;
      setError(e.response?.data?.error || "Error al actualizar el perfil");
    } finally {
      setGuardando(false);
    }
  }

  async function handleAgregarStack(e: React.FormEvent) {
    e.preventDefault();
    setErrorStack("");
    setGuardandoStack(true);

    try {
      await agregarStackAlPerfil({
        nombre: stackNombre.trim(),
        tipo: stackTipo,
        nivel: stackNivel,
      });
      setStackNombre("");
      await cargarPerfil();
    } catch (err) {
      const e = err as AxiosError<{ error: string }>;
      setErrorStack(e.response?.data?.error || "Error al agregar el stack");
    } finally {
      setGuardandoStack(false);
    }
  }

  async function handleQuitarStack(stackId: string) {
    setQuitandoStackId(stackId);
    try {
      await quitarStackDelPerfil(stackId);
      await cargarPerfil();
    } finally {
      setQuitandoStackId(null);
    }
  }

  if (usuario?.rol !== "developer") return <Navigate to="/dashboard" replace />;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-[#1F2F98] mb-1">Mi perfil</h1>
      <p className="text-slate-500 text-sm mb-8">
        Actualiza tu experiencia y tecnologías para que los clientes te conozcan
      </p>

      {cargando ? (
        <ProfileSkeleton />
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <form
            onSubmit={handleGuardar}
            className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 h-fit"
          >
            <div className="flex items-center gap-2 font-bold text-[#1F2F98]">
              <Briefcase size={18} />
              Datos profesionales
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Años de experiencia
              </label>
              <input
                type="number"
                value={experiencia}
                onChange={(e) => setExperiencia(e.target.value)}
                min={0}
                max={70}
                className="w-full px-3 py-2.5 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6]"
                placeholder="Ej: 3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Disponibilidad
              </label>
              <select
                value={disponibilidad}
                onChange={(e) => setDisponibilidad(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6]"
              >
                <option value="">Sin especificar</option>
                {disponibilidades.map((d) => (
                  <option key={d.valor} value={d.valor}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Portafolio (URL)
              </label>
              <input
                type="url"
                value={portafolio}
                onChange={(e) => setPortafolio(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6]"
                placeholder="https://tuportafolio.com"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {exito && <p className="text-green-600 text-sm">{exito}</p>}

            <button
              type="submit"
              disabled={guardando}
              className="w-full bg-[#787FF6] hover:bg-[#6b71e0] text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {guardando ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              Guardar cambios
            </button>
          </form>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 h-fit">
            <div className="flex items-center gap-2 font-bold text-[#1F2F98]">
              <Code2 size={18} />
              Tus stacks
            </div>

            {perfil!.stacks.length === 0 ? (
              <p className="text-slate-400 text-sm">
                Aún no has agregado ninguna tecnología.
              </p>
            ) : (
              <ul className="space-y-2">
                {perfil!.stacks.map((ds) => (
                  <li
                    key={ds.id}
                    className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-[#1F2F98] text-sm">
                        {ds.stack.nombre}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">
                        {ds.tipo} - {ds.nivel}
                      </p>
                    </div>
                    <button
                      onClick={() => handleQuitarStack(ds.stackId)}
                      disabled={quitandoStackId === ds.stackId}
                      className="text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                      aria-label={`Quitar ${ds.stack.nombre}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={handleAgregarStack} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nueva tecnología
                </label>
                <input
                  type="text"
                  value={stackNombre}
                  onChange={(e) => setStackNombre(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6]"
                  placeholder="Ej: React, Node.js, PostgreSQL"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tipo
                  </label>
                  <select
                    value={stackTipo}
                    onChange={(e) =>
                      setStackTipo(e.target.value as "preferido" | "experiencia")
                    }
                    className="w-full px-3 py-2.5 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6]"
                  >
                    <option value="preferido">Preferido</option>
                    <option value="experiencia">Experiencia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nivel
                  </label>
                  <select
                    value={stackNivel}
                    onChange={(e) =>
                      setStackNivel(
                        e.target.value as "basico" | "intermedio" | "avanzado",
                      )
                    }
                    className="w-full px-3 py-2.5 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6]"
                  >
                    {niveles.map((n) => (
                      <option key={n.valor} value={n.valor}>
                        {n.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {errorStack && <p className="text-red-500 text-sm">{errorStack}</p>}

              <button
                type="submit"
                disabled={guardandoStack}
                className="w-full bg-[#787FF6] hover:bg-[#6b71e0] text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {guardandoStack ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <Plus size={18} />
                )}
                Agregar stack
              </button>
            </form>

            {perfil?.portafolioUrl && (
              <div className="flex items-center gap-2 text-sm text-[#1CA7EC]">
                <Link2 size={15} />
                <a
                  href={perfil.portafolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Ver portafolio
                </a>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock size={15} />
              Quitando un stack no elimina la tecnología del catálogo
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}