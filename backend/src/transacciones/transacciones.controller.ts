import { Request, Response } from "express";
import {
  crearTransaccionDesdePostulacion,
  marcarTransaccionPagada,
  liberarTransaccion,
  listarTransaccionesMias,
} from "./transacciones.service";

export async function crearDesdePostulacion(req: Request, res: Response) {
  try {
    const transaccion = await crearTransaccionDesdePostulacion(
      req.params.postulacionId as string,
      req.usuario!.usuarioId,
    );
    res.status(201).json(transaccion);
  } catch (error) {
    const mensaje =
      error instanceof Error
        ? error.message
        : "Error al crear la transacción";
    res.status(400).json({ error: mensaje });
  }
}

export async function marcarPagado(req: Request, res: Response) {
  try {
    const transaccion = await marcarTransaccionPagada(
      req.params.id as string,
      req.usuario!.usuarioId,
    );
    res.json(transaccion);
  } catch (error) {
    const mensaje =
      error instanceof Error
        ? error.message
        : "Error al marcar la transacción como pagada";
    res.status(400).json({ error: mensaje });
  }
}

export async function liberar(req: Request, res: Response) {
  try {
    const transaccion = await liberarTransaccion(
      req.params.id as string,
      req.usuario!.usuarioId,
    );
    res.json(transaccion);
  } catch (error) {
    const mensaje =
      error instanceof Error
        ? error.message
        : "Error al liberar la transacción";
    res.status(400).json({ error: mensaje });
  }
}

export async function listarMias(req: Request, res: Response) {
  try {
    const transacciones = await listarTransaccionesMias(req.usuario!.usuarioId);
    res.json(transacciones);
  } catch (error) {
    const mensaje =
      error instanceof Error
        ? error.message
        : "Error al listar transacciones";
    res.status(400).json({ error: mensaje });
  }
}