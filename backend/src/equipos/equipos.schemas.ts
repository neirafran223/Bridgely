import { z } from "zod";

export const crearEquipoSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  tipoOrigen: z.enum(["preformado", "armado_en_plataforma"]),
  emailsInvitados: z
    .array(z.string().email("Email inválido"))
    .optional(),
});

export const invitarSchema = z.object({
  email: z.string().email("Email inválido"),
});

export const responderInvitacionSchema = z.object({
  estado: z.enum(["aceptado", "rechazado"]),
});

export type CrearEquipoInput = z.infer<typeof crearEquipoSchema>;
export type InvitarInput = z.infer<typeof invitarSchema>;
export type ResponderInvitacionInput = z.infer<typeof responderInvitacionSchema>;