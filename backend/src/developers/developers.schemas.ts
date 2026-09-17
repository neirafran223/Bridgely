import { z } from "zod";

export const actualizarPerfilSchema = z.object({
  experienciaAnios: z
    .number()
    .int("Los años de experiencia deben ser un número entero")
    .min(0, "Los años de experiencia no pueden ser negativos")
    .max(70, "Los años de experiencia no pueden superar 70")
    .nullable()
    .optional(),
  disponibilidad: z
    .enum(["full_time", "part_time", "por_horas"])
    .nullable()
    .optional(),
  portafolioUrl: z
    .string()
    .url("El portafolio debe ser una URL válida")
    .nullable()
    .optional(),
});

export const agregarStackSchema = z.object({
  nombre: z.string().min(1, "El nombre del stack es requerido"),
  tipo: z.enum(["preferido", "experiencia"]),
  nivel: z.enum(["basico", "intermedio", "avanzado"]),
});

export type ActualizarPerfilInput = z.infer<typeof actualizarPerfilSchema>;
export type AgregarStackInput = z.infer<typeof agregarStackSchema>;