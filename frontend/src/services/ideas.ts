import { api } from "./api";

export interface Idea {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  presupuestoPropuesto: number;
  plazoDeseado: string | null;
  dificultadSugerida: string | null;
  estado: "abierta" | "en_progreso" | "cerrada";
  fechaCreacion: string;
  cliente?: {
    usuario: { nombre: string };
  };
}

export interface CrearIdeaInput {
  titulo: string;
  descripcion: string;
  categoria: string;
  presupuestoPropuesto: number;
  plazoDeseado?: string;
}

export interface FiltrosIdeas {
  categoria?: string;
  dificultad?: string;
  presupuestoMin?: number;
  presupuestoMax?: number;
  busqueda?: string;
  pagina?: number;
  limite?: number;
}

export interface IdeasPaginadas {
  datos: Idea[];
  total: number;
  pagina: number;
  limite: number;
}

export async function obtenerIdeasPublicas(
  filtros: FiltrosIdeas = {},
): Promise<IdeasPaginadas> {
  const { data } = await api.get("/ideas", { params: filtros });
  return data;
}

export async function obtenerMisIdeas(): Promise<Idea[]> {
  const { data } = await api.get("/ideas/propias");
  return data;
}

export async function crearIdea(datos: CrearIdeaInput): Promise<Idea> {
  const { data } = await api.post("/ideas", datos);
  return data;
}

export async function obtenerIdea(id: string): Promise<Idea> {
  const { data } = await api.get(`/ideas/${id}`);
  return data;
}
