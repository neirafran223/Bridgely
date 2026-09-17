import { prisma } from "../prisma";

export async function listarUsuarios() {
  return prisma.usuario.findMany({
    orderBy: { fechaRegistro: "desc" },
    include: {
      perfilCliente: {
        select: {
          empresa: true,
          _count: { select: { ideas: true } },
        },
      },
      perfilDeveloper: {
        select: {
          experienciaAnios: true,
          disponibilidad: true,
          _count: { select: { postulaciones: true } },
        },
      },
    },
  });
}

export async function alternarSuspension(id: string, adminId: string) {
  if (id === adminId) {
    throw new Error("No puedes suspender tu propia cuenta");
  }

  const usuario = await prisma.usuario.findUnique({ where: { id } });

  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }

  return prisma.usuario.update({
    where: { id },
    data: { suspendido: !usuario.suspendido },
  });
}

export async function listarIdeasAdmin() {
  return prisma.idea.findMany({
    orderBy: { fechaCreacion: "desc" },
    include: {
      cliente: {
        include: { usuario: { select: { nombre: true, email: true } } },
      },
      _count: { select: { postulaciones: true } },
    },
  });
}

export async function eliminarIdeaModeracion(id: string) {
  const idea = await prisma.idea.findUnique({ where: { id } });

  if (!idea) {
    throw new Error("Idea no encontrada");
  }

  return prisma.$transaction(async (tx) => {
    await tx.calificacion.deleteMany({
      where: { transaccion: { ideaId: id } },
    });

    const conversaciones = await tx.conversacion.findMany({
      where: { ideaId: id },
      select: { id: true },
    });

    const conversacionIds = conversaciones.map((c) => c.id);

    if (conversacionIds.length > 0) {
      await tx.mensaje.deleteMany({
        where: { conversacionId: { in: conversacionIds } },
      });
      await tx.conversacion.deleteMany({ where: { ideaId: id } });
    }

    await tx.transaccion.deleteMany({ where: { ideaId: id } });

    await tx.postulacion.deleteMany({ where: { ideaId: id } });

    const equipos = await tx.equipo.findMany({
      where: { ideaId: id },
      select: { id: true },
    });

    const equipoIds = equipos.map((e) => e.id);

    if (equipoIds.length > 0) {
      await tx.equipoMiembro.deleteMany({
        where: { equipoId: { in: equipoIds } },
      });
      await tx.equipo.deleteMany({ where: { ideaId: id } });
    }

    await tx.idea.delete({ where: { id } });

    return { ok: true };
  });
}

export async function estadisticas() {
  const [usuariosPorRol, ideasPorEstado, transaccionesPorEstado] =
    await Promise.all([
      prisma.usuario.groupBy({
        by: ["rol"],
        _count: { _all: true },
      }),
      prisma.idea.groupBy({
        by: ["estado"],
        _count: { _all: true },
      }),
      prisma.transaccion.groupBy({
        by: ["estado"],
        _count: { _all: true },
      }),
    ]);

  const totalUsuarios = usuariosPorRol.reduce(
    (acc, item) => acc + item._count._all,
    0,
  );
  const totalIdeas = ideasPorEstado.reduce(
    (acc, item) => acc + item._count._all,
    0,
  );
  const totalTransacciones = transaccionesPorEstado.reduce(
    (acc, item) => acc + item._count._all,
    0,
  );

  return {
    usuariosPorRol: Object.fromEntries(
      usuariosPorRol.map((item) => [item.rol, item._count._all]),
    ),
    ideasPorEstado: Object.fromEntries(
      ideasPorEstado.map((item) => [item.estado, item._count._all]),
    ),
    transaccionesPorEstado: Object.fromEntries(
      transaccionesPorEstado.map((item) => [item.estado, item._count._all]),
    ),
    totalUsuarios,
    totalIdeas,
    totalTransacciones,
  };
}