import { Router } from "express";
import { requireAuth, requireRol } from "../auth/auth.middleware";
import {
  crear,
  invitarController,
  responder,
  listarMios,
} from "./equipos.controller";

const router = Router();

router.post("/", requireAuth, requireRol("developer"), crear);
router.post(
  "/:id/invitar",
  requireAuth,
  requireRol("developer"),
  invitarController,
);
router.patch(
  "/:id/miembros/:miembroId/responder",
  requireAuth,
  requireRol("developer"),
  responder,
);
router.get("/mis-equipos", requireAuth, requireRol("developer"), listarMios);

export default router;