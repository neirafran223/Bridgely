import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function conectarSocket(): Socket {
  if (socket?.connected) return socket;

  // Si existe pero no está conectado, reconectar
  if (socket) {
    socket.connect();
    return socket;
  }

  const token = localStorage.getItem("token");

  socket = io("/", {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    autoConnect: true,
  });

  socket.on("connect_error", () => {
  });

  socket.on("reconnect", () => {
  });

  return socket;
}

export function desconectarSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}

export function esperarConexion(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (socket?.connected) {
      resolve();
      return;
    }

    const socketInstance = conectarSocket();

    const onConnect = () => {
      cleanup();
      resolve();
    };

    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };

    const cleanup = () => {
      socketInstance.off("connect", onConnect);
      socketInstance.off("connect_error", onError);
    };

    socketInstance.on("connect", onConnect);
    socketInstance.on("connect_error", onError);

    // Timeout después de 5 segundos
    setTimeout(() => {
      cleanup();
      reject(new Error("Timeout de conexión Socket.IO"));
    }, 5000);
  });
}
