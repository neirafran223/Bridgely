import { useEffect, useState } from "react";
import { Bell, CheckCheck, X } from "lucide-react";
import { conectarSocket } from "../services/socket";
import {
  obtenerMisNotificaciones,
  marcarNotificacionLeida,
  marcarTodasLeidas,
} from "../services/notificaciones";
import type { Notificacion } from "../services/notificaciones";

const iconosPorTipo: Record<string, string> = {
  postulacion_aceptada: "Aceptación de postulación",
  invitacion_equipo: "Invitación a equipo",
  respuesta_invitacion: "Respuesta de invitación",
  transaccion_creada: "Transacción creada",
  pago_realizado: "Pago realizado",
  pago_liberado: "Pago liberado",
  calificacion_recibida: "Calificación recibida",
};

export default function NotificacionesBell() {
  const [abierto, setAbierto] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [cargando, setCargando] = useState(true);

  async function cargar() {
    try {
      const data = await obtenerMisNotificaciones();
      setNotificaciones(data);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();

    const socket = conectarSocket();

    function manejarNotificacion() {
      cargar();
    }

    socket.on("notificacion", manejarNotificacion);

    return () => {
      socket.off("notificacion", manejarNotificacion);
    };
  }, []);

  async function handleMarcarTodas() {
    try {
      await marcarTodasLeidas();
      setNotificaciones((prev) =>
        prev.map((n) => ({ ...n, leido: true })),
      );
    } catch {
      await cargar();
    }
  }

  async function handleMarcarLeida(id: string) {
    try {
      await marcarNotificacionLeida(id);
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leido: true } : n)),
      );
    } catch {
      await cargar();
    }
  }

  const noLeidas = notificaciones.filter((n) => !n.leido).length;

  return (
    <div className="relative">
      <button
        onClick={() => setAbierto((v) => !v)}
        className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-slate-200 text-[#1F2F98] hover:bg-slate-50 transition-colors"
        aria-label="Notificaciones"
      >
        <Bell size={20} />
        {noLeidas > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[11px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
            {noLeidas}
          </span>
        )}
      </button>

      {abierto && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <span className="font-bold text-[#1F2F98] text-sm">
              Notificaciones
            </span>
            <button
              onClick={handleMarcarTodas}
              disabled={noLeidas === 0}
              className="flex items-center gap-1 text-xs text-[#1CA7EC] hover:underline disabled:opacity-50"
            >
              <CheckCheck size={14} />
              Marcar todas
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {cargando ? (
              <p className="text-center text-sm text-slate-400 py-6">
                Cargando...
              </p>
            ) : notificaciones.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-6">
                No tienes notificaciones
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {notificaciones.map((n) => (
                  <li key={n.id}>
                    <button
                      onClick={() => handleMarcarLeida(n.id)}
                      className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${
                        n.leido ? "opacity-60" : ""
                      }`}
                    >
                      <p className="text-[11px] text-[#1CA7EC] font-medium mb-0.5">
                        {iconosPorTipo[n.tipo] ?? "Notificación"}
                      </p>
                      <p className="text-sm text-slate-600">{n.contenido}</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {new Date(n.fecha).toLocaleDateString("es-CL", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={() => setAbierto(false)}
            className="w-full flex items-center justify-center gap-1 py-2 border-t border-slate-100 text-xs text-slate-400 hover:text-slate-600"
          >
            <X size={12} />
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}