import { Request, Response } from "express";
import {
  obtenerOCrearConversacion,
  obtenerMensajes,
  verificarAccesoConversacion,
} from "./chat.service";

export async function obtenerConversacion(req: Request, res: Response) {
  try {
    const conversacion = await obtenerOCrearConversacion(
      req.params.postulacionId as string,
    );
    await verificarAccesoConversacion(conversacion.id, req.usuario!.usuarioId);
    res.json(conversacion);
  } catch (error) {
    const mensaje =
      error instanceof Error
        ? error.message
        : "Error al obtener la conversación";
    res.status(403).json({ error: mensaje });
  }
}

export async function listarMensajes(req: Request, res: Response) {
  try {
    const conversacionId = req.params.conversacionId as string;
    await verificarAccesoConversacion(conversacionId, req.usuario!.usuarioId);
    const mensajes = await obtenerMensajes(conversacionId);
    res.json(mensajes);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al listar mensajes";
    res.status(403).json({ error: mensaje });
  }
}
