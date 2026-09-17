import { describe, it, expect } from "vitest";
import { registroSchema, loginSchema } from "../auth/schemas";

describe("registroSchema", () => {
  const validClientData = {
    nombre: "Juan Perez",
    email: "juan@test.com",
    telefono: "+56912345678",
    password: "Password1!",
    confirmPassword: "Password1!",
    rol: "cliente" as const,
    empresa: "Mi Empresa",
  };

  const validDeveloperData = {
    nombre: "Maria Garcia",
    email: "maria@test.com",
    telefono: "+56987654321",
    password: "DevPass1!",
    confirmPassword: "DevPass1!",
    rol: "developer" as const,
    tituloProfesional: "Ingeniera en Sistemas",
  };

  it("should validate a valid client registration", () => {
    const result = registroSchema.safeParse(validClientData);
    expect(result.success).toBe(true);
  });

  it("should validate a valid developer registration", () => {
    const result = registroSchema.safeParse(validDeveloperData);
    expect(result.success).toBe(true);
  });

  it("should reject short name", () => {
    const result = registroSchema.safeParse({
      ...validClientData,
      nombre: "A",
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid email", () => {
    const result = registroSchema.safeParse({
      ...validClientData,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("should reject weak password (no uppercase)", () => {
    const result = registroSchema.safeParse({
      ...validClientData,
      password: "password1!",
      confirmPassword: "password1!",
    });
    expect(result.success).toBe(false);
  });

  it("should reject weak password (no symbol)", () => {
    const result = registroSchema.safeParse({
      ...validClientData,
      password: "Password1",
      confirmPassword: "Password1",
    });
    expect(result.success).toBe(false);
  });

  it("should reject mismatched passwords", () => {
    const result = registroSchema.safeParse({
      ...validClientData,
      confirmPassword: "Different1!",
    });
    expect(result.success).toBe(false);
  });

  it("should require empresa for client role", () => {
    const result = registroSchema.safeParse({
      ...validClientData,
      empresa: undefined,
    });
    expect(result.success).toBe(false);
  });

  it("should require tituloProfesional for developer role", () => {
    const result = registroSchema.safeParse({
      ...validDeveloperData,
      tituloProfesional: undefined,
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid phone format", () => {
    const result = registroSchema.safeParse({
      ...validClientData,
      telefono: "abc",
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("should validate valid login data", () => {
    const result = loginSchema.safeParse({
      email: "test@test.com",
      password: "password",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-email",
      password: "password",
    });
    expect(result.success).toBe(false);
  });

  it("should reject empty password", () => {
    const result = loginSchema.safeParse({
      email: "test@test.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});
