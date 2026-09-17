import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import { COMISION_PORCENTAJE } from "../config";
import { notificarUsuarios } from "../notificaciones/notificaciones.service";
import { enviarEmailPagoRecibido, enviarEmailTransaccionLiberada } from "../email/email.service";

export async function crearTransaccionDesdePostulacion(
  postulacionId: string,
  usuarioId: string,
) {
  const perfilCliente = await prisma.perfilCliente.findUnique({
    where: { usuarioId },
  });

  if (!perfilCliente) {
    throw new Error("No se encontró el perfil de cliente");
  }

  const postulacion = await prisma.postulacion.findUnique({
    where: { id: postulacionId },
    include: {
      idea: { select: { clienteId: true, titulo: true } },
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
  });

  if (!postulacion) {
    throw new Error("Postulación no encontrada");
  }

  if (postulacion.idea.clienteId !== perfilCliente.id) {
    throw new Error("No tienes permisos sobre esta postulación");
  }

  if (postulacion.estado !== "aceptada") {
    throw new Error(
      "Solo se puede crear una transacción para una postulación aceptada",
    );
  }

  const existente = await prisma.transaccion.findUnique({
    where: { postulacionId },
  });

  if (existente) {
    throw new Error("Ya existe una transacción para esta postulación");
  }

  const montoAcordado = postulacion.precioPropuesto;
  const comisionPlataforma = montoAcordado * COMISION_PORCENTAJE;

  return prisma.transaccion.create({
    data: {
      ideaId: postulacion.ideaId,
      postulacionId,
      montoAcordado,
      comisionPlataforma,
    },
    include: { idea: { select: { titulo: true } } },
  }).then(async (transaccion) => {
    const destinatarios = postulacion.developerId
      ? [postulacion.developer?.usuario?.id]
      : postulacion.equipo?.miembros.map((m) => m.developer.usuario?.id) ?? [];

    await notificarUsuarios(
      destinatarios.filter(Boolean) as string[],
      "transaccion_creada",
      `Se creó una transacción por $${montoAcordado.toLocaleString(
        "es-CL",
      )} para "${postulacion.idea.titulo}"`,
    );

    return transaccion;
  });
}

export async function marcarTransaccionPagada(
  transaccionId: string,
  usuarioId: string,
) {
  const transaccion = await obtenerTransaccionComoCliente(
    transaccionId,
    usuarioId,
  );

  if (transaccion.estado !== "pendiente") {
    throw new Error(
      "La transacción debe estar pendiente para marcarla como pagada",
    );
  }

  const actualizada = await prisma.transaccion.update({
    where: { id: transaccionId },
    data: { estado: "pagado" },
  });

  await notificarUsuarios(
    destinatariosDeTransaccion(transaccion),
    "pago_realizado",
    `El cliente marcó el pago por "${transaccion.idea.titulo}" como pagado`,
  );

  // Send email notifications to developers
  const devUsuarios = obtenerUsuariosDeveloper(transaccion);
  for (const dev of devUsuarios) {
    if (dev.email) {
      enviarEmailPagoRecibido(
        dev.email,
        dev.nombre,
        transaccion.montoAcordado,
        transaccion.idea.titulo,
      );
    }
  }

  return actualizada;
}

export async function liberarTransaccion(
  transaccionId: string,
  usuarioId: string,
) {
  const transaccion = await obtenerTransaccionComoCliente(
    transaccionId,
    usuarioId,
  );

  if (transaccion.estado !== "pagado") {
    throw new Error(
      "La transacción debe estar pagada para liberar el pago",
    );
  }

  const [transaccionLiberada] = await prisma.$transaction([
    prisma.transaccion.update({
      where: { id: transaccionId },
      data: { estado: "liberado" },
    }),
    prisma.idea.update({
      where: { id: transaccion.ideaId },
      data: { estado: "cerrada" },
    }),
  ]);

  await notificarUsuarios(
    destinatariosDeTransaccion(transaccion),
    "pago_liberado",
    `El pago fue liberado y el proyecto "${transaccion.idea.titulo}" está completado`,
  );

  // Send email notifications to developers
  const devUsuarios = obtenerUsuariosDeveloper(transaccion);
  for (const dev of devUsuarios) {
    if (dev.email) {
      enviarEmailTransaccionLiberada(
        dev.email,
        dev.nombre,
        transaccion.montoAcordado,
        transaccion.idea.titulo,
      );
    }
  }

  return transaccionLiberada;
}

export async function listarTransaccionesMias(usuarioId: string) {
  const [perfilCliente, perfilDeveloper] = await Promise.all([
    prisma.perfilCliente.findUnique({ where: { usuarioId } }),
    prisma.perfilDeveloper.findUnique({ where: { usuarioId } }),
  ]);

  const where: Prisma.TransaccionWhereInput = {
    OR: [
      ...(perfilCliente
        ? [{ idea: { clienteId: perfilCliente.id } }]
        : []),
      ...(perfilDeveloper
        ? [
            { postulacion: { developerId: perfilDeveloper.id } },
            {
              postulacion: {
                equipo: {
                  miembros: { some: { developerId: perfilDeveloper.id } },
                },
              },
            },
          ]
        : []),
    ],
  };

  return prisma.transaccion.findMany({
    where,
    orderBy: { fecha: "desc" },
    include: {
      idea: { select: { id: true, titulo: true, estado: true } },
      postulacion: {
        select: {
          id: true,
          precioPropuesto: true,
          equipo: { select: { nombre: true } },
        },
      },
    },
  });
}

async function obtenerTransaccionComoCliente(
  transaccionId: string,
  usuarioId: string,
) {
  const perfilCliente = await prisma.perfilCliente.findUnique({
    where: { usuarioId },
  });

  if (!perfilCliente) {
    throw new Error("No se encontró el perfil de cliente");
  }

  const transaccion = await prisma.transaccion.findUnique({
    where: { id: transaccionId },
    include: {
      idea: { select: { clienteId: true, titulo: true } },
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

  return transaccion;
}

function destinatariosDeTransaccion(transaccion: {
  postulacion: {
    developerId?: string | null;
    developer?: { usuario?: { id: string } | null } | null;
    equipo?: {
      miembros: { developer: { usuario?: { id: string } | null } }[];
    } | null;
  } | null;
}) {
  const postulacion = transaccion.postulacion;

  if (!postulacion) {
    return [];
  }

  if (postulacion.developerId) {
    return postulacion.developer?.usuario?.id
      ? [postulacion.developer.usuario.id]
      : [];
  }

  return (postulacion.equipo?.miembros ?? [])
    .map((m) => m.developer.usuario?.id)
    .filter(Boolean) as string[];
}

function obtenerUsuariosDeveloper(transaccion: {
  postulacion: {
    developerId?: string | null;
    developer?: { usuario?: { id: string; nombre: string; email: string | null } | null } | null;
    equipo?: {
      miembros: { developer: { usuario?: { id: string; nombre: string; email: string | null } | null } }[];
    } | null;
  } | null;
}): { id: string; nombre: string; email: string | null }[] {
  const postulacion = transaccion.postulacion;
  if (!postulacion) return [];

  if (postulacion.developerId && postulacion.developer?.usuario) {
    return [postulacion.developer.usuario];
  }

  return (postulacion.equipo?.miembros ?? [])
    .map((m) => m.developer.usuario)
    .filter((u): u is { id: string; nombre: string; email: string | null } => u !== null && u !== undefined);
}
