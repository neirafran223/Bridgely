import { Router } from "express";
import { requireAuth, requireRol } from "../auth/auth.middleware";
import {
  perfilPropio,
  actualizar,
  agregarStackController,
  quitarStackController,
  perfilPublico,
} from "./developers.controller";

const router = Router();

router.get("/perfil", requireAuth, requireRol("developer"), perfilPropio);
router.patch("/perfil", requireAuth, requireRol("developer"), actualizar);
router.post(
  "/perfil/stacks",
  requireAuth,
  requireRol("developer"),
  agregarStackController,
);
router.delete(
  "/perfil/stacks/:stackId",
  requireAuth,
  requireRol("developer"),
  quitarStackController,
);
router.get("/:id/publico", requireAuth, perfilPublico);

export default router;