import { Request, Response, NextFunction } from "express";

interface Ventana {
  conteo: number;
  desde: number;
}

const almacen = new Map<string, Ventana>();

const SWEEP_INTERVAL_MS = 5 * 60 * 1000;
const MAXIMO_RETENCION_MS = 60 * 60 * 1000;

setInterval(() => {
  const ahora = Date.now();
  for (const [clave, ventana] of almacen) {
    if (ahora - ventana.desde > MAXIMO_RETENCION_MS) {
      almacen.delete(clave);
    }
  }
}, SWEEP_INTERVAL_MS);

export function obtenerIp(req: Request) {
  return req.ip ?? req.socket.remoteAddress ?? "desconocida";
}

export function limitarIntentos(opciones: {
  obtenerClave: (req: Request) => string;
  maximo: number;
  ventanaMs: number;
  mensaje: string;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const clave = opciones.obtenerClave(req);
    const ahora = Date.now();
    const actual = almacen.get(clave);

    if (!actual || ahora - actual.desde > opciones.ventanaMs) {
      almacen.set(clave, { conteo: 1, desde: ahora });
      return next();
    }

    if (actual.conteo >= opciones.maximo) {
      const segundosRestantes = Math.ceil(
        (opciones.ventanaMs - (ahora - actual.desde)) / 1000,
      );
      return res.status(429).json({
        error: opciones.mensaje,
        reintentarEn: segundosRestantes,
      });
    }

    actual.conteo += 1;
    next();
  };
}