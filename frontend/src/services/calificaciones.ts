import { api } from "./api";

export interface Calificacion {
  id: string;
  puntaje: number;
  comentario: string | null;
  fecha: string;
  calificador: { nombre: string };
  transaccion?: {
    idea: { titulo: string };
  };
}

export interface CalificacionesDeDeveloper {
  promedio: number;
  total: number;
  calificaciones: Calificacion[];
}

export interface CrearCalificacionInput {
  transaccionId: string;
  calificadoId: string;
  puntaje: number;
  comentario?: string;
}

export async function crearCalificacion(
  datos: CrearCalificacionInput,
): Promise<Calificacion> {
  const { data } = await api.post("/calificaciones", datos);
  return data;
}

export async function obtenerCalificacionesDeDeveloper(
  developerUsuarioId: string,
): Promise<CalificacionesDeDeveloper> {
  const { data } = await api.get(
    `/calificaciones/developer/${developerUsuarioId}`,
  );
  return data;
}
