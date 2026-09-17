import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Wallet, Tag, Send, SlidersHorizontal, X, Lightbulb, BarChart3, TrendingUp } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import PublicarIdeaModal from "../components/PublicarIdeaModal";
import PostularModal from "../components/PostularModal";
import FiltrosIdeasModal from "../components/FiltrosIdeasModal";
import DificultadBadge from "../components/DificultadBadge";
import Buscador from "../components/common/Buscador";
import Paginacion from "../components/common/Paginacion";
import { MetricsSkeleton, DashboardIdeasSkeleton } from "../components/common/LoadingSkeletons";
import EmptyState from "../components/common/EmptyState";
import { useAuth } from "../context/AuthContext";
import { useDebounce } from "../hooks/useDebounce";
import { obtenerMisIdeas, obtenerIdeasPublicas } from "../services/ideas";
import { obtenerMetricasCliente } from "../services/metricas";
import type { Idea, FiltrosIdeas } from "../services/ideas";
import type { MetricasCliente } from "../services/metricas";

export default function DashboardPage() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalPublicarAbierto, setModalPublicarAbierto] = useState(false);
  const [ideaParaPostular, setIdeaParaPostular] = useState<Idea | null>(null);
  const [filtros, setFiltros] = useState<FiltrosIdeas>({});
  const [modalFiltrosAbierto, setModalFiltrosAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const [metricas, setMetricas] = useState<MetricasCliente | null>(null);
  const [cargandoMetricas, setCargandoMetricas] = useState(true);

  const busquedaDebounced = useDebounce(busqueda, 300);
  const limite = 10;

  const cargarIdeas = useCallback(async (p?: number, busq?: string) => {
    setCargando(true);
    try {
      if (usuario?.rol === "cliente") {
        const data = await obtenerMisIdeas();
        setIdeas(data);
        setTotal(data.length);
      } else {
        const paginaActual = p || pagina;
        const data = await obtenerIdeasPublicas({
          ...filtros,
          busqueda: busq !== undefined ? busq : busquedaDebounced,
          pagina: paginaActual,
          limite,
        });
        setIdeas(data.datos);
        setTotal(data.total);
      }
    } finally {
      setCargando(false);
    }
  }, [usuario, filtros, pagina, busquedaDebounced]);

  useEffect(() => {
    cargarIdeas();
  }, [usuario, filtros, busquedaDebounced]);

  useEffect(() => {
    if (usuario?.rol !== "cliente") {
      cargarIdeas(1, busquedaDebounced);
      setPagina(1);
    }
  }, [busquedaDebounced]);

  useEffect(() => {
    if (usuario?.rol === "cliente") {
      setCargandoMetricas(true);
      obtenerMetricasCliente()
        .then(setMetricas)
        .catch(() => {})
        .finally(() => setCargandoMetricas(false));
    }
  }, [usuario]);

  const handleBuscar = useCallback((termino: string) => {
    setBusqueda(termino);
    setPagina(1);
  }, []);

  const aplicarFiltros = useCallback((nuevosFiltros: FiltrosIdeas) => {
    setFiltros(nuevosFiltros);
    setPagina(1);
  }, []);

  const limpiarFiltros = useCallback(() => {
    setFiltros({});
    setPagina(1);
  }, []);

  const totalPaginas = Math.ceil(total / limite);

  const cantidadFiltros = useMemo(
    () => Object.values(filtros).filter((v) => v !== undefined).length,
    [filtros]
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2F98]">
            {usuario?.rol === "cliente" ? "Tus ideas" : "Ideas disponibles"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {usuario?.rol === "cliente"
              ? "Gestiona las ideas que has publicado"
              : "Explora ideas y postula con tu perfil"}
          </p>
        </div>

        {usuario?.rol === "cliente" ? (
          <button
            onClick={() => setModalPublicarAbierto(true)}
            className="flex items-center gap-2 bg-[#787FF6] hover:bg-[#6b71e0] text-white font-medium px-4 py-2.5 rounded-xl transition-colors"
            aria-label="Publicar nueva idea"
          >
            <Plus size={18} />
            Publicar idea
          </button>
        ) : (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {cantidadFiltros > 0 && (
              <button
                onClick={limpiarFiltros}
                className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-500 font-medium px-4 py-2.5 rounded-xl border border-slate-200 transition-colors text-sm"
                aria-label={`Limpiar filtros activos (${cantidadFiltros})`}
              >
                <X size={16} />
                Limpiar ({cantidadFiltros})
              </button>
            )}
            <button
              onClick={() => setModalFiltrosAbierto(true)}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#1F2F98] font-medium px-4 py-2.5 rounded-xl transition-colors"
              aria-label="Abrir filtros de búsqueda"
            >
              <SlidersHorizontal size={18} />
              Filtrar
            </button>
          </div>
        )}
      </div>

      {/* Client metrics */}
      {usuario?.rol === "cliente" && cargandoMetricas && <MetricsSkeleton />}
      {usuario?.rol === "cliente" && metricas && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8" role="region" aria-label="Métricas del dashboard">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 animate-fade-in-up hover:shadow-md hover:border-[#787FF6]/20 transition-all duration-300" style={{ animationDelay: "0ms" }}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#787FF6]/15 to-[#4ADEDE]/10 flex items-center justify-center shadow-sm">
              <Lightbulb size={20} className="text-[#787FF6]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1F2F98]">{metricas.ideas.total}</p>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Ideas totales</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 animate-fade-in-up hover:shadow-md hover:border-emerald-200 transition-all duration-300" style={{ animationDelay: "60ms" }}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/15 to-emerald-400/10 flex items-center justify-center shadow-sm">
              <TrendingUp size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1F2F98]">{metricas.ideas.enProgreso}</p>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">En progreso</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 animate-fade-in-up hover:shadow-md hover:border-blue-200 transition-all duration-300" style={{ animationDelay: "120ms" }}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-400/10 flex items-center justify-center shadow-sm">
              <BarChart3 size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1F2F98]">{metricas.postulaciones}</p>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Postulaciones</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 animate-fade-in-up hover:shadow-md hover:border-amber-200 transition-all duration-300" style={{ animationDelay: "180ms" }}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/15 to-amber-400/10 flex items-center justify-center shadow-sm">
              <Wallet size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1F2F98]">
                ${metricas.transacciones.montoTotal.toLocaleString("es-CL")}
              </p>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Total invertido</p>
            </div>
          </div>
        </div>
      )}

      {usuario?.rol === "developer" && (
        <div className="mb-6">
          <Buscador
            placeholder="Buscar ideas por título, descripción o categoría..."
            alBuscar={handleBuscar}
          />
        </div>
      )}

      {cargando ? (
        <DashboardIdeasSkeleton />
      ) : ideas.length === 0 ? (
        <EmptyState
          titulo={
            usuario?.rol === "cliente"
              ? "Aún no has publicado ninguna idea"
              : "No se encontraron ideas"
          }
          descripcion={
            busqueda || cantidadFiltros > 0
              ? "Intenta cambiar los filtros o la búsqueda"
              : usuario?.rol === "cliente"
                ? "Publica tu primera idea para que los developers se postulen."
                : "No hay ideas publicadas todavía."
          }
          accion={
            busqueda || cantidadFiltros > 0
              ? { texto: "Limpiar filtros", onClick: limpiarFiltros }
              : usuario?.rol === "cliente"
                ? { texto: "Publicar idea", onClick: () => setModalPublicarAbierto(true) }
                : undefined
          }
        />
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-4" role="list" aria-label="Lista de ideas">
            {ideas.map((idea, index) => (
              <article
                key={idea.id}
                onClick={() =>
                  usuario?.rol === "cliente" && navigate(`/ideas/${idea.id}`)
                }
                style={{ animationDelay: `${index * 60}ms` }}
                className={`bg-white rounded-2xl border border-slate-100 p-5 animate-fade-in-up hover:shadow-lg hover:shadow-[#787FF6]/8 hover:border-[#787FF6]/20 hover:-translate-y-0.5 transition-all duration-300 ${
                  usuario?.rol === "cliente"
                    ? "cursor-pointer"
                    : ""
                }`}
                role="listitem"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && usuario?.rol === "cliente") {
                    navigate(`/ideas/${idea.id}`);
                  }
                }}
                aria-label={`Idea: ${idea.titulo}`}
              >
                {/* Top row: category + difficulty */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold bg-[#787FF6]/10 text-[#787FF6] px-3 py-1 rounded-full">
                      {idea.categoria}
                    </span>
                    <DificultadBadge dificultad={idea.dificultadSugerida} />
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                    {idea.estado.replace("_", " ")}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-[#1F2F98] mb-1.5 text-[15px] leading-snug">
                  {idea.titulo}
                </h3>

                {/* Description */}
                <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {idea.descripcion}
                </p>

                {/* Bottom row: budget + timeline + action */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-[#1F2F98] font-semibold">
                      <div className="w-6 h-6 rounded-md bg-[#787FF6]/8 flex items-center justify-center">
                        <Wallet size={13} className="text-[#787FF6]" />
                      </div>
                      ${idea.presupuestoPropuesto.toLocaleString("es-CL")}
                    </div>
                    {idea.plazoDeseado && (
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Tag size={13} />
                        <span>{idea.plazoDeseado}</span>
                      </div>
                    )}
                  </div>

                  {usuario?.rol === "developer" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIdeaParaPostular(idea);
                      }}
                      className="flex items-center gap-1.5 bg-[#787FF6] hover:bg-[#6b71e0] text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-200 shadow-sm shadow-[#787FF6]/20 hover:shadow-md hover:shadow-[#787FF6]/30"
                      aria-label={`Postular a ${idea.titulo}`}
                    >
                      <Send size={12} />
                      Postular
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>

          {usuario?.rol === "developer" && (
            <Paginacion
              pagina={pagina}
              totalPaginas={totalPaginas}
              total={total}
              siguientePagina={() => { setPagina((p) => p + 1); }}
              paginaAnterior={() => { setPagina((p) => p - 1); }}
              irAPagina={(p) => setPagina(p)}
            />
          )}
        </>
      )}

      {modalPublicarAbierto && (
        <PublicarIdeaModal
          onClose={() => setModalPublicarAbierto(false)}
          onCreada={cargarIdeas}
        />
      )}

      {modalFiltrosAbierto && (
        <FiltrosIdeasModal
          filtrosIniciales={filtros}
          onClose={() => setModalFiltrosAbierto(false)}
          onAplicar={aplicarFiltros}
          onLimpiar={limpiarFiltros}
        />
      )}

      {ideaParaPostular && (
        <PostularModal
          ideaId={ideaParaPostular.id}
          ideaTitulo={ideaParaPostular.titulo}
          presupuestoOriginal={ideaParaPostular.presupuestoPropuesto}
          onClose={() => setIdeaParaPostular(null)}
          onPostulada={cargarIdeas}
        />
      )}
    </DashboardLayout>
  );
}
