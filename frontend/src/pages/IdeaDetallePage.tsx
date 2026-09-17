import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Wallet,
  User,
  Users,
  LoaderCircle,
  MessageSquare,
  ExternalLink,
  CheckCircle2,
  Star,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import DificultadBadge from "../components/DificultadBadge";
import { IdeaDetailSkeleton } from "../components/common/LoadingSkeletons";
import { obtenerIdea } from "../services/ideas";
import type { Idea } from "../services/ideas";
import {
  obtenerPostulacionesDeIdea,
  aceptarPostulacion,
} from "../services/postulaciones";
import type { Postulacion } from "../services/postulaciones";
import {
  crearTransaccionDesdePostulacion,
  marcarTransaccionPagada,
  liberarTransaccion,
  obtenerMisTransacciones,
} from "../services/transacciones";
import type { Transaccion } from "../services/transacciones";
import { crearCalificacion } from "../services/calificaciones";
import CalificarModal from "../components/CalificarModal";
import { Link } from "react-router-dom";

export default function IdeaDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [cargandoIdea, setCargandoIdea] = useState(true);
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [aceptandoId, setAceptandoId] = useState<string | null>(null);
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [accionandoId, setAccionandoId] = useState<string | null>(null);
  const [errorTransaccion, setErrorTransaccion] = useState("");
  const [calificarObjetivo, setCalificarObjetivo] = useState<{
    transaccionId: string;
    calificadoId: string;
    nombre: string;
  } | null>(null);

  async function cargarIdea() {
    if (!id) return;
    try {
      const data = await obtenerIdea(id);
      setIdea(data);
    } finally {
      setCargandoIdea(false);
    }
  }

  async function cargarPostulaciones() {
    if (!id) return;
    setCargando(true);
    try {
      const data = await obtenerPostulacionesDeIdea(id);
      setPostulaciones(data);
    } finally {
      setCargando(false);
    }
  }

  async function cargarTransacciones() {
    try {
      const data = await obtenerMisTransacciones();
      setTransacciones(data);
    } catch {
      setTransacciones([]);
    }
  }

  useEffect(() => {
    cargarIdea();
    cargarPostulaciones();
    cargarTransacciones();
  }, [id]);

  function transaccionDePostulacion(postulacionId: string) {
    return transacciones.find((t) => t.postulacionId === postulacionId);
  }

  function calificablesDe(p: Postulacion) {
    if (p.equipo) {
      return p.equipo.miembros.map((m) => ({
        calificadoId: m.developer.usuario.id,
        nombre: m.developer.usuario.nombre,
      }));
    }
    if (p.developer) {
      return [
        {
          calificadoId: p.developer.usuario.id,
          nombre: p.developer.usuario.nombre,
        },
      ];
    }
    return [];
  }

  async function handleCalificarEnviar(
    puntaje: number,
    comentario: string,
  ) {
    if (!calificarObjetivo) return;
    await crearCalificacion({
      transaccionId: calificarObjetivo.transaccionId,
      calificadoId: calificarObjetivo.calificadoId,
      puntaje,
      comentario,
    });
  }

  async function handleCrearTransaccion(postulacionId: string) {
    setErrorTransaccion("");
    setAccionandoId(postulacionId);
    try {
      await crearTransaccionDesdePostulacion(postulacionId);
      await cargarTransacciones();
    } catch (err) {
      setErrorTransaccion(
        (err as { response?: { data?: { error?: string } } }).response?.data
          ?.error ?? "Error al crear la transacción",
      );
    } finally {
      setAccionandoId(null);
    }
  }

  async function handleMarcarPagado(transaccionId: string) {
    setErrorTransaccion("");
    setAccionandoId(transaccionId);
    try {
      await marcarTransaccionPagada(transaccionId);
      await cargarTransacciones();
      await cargarPostulaciones();
      await cargarIdea();
    } catch (err) {
      setErrorTransaccion(
        (err as { response?: { data?: { error?: string } } }).response?.data
          ?.error ?? "Error al marcar como pagado",
      );
    } finally {
      setAccionandoId(null);
    }
  }

  async function handleLiberar(transaccionId: string) {
    setErrorTransaccion("");
    setAccionandoId(transaccionId);
    try {
      await liberarTransaccion(transaccionId);
      await cargarTransacciones();
      await cargarPostulaciones();
      await cargarIdea();
    } catch (err) {
      setErrorTransaccion(
        (err as { response?: { data?: { error?: string } } }).response?.data
          ?.error ?? "Error al liberar el pago",
      );
    } finally {
      setAccionandoId(null);
    }
  }

  async function handleAceptar(postulacionId: string) {
    setAceptandoId(postulacionId);
    try {
      await aceptarPostulacion(postulacionId);
      await cargarPostulaciones();
    } finally {
      setAceptandoId(null);
    }
  }

  if (cargandoIdea) {
    return (
      <DashboardLayout>
        <IdeaDetailSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-slate-500 hover:text-[#1F2F98] text-sm mb-6"
      >
        <ArrowLeft size={16} />
        Volver a tus ideas
      </button>

      <h1 className="text-2xl font-bold text-[#1F2F98] mb-1">
        Postulaciones recibidas
      </h1>
      <p className="text-slate-500 text-sm mb-8">
        Revisa y acepta la propuesta que más te convenga
      </p>

      {idea && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium bg-[#787FF6]/10 text-[#1F2F98] px-2.5 py-1 rounded-full">
                {idea.categoria}
              </span>
              <DificultadBadge dificultad={idea.dificultadSugerida} />
            </div>
            <span className="text-xs text-slate-400 capitalize">
              {idea.estado.replace("_", " ")}
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#1F2F98] mb-2">
            {idea.titulo}
          </h2>
          <p className="text-slate-600 text-sm mb-4">{idea.descripcion}</p>
          <div className="flex items-center gap-2 text-[#1F2F98] font-medium">
            <Wallet size={16} />$
            {idea.presupuestoPropuesto.toLocaleString("es-CL")}
            {idea.plazoDeseado && (
              <span className="text-sm font-normal text-slate-500 ml-2">
                Plazo: {idea.plazoDeseado}
              </span>
            )}
          </div>
        </div>
      )}

      {cargando ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <p className="text-slate-400">Cargando...</p>
        </div>
      ) : postulaciones.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <p className="text-slate-400">
            Aún no has recibido postulaciones para esta idea.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {postulaciones.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                {p.equipo ? (
                  <div>
                    <div className="flex items-center gap-2 text-[#1F2F98] font-medium">
                      <Users size={16} />
                      {p.equipo.nombre}
                      <span className="text-xs font-normal text-slate-400">
                        (equipo)
                      </span>
                    </div>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {p.equipo.miembros.map((m) => (
                        <li key={m.id}>
                          <Link
                            to={`/developers/${m.developer.id}/publico`}
                            className="flex items-center gap-1 text-xs text-[#1CA7EC] hover:underline"
                          >
                            <User size={12} />
                            {m.developer.usuario.nombre}
                            <ExternalLink size={10} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[#1F2F98] font-medium">
                    <User size={16} />
                    {p.developer?.usuario.nombre}
                    {p.developer && (
                      <Link
                        to={`/developers/${p.developer.id}/publico`}
                        className="flex items-center gap-1 text-xs font-normal text-[#1CA7EC] hover:underline"
                      >
                        Ver perfil
                        <ExternalLink size={12} />
                      </Link>
                    )}
                  </div>
                )}
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                    p.estado === "aceptada"
                      ? "bg-green-100 text-green-700"
                      : p.estado === "rechazada"
                        ? "bg-red-100 text-red-600"
                        : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {p.estado}
                </span>
              </div>

              <p className="text-slate-600 text-sm mb-4">{p.mensaje}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#1F2F98] font-medium">
                  <Wallet size={16} />$
                  {p.precioPropuesto.toLocaleString("es-CL")}
                </div>

                {p.estado === "pendiente" && (
                  <button
                    onClick={() => handleAceptar(p.id)}
                    disabled={aceptandoId === p.id}
                    className="flex items-center gap-2 bg-[#787FF6] hover:bg-[#6b71e0] text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
                  >
                    {aceptandoId === p.id && (
                      <LoaderCircle size={14} className="animate-spin" />
                    )}
                    Aceptar postulación
                  </button>
                )}

                {p.estado === "aceptada" && (
                  <button
                    onClick={() => navigate(`/chat/${p.id}`)}
                    className="flex items-center gap-2 bg-[#787FF6] hover:bg-[#6b71e0] text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                  >
                    <MessageSquare size={14} />
                    Abrir chat
                  </button>
                )}
              </div>

              {p.estado === "aceptada" &&
                (transaccionDePostulacion(p.id) ? (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                    {(() => {
                      const t = transaccionDePostulacion(p.id)!;
                    if (t.estado === "pendiente") {
                      return (
                        <>
                          <div className="text-sm text-slate-500">
                            Transacción pendiente por $
                            {t.montoAcordado.toLocaleString("es-CL")} (comisión
                            de plataforma: $
                            {t.comisionPlataforma.toLocaleString("es-CL")})
                          </div>
                          <button
                            onClick={() => handleMarcarPagado(t.id)}
                            disabled={accionandoId === t.id}
                            className="flex items-center gap-2 bg-[#1CA7EC] hover:bg-[#1894d1] text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
                          >
                            {accionandoId === t.id && (
                              <LoaderCircle size={14} className="animate-spin" />
                            )}
                            Marcar como pagado
                          </button>
                        </>
                      );
                    }
                    if (t.estado === "pagado") {
                      return (
                        <button
                          onClick={() => handleLiberar(t.id)}
                          disabled={accionandoId === t.id}
                          className="flex items-center gap-2 bg-[#787FF6] hover:bg-[#6b71e0] text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
                        >
                          {accionandoId === t.id && (
                            <LoaderCircle size={14} className="animate-spin" />
                          )}
                          Marcar proyecto como completado
                        </button>
                      );
                    }
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                          <CheckCircle2 size={16} />
                          Proyecto completado y pago liberado
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {calificablesDe(p).map((c) => (
                            <button
                              key={c.calificadoId}
                              onClick={() =>
                                setCalificarObjetivo({
                                  transaccionId: t.id,
                                  calificadoId: c.calificadoId,
                                  nombre: c.nombre,
                                })
                              }
                              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                            >
                              <Star size={14} fill="currentColor" />
                              Calificar a {c.nombre}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                    <button
                      onClick={() => handleCrearTransaccion(p.id)}
                      disabled={accionandoId === p.id}
                      className="flex items-center gap-2 bg-[#1CA7EC] hover:bg-[#1894d1] text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
                    >
                      {accionandoId === p.id && (
                        <LoaderCircle size={14} className="animate-spin" />
                      )}
                      Crear transacción
                    </button>
                  </div>
                ))}
              {errorTransaccion && (
                <p className="mt-3 text-sm text-red-600">{errorTransaccion}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {calificarObjetivo && (
        <CalificarModal
          nombre={calificarObjetivo.nombre}
          onClose={() => setCalificarObjetivo(null)}
          onEnviar={handleCalificarEnviar}
        />
      )}
    </DashboardLayout>
  );
}
