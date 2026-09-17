import { prisma } from "../prisma";
import {
  ActualizarPerfilInput,
  AgregarStackInput,
} from "./developers.schemas";

export async function obtenerPerfilPropio(usuarioId: string) {
  const perfil = await prisma.perfilDeveloper.findUnique({
    where: { usuarioId },
    include: {
      stacks: {
        include: { stack: true },
        orderBy: { stack: { nombre: "asc" } },
      },
      usuario: {
        select: { id: true, nombre: true, email: true, fotoUrl: true },
      },
    },
  });

  if (!perfil) {
    throw new Error("No se encontró tu perfil de developer");
  }

  return perfil;
}

export async function actualizarPerfil(
  usuarioId: string,
  datos: ActualizarPerfilInput,
) {
  const perfil = await prisma.perfilDeveloper.findUnique({
    where: { usuarioId },
  });

  if (!perfil) {
    throw new Error("No se encontró tu perfil de developer");
  }

  return prisma.perfilDeveloper.update({
    where: { usuarioId },
    data: {
      experienciaAnios: datos.experienciaAnios,
      disponibilidad: datos.disponibilidad,
      portafolioUrl: datos.portafolioUrl,
    },
    include: {
      stacks: {
        include: { stack: true },
        orderBy: { stack: { nombre: "asc" } },
      },
    },
  });
}

export async function agregarStack(
  usuarioId: string,
  datos: AgregarStackInput,
) {
  const perfil = await prisma.perfilDeveloper.findUnique({
    where: { usuarioId },
  });

  if (!perfil) {
    throw new Error("No se encontró tu perfil de developer");
  }

  const stack = await prisma.stack.upsert({
    where: { nombre: datos.nombre },
    update: {},
    create: { nombre: datos.nombre },
  });

  return prisma.developerStack.upsert({
    where: {
      developerId_stackId: { developerId: perfil.id, stackId: stack.id },
    },
    update: { tipo: datos.tipo, nivel: datos.nivel },
    create: {
      developerId: perfil.id,
      stackId: stack.id,
      tipo: datos.tipo,
      nivel: datos.nivel,
    },
    include: { stack: true },
  });
}

export async function quitarStack(usuarioId: string, stackId: string) {
  const perfil = await prisma.perfilDeveloper.findUnique({
    where: { usuarioId },
  });

  if (!perfil) {
    throw new Error("No se encontró tu perfil de developer");
  }

  const developerStack = await prisma.developerStack.findFirst({
    where: { developerId: perfil.id, stackId },
  });

  if (!developerStack) {
    throw new Error("No tienes este stack en tu perfil");
  }

  await prisma.developerStack.delete({ where: { id: developerStack.id } });

  return { ok: true };
}

export async function obtenerPerfilPublico(developerPerfilId: string) {
  const perfil = await prisma.perfilDeveloper.findUnique({
    where: { id: developerPerfilId },
    include: {
      stacks: {
        include: { stack: true },
        orderBy: { stack: { nombre: "asc" } },
      },
      usuario: {
        select: { id: true, nombre: true, fotoUrl: true, fechaRegistro: true },
      },
    },
  });

  if (!perfil) {
    throw new Error("Perfil de developer no encontrado");
  }

  return perfil;
}