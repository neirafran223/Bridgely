import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Save, LoaderCircle, User, Mail, Phone, Building2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { ProfileSkeleton } from "../components/common/LoadingSkeletons";
import SubirImagen from "../components/common/SubirImagen";
import { useAuth } from "../context/AuthContext";
import {
  obtenerMiPerfilCliente,
  actualizarMiPerfilCliente,
} from "../services/clientes";
import type { PerfilCliente } from "../services/clientes";

export default function PerfilClientePage() {
  const { usuario } = useAuth();
  const [perfil, setPerfil] = useState<PerfilCliente | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [exito, setExito] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargar() {
      try {
        const data = await obtenerMiPerfilCliente();
        setPerfil(data);
        setNombre(data.nombre);
        setTelefono(data.telefono || "");
        setEmpresa(data.perfilCliente?.empresa || "");
      } catch {
        setError("Error al cargar el perfil");
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  if (usuario?.rol !== "cliente") {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    setExito(false);

    try {
      await actualizarMiPerfilCliente({ nombre, telefono, empresa });
      setExito(true);
      setTimeout(() => setExito(false), 3000);
    } catch {
      setError("Error al guardar los cambios");
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return (
      <DashboardLayout>
        <ProfileSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-[#1F2F98] mb-2">Mi perfil</h1>
      <p className="text-slate-500 text-sm mb-8">
        Gestiona tu información personal
      </p>

      <form
        onSubmit={handleGuardar}
        className="max-w-lg bg-white rounded-2xl border border-slate-200 p-6 space-y-5"
      >
        {/* Profile image */}
        <div className="flex justify-center">
          <SubirImagen
            urlActual={(perfil as any)?.imagenUrl}
            onSubida={() => {}}
            tamaño="lg"
          />
        </div>

        {/* Nombre */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-1.5">
            Nombre
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6] focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Email (read-only) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
            Email
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              type="email"
              value={perfil?.email || ""}
              readOnly
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Teléfono */}
        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-slate-700 mb-1.5">
            Teléfono
          </label>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="telefono"
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="+56 9 1234 5678"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6] focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Empresa */}
        <div>
          <label htmlFor="empresa" className="block text-sm font-medium text-slate-700 mb-1.5">
            Empresa
          </label>
          <div className="relative">
            <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="empresa"
              type="text"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              placeholder="Nombre de tu empresa"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#787FF6] focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Messages */}
        {error && (
          <p className="text-red-500 text-sm" role="alert">{error}</p>
        )}
        {exito && (
          <p className="text-emerald-600 text-sm" role="status">Perfil actualizado correctamente</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={guardando}
          className="w-full flex items-center justify-center gap-2 bg-[#787FF6] hover:bg-[#6b71e0] text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50"
        >
          {guardando ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </DashboardLayout>
  );
}
