import type { ReactNode } from "react";
import { useState, useRef, useEffect } from "react";
import {
  LayoutGrid,
  LogOut,
  Shield,
  User,
  Send,
  UserCircle,
  Users,
  Wallet,
} from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificacionesBell from "./NotificacionesBell";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  roles?: string[];
  ariaLabel?: string;
}

const navItems: NavItem[] = [
  { to: "/admin", label: "Administración", icon: Shield, roles: ["admin"], ariaLabel: "Panel de administración" },
  { to: "/dashboard", label: "Inicio", icon: LayoutGrid, roles: ["cliente", "developer"], ariaLabel: "Panel principal" },
  { to: "/mis-postulaciones", label: "Postulaciones", icon: Send, roles: ["developer"], ariaLabel: "Mis postulaciones" },
  { to: "/perfil-developer", label: "Mi perfil", icon: UserCircle, roles: ["developer"], ariaLabel: "Mi perfil de developer" },
  { to: "/perfil-cliente", label: "Mi perfil", icon: UserCircle, roles: ["cliente"], ariaLabel: "Mi perfil de cliente" },
  { to: "/mis-equipos", label: "Equipos", icon: Users, roles: ["developer"], ariaLabel: "Mis equipos" },
  { to: "/mis-transacciones", label: "Transacciones", icon: Wallet, roles: ["cliente", "developer"], ariaLabel: "Mis transacciones" },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileAbierto, setMobileAbierto] = useState(false);
  const [colapsado, setColapsado] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleMouseEnter() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setColapsado(false);
  }

  function handleMouseLeave() {
    timerRef.current = setTimeout(() => setColapsado(true), 250);
  }

  const filteredItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(usuario?.rol || ""),
  );

  return (
    <div className="min-h-screen bg-[#F0F2FF] flex">
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileAbierto(!mobileAbierto)}
        className="fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all duration-200 lg:hidden active:scale-95"
        aria-label={mobileAbierto ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={mobileAbierto}
      >
        <div className="w-5 h-5 flex flex-col justify-center gap-1.5">
          <span className={`block h-0.5 w-5 bg-slate-600 rounded-full transition-all duration-300 origin-center ${mobileAbierto ? "rotate-45 translate-y-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-slate-600 rounded-full transition-all duration-300 ${mobileAbierto ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-slate-600 rounded-full transition-all duration-300 origin-center ${mobileAbierto ? "-rotate-45 -translate-y-[3px]" : ""}`} />
        </div>
      </button>

      {/* Mobile overlay */}
      {mobileAbierto && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
          onClick={() => setMobileAbierto(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-slate-100 flex flex-col z-40 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-[width] ${
          mobileAbierto
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        } ${colapsado ? "lg:w-[72px]" : "lg:w-64"} w-64 ${
          colapsado ? "" : "shadow-xl shadow-[#787FF6]/[0.03] border-[#787FF6]/10"
        } ${mounted ? "opacity-100" : "opacity-0 -translate-x-4"}`}
        role="navigation"
        aria-label="Menú principal del dashboard"
      >
        {/* Logo */}
        <div className={`flex items-center border-b border-slate-100 transition-all duration-[400ms] ${colapsado ? "lg:justify-center lg:px-0 lg:py-5 px-6 py-5" : "px-5 py-5"}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src="/logo-bridgely.jpg"
              alt="Bridgely"
              className={`w-9 h-9 rounded-xl object-cover shadow-md shadow-[#787FF6]/25 transition-transform duration-500 ease-out ${colapsado ? "" : "scale-110"}`}
            />
            <span
              className={`text-lg font-bold tracking-tight text-[#1F2F98] whitespace-nowrap transition-all duration-[400ms] delay-75 ${
                colapsado ? "lg:w-0 lg:opacity-0 lg:ml-0" : "lg:w-auto lg:opacity-100 lg:ml-0"
              }`}
            >
              Bridgely
            </span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-3 space-y-1" aria-label="Enlaces de navegación">
          {filteredItems.map((item, i) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileAbierto(false)}
                className={`relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-300 ease-out group ${
                  colapsado ? "lg:justify-center lg:px-0 lg:py-3 px-3 py-2.5" : "px-3 py-2.5"
                } ${
                  isActive
                    ? "bg-gradient-to-r from-[#787FF6]/10 to-[#4ADEDE]/5 text-[#1F2F98] shadow-sm shadow-[#787FF6]/10"
                    : "text-slate-500 hover:bg-slate-50 hover:text-[#1F2F98] hover:shadow-sm hover:shadow-slate-100"
                }`}
                style={{
                  transitionDelay: colapsado ? "0ms" : `${i * 25}ms`,
                }}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.ariaLabel || item.label}
                title={colapsado ? item.label : undefined}
              >
                {/* Active indicator */}
                <span
                  className={`absolute left-0 w-[3px] rounded-r-full top-1/2 -translate-y-1/2 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    isActive
                      ? "h-5 bg-gradient-to-b from-[#787FF6] to-[#4ADEDE] opacity-100"
                      : "h-0 bg-transparent opacity-0"
                  }`}
                  aria-hidden="true"
                />

                {/* Icon */}
                <div className={`relative shrink-0 transition-transform duration-300 ease-out ${
                  isActive ? "scale-110" : "group-hover:scale-110"
                }`}>
                  <Icon size={18} aria-hidden="true" />
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-[#787FF6]/15 blur-sm animate-pulse-slow" aria-hidden="true" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`whitespace-nowrap transition-all duration-[400ms] ease-out ${
                    colapsado
                      ? "lg:w-0 lg:opacity-0 lg:ml-0"
                      : "lg:w-auto lg:opacity-100 lg:ml-0"
                  }`}
                  style={{
                    transitionDelay: colapsado ? "0ms" : `${i * 25 + 30}ms`,
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 border-t border-slate-100" />

        {/* User info + Logout */}
        <div className="p-3 space-y-1">
          {/* User role badge */}
          <div
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl overflow-hidden transition-all duration-[400ms] ${
              colapsado ? "lg:justify-center lg:px-0" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1F2F98] to-[#787FF6] flex items-center justify-center shrink-0 shadow-md shadow-[#1F2F98]/20 transition-transform duration-300">
              <User size={14} className="text-white" aria-hidden="true" />
            </div>
            <span
              className={`capitalize text-sm font-semibold text-[#1F2F98] whitespace-nowrap transition-all duration-[400ms] ${
                colapsado ? "lg:w-0 lg:opacity-0 lg:ml-0" : "lg:w-auto lg:opacity-100 lg:ml-0"
              }`}
            >
              {usuario?.rol}
            </span>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all duration-300 text-sm overflow-hidden group ${
              colapsado ? "lg:justify-center lg:px-0" : ""
            }`}
            aria-label="Cerrar sesión"
            title={colapsado ? "Cerrar sesión" : undefined}
          >
            <div className="shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
              <LogOut size={18} aria-hidden="true" />
            </div>
            <span
              className={`whitespace-nowrap transition-all duration-[400ms] ${
                colapsado ? "lg:w-0 lg:opacity-0 lg:ml-0" : "lg:w-auto lg:opacity-100 lg:ml-0"
              }`}
            >
              Cerrar sesión
            </span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-[400ms] ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}>
        {/* Header */}
        <header className="flex items-center justify-between px-6 lg:px-8 py-5 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30">
          <div />
          <NotificacionesBell />
        </header>

        {/* Page content */}
        <div className="flex-1 p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
