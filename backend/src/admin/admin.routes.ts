import { Router } from "express";
import { requireAuth, requireRol } from "../auth/auth.middleware";
import {
  listarUsuariosController,
  suspenderUsuarioController,
  listarIdeasController,
  eliminarIdeaController,
  estadisticasController,
} from "./admin.controller";

const router = Router();

router.use(requireAuth, requireRol("admin"));

router.get("/usuarios", listarUsuariosController);
router.patch("/usuarios/:id/suspender", suspenderUsuarioController);
router.get("/ideas", listarIdeasController);
router.delete("/ideas/:id", eliminarIdeaController);
router.get("/estadisticas", estadisticasController);

export default router;