import { Request, Response } from "express";
import { idParamSchema } from "./admin.schemas";
import {
  listarUsuarios,
  alternarSuspension,
  listarIdeasAdmin,
  eliminarIdeaModeracion,
  estadisticas,
} from "./admin.service";

function codigoError(mensaje: string) {
  if (mensaje.includes("no encontrad")) return 404;
  if (mensaje.includes("propia")) return 403;
  return 400;
}

export async function listarUsuariosController(
  _req: Request,
  res: Response,
) {
  try {
    const usuarios = await listarUsuarios();
    res.json(usuarios);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al listar usuarios";
    res.status(400).json({ error: mensaje });
  }
}

export async function suspenderUsuarioController(req: Request, res: Response) {
  const resultado = idParamSchema.safeParse(req.params);

  if (!resultado.success) {
    return res.status(400).json({ error: resultado.error.issues[0].message });
  }

  try {
    const usuario = await alternarSuspension(
      resultado.data.id,
      req.usuario!.usuarioId,
    );
    res.json(usuario);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al actualizar usuario";
    res.status(codigoError(mensaje)).json({ error: mensaje });
  }
}

export async function listarIdeasController(_req: Request, res: Response) {
  try {
    const ideas = await listarIdeasAdmin();
    res.json(ideas);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al listar ideas";
    res.status(400).json({ error: mensaje });
  }
}

export async function eliminarIdeaController(req: Request, res: Response) {
  const resultado = idParamSchema.safeParse(req.params);

  if (!resultado.success) {
    return res.status(400).json({ error: resultado.error.issues[0].message });
  }

  try {
    await eliminarIdeaModeracion(resultado.data.id);
    res.status(204).send();
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al eliminar la idea";
    res.status(codigoError(mensaje)).json({ error: mensaje });
  }
}

export async function estadisticasController(_req: Request, res: Response) {
  try {
    const datos = await estadisticas();
    res.json(datos);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al obtener estadísticas";
    res.status(400).json({ error: mensaje });
  }
}