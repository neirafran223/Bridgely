import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, MessageSquare, Users } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { PostulacionesSkeleton } from "../components/common/LoadingSkeletons";
import { useAuth } from "../context/AuthContext";
import { obtenerMisPostulaciones } from "../services/postulaciones";
import type { Postulacion } from "../services/postulaciones";

const coloresEstado: Record<string, string> = {
  aceptada: "bg-green-100 text-green-700",
  rechazada: "bg-red-100 text-red-600",
  pendiente: "bg-slate-100 text-slate-500",
};

const etiquetasEstado: Record<string, string> = {
  aceptada: "Aceptada",
  rechazada: "Rechazada",
  pendiente: "Pendiente",
};

export default function MisPostulacionesPage() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [tab, setTab] = useState<"individuales" | "equipo">("individuales");

  useEffect(() => {
    async function cargar() {
      setCargando(true);
      try {
        const data = await obtenerMisPostulaciones();
        setPostulaciones(data);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  const individuales = postulaciones.filter((p) => !p.equipoId);
  const enEquipo = postulaciones.filter((p) => p.equipoId);
  const visibles = tab === "individuales" ? individuales : enEquipo;

  function renderCard(p: Postulacion, index: number) {
    const esEquipo = Boolean(p.equipoId);

    return (
      <div
        key={p.id}
        style={{ animationDelay: `${index * 50}ms` }}
        className="bg-white rounded-2xl border border-slate-200 p-5 animate-fade-in-up card-hover"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-[#1F2F98]">{p.idea?.titulo}</h3>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${coloresEstado[p.estado]}`}
          >
            {etiquetasEstado[p.estado]}
          </span>
        </div>

        {esEquipo && p.equipo && (
          <div className="mb-3 bg-[#787FF6]/5 border border-[#787FF6]/15 rounded-xl p-3">
            <div className="flex items-center gap-2 text-[#1F2F98] font-medium mb-2">
              <Users size={15} />
              <span className="text-sm">Postulación en equipo</span>
              <span className="text-xs font-medium bg-[#787FF6]/10 text-[#1F2F98] px-2 py-0.5 rounded-full">
                {p.equipo.nombre}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {p.equipo.miembros.map((m) => (
                <span
                  key={m.id}
                  className="text-xs bg-white border border-slate-200 text-slate-600 rounded-full px-2.5 py-1"
                >
                  {m.developer.usuario.nombre}
                  {m.developer.usuario.id === usuario?.usuarioId ? " (tú)" : ""}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="text-slate-600 text-sm mb-4">{p.mensaje}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#1F2F98] font-medium">
            <Wallet size={16} />$
            {p.precioPropuesto.toLocaleString("es-CL")}
          </div>

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
      </div>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-[#1F2F98] mb-1">
        Mis postulaciones
      </h1>
      <p className="text-slate-500 text-sm mb-8">
        Revisa el estado de tus postulaciones individuales y en equipo
      </p>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("individuales")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            tab === "individuales"
              ? "bg-[#787FF6] text-white"
              : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
          }`}
        >
          Individuales ({individuales.length})
        </button>
        <button
          onClick={() => setTab("equipo")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            tab === "equipo"
              ? "bg-[#787FF6] text-white"
              : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
          }`}
        >
          En equipo ({enEquipo.length})
        </button>
      </div>

      {cargando ? (
        <PostulacionesSkeleton />
      ) : visibles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          {tab === "individuales" ? (
            <>
              <Users size={40} className="mx-auto mb-4 text-slate-300" />
              <p className="text-slate-400">
                Aún no has postulado individualmente a ninguna idea.
              </p>
            </>
          ) : (
            <>
              <Users size={40} className="mx-auto mb-4 text-slate-300" />
              <p className="text-slate-400">
                Aún no tienes postulaciones en equipo. Crea o únete a un equipo y
                postulen juntos a una idea.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">{visibles.map(renderCard)}</div>
      )}
    </DashboardLayout>
  );
}