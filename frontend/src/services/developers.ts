import { api } from "./api";

export interface DeveloperStack {
  id: string;
  developerId: string;
  stackId: string;
  tipo: "preferido" | "experiencia";
  nivel: "basico" | "intermedio" | "avanzado";
  stack: { id: string; nombre: string };
}

export interface PerfilDeveloper {
  id: string;
  usuarioId: string;
  experienciaAnios: number | null;
  disponibilidad: "full_time" | "part_time" | "por_horas" | null;
  portafolioUrl: string | null;
  reputacionPromedio: number;
  stacks: DeveloperStack[];
  usuario?: {
    id: string;
    nombre: string;
    email: string;
    fotoUrl?: string | null;
    fechaRegistro?: string;
  };
}

export interface ActualizarPerfilInput {
  experienciaAnios?: number | null;
  disponibilidad?: string | null;
  portafolioUrl?: string | null;
}

export interface AgregarStackInput {
  nombre: string;
  tipo: "preferido" | "experiencia";
  nivel: "basico" | "intermedio" | "avanzado";
}

export async function obtenerMiPerfil(): Promise<PerfilDeveloper> {
  const { data } = await api.get("/developers/perfil");
  return data;
}

export async function actualizarMiPerfil(
  datos: ActualizarPerfilInput,
): Promise<PerfilDeveloper> {
  const { data } = await api.patch("/developers/perfil", datos);
  return data;
}

export async function agregarStackAlPerfil(
  datos: AgregarStackInput,
): Promise<DeveloperStack> {
  const { data } = await api.post("/developers/perfil/stacks", datos);
  return data;
}

export async function quitarStackDelPerfil(stackId: string): Promise<void> {
  await api.delete(`/developers/perfil/stacks/${stackId}`);
}

export async function obtenerPerfilPublico(
  developerId: string,
): Promise<PerfilDeveloper> {
  const { data } = await api.get(`/developers/${developerId}/publico`);
  return data;
}
