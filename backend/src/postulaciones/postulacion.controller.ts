import { Request, Response } from "express";
import { crearPostulacionSchema } from "./postulacion.schemas";
import {
  crearPostulacion,
  listarPostulacionesDeIdea,
  listarPostulacionesDeDeveloper,
  aceptarPostulacion,
} from "./postulacion.service";

export async function crear(req: Request, res: Response) {
  const resultado = crearPostulacionSchema.safeParse(req.body);

  if (!resultado.success) {
    return res.status(400).json({ error: resultado.error.issues[0].message });
  }

  try {
    const postulacion = await crearPostulacion(
      req.usuario!.usuarioId,
      resultado.data,
    );
    res.status(201).json(postulacion);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al crear la postulación";
    res.status(400).json({ error: mensaje });
  }
}

export async function listarPorIdea(req: Request, res: Response) {
  try {
    const postulaciones = await listarPostulacionesDeIdea(
      req.params.ideaId as string,
      req.usuario!.usuarioId,
    );
    res.json(postulaciones);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al listar postulaciones";
    res.status(403).json({ error: mensaje });
  }
}

export async function listarPropias(req: Request, res: Response) {
  const postulaciones = await listarPostulacionesDeDeveloper(
    req.usuario!.usuarioId,
  );
  res.json(postulaciones);
}

export async function aceptar(req: Request, res: Response) {
  try {
    const postulacion = await aceptarPostulacion(
      req.params.id as string,
      req.usuario!.usuarioId,
    );
    res.json(postulacion);
  } catch (error) {
    const mensaje =
      error instanceof Error
        ? error.message
        : "Error al aceptar la postulación";
    res.status(403).json({ error: mensaje });
  }
}
