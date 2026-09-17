import { prisma } from "../prisma";
import { CrearPostulacionInput } from "./postulacion.schemas";
import { notificarUsuarios } from "../notificaciones/notificaciones.service";
import { enviarEmailPostulacionAceptada } from "../email/email.service";

export async function crearPostulacion(
  usuarioId: string,
  datos: CrearPostulacionInput,
) {
  const perfilDeveloper = await prisma.perfilDeveloper.findUnique({
    where: { usuarioId },
  });

  if (!perfilDeveloper) {
    throw new Error("No se encontró el perfil de developer");
  }

  const idea = await prisma.idea.findUnique({ where: { id: datos.ideaId } });

  if (!idea) {
    throw new Error("La idea no existe");
  }

  if (idea.estado !== "abierta") {
    throw new Error("Esta idea ya no está abierta a postulaciones");
  }

  let developerId: string | null = null;
  let equipoId: string | null = null;

  if (datos.equipoId) {
    const miembro = await prisma.equipoMiembro.findFirst({
      where: {
        equipoId: datos.equipoId,
        developerId: perfilDeveloper.id,
        estado: "aceptado",
      },
    });

    if (!miembro) {
      throw new Error("Debes ser miembro aceptado del equipo para postular con él");
    }

    const miembrosPendientes = await prisma.equipoMiembro.count({
      where: { equipoId: datos.equipoId, estado: { not: "aceptado" } },
    });

    if (miembrosPendientes > 0) {
      throw new Error(
        "Todos los miembros del equipo deben aceptar la invitación antes de postular",
      );
    }

    const yaPostuloEquipo = await prisma.postulacion.findFirst({
      where: { ideaId: datos.ideaId, equipoId: datos.equipoId },
    });

    if (yaPostuloEquipo) {
      throw new Error("Este equipo ya postuló a esta idea");
    }

    equipoId = datos.equipoId;
  } else {
    const yaPostulo = await prisma.postulacion.findFirst({
      where: { ideaId: datos.ideaId, developerId: perfilDeveloper.id },
    });

    if (yaPostulo) {
      throw new Error("Ya postulaste a esta idea");
    }

    developerId = perfilDeveloper.id;
  }

  return prisma.postulacion.create({
    data: {
      ideaId: datos.ideaId,
      developerId,
      equipoId,
      mensaje: datos.mensaje,
      precioPropuesto: datos.precioPropuesto,
    },
  });
}

export async function listarPostulacionesDeIdea(
  ideaId: string,
  usuarioId: string,
) {
  const perfilCliente = await prisma.perfilCliente.findUnique({
    where: { usuarioId },
  });

  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });

  if (!idea || idea.clienteId !== perfilCliente?.id) {
    throw new Error("No tienes permiso para ver estas postulaciones");
  }

  return prisma.postulacion.findMany({
    where: { ideaId },
    orderBy: { fecha: "desc" },
    include: {
      developer: {
        include: {
          usuario: { select: { id: true, nombre: true, email: true } },
        },
      },
      equipo: {
        include: {
          miembros: {
            include: {
              developer: {
                include: {
                  usuario: { select: { id: true, nombre: true, email: true } },
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function listarPostulacionesDeDeveloper(usuarioId: string) {
  const perfilDeveloper = await prisma.perfilDeveloper.findUnique({
    where: { usuarioId },
  });

  if (!perfilDeveloper) {
    throw new Error("No se encontró el perfil de developer");
  }

  const equiposAceptados = await prisma.equipoMiembro.findMany({
    where: { developerId: perfilDeveloper.id, estado: "aceptado" },
    select: { equipoId: true },
  });

  const equipoIds = equiposAceptados.map((m) => m.equipoId);

  const includePostulacion = {
    idea: true,
    equipo: {
      include: {
        miembros: {
          include: {
            developer: {
              include: {
                usuario: { select: { id: true, nombre: true, email: true } },
              },
            },
          },
        },
      },
    },
  };

  const [individuales, deEquipos] = await Promise.all([
    prisma.postulacion.findMany({
      where: { developerId: perfilDeveloper.id },
      include: includePostulacion,
      orderBy: { fecha: "desc" },
    }),
    prisma.postulacion.findMany({
      where: { equipoId: { in: equipoIds } },
      include: includePostulacion,
      orderBy: { fecha: "desc" },
    }),
  ]);

  return [...individuales, ...deEquipos].sort(
    (a, b) => b.fecha.getTime() - a.fecha.getTime(),
  );
}

export async function aceptarPostulacion(
  postulacionId: string,
  usuarioId: string,
) {
  const perfilCliente = await prisma.perfilCliente.findUnique({
    where: { usuarioId },
  });

  const postulacion = await prisma.postulacion.findUnique({
    where: { id: postulacionId },
    include: {
      idea: true,
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

  if (!postulacion || postulacion.idea.clienteId !== perfilCliente?.id) {
    throw new Error("No tienes permiso para aceptar esta postulación");
  }

  const [postulacionActualizada] = await prisma.$transaction([
    prisma.postulacion.update({
      where: { id: postulacionId },
      data: { estado: "aceptada" },
    }),
    prisma.idea.update({
      where: { id: postulacion.ideaId },
      data: { estado: "en_progreso" },
    }),
    prisma.postulacion.updateMany({
      where: {
        ideaId: postulacion.ideaId,
        id: { not: postulacionId },
        estado: "pendiente",
      },
      data: { estado: "rechazada" },
    }),
  ]);

  const destinatarios = postulacion.developerId
    ? [postulacion.developer?.usuario?.id]
    : postulacion.equipo?.miembros.map((m) => m.developer.usuario?.id) ?? [];

  await notificarUsuarios(
    destinatarios.filter(Boolean) as string[],
    "postulacion_aceptada",
    `Tu postulación fue aceptada para "${postulacion.idea.titulo}"`,
  );

  // Send email notifications
  if (postulacion.developerId && postulacion.developer?.usuario) {
    const dev = postulacion.developer.usuario;
    if (dev.email) {
      enviarEmailPostulacionAceptada(
        dev.email,
        dev.nombre,
        postulacion.idea.titulo,
        postulacion.ideaId,
      );
    }
  } else if (postulacion.equipo?.miembros) {
    for (const miembro of postulacion.equipo.miembros) {
      if (miembro.estado === "aceptado" && miembro.developer.usuario?.email) {
        enviarEmailPostulacionAceptada(
          miembro.developer.usuario.email,
          miembro.developer.usuario.nombre,
          postulacion.idea.titulo,
          postulacion.ideaId,
        );
      }
    }
  }

  return postulacionActualizada;
}
