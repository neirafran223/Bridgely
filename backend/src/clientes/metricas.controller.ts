import { Request, Response } from "express";
import { obtenerMetricasCliente } from "./metricas.service";

export async function obtenerMetricas(req: Request, res: Response) {
  try {
    const metricas = await obtenerMetricasCliente(req.usuario!.usuarioId);
    res.json(metricas);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al obtener métricas";
    res.status(400).json({ error: mensaje });
  }
}
