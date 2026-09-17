import { z } from "zod";

export const actualizarPerfilClienteSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres").optional(),
  telefono: z.string().optional(),
  empresa: z.string().optional(),
});

export type ActualizarPerfilClienteInput = z.infer<typeof actualizarPerfilClienteSchema>;
