import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { crearMensaje, verificarAccesoConversacion } from "./chat.service";

const JWT_SECRET = process.env.JWT_SECRET as string;

let io: Server | null = null;

export function getIO() {
  return io;
}

interface JwtPayload {
  usuarioId: string;
  rol: string;
}

export function configurarSocket(httpServer: HttpServer) {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const server = new Server(httpServer, {
    cors: { origin: frontendUrl, credentials: true },
  });

  io = server;

  server.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Token no proporcionado"));

    try {
      const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
      socket.data.usuario = payload;
      next();
    } catch {
      next(new Error("Token inválido"));
    }
  });

  server.on("connection", (socket) => {
    socket.join(`usuario:${socket.data.usuario.usuarioId}`);

    socket.on("unirse_conversacion", async (conversacionId: string) => {
      try {
        await verificarAccesoConversacion(
          conversacionId,
          socket.data.usuario.usuarioId,
        );
        socket.join(conversacionId);
      } catch {
        socket.emit("error_chat", "No tienes acceso a esta conversación");
      }
    });

    socket.on(
      "enviar_mensaje",
      async (datos: { conversacionId: string; contenido: string }) => {
        try {
          await verificarAccesoConversacion(
            datos.conversacionId,
            socket.data.usuario.usuarioId,
          );
          const mensaje = await crearMensaje(
            datos.conversacionId,
            socket.data.usuario.usuarioId,
            datos.contenido,
          );
          server.to(datos.conversacionId).emit("nuevo_mensaje", mensaje);
        } catch {
          socket.emit("error_chat", "No se pudo enviar el mensaje");
        }
      },
    );
  });

  return server;
}
