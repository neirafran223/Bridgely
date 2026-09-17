import { z } from "zod";

export const crearPostulacionSchema = z.object({
  ideaId: z.string().uuid("ID de idea inválido"),
  mensaje: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
  precioPropuesto: z.number().positive("El precio debe ser mayor a 0"),
  equipoId: z.string().uuid("ID de equipo inválido").optional(),
});

export type CrearPostulacionInput = z.infer<typeof crearPostulacionSchema>;
