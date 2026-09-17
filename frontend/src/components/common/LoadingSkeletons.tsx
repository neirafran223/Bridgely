import { Skeleton } from "./Skeleton";

// ── Dashboard Metrics Skeleton ──
export function MetricsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8" aria-busy="true" aria-label="Cargando métricas">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 animate-fade-in-up"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Idea Card Skeleton ──
export function IdeaCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 p-5 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
      aria-hidden="true"
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <Skeleton className="h-3 w-16" />
      </div>

      {/* Title */}
      <Skeleton className="h-5 w-3/4 mb-2" />

      {/* Description */}
      <div className="space-y-1.5 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 pt-3 mt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Skeleton className="w-6 h-6 rounded-md" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-8 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ── Dashboard Ideas Grid Skeleton ──
export function DashboardIdeasSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-4" aria-busy="true" aria-label="Cargando ideas">
      {Array.from({ length: 4 }).map((_, i) => (
        <IdeaCardSkeleton key={i} delay={i * 60} />
      ))}
    </div>
  );
}

// ── Idea Detail Skeleton ──
export function IdeaDetailSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in" aria-busy="true" aria-label="Cargando detalle de idea">
      {/* Back button */}
      <Skeleton className="h-10 w-32 rounded-xl" />

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* Title */}
        <Skeleton className="h-8 w-2/3" />

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-24" />
            </div>
          ))}
        </div>
      </div>

      {/* Postulaciones section */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-9 w-24 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Profile Skeleton ──
export function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in" aria-busy="true" aria-label="Cargando perfil">
      {/* Avatar + Name */}
      <div className="flex items-center gap-4">
        <Skeleton className="w-20 h-20 rounded-2xl shrink-0" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Form fields */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        ))}
        <Skeleton className="h-11 w-32 rounded-xl" />
      </div>
    </div>
  );
}

// ── Postulacion Card Skeleton ──
export function PostulacionCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 p-5 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
      aria-hidden="true"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="space-y-1.5 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

// ── Postulaciones List Skeleton ──
export function PostulacionesSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Cargando postulaciones">
      {Array.from({ length: 3 }).map((_, i) => (
        <PostulacionCardSkeleton key={i} delay={i * 60} />
      ))}
    </div>
  );
}

// ── Transaction Card Skeleton ──
export function TransaccionCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 p-5 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

// ── Transactions List Skeleton ──
export function TransaccionesSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Cargando transacciones">
      {Array.from({ length: 3 }).map((_, i) => (
        <TransaccionCardSkeleton key={i} delay={i * 60} />
      ))}
    </div>
  );
}

// ── Team Card Skeleton ──
export function EquipoCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 p-5 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
      aria-hidden="true"
    >
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="space-y-1.5 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-24 rounded-xl" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
    </div>
  );
}

// ── Teams List Skeleton ──
export function EquiposSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Cargando equipos">
      {Array.from({ length: 3 }).map((_, i) => (
        <EquipoCardSkeleton key={i} delay={i * 60} />
      ))}
    </div>
  );
}

// ── Chat Skeleton ──
export function ChatSkeleton() {
  return (
    <div className="flex flex-col h-[calc(100vh-200px)] animate-fade-in" aria-busy="true" aria-label="Cargando chat">
      {/* Chat header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-4 flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-100 p-4 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
          >
            <div className={`space-y-1 ${i % 2 === 0 ? "items-start" : "items-end"} flex flex-col`}>
              <Skeleton className={`h-10 ${i % 2 === 0 ? "w-48" : "w-40"} rounded-2xl`} />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white rounded-2xl border border-slate-100 p-3 mt-4 flex items-center gap-3">
        <Skeleton className="flex-1 h-10 rounded-xl" />
        <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
      </div>
    </div>
  );
}

// ── Admin Dashboard Skeleton ──
export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in" aria-busy="true" aria-label="Cargando panel de administración">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Full Page Loading ──
export function PageLoadingSkeleton() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-label="Cargando página">
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#787FF6] to-[#4ADEDE] flex items-center justify-center animate-pulse-glow">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          {/* Orbiting dots */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: "2s" }}>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#787FF6]" />
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s", animationDirection: "reverse" }}>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#4ADEDE]" />
          </div>
        </div>

        {/* Loading bar */}
        <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#787FF6] to-[#4ADEDE] rounded-full animate-loading-bar" />
        </div>

        <p className="text-sm text-slate-400 font-medium">Cargando...</p>
      </div>
    </div>
  );
}
