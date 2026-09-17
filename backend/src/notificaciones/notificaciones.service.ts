import { prisma } from "../prisma";
import { getIO } from "../chat/socket";

export async function crearNotificacion(
  usuarioId: string,
  tipo: string,
  contenido: string,
) {
  return prisma.notificacion.create({
    data: { usuarioId, tipo, contenido },
  });
}

export async function notificarUsuarios(
  usuarioIds: string[],
  tipo: string,
  contenido: string,
) {
  const ids = [...new Set(usuarioIds.filter(Boolean))];

  if (ids.length === 0) {
    return;
  }

  await prisma.notificacion.createMany({
    data: ids.map((usuarioId) => ({ usuarioId, tipo, contenido })),
  });

  const io = getIO();

  if (io) {
    for (const usuarioId of ids) {
      io.to(`usuario:${usuarioId}`).emit("notificacion", {
        tipo,
        contenido,
      });
    }
  }
}

export async function listarNotificacionesMias(usuarioId: string) {
  return prisma.notificacion.findMany({
    where: { usuarioId },
    orderBy: { fecha: "desc" },
  });
}

export async function marcarLeida(notificacionId: string, usuarioId: string) {
  const notificacion = await prisma.notificacion.findFirst({
    where: { id: notificacionId, usuarioId },
  });

  if (!notificacion) {
    throw new Error("Notificación no encontrada");
  }

  return prisma.notificacion.update({
    where: { id: notificacionId },
    data: { leido: true },
  });
}

export async function marcarTodasLeidas(usuarioId: string) {
  await prisma.notificacion.updateMany({
    where: { usuarioId, leido: false },
    data: { leido: true },
  });

  return { ok: true };
}