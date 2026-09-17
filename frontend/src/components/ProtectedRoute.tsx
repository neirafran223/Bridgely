import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  rolesPermitidos?: string[];
}

export default function ProtectedRoute({
  children,
  rolesPermitidos,
}: ProtectedRouteProps) {
  const { usuario, cargandoAuth } = useAuth();

  if (cargandoAuth) return null;

  if (!usuario) return <Navigate to="/login" replace />;

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    const destino = usuario.rol === "admin" ? "/admin" : "/dashboard";
    return <Navigate to={destino} replace />;
  }

  return <>{children}</>;
}