import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#features", label: "Funcionalidades" },
  { href: "#proyectos", label: "Casos de éxito" },
  { href: "#testimonios", label: "Testimonios" },
  { href: "#faq", label: "Preguntas frecuentes" },
];

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuAbierto(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 py-3 animate-fade-in-down">
      <div
        className={`max-w-6xl mx-auto flex items-center justify-between gap-4 rounded-2xl px-4 sm:px-5 py-2.5 transition-all duration-300 ${
          scrolled
            ? "navbar-scrolled"
            : "bg-white/30 backdrop-blur-sm border border-white/30 shadow-lg shadow-[#1F2F98]/5"
        }`}
      >
        <Link
          to="/"
          className="flex items-center gap-2.5 text-[#1F2F98] pl-1"
        >
          <img
            src="/logo-bridgely.jpg"
            alt="Bridgely"
            className="w-9 h-9 rounded-xl object-cover"
          />
          <span className="text-lg font-bold tracking-tight hidden sm:inline">
            Bridgely
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="relative text-sm font-medium text-slate-600 hover:text-[#1F2F98] px-3 py-2 rounded-lg transition-colors group"
            >
              {link.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#787FF6] to-[#4ADEDE] rounded-full transition-all duration-300 group-hover:w-3/4" />
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-600 hover:text-[#1F2F98] px-4 py-2.5 rounded-xl transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/registro"
            className="bg-gradient-to-r from-[#787FF6] to-[#6b71e0] hover:from-[#6b71e0] hover:to-[#5a60c9] text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-md shadow-[#787FF6]/25 hover:shadow-lg hover:shadow-[#787FF6]/30 btn-press"
          >
            Crear cuenta
          </Link>
        </div>

        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="lg:hidden w-10 h-10 flex items-center justify-center text-[#1F2F98] rounded-xl hover:bg-[#787FF6]/10 transition-colors"
          aria-label="Abrir menú"
        >
          {menuAbierto ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden max-w-6xl mx-auto overflow-hidden transition-all duration-300 ease-out ${
          menuAbierto ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/90 backdrop-blur-xl border border-white/40 shadow-xl shadow-[#1F2F98]/10 rounded-2xl px-5 py-5">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-sm font-medium text-slate-600 hover:text-[#1F2F98] hover:bg-[#787FF6]/5 px-4 py-3 rounded-xl transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-3 pt-4 mt-4 border-t border-slate-100">
            <Link
              to="/login"
              onClick={() => setMenuAbierto(false)}
              className="text-sm font-medium text-slate-600 hover:text-[#1F2F98] text-center py-3 rounded-xl hover:bg-slate-50 transition-all"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/registro"
              onClick={() => setMenuAbierto(false)}
              className="bg-gradient-to-r from-[#787FF6] to-[#6b71e0] text-white text-sm font-medium px-5 py-3 rounded-xl text-center shadow-md shadow-[#787FF6]/25"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
