import { api } from "./api";

export interface Transaccion {
  id: string;
  ideaId: string;
  postulacionId: string;
  montoAcordado: number;
  comisionPlataforma: number;
  estado: "pendiente" | "pagado" | "liberado";
  fecha: string;
  idea?: { id: string; titulo: string; estado: string };
  postulacion?: {
    id: string;
    precioPropuesto: number;
    equipo?: { nombre: string } | null;
  };
}

export async function crearTransaccionDesdePostulacion(
  postulacionId: string,
): Promise<Transaccion> {
  const { data } = await api.post(
    `/transacciones/desde-postulacion/${postulacionId}`,
  );
  return data;
}

export async function marcarTransaccionPagada(
  transaccionId: string,
): Promise<Transaccion> {
  const { data } = await api.patch(
    `/transacciones/${transaccionId}/marcar-pagado`,
  );
  return data;
}

export async function liberarTransaccion(
  transaccionId: string,
): Promise<Transaccion> {
  const { data } = await api.patch(`/transacciones/${transaccionId}/liberar`);
  return data;
}

export async function obtenerMisTransacciones(): Promise<Transaccion[]> {
  const { data } = await api.get("/transacciones/mias");
  return data;
}
