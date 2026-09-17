import { Request, Response } from "express";
import {
  crearEquipoSchema,
  invitarSchema,
  responderInvitacionSchema,
} from "./equipos.schemas";
import {
  crearEquipo,
  invitar,
  responderInvitacion,
  misEquipos,
} from "./equipos.service";

export async function crear(req: Request, res: Response) {
  const resultado = crearEquipoSchema.safeParse(req.body);

  if (!resultado.success) {
    return res.status(400).json({ error: resultado.error.issues[0].message });
  }

  try {
    const equipo = await crearEquipo(req.usuario!.usuarioId, resultado.data);
    res.status(201).json(equipo);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al crear el equipo";
    res.status(400).json({ error: mensaje });
  }
}

export async function invitarController(req: Request, res: Response) {
  const resultado = invitarSchema.safeParse(req.body);

  if (!resultado.success) {
    return res.status(400).json({ error: resultado.error.issues[0].message });
  }

  try {
    const miembro = await invitar(
      req.params.id as string,
      req.usuario!.usuarioId,
      resultado.data,
    );
    res.status(201).json(miembro);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al invitar al developer";
    res.status(400).json({ error: mensaje });
  }
}

export async function responder(req: Request, res: Response) {
  const resultado = responderInvitacionSchema.safeParse(req.body);

  if (!resultado.success) {
    return res.status(400).json({ error: resultado.error.issues[0].message });
  }

  try {
    const miembro = await responderInvitacion(
      req.params.id as string,
      req.params.miembroId as string,
      req.usuario!.usuarioId,
      resultado.data.estado,
    );
    res.json(miembro);
  } catch (error) {
    const mensaje =
      error instanceof Error
        ? error.message
        : "Error al responder la invitación";
    res.status(400).json({ error: mensaje });
  }
}

export async function listarMios(req: Request, res: Response) {
  try {
    const equipos = await misEquipos(req.usuario!.usuarioId);
    res.json(equipos);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al listar equipos";
    res.status(400).json({ error: mensaje });
  }
}