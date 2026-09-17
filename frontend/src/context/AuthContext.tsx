import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface Usuario {
  usuarioId: string;
  rol: "cliente" | "developer" | "admin";
  exp?: number;
}

interface AuthContextType {
  usuario: Usuario | null;
  cargandoAuth: boolean;
  login: (token: string) => void;
  logout: () => void;
  tokenExpirado: boolean;
}

const AuthContext = createContext<AuthContextType>({
  usuario: null,
  cargandoAuth: true,
  login: () => {},
  logout: () => {},
  tokenExpirado: false,
});

function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<Usuario>(token);
    if (!decoded.exp) return false;
    // exp está en segundos, Date.now() en milisegundos
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);
  const [tokenExpirado, setTokenExpirado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      if (isTokenExpired(token)) {
        localStorage.removeItem("token");
        setTokenExpirado(true);
      } else {
        try {
          const payload = jwtDecode<Usuario>(token);
          setUsuario(payload);
        } catch {
          localStorage.removeItem("token");
        }
      }
    }
    setCargandoAuth(false);
  }, []);

  // Verificar expiración cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && isTokenExpired(token)) {
        localStorage.removeItem("token");
        setUsuario(null);
        setTokenExpirado(true);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  function login(token: string) {
    localStorage.setItem("token", token);
    const payload = jwtDecode<Usuario>(token);
    setUsuario(payload);
    setTokenExpirado(false);
  }

  function logout() {
    localStorage.removeItem("token");
    setUsuario(null);
    setTokenExpirado(false);
  }

  return (
    <AuthContext.Provider value={{ usuario, cargandoAuth, login, logout, tokenExpirado }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
