import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AvisoLegalPage() {
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
        <h1 className="text-3xl font-bold text-[#1F2F98] mb-2">Aviso Legal</h1>
        <p className="text-slate-500 mb-8">
          Información del responsable del tratamiento de datos y titular de la plataforma.
        </p>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 space-y-8">

          {/* Datos del responsable */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">Datos del Responsable</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div>
                  <span className="text-slate-400">Razón social</span>
                  <p className="font-medium text-[#1F2F98]">Bridgely SpA</p>
                </div>
                <div>
                  <span className="text-slate-400">RUT</span>
                  <p className="font-medium text-[#1F2F98]">XX.XXX.XXX-X</p>
                </div>
                <div>
                  <span className="text-slate-400">Giro</span>
                  <p className="font-medium text-[#1F2F98]">Plataforma de conexión de servicios de desarrollo de software</p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-slate-400">Dirección</span>
                  <p className="font-medium text-[#1F2F98]">Santiago, Chile</p>
                </div>
                <div>
                  <span className="text-slate-400">Email general</span>
                  <p className="font-medium text-[#1F2F98]">contacto@bridgely.cl</p>
                </div>
                <div>
                  <span className="text-slate-400">Email legal</span>
                  <p className="font-medium text-[#1F2F98]">legal@bridgely.cl</p>
                </div>
                <div>
                  <span className="text-slate-400">Email privacidad</span>
                  <p className="font-medium text-[#1F2F98]">privacidad@bridgely.cl</p>
                </div>
              </div>
            </div>
          </section>

          {/* Actividad */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">Actividad de la Plataforma</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Bridgely es una plataforma digital que conecta a clientes que buscan desarrollar
              software con developers que ofrecen sus servicios. La plataforma facilita la publicación
              de proyectos, postulaciones, comunicación y procesamiento de pagos entre las partes.
            </p>
          </section>

          {/* Propiedad intelectual */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">Propiedad Intelectual</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Todo el contenido de esta plataforma (código, diseño, textos, logotipos, imágenes)
              es propiedad de Bridgely SpA o de sus licenciantes, y está protegido por las leyes
              de propiedad intelectual de Chile. Queda prohibida su reproducción total o parcial
              sin autorización expresa.
            </p>
          </section>

          {/* Exención de responsabilidad */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">Exención de Responsabilidad</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Bridgely actúa como intermediario entre clientes y developers. No somos parte en los
              acuerdos bilaterales de prestación de servicios, ni garantizamos la calidad, legalidad
              o resultado del trabajo realizado. Cada usuario es responsable de sus acciones dentro
              de la plataforma.
            </p>
          </section>

          {/* Normativa aplicable */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">Normativa Aplicable</h2>
            <ul className="space-y-2 text-slate-600 text-sm leading-relaxed">
              <li>Ley 19.496 - Protección de los Derechos de los Consumidores</li>
              <li>Ley 19.628 - Protección de Datos Personales</li>
              <li>Ley 19.223 - Delitos Informáticos (modificada por Ley 21.458)</li>
              <li>Ley 18.481 - Ley de Impuesto a la Renta (obligaciones tributarias)</li>
              <li>Código Civil y Comercial de Chile</li>
            </ul>
          </section>

          {/* Jurisdicción */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2F98] mb-3">Jurisdicción</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Para cualquier controversia derivada del uso de esta plataforma, las partes se someten
              a la jurisdicción de los tribunales competentes de Santiago de Chile, renunciando a
              cualquier otro fuero que pudiera corresponderles.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
