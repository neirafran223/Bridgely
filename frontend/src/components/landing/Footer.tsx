export default function Footer() {
  return (
    <footer className="relative">
      {/* Gradient transition */}
      <div className="h-20 bg-gradient-to-b from-transparent to-[#1F2F98]" />

      <div className="bg-[#1F2F98] text-white/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 text-white mb-4">
              <img src="/logo-bridgely.jpg" alt="Bridgely" className="w-9 h-9 rounded-xl object-cover" />
              <span className="text-lg font-bold tracking-tight">Bridgely</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">
              Conectando ideas de software con los developers que pueden
              construirlas.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium text-sm mb-4">Plataforma</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="#como-funciona"
                  className="hover:text-white transition-colors"
                >
                  Cómo funciona
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-white transition-colors"
                >
                  Funcionalidades
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Preguntas frecuentes
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium text-sm mb-4">Cuenta</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/login" className="hover:text-white transition-colors">
                  Iniciar sesión
                </a>
              </li>
              <li>
                <a href="/registro" className="hover:text-white transition-colors">
                  Crear cuenta
                </a>
              </li>
              <li>
                <a
                  href="#proyectos"
                  className="hover:text-white transition-colors"
                >
                  Casos de éxito
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium text-sm mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/terminos" className="hover:text-white transition-colors">
                  Términos y condiciones
                </a>
              </li>
              <li>
                <a href="/privacidad" className="hover:text-white transition-colors">
                  Política de privacidad
                </a>
              </li>
              <li>
                <a href="/aviso-legal" className="hover:text-white transition-colors">
                  Aviso legal
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-5 text-center text-xs text-white/40 px-4">
          © {new Date().getFullYear()} Bridgely. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
