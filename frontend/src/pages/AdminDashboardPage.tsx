import { useEffect, useState } from "react";
import {
  Ban,
  BarChart3,
  Lightbulb,
  RotateCcw,
  Shield,
  Trash2,
  Users,
  Wallet,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { AdminDashboardSkeleton } from "../components/common/LoadingSkeletons";
import {
  listarUsuarios,
  alternarSuspension,
  listarIdeasAdmin,
  eliminarIdeaAdmin,
  obtenerEstadisticas,
} from "../services/admin";
import type {
  UsuarioAdmin,
  IdeaAdmin,
  Estadisticas,
} from "../services/admin";

const etiquetasRol: Record<string, string> = {
  cliente: "Clientes",
  developer: "Developers",
  admin: "Administradores",
};

const etiquetasRolSingular: Record<string, string> = {
  cliente: "Cliente",
  developer: "Developer",
  admin: "Administrador",
};

const etiquetasEstadoIdea: Record<string, string> = {
  abierta: "Abiertas",
  en_progreso: "En progreso",
  cerrada: "Cerradas",
};

const etiquetasEstadoTransaccion: Record<string, string> = {
  pendiente: "Pendientes",
  pagado: "Pagadas",
  liberado: "Liberadas",
};

const coloresEstadoIdea: Record<string, string> = {
  abierta: "bg-green-100 text-green-700",
  en_progreso: "bg-sky-100 text-sky-700",
  cerrada: "bg-slate-200 text-slate-600",
};

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<"usuarios" | "ideas">("usuarios");
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [ideas, setIdeas] = useState<IdeaAdmin[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [usuariosData, ideasData, estadisticasData] = await Promise.all([
          listarUsuarios(),
          listarIdeasAdmin(),
          obtenerEstadisticas(),
        ]);
        setUsuarios(usuariosData);
        setIdeas(ideasData);
        setEstadisticas(estadisticasData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar los datos",
        );
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, []);

  async function toggleSuspension(usuario: UsuarioAdmin) {
    try {
      const actualizado = await alternarSuspension(usuario.id);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === actualizado.id ? actualizado : u)),
      );
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar el usuario",
      );
    }
  }

  async function eliminarIdea(idea: IdeaAdmin) {
    const confirmar = window.confirm(
      `¿Seguro que quieres eliminar la idea "${idea.titulo}"? Esta acción no se puede deshacer.`,
    );

    if (!confirmar) return;

    try {
      await eliminarIdeaAdmin(idea.id);
      setIdeas((prev) => prev.filter((i) => i.id !== idea.id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar la idea");
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1F2F98]">
          Panel de administración
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Gestiona usuarios, ideas y estadísticas de la plataforma
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {cargando ? (
        <AdminDashboardSkeleton />
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 card-hover animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-[#787FF6]/10 text-[#787FF6]">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Usuarios</p>
                  <p className="text-2xl font-bold text-[#1F2F98]">
                    {estadisticas?.totalUsuarios ?? 0}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                {(Object.entries(etiquetasRol) as [string, string][]).map(
                  ([rol, etiqueta]) => (
                    <div
                      key={rol}
                      className="flex justify-between text-sm text-slate-500"
                    >
                      <span>{etiqueta}</span>
                      <span className="font-medium">
                        {estadisticas?.usuariosPorRol[rol] ?? 0}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 card-hover animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-[#1CA7EC]/10 text-[#1CA7EC]">
                  <Lightbulb size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Ideas</p>
                  <p className="text-2xl font-bold text-[#1F2F98]">
                    {estadisticas?.totalIdeas ?? 0}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                {(
                  Object.entries(etiquetasEstadoIdea) as [string, string][]
                ).map(([estado, etiqueta]) => (
                  <div
                    key={estado}
                    className="flex justify-between text-sm text-slate-500"
                  >
                    <span>{etiqueta}</span>
                    <span className="font-medium">
                      {estadisticas?.ideasPorEstado[estado] ?? 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 card-hover animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-[#4ADEDE]/20 text-[#0e9b9b]">
                  <Wallet size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">
                    Transacciones
                  </p>
                  <p className="text-2xl font-bold text-[#1F2F98]">
                    {estadisticas?.totalTransacciones ?? 0}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                {(
                  Object.entries(etiquetasEstadoTransaccion) as [
                    string,
                    string,
                  ][]
                ).map(([estado, etiqueta]) => (
                  <div
                    key={estado}
                    className="flex justify-between text-sm text-slate-500"
                  >
                    <span>{etiqueta}</span>
                    <span className="font-medium">
                      {estadisticas?.transaccionesPorEstado[estado] ?? 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTab("usuarios")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                tab === "usuarios"
                  ? "bg-[#787FF6] text-white"
                  : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Users size={16} />
              Usuarios
            </button>
            <button
              onClick={() => setTab("ideas")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                tab === "ideas"
                  ? "bg-[#787FF6] text-white"
                  : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              <BarChart3 size={16} />
              Ideas
            </button>
          </div>

          {tab === "usuarios" && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-slate-200">
                    <th className="px-5 py-3 font-medium">Usuario</th>
                    <th className="px-5 py-3 font-medium">Rol</th>
                    <th className="px-5 py-3 font-medium">Estado</th>
                    <th className="px-5 py-3 font-medium">Registro</th>
                    <th className="px-5 py-3 font-medium text-right">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-10 text-center text-slate-400"
                      >
                        No hay usuarios registrados
                      </td>
                    </tr>
                  ) : (
                    usuarios.map((u) => (
                      <tr
                        key={u.id}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <td className="px-5 py-4">
                          <p className="font-medium text-[#1F2F98]">
                            {u.nombre}
                          </p>
                          <p className="text-slate-400 text-xs">{u.email}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="capitalize text-slate-600">
                            {etiquetasRolSingular[u.rol]}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                              u.suspendido
                                ? "bg-red-100 text-red-600"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {u.suspendido ? "Suspendido" : "Activo"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-500">
                          {new Date(u.fechaRegistro).toLocaleDateString("es-CL")}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {u.rol !== "admin" && (
                            <button
                              onClick={() => toggleSuspension(u)}
                              className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                                u.suspendido
                                  ? "bg-green-50 text-green-600 hover:bg-green-100"
                                  : "bg-red-50 text-red-600 hover:bg-red-100"
                              }`}
                            >
                              {u.suspendido ? (
                                <RotateCcw size={14} />
                              ) : (
                                <Ban size={14} />
                              )}
                              {u.suspendido ? "Reactivar" : "Suspender"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {tab === "ideas" && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-slate-200">
                    <th className="px-5 py-3 font-medium">Idea</th>
                    <th className="px-5 py-3 font-medium">Cliente</th>
                    <th className="px-5 py-3 font-medium">Presupuesto</th>
                    <th className="px-5 py-3 font-medium">Postulaciones</th>
                    <th className="px-5 py-3 font-medium">Estado</th>
                    <th className="px-5 py-3 font-medium text-right">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {ideas.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-10 text-center text-slate-400"
                      >
                        No hay ideas publicadas
                      </td>
                    </tr>
                  ) : (
                    ideas.map((i) => (
                      <tr
                        key={i.id}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <td className="px-5 py-4">
                          <p className="font-medium text-[#1F2F98]">
                            {i.titulo}
                          </p>
                          <p className="text-slate-400 text-xs">
                            {i.categoria}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-slate-600">{i.cliente?.usuario.nombre}</p>
                          <p className="text-slate-400 text-xs">
                            {i.cliente?.usuario.email}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          ${i.presupuestoPropuesto.toLocaleString("es-CL")}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {i._count.postulaciones}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${coloresEstadoIdea[i.estado]}`}
                          >
                            {etiquetasEstadoIdea[i.estado]}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => eliminarIdea(i)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 size={14} />
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {!cargando && (
        <p className="mt-6 text-xs text-slate-400 flex items-center gap-1.5">
          <Shield size={12} />
          Acciones de moderación restringidas al rol administrador
        </p>
      )}
    </DashboardLayout>
  );
}