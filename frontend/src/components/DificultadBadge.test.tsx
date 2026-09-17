import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DificultadBadge from "../components/DificultadBadge";

describe("DificultadBadge", () => {
  it("should render 'basica' with green styling", () => {
    render(<DificultadBadge dificultad="basica" />);
    const badge = screen.getByText("Básica");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("green");
  });

  it("should render 'intermedia' with amber styling", () => {
    render(<DificultadBadge dificultad="intermedia" />);
    const badge = screen.getByText("Intermedia");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("amber");
  });

  it("should render 'avanzada' with red styling", () => {
    render(<DificultadBadge dificultad="avanzada" />);
    const badge = screen.getByText("Avanzada");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("red");
  });

  it("should return null when no difficulty is provided", () => {
    const { container } = render(<DificultadBadge dificultad={null} />);
    expect(container.firstChild).toBeNull();
  });
});
