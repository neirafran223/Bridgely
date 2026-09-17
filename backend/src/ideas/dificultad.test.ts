import { describe, it, expect } from "vitest";
import { sugerirDificultad } from "./dificultad.service";

describe("sugerirDificultad", () => {
  it("should return 'basica' for simple description with low budget", () => {
    const result = sugerirDificultad(
      "Necesito una pagina web basica",
      500000,
    );
    expect(result).toBe("basica");
  });

  it("should return 'intermedia' for medium complexity keywords", () => {
    const result = sugerirDificultad(
      "Necesito una app movil con chat y tiempo real",
      1000000,
    );
    expect(result).toBe("intermedia");
  });

  it("should return 'avanzada' for high complexity keywords", () => {
    const result = sugerirDificultad(
      "Necesito inteligencia artificial con machine learning y pagos",
      1000000,
    );
    expect(result).toBe("avanzada");
  });

  it("should return 'intermedia' for high budget alone", () => {
    const result = sugerirDificultad("Proyecto simple", 6000000);
    expect(result).toBe("intermedia");
  });

  it("should return 'basica' for medium budget alone", () => {
    const result = sugerirDificultad("Proyecto simple", 3000000);
    expect(result).toBe("basica");
  });

  it("should add score for long timeline", () => {
    const result = sugerirDificultad(
      "Proyecto con API e integración",
      1000000,
      "4 meses",
    );
    expect(result).toBe("intermedia");
  });

  it("should handle e-commerce keyword", () => {
    const result = sugerirDificultad(
      "Tienda e-commerce con pasarela de pago",
      1000000,
    );
    expect(result).toBe("avanzada");
  });

  it("should handle microservicios keyword (4pts = intermedia)", () => {
    const result = sugerirDificultad(
      "Arquitectura de microservicios con webhook",
      1000000,
    );
    expect(result).toBe("intermedia");
  });

  it("should handle multiple medium keywords (5pts = avanzada)", () => {
    const result = sugerirDificultad(
      "App móvil con API, integración, chat y tiempo real",
      1000000,
    );
    expect(result).toBe("avanzada");
  });

  it("should handle case insensitive keywords (4pts = intermedia)", () => {
    const result = sugerirDificultad(
      "INTELIGENCIA ARTIFICIAL con Machine Learning",
      1000000,
    );
    expect(result).toBe("intermedia");
  });

  it("should return 'avanzada' with keywords + high budget (6pts)", () => {
    const result = sugerirDificultad(
      "INTELIGENCIA ARTIFICIAL con Machine Learning",
      6000000,
    );
    expect(result).toBe("avanzada");
  });

  it("should return 'avanzada' with keywords + medium budget (5pts)", () => {
    const result = sugerirDificultad(
      "App móvil con API, integración, chat, tiempo real y autenticación",
      3000000,
    );
    expect(result).toBe("avanzada");
  });
});
