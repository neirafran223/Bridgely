import { api } from "./api";

export interface Postulacion {
  id: string;
  ideaId: string;
  equipoId?: string | null;
  mensaje: string;
  precioPropuesto: number;
  estado: "pendiente" | "aceptada" | "rechazada";
  fecha: string;
  developer?: {
    id: string;
    usuario: { id: string; nombre: string };
  };
  equipo?: {
    id: string;
    nombre: string;
    tipoOrigen: string;
    creadoPorId: string;
    miembros: {
      id: string;
      estado: string;
      developer: { id: string; usuario: { id: string; nombre: string } };
    }[];
  };
  idea?: {
    id: string;
    titulo: string;
    estado: string;
  };
}

export interface CrearPostulacionInput {
  ideaId: string;
  mensaje: string;
  precioPropuesto: number;
  equipoId?: string;
}

export async function crearPostulacion(
  datos: CrearPostulacionInput,
): Promise<Postulacion> {
  const { data } = await api.post("/postulaciones", datos);
  return data;
}

export async function obtenerMisPostulaciones(): Promise<Postulacion[]> {
  const { data } = await api.get("/postulaciones/propias");
  return data;
}

export async function obtenerPostulacionesDeIdea(
  ideaId: string,
): Promise<Postulacion[]> {
  const { data } = await api.get(`/postulaciones/idea/${ideaId}`);
  return data;
}

export async function aceptarPostulacion(id: string): Promise<Postulacion> {
  const { data } = await api.patch(`/postulaciones/${id}/aceptar`);
  return data;
}
