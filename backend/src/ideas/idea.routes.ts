import { Router } from "express";
import { requireAuth, requireRol } from "../auth/auth.middleware";
import {
  crear,
  listar,
  listarPropias,
  obtener,
  actualizar,
  eliminar,
} from "./idea.controller";

const router = Router();

router.get("/", listar);
router.get("/propias", requireAuth, requireRol("cliente"), listarPropias);
router.get("/:id", obtener);
router.post("/", requireAuth, requireRol("cliente"), crear);
router.patch("/:id", requireAuth, requireRol("cliente"), actualizar);
router.delete("/:id", requireAuth, requireRol("cliente"), eliminar);

export default router;
