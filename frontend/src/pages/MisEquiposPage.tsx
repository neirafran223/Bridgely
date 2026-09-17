import { useEffect, useState } from "react";
import {
  Users,
  Plus,
  Check,
  X,
  LoaderCircle,
  UserPlus,
  ShieldCheck,
} from "lucide-react";
import { AxiosError } from "axios";
import DashboardLayout from "../components/DashboardLayout";
import { EquiposSkeleton } from "../components/common/LoadingSkeletons";
import { useAuth } from "../context/AuthContext";
import {
  obtenerMisEquipos,
  crearEquipo,
  invitarMiembro,
  responderInvitacion,
} from "../services/equipos";
import type { Equipo } from "../services/equipos";

const etiquetasEstadoMiembro: Record<string, string> = {
  invitado: "Invitado",
  aceptado: "Aceptado",
  rechazado: "Rechazado",
};

const coloresEstadoMiembro: Record<string, string> = {
  invitado: "bg-amber-100 text-amber-700",
  aceptado: "bg-green-100 text-green-700",
  rechazado: "bg-red-100 text-red-600",
};

export default function MisEquiposPage() {
  const { usuario } = useAuth();
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [cargando, setCargando] = useState(true);

  const [formAbierto, setFormAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [tipoOrigen, setTipoOrigen] = useState<
    "preformado" | "armado_en_plataforma"
  >("armado_en_plataforma");
  const [emails, setEmails] = useState("");
  const [creando, setCreando] = useState(false);
  const [errorCrear, setErrorCrear] = useState("");

  const [invitandoEn, setInvitandoEn] = useState<string | null>(null);
  const [emailsInvitar, setEmailsInvitar] = useState<Record<string, string>>(
    {},
  );
  const [errorInvitar, setErrorInvitar] = useState("");

  const [respondiendo, setRespondiendo] = useState<string | null>(null);

  async function cargarEquipos() {
    try {
      const data = await obtenerMisEquipos();
      setEquipos(data);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarEquipos();
  }, []);

  function miMiembro(equipo: Equipo) {
    return equipo.miembros.find(
      (m) => m.developer.usuario.id === usuario?.usuarioId,
    );
  }

  const invitacionesPendientes = equipos.filter(
    (e) => miMiembro(e)?.estado === "invitado",
  );

  async function handleCrear(e: React.FormEvent) {
    e.preventDefault();
    setErrorCrear("");
    setCreando(true);

    try {
      await crearEquipo({
        nombre: nombre.trim(),
        tipoOrigen,
        emailsInvitados:
          emails.trim() === ""
            ? undefined
            : emails
                .split(",")
                .map((em) => em.trim())
                .filter(Boolean),
      });
      setNombre("");
      setEmails("");
      setFormAbierto(false);
      await cargarEquipos();
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      setErrorCrear(
        axiosError.response?.data?.error || "Error al crear el equipo",
      );
    } finally {
      setCreando(false);
    }
  }

  async function handleInvitar(equipoId: string) {
    setErrorInvitar("");
    setInvitandoEn(equipoId);
    try {
      await invitarMiembro(equipoId, (emailsInvitar[equipoId] ?? "").trim());
      setEmailsInvitar((prev) => ({ ...prev, [equipoId]: "" }));
      setInvitandoEn(null);
      await cargarEquipos();
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      setErrorInvitar(
        axiosError.response?.data?.error || "Error al invitar",
      );
    } finally {
      setInvitandoEn(null);
    }
  }

  async function handleResponder(
    equipoId: string,
    miembroId: string,
    estado: "aceptado" | "rechazado",
  ) {
    setRespondiendo(miembroId);
    try {
      await responderInvitacion(equipoId, miembroId, estado);
      await cargarEquipos();
    } finally {
      setRespondiendo(null);
    }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2F98] mb-1">
            Mis equipos
          </h1>
          <p className="text-slate-500 text-sm">
            Arma un equipo y postula junto a otros developers
          </p>
        </div>
        <button
          onClick={() => setFormAbierto((v) => !v)}
          className="flex items-center gap-2 bg-[#787FF6] hover:bg-[#6b71e0] text-white font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={18} />
          Crear equipo
        </button>
      </div>

      {formAbierto && (
        <form
          onSubmit={handleCrear}
          className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 space-y-4"
        >
          <h2 className="font-bold text-[#1F2F98]">Nuevo equipo</h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nombre del equipo
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              minLength={2}
              className="w-full px-3 py-2.5 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6]"
              placeholder="Ej: Devs del sur"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Origen del equipo
            </label>
            <select
              value={tipoOrigen}
              onChange={(e) =>
                setTipoOrigen(
                  e.target.value as "preformado" | "armado_en_plataforma",
                )
              }
              className="w-full px-3 py-2.5 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6]"
            >
              <option value="armado_en_plataforma">
                Armado en la plataforma
              </option>
              <option value="preformado">Preformado (ya nos conocíamos)</option>
            </select>
          </div>

          {tipoOrigen === "preformado" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Emails de developers a invitar (opcional)
              </label>
              <input
                type="text"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6]"
                placeholder="dev1@mail.com, dev2@mail.com"
              />
              <p className="text-xs text-slate-400 mt-1">
                Sepáralos con comas. Solo se invitará a developers registrados.
              </p>
            </div>
          )}

          {errorCrear && <p className="text-red-500 text-sm">{errorCrear}</p>}

          <button
            type="submit"
            disabled={creando}
            className="w-full bg-[#787FF6] hover:bg-[#6b71e0] text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60 sm:w-auto sm:px-8"
          >
            {creando && <LoaderCircle size={18} className="animate-spin" />}
            Crear equipo
          </button>
        </form>
      )}

      {invitacionesPendientes.length > 0 && (
        <section className="mb-8">
          <h2 className="font-bold text-[#1F2F98] mb-3">
            Invitaciones pendientes
          </h2>
          <div className="space-y-3">
            {invitacionesPendientes.map((equipo) => {
              const miembro = miMiembro(equipo)!;
              return (
                <div
                  key={equipo.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-[#1F2F98]">
                      {equipo.nombre}
                    </p>
                    <p className="text-sm text-slate-500">
                      Te invitaron a unirte a este equipo ({equipo.miembros.length}{" "}
                      miembros)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleResponder(equipo.id, miembro.id, "rechazado")
                      }
                      disabled={respondiendo === miembro.id}
                      className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 text-sm font-medium px-3 py-2 rounded-xl transition-colors disabled:opacity-60"
                    >
                      <X size={16} />
                      Rechazar
                    </button>
                    <button
                      onClick={() =>
                        handleResponder(equipo.id, miembro.id, "aceptado")
                      }
                      disabled={respondiendo === miembro.id}
                      className="flex items-center gap-1.5 bg-[#787FF6] hover:bg-[#6b71e0] text-white text-sm font-medium px-3 py-2 rounded-xl transition-colors disabled:opacity-60"
                    >
                      {respondiendo === miembro.id ? (
                        <LoaderCircle size={16} className="animate-spin" />
                      ) : (
                        <Check size={16} />
                      )}
                      Aceptar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {cargando ? (
        <EquiposSkeleton />
      ) : equipos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <Users size={40} className="mx-auto mb-4 text-slate-300" />
          <p className="text-slate-400">
            Aún no perteneces a ningún equipo. Crea uno para empezar.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {equipos.map((equipo) => {
            const soyCreador = equipo.creadoPorId === usuario?.usuarioId;
            const miMiembroEquipo = miMiembro(equipo);
            return (
              <div
                key={equipo.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#1F2F98]">{equipo.nombre}</h3>
                  <span className="text-xs font-medium bg-[#787FF6]/10 text-[#1F2F98] px-2.5 py-1 rounded-full">
                    {equipo.tipoOrigen === "preformado"
                      ? "Preformado"
                      : "Armado en plataforma"}
                  </span>
                </div>

                {soyCreador && (
                  <div className="flex items-center gap-1.5 text-xs text-[#4ADEDE] font-medium">
                    <ShieldCheck size={14} />
                    Eres el creador
                  </div>
                )}

                <ul className="space-y-2">
                  {equipo.miembros.map((m) => (
                    <li
                      key={m.id}
                      className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-2.5"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#1F2F98]">
                          {m.developer.usuario.nombre}
                          {m.developer.usuario.id === usuario?.usuarioId &&
                            " (tú)"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {m.developer.usuario.email}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${coloresEstadoMiembro[m.estado]}`}
                      >
                        {etiquetasEstadoMiembro[m.estado]}
                      </span>
                    </li>
                  ))}
                </ul>

                {soyCreador && (
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={emailsInvitar[equipo.id] ?? ""}
                      onChange={(e) =>
                        setEmailsInvitar((prev) => ({
                          ...prev,
                          [equipo.id]: e.target.value,
                        }))
                      }
                      placeholder="email@dev.com"
                      className="flex-1 px-3 py-2 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6] text-sm"
                    />
                    <button
                      onClick={() => handleInvitar(equipo.id)}
                      disabled={invitandoEn === equipo.id}
                      className="flex items-center gap-1.5 bg-[#787FF6]/10 hover:bg-[#787FF6]/20 text-[#1F2F98] text-sm font-medium px-3 py-2 rounded-xl transition-colors disabled:opacity-60"
                    >
                      {invitandoEn === equipo.id ? (
                        <LoaderCircle size={16} className="animate-spin" />
                      ) : (
                        <UserPlus size={16} />
                      )}
                      Invitar
                    </button>
                  </div>
                )}

                {errorInvitar && invitandoEn === equipo.id && (
                  <p className="text-red-500 text-sm">{errorInvitar}</p>
                )}

                {!soyCreador && miMiembroEquipo?.estado === "aceptado" && (
                  <p className="text-xs text-slate-400">
                    Este equipo está listo para postular a ideas.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}