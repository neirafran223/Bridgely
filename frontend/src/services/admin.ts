import { api } from "./api";

export interface UsuarioAdmin {
  id: string;
  nombre: string;
  email: string;
  rol: "cliente" | "developer" | "admin";
  suspendido: boolean;
  fechaRegistro: string;
  perfilCliente?: {
    empresa: string | null;
    _count: { ideas: number };
  } | null;
  perfilDeveloper?: {
    experienciaAnios: number | null;
    disponibilidad: string | null;
    _count: { postulaciones: number };
  } | null;
}

export interface IdeaAdmin {
  id: string;
  titulo: string;
  categoria: string;
  dificultadSugerida: "basica" | "intermedia" | "avanzada" | null;
  estado: "abierta" | "en_progreso" | "cerrada";
  presupuestoPropuesto: number;
  fechaCreacion: string;
  cliente?: {
    usuario: { nombre: string; email: string };
  };
  _count: { postulaciones: number };
}

export interface Estadisticas {
  usuariosPorRol: Record<string, number>;
  ideasPorEstado: Record<string, number>;
  transaccionesPorEstado: Record<string, number>;
  totalUsuarios: number;
  totalIdeas: number;
  totalTransacciones: number;
}

export async function listarUsuarios(): Promise<UsuarioAdmin[]> {
  const { data } = await api.get("/admin/usuarios");
  return data;
}

export async function alternarSuspension(id: string): Promise<UsuarioAdmin> {
  const { data } = await api.patch(`/admin/usuarios/${id}/suspender`);
  return data;
}

export async function listarIdeasAdmin(): Promise<IdeaAdmin[]> {
  const { data } = await api.get("/admin/ideas");
  return data;
}

export async function eliminarIdeaAdmin(id: string): Promise<void> {
  await api.delete(`/admin/ideas/${id}`);
}

export async function obtenerEstadisticas(): Promise<Estadisticas> {
  const { data } = await api.get("/admin/estadisticas");
  return data;
}
