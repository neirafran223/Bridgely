import { describe, it, expect, beforeEach } from "vitest";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";

const mockToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvSWQiOiIxMjM0NSIsInJvbCI6ImNsaWVudGUiLCJleHAiOjk5OTk5OTk5OTl9.fakeSignature";

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should start with no user and loading", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.usuario).toBeNull();
    expect(result.current.cargandoAuth).toBe(true);
  });

  it("should login and set user from token", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      result.current.login(mockToken);
    });

    expect(result.current.usuario).toBeDefined();
    expect(result.current.usuario?.usuarioId).toBe("12345");
    expect(result.current.usuario?.rol).toBe("cliente");
    expect(localStorage.getItem("token")).toBe(mockToken);
  });

  it("should logout and clear user", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      result.current.login(mockToken);
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.usuario).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("should restore user from localStorage on mount", () => {
    localStorage.setItem("token", mockToken);

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.usuario).toBeDefined();
    expect(result.current.usuario?.usuarioId).toBe("12345");
  });

  it("should clear invalid token on mount", () => {
    localStorage.setItem("token", "invalid-token");

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.usuario).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });
});
