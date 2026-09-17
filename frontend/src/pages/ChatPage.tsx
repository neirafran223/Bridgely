import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { ChatSkeleton } from "../components/common/LoadingSkeletons";
import { useAuth } from "../context/AuthContext";
import {
  obtenerConversacion,
  obtenerHistorialMensajes,
} from "../services/chat";
import type { Mensaje } from "../services/chat";
import { conectarSocket, esperarConexion } from "../services/socket";

export default function ChatPage() {
  const { postulacionId } = useParams<{ postulacionId: string }>();
  const { usuario, cargandoAuth } = useAuth();
  const navigate = useNavigate();
  const [conversacionId, setConversacionId] = useState<string | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(true);
  const [conexionLista, setConexionLista] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const finMensajesRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<ReturnType<typeof conectarSocket> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!postulacionId || cargandoAuth || !usuario) return;

    let mounted = true;

    function manejarNuevoMensaje(mensaje: Mensaje) {
      if (mounted) {
        setMensajes((prev) => [...prev, mensaje]);
      }
    }

    async function iniciar() {
      setCargando(true);
      setError(null);

      try {
        // Obtener conversación
        const conversacion = await obtenerConversacion(postulacionId!);
        if (!mounted) return;

        setConversacionId(conversacion.id);

        // Obtener historial
        const historial = await obtenerHistorialMensajes(conversacion.id);
        if (!mounted) return;

        setMensajes(historial);

        // Conectar socket y esperar conexión
        const socket = conectarSocket();
        socketRef.current = socket;

        await esperarConexion();
        if (!mounted) return;

        // Unirse a la conversación
        socket.emit("unirse_conversacion", conversacion.id);

        // Escuchar nuevos mensajes
        socket.off("nuevo_mensaje", manejarNuevoMensaje);
        socket.on("nuevo_mensaje", manejarNuevoMensaje);

        setConexionLista(true);
      } catch {
        if (mounted) {
          setError("No se pudo cargar la conversación. Intenta de nuevo.");
        }
      } finally {
        if (mounted) {
          setCargando(false);
        }
      }
    }

    // Pequeño delay para asegurar que Auth esté listo
    const timer = setTimeout(iniciar, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
      if (socketRef.current) {
        socketRef.current.off("nuevo_mensaje", manejarNuevoMensaje);
      }
    };
  }, [postulacionId, cargandoAuth, usuario]);

  useEffect(() => {
    finMensajesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  function handleEnviar(e: React.FormEvent) {
    e.preventDefault();
    if (!texto.trim() || !conversacionId || !conexionLista) return;

    const socket = conectarSocket();
    socket.emit("enviar_mensaje", { conversacionId, contenido: texto });
    setTexto("");
  }

  if (cargandoAuth) {
    return (
      <DashboardLayout>
        <ChatSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-[#1F2F98] text-sm mb-6"
      >
        <ArrowLeft size={16} />
        Volver
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 flex flex-col h-[70vh]">
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {cargando ? (
            <ChatSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <p className="text-red-500 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-[#787FF6] text-sm hover:underline"
              >
                Reintentar
              </button>
            </div>
          ) : mensajes.length === 0 ? (
            <p className="text-slate-400 text-center">
              Aún no hay mensajes. Escribe el primero.
            </p>
          ) : (
            mensajes.map((m) => {
              const esPropio = m.remitenteId === usuario?.usuarioId;
              return (
                <div
                  key={m.id}
                  className={`flex ${esPropio ? "justify-end" : "justify-start"} animate-fade-in-up`}
                >
                  <div
                    className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                      esPropio
                        ? "bg-[#787FF6] text-white rounded-br-sm"
                        : "bg-slate-100 text-slate-700 rounded-bl-sm"
                    }`}
                  >
                    {!esPropio && (
                      <p className="text-xs font-medium text-[#1F2F98] mb-0.5">
                        {m.remitente?.nombre}
                      </p>
                    )}
                    {m.contenido}
                  </div>
                </div>
              );
            })
          )}
          <div ref={finMensajesRef} />
        </div>

        <form
          onSubmit={handleEnviar}
          className="flex items-center gap-2 p-4 border-t border-slate-200"
        >
          <input
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder={conexionLista ? "Escribe un mensaje..." : "Conectando..."}
            disabled={!conexionLista}
            className="flex-1 px-4 py-2.5 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!conexionLista || !texto.trim()}
            className="bg-[#787FF6] hover:bg-[#6b71e0] text-white p-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
