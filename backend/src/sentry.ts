import * as Sentry from "@sentry/node";
import express from "express";
import { logger } from "./logger/logger";

export function inicializarSentry(app: express.Express) {
  const dsn = process.env.SENTRY_DSN;

  if (!dsn) {
    logger.info("[Sentry] DSN no configurado, omitiendo inicialización");
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,
  });

  logger.info("[Sentry] Inicializado correctamente");
}

export { Sentry };
