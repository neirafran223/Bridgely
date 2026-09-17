import { api } from "./api";

export interface Notificacion {
  id: string;
  tipo: string;
  contenido: string;
  leido: boolean;
  fecha: string;
}

export async function obtenerMisNotificaciones(): Promise<Notificacion[]> {
  const { data } = await api.get("/notificaciones/mias");
  return data;
}

export async function marcarNotificacionLeida(
  id: string,
): Promise<Notificacion> {
  const { data } = await api.patch(`/notificaciones/${id}/leer`);
  return data;
}

export async function marcarTodasLeidas(): Promise<{ ok: boolean }> {
  const { data } = await api.patch("/notificaciones/leer-todas");
  return data;
}
