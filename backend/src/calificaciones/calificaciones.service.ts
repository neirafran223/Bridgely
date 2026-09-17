import { prisma } from "../prisma";
import { CrearCalificacionInput } from "./calificaciones.schemas";
import { notificarUsuarios } from "../notificaciones/notificaciones.service";
import { enviarEmailCalificacionRecibida } from "../email/email.service";

export async function crearCalificacion(
  usuarioId: string,
  datos: CrearCalificacionInput,
) {
  const perfilCliente = await prisma.perfilCliente.findUnique({
    where: { usuarioId },
    include: { usuario: { select: { nombre: true, email: true } } },
  });

  if (!perfilCliente) {
    throw new Error("No se encontró el perfil de cliente");
  }

  const transaccion = await prisma.transaccion.findUnique({
    where: { id: datos.transaccionId },
    include: {
      idea: { select: { clienteId: true } },
      postulacion: {
        include: {
          developer: {
            include: { usuario: { select: { id: true, nombre: true, email: true } } },
          },
          equipo: {
            include: {
              miembros: {
                include: {
                  developer: {
                    include: { usuario: { select: { id: true, nombre: true, email: true } } },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!transaccion) {
    throw new Error("Transacción no encontrada");
  }

  if (transaccion.idea.clienteId !== perfilCliente.id) {
    throw new Error("No tienes permisos sobre esta transacción");
  }

  if (transaccion.estado !== "liberado") {
    throw new Error(
      "Solo se puede calificar una transacción liberada",
    );
  }

  const postulacion = transaccion.postulacion;

  let participa = false;

  if (postulacion.developerId) {
    participa = postulacion.developer?.usuario?.id === datos.calificadoId;
  } else if (postulacion.equipoId) {
    participa = postulacion.equipo!.miembros.some(
      (m) => m.estado === "aceptado" && m.developer.usuario?.id === datos.calificadoId,
    );
  }

  if (!participa) {
    throw new Error("El developer a calificar no participa en esta postulación");
  }

  const existente = await prisma.calificacion.findFirst({
    where: {
      transaccionId: datos.transaccionId,
      calificadoId: datos.calificadoId,
    },
  });

  if (existente) {
    throw new Error("Ya calificaste a este developer en esta transacción");
  }

  const [calificacion, agregado] = await prisma.$transaction([
    prisma.calificacion.create({
      data: {
        transaccionId: datos.transaccionId,
        calificadorId: perfilCliente.usuarioId,
        calificadoId: datos.calificadoId,
        puntaje: datos.puntaje,
        comentario: datos.comentario,
      },
      include: {
        calificador: { select: { nombre: true } },
        calificado: { select: { nombre: true } },
      },
    }),
    prisma.calificacion.aggregate({
      where: { calificadoId: datos.calificadoId },
      _avg: { puntaje: true },
    }),
  ]);

  await prisma.perfilDeveloper.update({
    where: { usuarioId: datos.calificadoId },
    data: { reputacionPromedio: agregado._avg.puntaje ?? 0 },
  });

  await notificarUsuarios(
    [datos.calificadoId],
    "calificacion_recibida",
    `Recibiste una calificación de ${perfilCliente.usuario.nombre}`,
  );

  // Send email notification
  const calificado = postulacion.developerId
    ? postulacion.developer?.usuario
    : postulacion.equipo?.miembros.find(
        (m) => m.developer.usuario?.id === datos.calificadoId,
      )?.developer.usuario;

  if (calificado?.email) {
    enviarEmailCalificacionRecibida(
      calificado.email,
      calificado.nombre,
      datos.puntaje,
      datos.comentario || "Sin comentario",
      perfilCliente.usuario.nombre,
    );
  }

  return calificacion;
}

export async function obtenerCalificacionesDeDeveloper(
  developerUsuarioId: string,
) {
  const [calificaciones, agregado] = await Promise.all([
    prisma.calificacion.findMany({
      where: { calificadoId: developerUsuarioId },
      orderBy: { fecha: "desc" },
      include: {
        calificador: { select: { nombre: true } },
        transaccion: {
          select: {
            idea: { select: { titulo: true } },
          },
        },
      },
    }),
    prisma.calificacion.aggregate({
      where: { calificadoId: developerUsuarioId },
      _avg: { puntaje: true },
      _count: { _all: true },
    }),
  ]);

  return {
    promedio: Number((agregado._avg.puntaje ?? 0).toFixed(1)),
    total: agregado._count._all,
    calificaciones,
  };
}
