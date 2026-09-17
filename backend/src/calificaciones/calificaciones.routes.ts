import { Router } from "express";
import { requireAuth, requireRol } from "../auth/auth.middleware";
import { crear, listarDeDeveloper } from "./calificaciones.controller";

const router = Router();

router.post("/", requireAuth, requireRol("cliente"), crear);
router.get("/developer/:developerUserId", requireAuth, listarDeDeveloper);

export default router;