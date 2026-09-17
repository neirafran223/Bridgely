import { Router, Request } from "express";
import { registro, login } from "./auth.controller";
import { requireAuth } from "./auth.middleware";
import { limitarIntentos, obtenerIp } from "./rateLimit";

const router = Router();

router.post(
  "/registro",
  limitarIntentos({
    obtenerClave: (req: Request) => `registro:${obtenerIp(req)}`,
    maximo: 3,
    ventanaMs: 60 * 60 * 1000,
    mensaje:
      "Has superado el límite de intentos de registro. Intenta nuevamente en un momento.",
  }),
  registro,
);
router.post(
  "/login",
  limitarIntentos({
    obtenerClave: (req: Request) =>
      `login:${obtenerIp(req)}:${String(req.body?.email ?? "").toLowerCase().trim()}`,
    maximo: 5,
    ventanaMs: 15 * 60 * 1000,
    mensaje:
      "Demasiados intentos de inicio de sesión. Espera unos minutos antes de volver a intentar.",
  }),
  login,
);
router.get("/perfil", requireAuth, (req, res) => {
  res.json({ usuario: req.usuario });
});

export default router;
