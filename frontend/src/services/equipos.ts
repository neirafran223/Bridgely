import { api } from "./api";

export interface MiembroEquipo {
  id: string;
  estado: "invitado" | "aceptado" | "rechazado";
  developer: {
    id: string;
    usuario: { id: string; nombre: string; email: string };
  };
}

export interface Equipo {
  id: string;
  nombre: string;
  tipoOrigen: "preformado" | "armado_en_plataforma";
  creadoPorId: string;
  fechaCreacion: string;
  miembros: MiembroEquipo[];
}

export interface CrearEquipoInput {
  nombre: string;
  tipoOrigen: "preformado" | "armado_en_plataforma";
  emailsInvitados?: string[];
}

export async function crearEquipo(datos: CrearEquipoInput): Promise<Equipo> {
  const { data } = await api.post("/equipos", datos);
  return data;
}

export async function invitarMiembro(
  equipoId: string,
  email: string,
): Promise<MiembroEquipo> {
  const { data } = await api.post(`/equipos/${equipoId}/invitar`, { email });
  return data;
}

export async function responderInvitacion(
  equipoId: string,
  miembroId: string,
  estado: "aceptado" | "rechazado",
): Promise<MiembroEquipo> {
  const { data } = await api.patch(
    `/equipos/${equipoId}/miembros/${miembroId}/responder`,
    { estado },
  );
  return data;
}

export async function obtenerMisEquipos(): Promise<Equipo[]> {
  const { data } = await api.get("/equipos/mis-equipos");
  return data;
}
