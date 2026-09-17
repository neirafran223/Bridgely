import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Briefcase,
  Code2,
  LoaderCircle,
  ShieldAlert,
  GraduationCap,
  FileText,
  CheckCircle2,
} from "lucide-react";
import AuthLayout from "../components/AuthLoyout";
import BridgeLoader from "../components/common/BridgeLoader";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

type Rol = "cliente" | "developer";

const regexContrasena = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;
const regexTelefono = /^\+?[0-9]{7,15}$/;

const nivelesFortaleza = [
  { etiqueta: "", color: "bg-slate-200", texto: "" },
  { etiqueta: "Muy débil", color: "bg-red-500", texto: "text-red-500" },
  { etiqueta: "Débil", color: "bg-orange-500", texto: "text-orange-500" },
  { etiqueta: "Aceptable", color: "bg-amber-400", texto: "text-amber-500" },
  { etiqueta: "Fuerte", color: "bg-emerald-400", texto: "text-emerald-500" },
  { etiqueta: "Muy fuerte", color: "bg-green-500", texto: "text-green-600" },
];

function calcularFortaleza(password: string) {
  if (!password) return 0;
  let puntos = 0;
  if (password.length >= 8) puntos += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) puntos += 1;
  if (/[0-9]/.test(password)) puntos += 1;
  if (/[^A-Za-z0-9]/.test(password)) puntos += 1;
  if (password.length >= 12) puntos += 1;
  return Math.min(puntos, 5);
}

export default function RegistroPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rol, setRol] = useState<Rol>("cliente");
  const [empresa, setEmpresa] = useState("");
  const [tituloProfesional, setTituloProfesional] = useState("");
  const [bio, setBio] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [verPassword, setVerPassword] = useState(false);
  const [verConfirmPassword, setVerConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const fortaleza = calcularFortaleza(password);
  const nivel = nivelesFortaleza[fortaleza];

  function validarCliente() {
    if (!regexContrasena.test(password)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.",
      );
      return false;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return false;
    }
    if (!regexTelefono.test(telefono.trim())) {
      setError("Ingresa un número de teléfono válido (7 a 15 dígitos).");
      return false;
    }
    if (rol === "cliente" && empresa.trim().length < 2) {
      setError("Ingresa el nombre de tu empresa.");
      return false;
    }
    if (rol === "developer" && tituloProfesional.trim().length < 2) {
      setError("Ingresa tu título profesional.");
      return false;
    }
    if (!aceptaTerminos) {
      setError("Debes aceptar los términos y condiciones.");
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!validarCliente()) return;

    setCargando(true);
    const inicio = Date.now();

    try {
      const { data } = await api.post("/auth/registro", {
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        telefono: telefono.trim(),
        password,
        confirmPassword,
        rol,
        ...(rol === "cliente"
          ? { empresa: empresa.trim() }
          : {
              tituloProfesional: tituloProfesional.trim(),
              bio: bio.trim() || undefined,
            }),
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
      setError(axiosError.response?.data?.error || "Error al registrarse");
    } finally {
      setCargando(false);
    }
  }

  const inputClase =
    "w-full pl-10 pr-3 py-3 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6] transition-shadow";
  const inputClaseConToggle =
    "w-full pl-10 pr-11 py-3 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6] transition-shadow";

  return (
    <>
      {cargando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-md">
          <BridgeLoader texto="Creando tu cuenta..." />
        </div>
      )}

      <AuthLayout
        titulo="Crea tu cuenta"
        subtitulo="Únete a Bridgely y empieza a conectar ideas y talento"
      >
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Quiero ingresar como
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRol("cliente")}
              className={`flex flex-col items-center gap-2 py-3 rounded-xl border-2 transition-all ${
                rol === "cliente"
                  ? "border-[#787FF6] bg-[#787FF6]/5 text-[#1F2F98]"
                  : "border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              <Briefcase size={20} />
              <span className="text-sm font-medium">Cliente</span>
            </button>
            <button
              type="button"
              onClick={() => setRol("developer")}
              className={`flex flex-col items-center gap-2 py-3 rounded-xl border-2 transition-all ${
                rol === "developer"
                  ? "border-[#787FF6] bg-[#787FF6]/5 text-[#1F2F98]"
                  : "border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              <Code2 size={20} />
              <span className="text-sm font-medium">Developer</span>
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nombre completo
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                minLength={2}
                autoComplete="name"
                className={inputClase}
                placeholder="Tu nombre y apellido"
              />
            </div>
          </div>

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
                className={inputClase}
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Teléfono
            </label>
            <div className="relative">
              <Phone
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
                autoComplete="tel"
                className={inputClase}
                placeholder="+56 9 1234 5678"
              />
            </div>
          </div>
        </div>

        {rol === "cliente" ? (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nombre de tu empresa
            </label>
            <div className="relative">
              <Briefcase
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                className={inputClase}
                placeholder="Ej: Mi Empresa SpA"
              />
            </div>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Título profesional
              </label>
              <div className="relative">
                <GraduationCap
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={tituloProfesional}
                  onChange={(e) => setTituloProfesional(e.target.value)}
                  className={inputClase}
                  placeholder="Ej: Ingeniero en Informática"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Sobre ti <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <div className="relative">
                <FileText
                  size={18}
                  className="absolute left-3 top-3 text-slate-400"
                />
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  maxLength={300}
                  className="w-full pl-10 pr-3 py-3 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6] transition-shadow resize-none"
                  placeholder="Cuéntale a los clientes sobre tu experiencia"
                />
              </div>
            </div>
          </>
        )}

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
              autoComplete="new-password"
              className={inputClaseConToggle}
              placeholder="Mínimo 8 caracteres"
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

          {password && (
            <div className="mt-2">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((segmento) => (
                  <div
                    key={segmento}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                      segmento <= fortaleza ? nivel.color : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
              <p className={`text-xs mt-1 font-medium ${nivel.texto}`}>
                {nivel.etiqueta}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Confirmar contraseña
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type={verConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className={inputClaseConToggle}
              placeholder="Repite tu contraseña"
            />
            <button
              type="button"
              onClick={() => setVerConfirmPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1F2F98] transition-colors"
              aria-label={
                verConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {verConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="text-xs text-red-500 mt-1">
              Las contraseñas no coinciden.
            </p>
          )}
        </div>

        <label className="flex items-start gap-2.5 text-sm text-slate-500 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={aceptaTerminos}
            onChange={(e) => setAceptaTerminos(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[#787FF6]"
          />
          <span>
            Acepto los{" "}
            <span className="text-[#1CA7EC] font-medium">términos y condiciones</span>{" "}
            y la <span className="text-[#1CA7EC] font-medium">política de privacidad</span>{" "}
            de Bridgely.
          </span>
        </label>

        {error && (
          <p className="flex items-start gap-2 text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
            <ShieldAlert size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
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
              Creando cuenta...
            </div>
          ) : (
            <>
              <CheckCircle2 size={18} />
              Crear cuenta
            </>
          )}
        </button>
      </form>

      <p className="text-sm text-slate-500 mt-6 text-center">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="text-[#1CA7EC] font-medium hover:underline">
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
    </>
  );
}