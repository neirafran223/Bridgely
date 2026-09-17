import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TerminosPage() {
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
        <h1 className="text-3xl font-bold text-[#1F2F98] mb-2">Términos y Condiciones</h1>
        <p className="text-slate-500 mb-8">
          Estos términos rigen el uso de la plataforma Bridgely. Al registrarte, aceptas estos términos en su totalidad.
        </p>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 space-y-8">

          {/* 1. Definiciones */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">1. Definiciones</h2>
            <ul className="space-y-2 text-slate-600 text-sm leading-relaxed">
              <li><strong>Plataforma:</strong> Bridgely, sitio web y servicios conectados.</li>
              <li><strong>Usuario:</strong> Toda persona que se registra y utiliza la plataforma.</li>
              <li><strong>Cliente:</strong> Usuario que publica ideas de software y contrata developers.</li>
              <li><strong>Developer:</strong> Usuario que ofrece servicios de desarrollo de software.</li>
              <li><strong>Idea:</strong> Proyecto publicado por un cliente buscando un developer.</li>
              <li><strong>Postulación:</strong> Propuesta enviada por un developer para trabajar en una idea.</li>
              <li><strong>Transacción:</strong> Acuerdo de pago entre cliente y developer mediado por Bridgely.</li>
            </ul>
          </section>

          {/* 2. Registro y cuentas */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">2. Registro y Cuentas</h2>
            <ul className="space-y-2 text-slate-600 text-sm leading-relaxed">
              <li>Debes ser mayor de 18 años para registrarte.</li>
              <li>Los datos proporcionados deben ser veraces y actualizados.</li>
              <li>Es responsabilidad del usuario mantener la confidencialidad de su contraseña.</li>
              <li>Cada persona puede tener una sola cuenta por rol (cliente y/o developer).</li>
              <li>Bridgely se reserva el derecho de suspender cuentas que violen estos términos.</li>
            </ul>
          </section>

          {/* 3. Publicación de ideas */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">3. Publicación de Ideas</h2>
            <ul className="space-y-2 text-slate-600 text-sm leading-relaxed">
              <li>El cliente es responsable del contenido, exactitud y legalidad de sus ideas publicadas.</li>
              <li>Las ideas no deben contener material ilegal, ofensivo o que infrinja derechos de terceros.</li>
              <li>El presupuesto y plazo indicados son estimaciones no vinculantes hasta acuerdo formal.</li>
              <li>Bridgely puede remover ideas que violen estos términos sin previo aviso.</li>
            </ul>
          </section>

          {/* 4. Postulaciones y contratación */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">4. Postulaciones y Contratación</h2>
            <ul className="space-y-2 text-slate-600 text-sm leading-relaxed">
              <li>El developer garantiza que tiene las habilidades descritas en su postulación.</li>
              <li>La aceptación de una postulación genera un acuerdo entre cliente y developer.</li>
              <li>Bridgely no es parte del acuerdo bilateral, solo media en pagos y comunicación.</li>
              <li>Los equipos pueden postular conjuntamente, asumiendo responsabilidad solidaria.</li>
            </ul>
          </section>

          {/* 5. Pagos y comisiones */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">5. Pagos y Comisiones</h2>
            <ul className="space-y-2 text-slate-600 text-sm leading-relaxed">
              <li>Bridgely cobra una comisión del <strong>10%</strong> sobre el monto de cada transacción completada.</li>
              <li>Los fondos quedan en custodia hasta que el cliente confirme la entrega y libere el pago.</li>
              <li>El cliente puede solicitar revisión dentro de los 7 días posteriores a la entrega.</li>
              <li>Los reembolsos se procesan según la política de resolución de disputas.</li>
              <li>Los precios se muestran en la moneda local (CLP) salvo indicación contraria.</li>
            </ul>
          </section>

          {/* 6. Propiedad intelectual */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">6. Propiedad Intelectual</h2>
            <ul className="space-y-2 text-slate-600 text-sm leading-relaxed">
              <li>El código fuente desarrollado pertenece al cliente una vez completado el pago.</li>
              <li>El developer conserva el derecho a mostrar el trabajo en su portafolio personal.</li>
              <li>Las ideas, diseños y conceptos compartidos en la plataforma son propiedad de quien los crea.</li>
              <li>Está prohibido copiar o usar el contenido de otros usuarios sin autorización.</li>
            </ul>
          </section>

          {/* 7. Responsabilidades */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">7. Responsabilidades</h2>
            <ul className="space-y-2 text-slate-600 text-sm leading-relaxed">
              <li>Bridgely actúa como intermediario y no garantiza la calidad del trabajo realizado.</li>
              <li>No nos responsabilizamos por disputas entre clientes y developers.</li>
              <li>La plataforma se ofrece "tal cual" sin garantías de disponibilidad continua.</li>
              <li>El usuario indemniza a Bridgely por cualquier daño derivado del uso indebido.</li>
            </ul>
          </section>

          {/* 8. Resolución de disputas */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">8. Resolución de Disputas</h2>
            <ul className="space-y-2 text-slate-600 text-sm leading-relaxed">
              <li>Primero se debe intentar resolver directamente entre las partes.</li>
              <li>Si no hay acuerdo, Bridgely ofrecerá un proceso de mediación.</li>
              <li>Las disputas no resueltas en 30 días podrán escalarse a arbitraje.</li>
              <li>El arbitraje se realizará en Santiago de Chile bajo las reglas de la CCB.</li>
            </ul>
          </section>

          {/* 9. Terminación */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">9. Terminación</h2>
            <ul className="space-y-2 text-slate-600 text-sm leading-relaxed">
              <li>Puedes eliminar tu cuenta en cualquier momento desde tu perfil.</li>
              <li>Bridgely puede suspender o eliminar cuentas por violación de términos.</li>
              <li>Las transacciones en curso se completarán según lo acordado.</li>
              <li>Los datos se eliminarán según lo establecido en la Política de Privacidad.</li>
            </ul>
          </section>

          {/* 10. Modificaciones */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">10. Modificaciones</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Bridgely se reserva el derecho de modificar estos términos en cualquier momento.
              Los cambios se notificarán por correo electrónico o mediante aviso en la plataforma.
              El uso continuado de la plataforma después de los cambios constituye aceptación de los nuevos términos.
            </p>
          </section>

          {/* 11. Contacto */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">11. Contacto</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Para consultas sobre estos términos, contáctanos en:
            </p>
            <ul className="mt-2 space-y-1 text-slate-600 text-sm">
              <li><strong>Email:</strong> legal@bridgely.cl</li>
              <li><strong>Dirección:</strong> Santiago, Chile</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
