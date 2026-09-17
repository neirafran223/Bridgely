import { useEffect, useState } from "react";
import { Wallet, Percent } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { TransaccionesSkeleton } from "../components/common/LoadingSkeletons";
import { obtenerMisTransacciones } from "../services/transacciones";
import type { Transaccion } from "../services/transacciones";

const etiquetasEstado: Record<string, string> = {
  pendiente: "Pendiente",
  pagado: "Pagado",
  liberado: "Completado",
};

const coloresEstado: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  pagado: "bg-sky-100 text-sky-700",
  liberado: "bg-green-100 text-green-700",
};

export default function MisTransaccionesPage() {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const data = await obtenerMisTransacciones();
        setTransacciones(data);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-[#1F2F98] mb-1">
        Mis transacciones
      </h1>
      <p className="text-slate-500 text-sm mb-8">
        Consulta el estado de los pagos de tus proyectos
      </p>

      {cargando ? (
        <TransaccionesSkeleton />
      ) : transacciones.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <Wallet size={40} className="mx-auto mb-4 text-slate-300" />
          <p className="text-slate-400">
            Aún no tienes transacciones registradas.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {transacciones.map((t, index) => (
            <div
              key={t.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 animate-fade-in-up card-hover"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#1F2F98]">
                  {t.idea?.titulo ?? "Proyecto"}
                </h3>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${coloresEstado[t.estado]}`}
                >
                  {etiquetasEstado[t.estado]}
                </span>
              </div>

              {t.postulacion?.equipo?.nombre && (
                <p className="text-sm text-slate-500">
                  Postulación de equipo: {t.postulacion.equipo.nombre}
                </p>
              )}

              <div className="flex items-center gap-2 text-[#1F2F98] font-medium">
                <Wallet size={16} />$
                {t.montoAcordado.toLocaleString("es-CL")}
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Percent size={15} />
                Comisión de la plataforma: $
                {t.comisionPlataforma.toLocaleString("es-CL")}
              </div>

              <p className="text-xs text-slate-400">
                {new Date(t.fecha).toLocaleDateString("es-CL")}
              </p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}