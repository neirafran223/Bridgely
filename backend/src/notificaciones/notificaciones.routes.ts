import { Router } from "express";
import { requireAuth } from "../auth/auth.middleware";
import {
  listarMias,
  marcarLeidaController,
  marcarTodasController,
} from "./notificaciones.controller";

const router = Router();

router.get("/mias", requireAuth, listarMias);
router.patch("/leer-todas", requireAuth, marcarTodasController);
router.patch("/:id/leer", requireAuth, marcarLeidaController);

export default router;