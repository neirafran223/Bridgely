import { Request, Response } from "express";
import { actualizarPerfilClienteSchema } from "./clientes.schemas";
import {
  obtenerPerfilCliente,
  actualizarPerfilCliente,
} from "./clientes.service";

export async function obtenerMiPerfil(req: Request, res: Response) {
  try {
    const perfil = await obtenerPerfilCliente(req.usuario!.usuarioId);
    res.json(perfil);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al obtener el perfil";
    res.status(400).json({ error: mensaje });
  }
}

export async function actualizarMiPerfil(req: Request, res: Response) {
  const resultado = actualizarPerfilClienteSchema.safeParse(req.body);

  if (!resultado.success) {
    return res.status(400).json({ error: resultado.error.issues[0].message });
  }

  try {
    const perfil = await actualizarPerfilCliente(
      req.usuario!.usuarioId,
      resultado.data,
    );
    res.json(perfil);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al actualizar el perfil";
    res.status(400).json({ error: mensaje });
  }
}
