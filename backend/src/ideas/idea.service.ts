import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import { sugerirDificultad } from "./dificultad.service";
import {
  CrearIdeaInput,
  ActualizarIdeaInput,
  ListarIdeasQuery,
} from "./idea.schemas";

export async function crearIdea(usuarioId: string, datos: CrearIdeaInput) {
  const perfilCliente = await prisma.perfilCliente.findUnique({
    where: { usuarioId },
  });

  if (!perfilCliente) {
    throw new Error("No se encontró el perfil de cliente");
  }

  const dificultadSugerida = sugerirDificultad(
    datos.descripcion,
    datos.presupuestoPropuesto,
    datos.plazoDeseado,
  );

  return prisma.idea.create({
    data: {
      clienteId: perfilCliente.id,
      titulo: datos.titulo,
      descripcion: datos.descripcion,
      categoria: datos.categoria,
      presupuestoPropuesto: datos.presupuestoPropuesto,
      plazoDeseado: datos.plazoDeseado,
      dificultadSugerida,
    },
  });
}

export async function listarIdeas(filtros: ListarIdeasQuery = {}) {
  const pagina = filtros.pagina || 1;
  const limite = filtros.limite || 10;
  const skip = (pagina - 1) * limite;

  const where: Prisma.IdeaWhereInput = {
    estado: "abierta",
    ...(filtros.categoria ? { categoria: filtros.categoria } : {}),
    ...(filtros.dificultad ? { dificultadSugerida: filtros.dificultad } : {}),
    ...(filtros.presupuestoMin !== undefined ||
    filtros.presupuestoMax !== undefined
      ? {
          presupuestoPropuesto: {
            ...(filtros.presupuestoMin !== undefined
              ? { gte: filtros.presupuestoMin }
              : {}),
            ...(filtros.presupuestoMax !== undefined
              ? { lte: filtros.presupuestoMax }
              : {}),
          },
        }
      : {}),
    ...(filtros.busqueda
      ? {
          OR: [
            { titulo: { contains: filtros.busqueda, mode: "insensitive" } },
            { descripcion: { contains: filtros.busqueda, mode: "insensitive" } },
            { categoria: { contains: filtros.busqueda, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [datos, total] = await Promise.all([
    prisma.idea.findMany({
      where,
      orderBy: { fechaCreacion: "desc" },
      skip,
      take: limite,
      include: {
        cliente: {
          include: { usuario: { select: { nombre: true } } },
        },
      },
    }),
    prisma.idea.count({ where }),
  ]);

  return { datos, total, pagina, limite };
}

export async function listarIdeasDeCliente(usuarioId: string) {
  const perfilCliente = await prisma.perfilCliente.findUnique({
    where: { usuarioId },
  });

  if (!perfilCliente) {
    throw new Error("No se encontró el perfil de cliente");
  }

  return prisma.idea.findMany({
    where: { clienteId: perfilCliente.id },
    orderBy: { fechaCreacion: "desc" },
  });
}

export async function obtenerIdeaPorId(id: string) {
  const idea = await prisma.idea.findUnique({
    where: { id },
    include: {
      cliente: {
        include: { usuario: { select: { nombre: true } } },
      },
    },
  });

  if (!idea) {
    throw new Error("Idea no encontrada");
  }

  return idea;
}

export async function actualizarIdea(
  id: string,
  usuarioId: string,
  datos: ActualizarIdeaInput,
) {
  const perfilCliente = await prisma.perfilCliente.findUnique({
    where: { usuarioId },
  });

  const idea = await prisma.idea.findUnique({ where: { id } });

  if (!idea || idea.clienteId !== perfilCliente?.id) {
    throw new Error("No tienes permiso para editar esta idea");
  }

  return prisma.idea.update({
    where: { id },
    data: datos,
  });
}

export async function eliminarIdea(id: string, usuarioId: string) {
  const perfilCliente = await prisma.perfilCliente.findUnique({
    where: { usuarioId },
  });

  const idea = await prisma.idea.findUnique({ where: { id } });

  if (!idea || idea.clienteId !== perfilCliente?.id) {
    throw new Error("No tienes permiso para eliminar esta idea");
  }

  return prisma.idea.delete({ where: { id } });
}
