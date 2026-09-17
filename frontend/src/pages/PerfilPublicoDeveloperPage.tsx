import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Briefcase,
  Clock,
  Link2,
  Code2,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { obtenerPerfilPublico } from "../services/developers";
import type { PerfilDeveloper } from "../services/developers";
import { obtenerCalificacionesDeDeveloper } from "../services/calificaciones";
import type { CalificacionesDeDeveloper } from "../services/calificaciones";

const etiquetasDisponibilidad: Record<string, string> = {
  full_time: "Tiempo completo",
  part_time: "Medio tiempo",
  por_horas: "Por horas",
};

export default function PerfilPublicoDeveloperPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState<PerfilDeveloper | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [calificaciones, setCalificaciones] =
    useState<CalificacionesDeDeveloper | null>(null);

  useEffect(() => {
    async function cargar() {
      if (!id) return;
      try {
        const data = await obtenerPerfilPublico(id);
        setPerfil(data);
        if (data.usuario?.id) {
          const datos = await obtenerCalificacionesDeDeveloper(data.usuario.id);
          setCalificaciones(datos);
        }
      } catch {
        setError("No se pudo cargar el perfil");
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [id]);

  return (
    <DashboardLayout>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-[#1F2F98] text-sm mb-6"
      >
        <ArrowLeft size={16} />
        Volver
      </button>

      {cargando ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <p className="text-slate-400">Cargando...</p>
        </div>
      ) : error || !perfil ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <p className="text-slate-400">{error}</p>
        </div>
      ) : (
        <div className="max-w-2xl space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-[#1F2F98]">
                {perfil.usuario?.nombre}
              </h1>
              <div className="flex items-center gap-1.5 text-amber-500 font-medium">
                <Star size={18} fill="currentColor" />
                {perfil.reputacionPromedio.toFixed(1)}
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-slate-400" />
                {perfil.experienciaAnios === null
                  ? "Sin experiencia declarada"
                  : `${perfil.experienciaAnios} años de experiencia`}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-slate-400" />
                {perfil.disponibilidad
                  ? etiquetasDisponibilidad[perfil.disponibilidad]
                  : "Disponibilidad sin especificar"}
              </div>
              {perfil.portafolioUrl && (
                <div className="flex items-center gap-2 text-[#1CA7EC]">
                  <Link2 size={16} />
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
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 font-bold text-[#1F2F98] mb-4">
              <Code2 size={18} />
              Tecnologías
            </div>

            {perfil.stacks.length === 0 ? (
              <p className="text-slate-400 text-sm">
                Este developer aún no ha registrado tecnologías.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {perfil.stacks.map((ds) => (
                  <div
                    key={ds.id}
                    className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3"
                  >
                    <span className="font-medium text-[#1F2F98] text-sm">
                      {ds.stack.nombre}
                    </span>
                    <span className="text-xs text-slate-500 capitalize">
                      {ds.nivel}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 font-bold text-[#1F2F98] mb-4">
              <Star size={18} fill="currentColor" className="text-amber-500" />
              Calificaciones
            </div>

            {!calificaciones || calificaciones.total === 0 ? (
              <p className="text-slate-400 text-sm">
                Aún no tiene calificaciones.
              </p>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={18}
                        className={
                          i <= Math.round(calificaciones.promedio)
                            ? "text-amber-500"
                            : "text-slate-200"
                        }
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-[#1F2F98]">
                    {calificaciones.promedio}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({calificaciones.total}{" "}
                    {calificaciones.total === 1
                      ? "calificación"
                      : "calificaciones"})
                  </span>
                </div>

                <div className="space-y-4">
                  {calificaciones.calificaciones.map((c) => (
                    <div key={c.id} className="border-t border-slate-100 pt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[#1F2F98] font-medium capitalize">
                          {c.calificador.nombre}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              size={12}
                              className={
                                i <= c.puntaje
                                  ? "text-amber-500"
                                  : "text-slate-200"
                              }
                              fill="currentColor"
                            />
                          ))}
                        </div>
                      </div>
                      {c.comentario && (
                        <p className="text-sm text-slate-600">{c.comentario}</p>
                      )}
                      {c.transaccion?.idea?.titulo && (
                        <p className="text-xs text-slate-400 mt-1">
                          {c.transaccion.idea.titulo}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}