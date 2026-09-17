import { z } from "zod";

export const registroSchema = z
  .object({
    nombre: z
      .string()
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().trim().toLowerCase().email("Email inválido"),
    telefono: z
      .string()
      .trim()
      .regex(/^\+?[0-9]{7,15}$/, "Ingresa un teléfono válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "La contraseña debe incluir una mayúscula")
      .regex(/[a-z]/, "La contraseña debe incluir una minúscula")
      .regex(/[0-9]/, "La contraseña debe incluir un número")
      .regex(
        /[^A-Za-z0-9]/,
        "La contraseña debe incluir al menos un símbolo",
      ),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
    rol: z.enum(["cliente", "developer"]),
    empresa: z.string().trim().optional(),
    tituloProfesional: z.string().trim().optional(),
    bio: z.string().trim().optional(),
  })
  .refine((datos) => datos.password === datos.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
  .superRefine((datos, ctx) => {
    if (datos.rol === "cliente" && !datos.empresa) {
      ctx.addIssue({
        code: "custom",
        path: ["empresa"],
        message: "Ingresa el nombre de tu empresa",
      });
    }

    if (datos.rol === "developer" && !datos.tituloProfesional) {
      ctx.addIssue({
        code: "custom",
        path: ["tituloProfesional"],
        message: "Ingresa tu título profesional",
      });
    }
  });

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export type RegistroInput = z.infer<typeof registroSchema>;
export type LoginInput = z.infer<typeof loginSchema>;