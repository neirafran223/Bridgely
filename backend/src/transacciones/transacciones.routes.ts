import { Router } from "express";
import { requireAuth, requireRol } from "../auth/auth.middleware";
import {
  crearDesdePostulacion,
  marcarPagado,
  liberar,
  listarMias,
} from "./transacciones.controller";

const router = Router();

router.post(
  "/desde-postulacion/:postulacionId",
  requireAuth,
  requireRol("cliente"),
  crearDesdePostulacion,
);
router.patch(
  "/:id/marcar-pagado",
  requireAuth,
  requireRol("cliente"),
  marcarPagado,
);
router.patch("/:id/liberar", requireAuth, requireRol("cliente"), liberar);
router.get("/mias", requireAuth, listarMias);

export default router;