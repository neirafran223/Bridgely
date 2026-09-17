import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { createServer } from "http";
import { prisma } from "./prisma";
import { logger } from "./logger/logger";
import { configurarSwagger } from "./swagger/swagger";
import { inicializarSentry } from "./sentry";
import authRoutes from "./auth/auth.routes";
import ideaRoutes from "./ideas/idea.routes";
import postulacionRoutes from "./postulaciones/postulacion.routes";
import chatRoutes from "./chat/chat.routes";
import developersRoutes from "./developers/developers.routes";
import equiposRoutes from "./equipos/equipos.routes";
import transaccionesRoutes from "./transacciones/transacciones.routes";
import calificacionesRoutes from "./calificaciones/calificaciones.routes";
import notificacionesRoutes from "./notificaciones/notificaciones.routes";
import adminRoutes from "./admin/admin.routes";
import clientesRoutes from "./clientes/clientes.routes";
import uploadRoutes from "./upload/upload.routes";
import { configurarSocket } from "./chat/socket";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 4000;

// Sentry
inicializarSentry(app);

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Global rate limiting
const limiterGlobal = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas solicitudes. Intenta de nuevo en 15 minutos." },
});
app.use(limiterGlobal);

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use("/uploads", express.static("uploads"));

// Swagger docs
configurarSwagger(app);

// Routes
app.use("/auth", authRoutes);
app.use("/ideas", ideaRoutes);
app.use("/postulaciones", postulacionRoutes);
app.use("/chat", chatRoutes);
app.use("/developers", developersRoutes);
app.use("/equipos", equiposRoutes);
app.use("/transacciones", transaccionesRoutes);
app.use("/calificaciones", calificacionesRoutes);
app.use("/notificaciones", notificacionesRoutes);
app.use("/admin", adminRoutes);
app.use("/clientes", clientesRoutes);
app.use("/upload", uploadRoutes);

// Health check
app.get("/health", async (_req, res) => {
  try {
    const usuariosCount = await prisma.usuario.count();
    res.json({ status: "ok", project: "Bridgely API", usuarios: usuariosCount, uptime: process.uptime() });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Database connection failed" });
  }
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error({ err }, "Unhandled error");
  res.status(500).json({ error: "Error interno del servidor" });
});

configurarSocket(httpServer);

httpServer.listen(PORT, () => {
  logger.info({ port: PORT }, "Servidor corriendo");
  logger.info({ url: `http://localhost:${PORT}/api-docs` }, "Swagger docs disponibles");
});
