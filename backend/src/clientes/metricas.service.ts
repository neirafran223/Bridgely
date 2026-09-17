import { prisma } from "../prisma";

export async function obtenerMetricasCliente(usuarioId: string) {
  const perfilCliente = await prisma.perfilCliente.findUnique({
    where: { usuarioId },
  });

  if (!perfilCliente) {
    throw new Error("No se encontró el perfil de cliente");
  }

  const clienteId = perfilCliente.id;

  const [
    totalIdeas,
    ideasAbiertas,
    ideasEnProgreso,
    ideasCerradas,
    totalPostulaciones,
    totalTransacciones,
    montoTotal,
  ] = await Promise.all([
    prisma.idea.count({ where: { clienteId } }),
    prisma.idea.count({ where: { clienteId, estado: "abierta" } }),
    prisma.idea.count({ where: { clienteId, estado: "en_progreso" } }),
    prisma.idea.count({ where: { clienteId, estado: "cerrada" } }),
    prisma.postulacion.count({
      where: { idea: { clienteId } },
    }),
    prisma.transaccion.count({
      where: { idea: { clienteId } },
    }),
    prisma.transaccion.aggregate({
      where: { idea: { clienteId }, estado: { in: ["pagado", "liberado"] } },
      _sum: { montoAcordado: true },
    }),
  ]);

  return {
    ideas: {
      total: totalIdeas,
      abiertas: ideasAbiertas,
      enProgreso: ideasEnProgreso,
      cerradas: ideasCerradas,
    },
    postulaciones: totalPostulaciones,
    transacciones: {
      total: totalTransacciones,
      montoTotal: Number(montoTotal._sum.montoAcordado || 0),
    },
  };
}
