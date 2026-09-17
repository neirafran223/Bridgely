import { api } from "./api";

export interface MetricasCliente {
  ideas: {
    total: number;
    abiertas: number;
    enProgreso: number;
    cerradas: number;
  };
  postulaciones: number;
  transacciones: {
    total: number;
    montoTotal: number;
  };
}

export async function obtenerMetricasCliente(): Promise<MetricasCliente> {
  const { data } = await api.get("/clientes/metricas");
  return data;
}
