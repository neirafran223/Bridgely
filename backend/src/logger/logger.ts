import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDev ? "debug" : "info"),
  transport: isDev
    ? { target: "pino-pretty", options: { colorize: true, translateTime: "HH:MM:ss" } }
    : undefined,
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export function httpLogger() {
  return pino({
    level: "info",
    transport: isDev
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
    formatters: {
      level: (label) => ({ level: label }),
    },
  });
}
