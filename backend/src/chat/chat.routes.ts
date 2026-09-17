import { Router } from "express";
import { requireAuth } from "../auth/auth.middleware";
import { obtenerConversacion, listarMensajes } from "./chat.controller";

const router = Router();

router.get("/postulacion/:postulacionId", requireAuth, obtenerConversacion);
router.get("/:conversacionId/mensajes", requireAuth, listarMensajes);

export default router;
