import { prisma } from "../prisma";

export async function obtenerOCrearConversacion(postulacionId: string) {
  let conversacion = await prisma.conversacion.findUnique({
    where: { postulacionId },
  });

  if (!conversacion) {
    const postulacion = await prisma.postulacion.findUnique({
      where: { id: postulacionId },
    });

    if (!postulacion || postulacion.estado !== "aceptada") {
      throw new Error("Solo se puede chatear en una postulación aceptada");
    }

    conversacion = await prisma.conversacion.create({
      data: {
        ideaId: postulacion.ideaId,
        postulacionId: postulacion.id,
      },
    });
  }

  return conversacion;
}

export async function obtenerMensajes(conversacionId: string) {
  return prisma.mensaje.findMany({
    where: { conversacionId },
    orderBy: { fechaEnvio: "asc" },
    include: { remitente: { select: { nombre: true } } },
  });
}

export async function crearMensaje(
  conversacionId: string,
  remitenteId: string,
  contenido: string,
) {
  return prisma.mensaje.create({
    data: { conversacionId, remitenteId, contenido },
    include: { remitente: { select: { nombre: true } } },
  });
}

export async function verificarAccesoConversacion(
  conversacionId: string,
  usuarioId: string,
) {
  const conversacion = await prisma.conversacion.findUnique({
    where: { id: conversacionId },
    include: {
      idea: { include: { cliente: true } },
      postulacion: {
        include: {
          developer: true,
          equipo: {
            include: {
              miembros: {
                where: { estado: "aceptado" },
                select: { developer: { select: { usuarioId: true } } },
              },
            },
          },
        },
      },
    },
  });

  if (!conversacion) {
    throw new Error("Conversación no encontrada");
  }

  const esCliente = conversacion.idea.cliente.usuarioId === usuarioId;
  const esDeveloper =
    conversacion.postulacion.developer?.usuarioId === usuarioId;
  const esMiembroEquipo = conversacion.postulacion.equipo?.miembros.some(
    (miembro) => miembro.developer.usuarioId === usuarioId,
  );

  if (!esCliente && !esDeveloper && !esMiembroEquipo) {
    throw new Error("No tienes acceso a esta conversación");
  }

  return conversacion;
}
