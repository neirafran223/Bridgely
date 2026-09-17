-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('cliente', 'developer', 'admin');

-- CreateEnum
CREATE TYPE "Disponibilidad" AS ENUM ('full_time', 'part_time', 'por_horas');

-- CreateEnum
CREATE TYPE "TipoStack" AS ENUM ('preferido', 'experiencia');

-- CreateEnum
CREATE TYPE "NivelStack" AS ENUM ('basico', 'intermedio', 'avanzado');

-- CreateEnum
CREATE TYPE "EstadoIdea" AS ENUM ('abierta', 'en_progreso', 'cerrada');

-- CreateEnum
CREATE TYPE "Dificultad" AS ENUM ('basica', 'intermedia', 'avanzada');

-- CreateEnum
CREATE TYPE "TipoOrigenEquipo" AS ENUM ('preformado', 'armado_en_plataforma');

-- CreateEnum
CREATE TYPE "EstadoMiembro" AS ENUM ('invitado', 'aceptado', 'rechazado');

-- CreateEnum
CREATE TYPE "EstadoPostulacion" AS ENUM ('pendiente', 'aceptada', 'rechazada');

-- CreateEnum
CREATE TYPE "EstadoTransaccion" AS ENUM ('pendiente', 'pagado', 'liberado');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "fotoUrl" TEXT,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerfilCliente" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "empresa" TEXT,

    CONSTRAINT "PerfilCliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerfilDeveloper" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "experienciaAnios" INTEGER,
    "disponibilidad" "Disponibilidad",
    "portafolioUrl" TEXT,
    "reputacionPromedio" DOUBLE PRECISION DEFAULT 0,

    CONSTRAINT "PerfilDeveloper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stack" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Stack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeveloperStack" (
    "id" TEXT NOT NULL,
    "developerId" TEXT NOT NULL,
    "stackId" TEXT NOT NULL,
    "tipo" "TipoStack" NOT NULL,
    "nivel" "NivelStack" NOT NULL,

    CONSTRAINT "DeveloperStack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Idea" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "presupuestoPropuesto" DOUBLE PRECISION NOT NULL,
    "plazoDeseado" TEXT,
    "dificultadSugerida" "Dificultad",
    "estado" "EstadoIdea" NOT NULL DEFAULT 'abierta',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Idea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipo" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT,
    "nombre" TEXT NOT NULL,
    "creadoPorId" TEXT NOT NULL,
    "tipoOrigen" "TipoOrigenEquipo" NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Equipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipoMiembro" (
    "id" TEXT NOT NULL,
    "equipoId" TEXT NOT NULL,
    "developerId" TEXT NOT NULL,
    "estado" "EstadoMiembro" NOT NULL DEFAULT 'invitado',

    CONSTRAINT "EquipoMiembro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Postulacion" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "developerId" TEXT,
    "equipoId" TEXT,
    "mensaje" TEXT NOT NULL,
    "precioPropuesto" DOUBLE PRECISION NOT NULL,
    "estado" "EstadoPostulacion" NOT NULL DEFAULT 'pendiente',
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Postulacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversacion" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "postulacionId" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mensaje" (
    "id" TEXT NOT NULL,
    "conversacionId" TEXT NOT NULL,
    "remitenteId" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "fechaEnvio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leido" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Mensaje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaccion" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "postulacionId" TEXT NOT NULL,
    "montoAcordado" DOUBLE PRECISION NOT NULL,
    "comisionPlataforma" DOUBLE PRECISION NOT NULL,
    "estado" "EstadoTransaccion" NOT NULL DEFAULT 'pendiente',
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calificacion" (
    "id" TEXT NOT NULL,
    "transaccionId" TEXT NOT NULL,
    "calificadorId" TEXT NOT NULL,
    "calificadoId" TEXT NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "comentario" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Calificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notificacion" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notificacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PerfilCliente_usuarioId_key" ON "PerfilCliente"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "PerfilDeveloper_usuarioId_key" ON "PerfilDeveloper"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Stack_nombre_key" ON "Stack"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "DeveloperStack_developerId_stackId_key" ON "DeveloperStack"("developerId", "stackId");

-- CreateIndex
CREATE UNIQUE INDEX "EquipoMiembro_equipoId_developerId_key" ON "EquipoMiembro"("equipoId", "developerId");

-- CreateIndex
CREATE UNIQUE INDEX "Conversacion_postulacionId_key" ON "Conversacion"("postulacionId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaccion_postulacionId_key" ON "Transaccion"("postulacionId");

-- AddForeignKey
ALTER TABLE "PerfilCliente" ADD CONSTRAINT "PerfilCliente_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerfilDeveloper" ADD CONSTRAINT "PerfilDeveloper_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeveloperStack" ADD CONSTRAINT "DeveloperStack_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "PerfilDeveloper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeveloperStack" ADD CONSTRAINT "DeveloperStack_stackId_fkey" FOREIGN KEY ("stackId") REFERENCES "Stack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "PerfilCliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipo" ADD CONSTRAINT "Equipo_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipo" ADD CONSTRAINT "Equipo_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipoMiembro" ADD CONSTRAINT "EquipoMiembro_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipoMiembro" ADD CONSTRAINT "EquipoMiembro_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "PerfilDeveloper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Postulacion" ADD CONSTRAINT "Postulacion_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Postulacion" ADD CONSTRAINT "Postulacion_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "PerfilDeveloper"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Postulacion" ADD CONSTRAINT "Postulacion_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversacion" ADD CONSTRAINT "Conversacion_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversacion" ADD CONSTRAINT "Conversacion_postulacionId_fkey" FOREIGN KEY ("postulacionId") REFERENCES "Postulacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_conversacionId_fkey" FOREIGN KEY ("conversacionId") REFERENCES "Conversacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_remitenteId_fkey" FOREIGN KEY ("remitenteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaccion" ADD CONSTRAINT "Transaccion_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaccion" ADD CONSTRAINT "Transaccion_postulacionId_fkey" FOREIGN KEY ("postulacionId") REFERENCES "Postulacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_transaccionId_fkey" FOREIGN KEY ("transaccionId") REFERENCES "Transaccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_calificadorId_fkey" FOREIGN KEY ("calificadorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_calificadoId_fkey" FOREIGN KEY ("calificadoId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
