import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { Mail, Lock, Eye, EyeOff, LoaderCircle, ShieldAlert } from "lucide-react";
import AuthLayout from "../components/AuthLoyout";
import BridgeLoader from "../components/common/BridgeLoader";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState("");
  const [reintentarEn, setReintentarEn] = useState<number | null>(null);
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);

    const inicio = Date.now();

    try {
      const { data } = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      const elapsed = Date.now() - inicio;
      const minDelay = 2200;
      if (elapsed < minDelay) {
        await new Promise((r) => setTimeout(r, minDelay - elapsed));
      }

      login(data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const elapsed = Date.now() - inicio;
      const minDelay = 1500;
      if (elapsed < minDelay) {
        await new Promise((r) => setTimeout(r, minDelay - elapsed));
      }

      const axiosError = err as AxiosError<{ error: string; reintentarEn?: number }>;
      setError(axiosError.response?.data?.error || "Error al iniciar sesión");
      setReintentarEn(axiosError.response?.data?.reintentarEn ?? null);
    } finally {
      setCargando(false);
    }
  }

  return (
    <>
      {cargando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-md">
          <BridgeLoader texto="Iniciando sesión..." />
        </div>
      )}

      <AuthLayout
        titulo="Inicia sesión"
        subtitulo="Ingresa tus datos para continuar en Bridgely"
      >
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full pl-10 pr-3 py-3 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6] transition-shadow"
              placeholder="tu@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Contraseña
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type={verPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full pl-10 pr-11 py-3 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6] transition-shadow"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setVerPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1F2F98] transition-colors"
              aria-label={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {verPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <p className="flex items-start gap-2 text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
            <ShieldAlert size={16} className="mt-0.5 shrink-0" />
            <span>
              {error}
              {reintentarEn !== null &&
                ` Puedes volver a intentar en ${reintentarEn} segundos.`}
            </span>
          </p>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-[#787FF6] hover:bg-[#6b71e0] text-white font-medium py-3 rounded-xl transition-colors btn-press flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {cargando ? (
            <div className="flex items-center gap-2">
              <LoaderCircle size={18} className="animate-spin" />
              Conectando...
            </div>
          ) : (
            "Iniciar sesión"
          )}
        </button>
      </form>

      <p className="text-sm text-slate-500 mt-6 text-center">
        ¿No tienes cuenta?{" "}
        <Link to="/registro" className="text-[#1CA7EC] font-medium hover:underline">
          Regístrate
        </Link>
      </p>
    </AuthLayout>
    </>
  );
}