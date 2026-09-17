import { z } from "zod";

export const crearCalificacionSchema = z.object({
  transaccionId: z.string().min(1, "Transacción requerida"),
  calificadoId: z.string().min(1, "Developer requerido"),
  puntaje: z.number().int("El puntaje debe ser un número entero").min(1).max(5),
  comentario: z.string().max(500).optional(),
});

export type CrearCalificacionInput = z.infer<typeof crearCalificacionSchema>;