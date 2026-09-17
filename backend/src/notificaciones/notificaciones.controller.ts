import { Request, Response } from "express";
import {
  listarNotificacionesMias,
  marcarLeida,
  marcarTodasLeidas,
} from "./notificaciones.service";

export async function listarMias(req: Request, res: Response) {
  try {
    const notificaciones = await listarNotificacionesMias(
      req.usuario!.usuarioId,
    );
    res.json(notificaciones);
  } catch (error) {
    const mensaje =
      error instanceof Error
        ? error.message
        : "Error al listar notificaciones";
    res.status(400).json({ error: mensaje });
  }
}

export async function marcarLeidaController(req: Request, res: Response) {
  try {
    const notificacion = await marcarLeida(
      req.params.id as string,
      req.usuario!.usuarioId,
    );
    res.json(notificacion);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al marcar la notificación";
    res.status(400).json({ error: mensaje });
  }
}

export async function marcarTodasController(req: Request, res: Response) {
  try {
    const resultado = await marcarTodasLeidas(req.usuario!.usuarioId);
    res.json(resultado);
  } catch (error) {
    const mensaje =
      error instanceof Error
        ? error.message
        : "Error al marcar las notificaciones";
    res.status(400).json({ error: mensaje });
  }
}