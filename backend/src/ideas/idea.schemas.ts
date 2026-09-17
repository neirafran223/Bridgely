import { z } from "zod";

export const crearIdeaSchema = z.object({
  titulo: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  descripcion: z
    .string()
    .min(20, "La descripción debe tener al menos 20 caracteres"),
  categoria: z.string().min(2, "Selecciona una categoría"),
  presupuestoPropuesto: z
    .number()
    .positive("El presupuesto debe ser mayor a 0"),
  plazoDeseado: z.string().optional(),
});

export const actualizarIdeaSchema = crearIdeaSchema.partial();

export const listarIdeasQuerySchema = z.object({
  categoria: z.string().optional(),
  dificultad: z.enum(["basica", "intermedia", "avanzada"]).optional(),
  presupuestoMin: z.coerce
    .number()
    .positive("El presupuesto mínimo debe ser mayor a 0")
    .optional(),
  presupuestoMax: z.coerce
    .number()
    .positive("El presupuesto máximo debe ser mayor a 0")
    .optional(),
  busqueda: z.string().optional(),
  pagina: z.coerce.number().int().positive().default(1).optional(),
  limite: z.coerce.number().int().positive().max(50).default(10).optional(),
});

export type CrearIdeaInput = z.infer<typeof crearIdeaSchema>;
export type ActualizarIdeaInput = z.infer<typeof actualizarIdeaSchema>;
export type ListarIdeasQuery = z.infer<typeof listarIdeasQuerySchema>;
