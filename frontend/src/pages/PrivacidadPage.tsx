import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-[#F0F2FF]">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-[#1F2F98] text-sm transition-colors">
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
          <span className="text-sm text-slate-400">Última actualización: 17 de septiembre de 2026</span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold text-[#1F2F98] mb-2">Política de Privacidad</h1>
        <p className="text-slate-500 mb-8">
          En Bridgely respetamos tu privacidad. Esta política explica cómo recopilamos, usamos y protegemos tus datos personales.
        </p>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 space-y-8">

          {/* 1. Datos que recopilamos */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">1. Datos que Recopilamos</h2>
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <div>
                <h3 className="font-semibold text-[#1F2F98] mb-1">Datos de registro:</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Nombre completo</li>
                  <li>Correo electrónico</li>
                  <li>Número de teléfono</li>
                  <li>Nombre de empresa (solo clientes)</li>
                  <li>Título profesional y experiencia (solo developers)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-[#1F2F98] mb-1">Datos de uso:</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>IP del dispositivo</li>
                  <li>Tipo de navegador y sistema operativo</li>
                  <li>Páginas visitadas y tiempo de permanencia</li>
                  <li>Interacciones con la plataforma</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-[#1F2F98] mb-1">Datos de transacciones:</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Historial de pagos (sin datos de tarjeta, procesados por pasarela externa)</li>
                  <li>Montos y estados de transacciones</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 2. Cómo usamos tus datos */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">2. Cómo Usamos tus Datos</h2>
            <ul className="space-y-2 text-slate-600 text-sm leading-relaxed">
              <li><strong>Prestar el servicio:</strong> Gestionar tu cuenta, conectar clientes con developers, procesar pagos.</li>
              <li><strong>Comunicación:</strong> Enviar notificaciones sobre postulaciones, mensajes y actualizaciones del servicio.</li>
              <li><strong>Mejora del servicio:</strong> Analizar uso estadístico para mejorar la plataforma.</li>
              <li><strong>Seguridad:</strong> Prevenir fraudes, abusos y verificar identidad.</li>
              <li><strong>Obligaciones legales:</strong> Cumplir con normativas tributarias y de protección al consumidor.</li>
            </ul>
          </section>

          {/* 3. Base legal */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">3. Base Legal del Tratamiento</h2>
            <ul className="space-y-2 text-slate-600 text-sm leading-relaxed">
              <li><strong>Consentimiento:</strong> Al registrarte, aceptas el tratamiento de tus datos.</li>
              <li><strong>Ejecución de contrato:</strong> Necesarios para prestar el servicio acordado.</li>
              <li><strong>Interés legítimo:</strong> Para mejorar seguridad y prevenir fraude.</li>
              <li><strong>Obligación legal:</strong> Para cumplir con normativas tributarias y laborales.</li>
            </ul>
          </section>

          {/* 4. Compartición de datos */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">4. Con Quién Compartimos tus Datos</h2>
            <ul className="space-y-2 text-slate-600 text-sm leading-relaxed">
              <li><strong>Otros usuarios:</strong> Tu nombre y perfil son visibles para clientes o developers según tu rol.</li>
              <li><strong>Proveedores de pago:</strong> Para procesar transacciones de forma segura.</li>
              <li><strong>Proveedores de email:</strong> Para enviar notificaciones por correo.</li>
              <li><strong>Autoridades:</strong> Solo cuando lo exija la ley o una orden judicial.</li>
            </ul>
            <p className="mt-2 text-slate-500 text-sm">
              No vendemos ni alquilamos tus datos personales a terceros.
            </p>
          </section>

          {/* 5. Seguridad */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">5. Seguridad de los Datos</h2>
            <ul className="space-y-2 text-slate-600 text-sm leading-relaxed">
              <li>Contraseñas encriptadas con bcrypt.</li>
              <li>Comunicaciones cifradas con HTTPS/TLS.</li>
              <li>Acceso restringido a datos personales según principio de mínimo privilegio.</li>
              <li>Monitoreo continuo de seguridad con Sentry.</li>
              <li>No almacenamos datos de tarjetas de crédito en nuestros servidores.</li>
            </ul>
          </section>

          {/* 6. Retención */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">6. Retención de Datos</h2>
            <ul className="space-y-2 text-slate-600 text-sm leading-relaxed">
              <li><strong>Datos de cuenta:</strong> Se mantienen mientras la cuenta esté activa.</li>
              <li><strong>Datos de transacciones:</strong> 5 años después de la última transacción (obligación tributaria).</li>
              <li><strong>Datos de uso:</strong> 24 meses desde la última actividad.</li>
              <li><strong>Tras eliminación de cuenta:</strong> Los datos se anonimizan o eliminan en 30 días.</li>
            </ul>
          </section>

          {/* 7. Tus derechos */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">7. Tus Derechos</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              Según la Ley 19.628 de Protección de Datos Personales en Chile, tienes derecho a:
            </p>
            <ul className="space-y-2 text-slate-600 text-sm leading-relaxed">
              <li><strong>Acceso:</strong> Solicitar una copia de tus datos personales.</li>
              <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos.</li>
              <li><strong>Eliminación:</strong> Solicitar la eliminación de tus datos personales.</li>
              <li><strong>Oposición:</strong> Oponerte al tratamiento de tus datos para fines específicos.</li>
              <li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado.</li>
            </ul>
            <p className="mt-3 text-slate-500 text-sm">
              Para ejercer estos derechos, contáctanos en <strong>privacidad@bridgely.cl</strong>
            </p>
          </section>

          {/* 8. Cookies */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">8. Cookies</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Bridgely utiliza <strong>localStorage</strong> para almacenar tu token de sesión y preferencias.
              No utilizamos cookies de rastreo ni de terceros. El token de autenticación se almacena
              de forma segura y se elimina al cerrar sesión.
            </p>
          </section>

          {/* 9. Menores de edad */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">9. Menores de Edad</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Bridgely no está dirigido a menores de 18 años. No recopilamos intencionadamente
              datos de menores. Si nos enteramos de que un menor se ha registrado, eliminaremos
              su cuenta y datos de forma inmediata.
            </p>
          </section>

          {/* 10. Cambios */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">10. Cambios en esta Política</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Nos reservamos el derecho de actualizar esta política. Los cambios significativos
              se notificarán por correo electrónico o mediante aviso visible en la plataforma.
              El uso continuado después de los cambios constituye aceptación.
            </p>
          </section>

          {/* 11. Contacto */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">11. Contacto</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Para consultas sobre privacidad o ejercer tus derechos:
            </p>
            <ul className="mt-2 space-y-1 text-slate-600 text-sm">
              <li><strong>Email:</strong> privacidad@bridgely.cl</li>
              <li><strong>Responsable:</strong> Bridgely SpA</li>
              <li><strong>Dirección:</strong> Santiago, Chile</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
