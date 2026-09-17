import { Router } from "express";
import { requireAuth, requireRol } from "../auth/auth.middleware";
import {
  obtenerMiPerfil,
  actualizarMiPerfil,
} from "./clientes.controller";
import { obtenerMetricas } from "./metricas.controller";

const router = Router();

router.get("/perfil", requireAuth, requireRol("cliente"), obtenerMiPerfil);
router.patch("/perfil", requireAuth, requireRol("cliente"), actualizarMiPerfil);
router.get("/metricas", requireAuth, requireRol("cliente"), obtenerMetricas);

export default router;
