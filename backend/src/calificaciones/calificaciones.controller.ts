import { Request, Response } from "express";
import { crearCalificacionSchema } from "./calificaciones.schemas";
import { crearCalificacion, obtenerCalificacionesDeDeveloper } from "./calificaciones.service";

export async function crear(req: Request, res: Response) {
  const resultado = crearCalificacionSchema.safeParse(req.body);

  if (!resultado.success) {
    return res.status(400).json({ error: resultado.error.issues[0].message });
  }

  try {
    const calificacion = await crearCalificacion(
      req.usuario!.usuarioId,
      resultado.data,
    );
    res.status(201).json(calificacion);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al crear la calificación";
    res.status(400).json({ error: mensaje });
  }
}

export async function listarDeDeveloper(req: Request, res: Response) {
  try {
    const datos = await obtenerCalificacionesDeDeveloper(
      req.params.developerUserId as string,
    );
    res.json(datos);
  } catch (error) {
    const mensaje =
      error instanceof Error
        ? error.message
        : "Error al obtener las calificaciones";
    res.status(400).json({ error: mensaje });
  }
}