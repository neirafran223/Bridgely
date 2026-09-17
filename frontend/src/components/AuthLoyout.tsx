import type { ReactNode } from "react";
import { ShieldCheck, Users, Wallet } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  titulo: string;
  subtitulo: string;
}

export default function AuthLayout({
  children,
  titulo,
  subtitulo,
}: AuthLayoutProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 lg:p-10 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #BFE6FB 0%, #9FBEF5 45%, #787FF6 100%)",
      }}
    >
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full bg-[#4ADEDE]/20 blur-3xl" />

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-center relative">
        <div className="hidden lg:flex flex-col gap-4 px-6">
          <div className="flex items-center gap-2 text-[#1F2F98] animate-fade-in-up">
            <img src="/logo-bridgely.jpg" alt="Bridgely" className="w-9 h-9 rounded-xl object-cover" />
            <span className="text-lg font-bold tracking-tight">Bridgely</span>
          </div>
          <h1
            className="text-3xl font-bold text-[#1F2F98] leading-tight animate-fade-in-up"
            style={{ animationDelay: "120ms" }}
          >
            Conecta tu idea con quien puede construirla
          </h1>
          <p
            className="text-[#1F2F98]/70 max-w-sm animate-fade-in-up"
            style={{ animationDelay: "240ms" }}
          >
            Clientes con una idea de software y developers listos para hacerla
            realidad, en un mismo lugar.
          </p>

          <ul
            className="mt-6 space-y-3 animate-fade-in-up"
            style={{ animationDelay: "360ms" }}
          >
            <li className="flex items-center gap-3 text-[#1F2F98]/80 text-sm">
              <span className="p-2 rounded-xl bg-white/40">
                <ShieldCheck size={18} />
              </span>
              Pagos protegidos con comisión transparente
            </li>
            <li className="flex items-center gap-3 text-[#1F2F98]/80 text-sm">
              <span className="p-2 rounded-xl bg-white/40">
                <Users size={18} />
              </span>
              Postula solo o arma tu equipo de developers
            </li>
            <li className="flex items-center gap-3 text-[#1F2F98]/80 text-sm">
              <span className="p-2 rounded-xl bg-white/40">
                <Wallet size={18} />
              </span>
              Negocia el presupuesto y paga dentro de la plataforma
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-[#1F2F98]/10 p-8 lg:p-10 w-full max-w-md mx-auto animate-fade-in-up">
          <h2 className="text-2xl font-bold text-[#1F2F98] mb-1">{titulo}</h2>
          <p className="text-slate-400 text-sm mb-8">{subtitulo}</p>
          {children}
        </div>
      </div>
    </div>
  );
}