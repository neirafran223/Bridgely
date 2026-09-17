import { Request, Response } from "express";
import {
  actualizarPerfilSchema,
  agregarStackSchema,
} from "./developers.schemas";
import {
  obtenerPerfilPropio,
  actualizarPerfil,
  agregarStack,
  quitarStack,
  obtenerPerfilPublico,
} from "./developers.service";

export async function perfilPropio(req: Request, res: Response) {
  try {
    const perfil = await obtenerPerfilPropio(req.usuario!.usuarioId);
    res.json(perfil);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al obtener el perfil";
    res.status(404).json({ error: mensaje });
  }
}

export async function actualizar(req: Request, res: Response) {
  const resultado = actualizarPerfilSchema.safeParse(req.body);

  if (!resultado.success) {
    return res.status(400).json({ error: resultado.error.issues[0].message });
  }

  try {
    const perfil = await actualizarPerfil(req.usuario!.usuarioId, resultado.data);
    res.json(perfil);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al actualizar el perfil";
    res.status(400).json({ error: mensaje });
  }
}

export async function agregarStackController(req: Request, res: Response) {
  const resultado = agregarStackSchema.safeParse(req.body);

  if (!resultado.success) {
    return res.status(400).json({ error: resultado.error.issues[0].message });
  }

  try {
    const developerStack = await agregarStack(
      req.usuario!.usuarioId,
      resultado.data,
    );
    res.status(201).json(developerStack);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al agregar el stack";
    res.status(400).json({ error: mensaje });
  }
}

export async function quitarStackController(req: Request, res: Response) {
  try {
    await quitarStack(req.usuario!.usuarioId, req.params.stackId as string);
    res.status(204).send();
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al quitar el stack";
    res.status(400).json({ error: mensaje });
  }
}

export async function perfilPublico(req: Request, res: Response) {
  try {
    const perfil = await obtenerPerfilPublico(req.params.id as string);
    res.json(perfil);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Perfil de developer no encontrado";
    res.status(404).json({ error: mensaje });
  }
}