import { describe, it, expect } from "vitest";
import { COMISION_PORCENTAJE } from "./config";

describe("config", () => {
  it("should have commission percentage set to 10%", () => {
    expect(COMISION_PORCENTAJE).toBe(0.1);
  });

  it("should calculate commission correctly", () => {
    const monto = 1000000;
    const comision = monto * COMISION_PORCENTAJE;
    expect(comision).toBe(100000);
  });

  it("should calculate commission for small amounts", () => {
    const monto = 500000;
    const comision = monto * COMISION_PORCENTAJE;
    expect(comision).toBe(50000);
  });
});
