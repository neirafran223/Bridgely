import { prisma } from "../prisma";

export async function obtenerPerfilCliente(usuarioId: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    select: {
      id: true,
      nombre: true,
      email: true,
      telefono: true,
      rol: true,
      perfilCliente: {
        select: {
          empresa: true,
        },
      },
    },
  });

  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }

  return usuario;
}

export async function actualizarPerfilCliente(
  usuarioId: string,
  datos: { nombre?: string; telefono?: string; empresa?: string },
) {
  const updates: Record<string, unknown> = {};

  if (datos.nombre !== undefined) updates.nombre = datos.nombre;
  if (datos.telefono !== undefined) updates.telefono = datos.telefono;

  const [usuario] = await prisma.$transaction([
    prisma.usuario.update({
      where: { id: usuarioId },
      data: updates,
    }),
    ...(datos.empresa !== undefined
      ? [
          prisma.perfilCliente.update({
            where: { usuarioId },
            data: { empresa: datos.empresa },
          }),
        ]
      : []),
  ]);

  return usuario;
}
