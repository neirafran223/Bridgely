import { prisma } from "../prisma";
import {
  CrearEquipoInput,
  InvitarInput,
  ResponderInvitacionInput,
} from "./equipos.schemas";
import { notificarUsuarios } from "../notificaciones/notificaciones.service";
import { enviarEmailInvitacionEquipo } from "../email/email.service";

const includeMiembros = {
  miembros: {
    include: {
      developer: {
        include: {
          usuario: { select: { id: true, nombre: true, email: true } },
        },
      },
    },
  },
};

export async function crearEquipo(usuarioId: string, datos: CrearEquipoInput) {
  const perfil = await prisma.perfilDeveloper.findUnique({
    where: { usuarioId },
    include: { usuario: { select: { nombre: true } } },
  });

  if (!perfil) {
    throw new Error("No se encontró tu perfil de developer");
  }

  return prisma.$transaction(async (tx) => {
    const equipo = await tx.equipo.create({
      data: {
        nombre: datos.nombre,
        creadoPorId: usuarioId,
        tipoOrigen: datos.tipoOrigen,
      },
    });

    await tx.equipoMiembro.create({
      data: {
        equipoId: equipo.id,
        developerId: perfil.id,
        estado: "aceptado",
      },
    });

    if (datos.tipoOrigen === "preformado" && datos.emailsInvitados?.length) {
      for (const email of datos.emailsInvitados) {
        const usuario = await tx.usuario.findUnique({ where: { email } });
        if (!usuario || usuario.rol !== "developer") continue;

        const developer = await tx.perfilDeveloper.findUnique({
          where: { usuarioId: usuario.id },
        });
        if (!developer || developer.id === perfil.id) continue;

        const yaExiste = await tx.equipoMiembro.findFirst({
          where: { equipoId: equipo.id, developerId: developer.id },
        });
        if (yaExiste) continue;

        await tx.equipoMiembro.create({
          data: {
            equipoId: equipo.id,
            developerId: developer.id,
            estado: "invitado",
          },
        });

        await notificarUsuarios(
          [usuario.id],
          "invitacion_equipo",
          `Te invitaron al equipo "${equipo.nombre}"`,
        );

        // Send email notification
        enviarEmailInvitacionEquipo(
          email,
          usuario.nombre,
          equipo.nombre,
          perfil.usuario.nombre,
        );
      }
    }

    return tx.equipo.findUniqueOrThrow({
      where: { id: equipo.id },
      include: includeMiembros,
    });
  });
}

export async function invitar(
  equipoId: string,
  creadorUsuarioId: string,
  datos: InvitarInput,
) {
  const equipo = await prisma.equipo.findUnique({ where: { id: equipoId } });

  if (!equipo) {
    throw new Error("Equipo no encontrado");
  }

  if (equipo.creadoPorId !== creadorUsuarioId) {
    throw new Error("Solo el creador puede invitar miembros");
  }

  const usuario = await prisma.usuario.findUnique({
    where: { email: datos.email },
  });

  if (!usuario || usuario.rol !== "developer") {
    throw new Error("No existe un developer con ese email");
  }

  const developer = await prisma.perfilDeveloper.findUnique({
    where: { usuarioId: usuario.id },
  });

  if (!developer) {
    throw new Error("No existe un developer con ese email");
  }

  if (developer.usuarioId === creadorUsuarioId) {
    throw new Error("No puedes invitarte a ti mismo");
  }

  const yaExiste = await prisma.equipoMiembro.findFirst({
    where: { equipoId, developerId: developer.id },
  });

  if (yaExiste) {
    if (yaExiste.estado === "rechazado") {
      const miembro = await prisma.equipoMiembro.update({
        where: { id: yaExiste.id },
        data: { estado: "invitado" },
        include: {
          developer: {
            include: {
              usuario: { select: { id: true, nombre: true, email: true } },
            },
          },
        },
      });

      await notificarUsuarios(
        [usuario.id],
        "invitacion_equipo",
        `Te invitaron al equipo "${equipo.nombre}"`,
      );

      // Send email notification
      const creador = await prisma.usuario.findUnique({
        where: { id: creadorUsuarioId },
        select: { nombre: true },
      });
      if (creador) {
        enviarEmailInvitacionEquipo(
          usuario.email,
          usuario.nombre,
          equipo.nombre,
          creador.nombre,
        );
      }

      return miembro;
    }

    throw new Error("Este developer ya pertenece al equipo o ya fue invitado");
  }

  const miembro = await prisma.equipoMiembro.create({
    data: { equipoId, developerId: developer.id, estado: "invitado" },
    include: {
      developer: {
        include: {
          usuario: { select: { id: true, nombre: true, email: true } },
        },
      },
    },
  });

  await notificarUsuarios(
    [usuario.id],
    "invitacion_equipo",
    `Te invitaron al equipo "${equipo.nombre}"`,
  );

  // Send email notification
  const creador = await prisma.usuario.findUnique({
    where: { id: creadorUsuarioId },
    select: { nombre: true },
  });
  if (creador) {
    enviarEmailInvitacionEquipo(
      usuario.email,
      usuario.nombre,
      equipo.nombre,
      creador.nombre,
    );
  }

  return miembro;
}

export async function responderInvitacion(
  equipoId: string,
  miembroId: string,
  usuarioId: string,
  estado: ResponderInvitacionInput["estado"],
) {
  const perfil = await prisma.perfilDeveloper.findUnique({
    where: { usuarioId },
  });

  if (!perfil) {
    throw new Error("No se encontró tu perfil de developer");
  }

  const [equipo, usuario] = await Promise.all([
    prisma.equipo.findUnique({ where: { id: equipoId } }),
    prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { nombre: true },
    }),
  ]);

  const miembro = await prisma.equipoMiembro.findFirst({
    where: { id: miembroId, equipoId, developerId: perfil.id },
  });

  if (!miembro) {
    throw new Error("Invitación no encontrada");
  }

  if (miembro.estado !== "invitado") {
    throw new Error("Esta invitación ya fue respondida");
  }

  const miembroActualizado = await prisma.equipoMiembro.update({
    where: { id: miembro.id },
    data: { estado },
  });

  if (equipo && usuario) {
    await notificarUsuarios(
      [equipo.creadoPorId],
      "respuesta_invitacion",
      `${usuario.nombre} ${
        estado === "aceptado"
          ? "aceptó"
          : "rechazó"
      } tu invitación al equipo "${equipo.nombre}"`,
    );
  }

  return miembroActualizado;
}

export async function misEquipos(usuarioId: string) {
  const perfil = await prisma.perfilDeveloper.findUnique({
    where: { usuarioId },
  });

  if (!perfil) {
    throw new Error("No se encontró tu perfil de developer");
  }

  const [comoCreador, comoMiembro] = await Promise.all([
    prisma.equipo.findMany({
      where: { creadoPorId: usuarioId },
      include: includeMiembros,
      orderBy: { fechaCreacion: "desc" },
    }),
    prisma.equipo.findMany({
      where: {
        miembros: { some: { developerId: perfil.id } },
        NOT: { creadoPorId: usuarioId },
      },
      include: includeMiembros,
      orderBy: { fechaCreacion: "desc" },
    }),
  ]);

  return [...comoCreador, ...comoMiembro];
}
