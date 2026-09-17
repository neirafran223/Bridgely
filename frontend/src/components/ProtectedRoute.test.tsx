import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import { AuthProvider } from "../context/AuthContext";

const mockToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvSWQiOiIxMjM0NSIsInJvbCI6ImNsaWVudGUiLCJleHAiOjk5OTk5OTk5OTl9.fakeSignature";

function renderWithAuth(
  ui: React.ReactElement,
  { route = "/", token }: { route?: string; token?: string } = {},
) {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.clear();
  }

  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should redirect to login when not authenticated", () => {
    renderWithAuth(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("should render children when authenticated", () => {
    renderWithAuth(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      { token: mockToken },
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("should redirect when role is not permitted", () => {
    renderWithAuth(
      <ProtectedRoute rolesPermitidos={["admin"]}>
        <div>Admin Content</div>
      </ProtectedRoute>,
      { token: mockToken },
    );

    expect(screen.queryByText("Admin Content")).not.toBeInTheDocument();
  });

  it("should render children when role is permitted", () => {
    renderWithAuth(
      <ProtectedRoute rolesPermitidos={["cliente", "developer"]}>
        <div>Client Content</div>
      </ProtectedRoute>,
      { token: mockToken },
    );

    expect(screen.getByText("Client Content")).toBeInTheDocument();
  });
});
