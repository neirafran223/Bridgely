import { api } from "./api";

export interface Mensaje {
  id: string;
  conversacionId: string;
  remitenteId: string;
  contenido: string;
  fechaEnvio: string;
  remitente?: { nombre: string };
}

export interface Conversacion {
  id: string;
  ideaId: string;
  postulacionId: string;
}

export async function obtenerConversacion(
  postulacionId: string,
): Promise<Conversacion> {
  const { data } = await api.get(`/chat/postulacion/${postulacionId}`);
  return data;
}

export async function obtenerHistorialMensajes(
  conversacionId: string,
): Promise<Mensaje[]> {
  const { data } = await api.get(`/chat/${conversacionId}/mensajes`);
  return data;
}
