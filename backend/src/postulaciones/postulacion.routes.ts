import { Router } from "express";
import { requireAuth, requireRol } from "../auth/auth.middleware";
import {
  crear,
  listarPorIdea,
  listarPropias,
  aceptar,
} from "./postulacion.controller";

const router = Router();

router.post("/", requireAuth, requireRol("developer"), crear);
router.get("/propias", requireAuth, requireRol("developer"), listarPropias);
router.get("/idea/:ideaId", requireAuth, requireRol("cliente"), listarPorIdea);
router.patch("/:id/aceptar", requireAuth, requireRol("cliente"), aceptar);

export default router;
