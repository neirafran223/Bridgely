import { api } from "./api";

export interface PerfilCliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  rol: string;
  perfilCliente: {
    empresa: string | null;
  } | null;
}

export interface ActualizarPerfilClienteInput {
  nombre?: string;
  telefono?: string;
  empresa?: string;
}

export async function obtenerMiPerfilCliente(): Promise<PerfilCliente> {
  const { data } = await api.get("/clientes/perfil");
  return data;
}

export async function actualizarMiPerfilCliente(
  datos: ActualizarPerfilClienteInput,
): Promise<PerfilCliente> {
  const { data } = await api.patch("/clientes/perfil", datos);
  return data;
}
