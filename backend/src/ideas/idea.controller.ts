import { Request, Response } from "express";
import { crearIdeaSchema, actualizarIdeaSchema, listarIdeasQuerySchema } from "./idea.schemas";
import {
  crearIdea,
  listarIdeas,
  listarIdeasDeCliente,
  obtenerIdeaPorId,
  actualizarIdea,
  eliminarIdea,
} from "./idea.service";

export async function crear(req: Request, res: Response) {
  const resultado = crearIdeaSchema.safeParse(req.body);

  if (!resultado.success) {
    return res.status(400).json({ error: resultado.error.issues[0].message });
  }

  try {
    const idea = await crearIdea(req.usuario!.usuarioId, resultado.data);
    res.status(201).json(idea);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al crear la idea";
    res.status(400).json({ error: mensaje });
  }
}

export async function listar(req: Request, res: Response) {
  const resultado = listarIdeasQuerySchema.safeParse(req.query);

  if (!resultado.success) {
    return res.status(400).json({ error: resultado.error.issues[0].message });
  }

  try {
    const resultadoPaginado = await listarIdeas(resultado.data);
    res.json(resultadoPaginado);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al listar ideas";
    res.status(500).json({ error: mensaje });
  }
}

export async function listarPropias(req: Request, res: Response) {
  try {
    const ideas = await listarIdeasDeCliente(req.usuario!.usuarioId);
    res.json(ideas);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al listar ideas";
    res.status(400).json({ error: mensaje });
  }
}

export async function obtener(req: Request, res: Response) {
  try {
    const idea = await obtenerIdeaPorId(req.params.id as string);
    res.json(idea);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Idea no encontrada";
    res.status(404).json({ error: mensaje });
  }
}

export async function actualizar(req: Request, res: Response) {
  const resultado = actualizarIdeaSchema.safeParse(req.body);

  if (!resultado.success) {
    return res.status(400).json({ error: resultado.error.issues[0].message });
  }

  try {
    const idea = await actualizarIdea(
      req.params.id as string,
      req.usuario!.usuarioId,
      resultado.data,
    );
    res.json(idea);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al actualizar la idea";
    res.status(403).json({ error: mensaje });
  }
}

export async function eliminar(req: Request, res: Response) {
  try {
    await eliminarIdea(req.params.id as string, req.usuario!.usuarioId);
    res.status(204).send();
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al eliminar la idea";
    res.status(403).json({ error: mensaje });
  }
}
