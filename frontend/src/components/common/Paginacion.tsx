import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginacionProps {
  pagina: number;
  totalPaginas: number;
  total: number;
  siguientePagina: () => void;
  paginaAnterior: () => void;
  irAPagina: (p: number) => void;
}

export default function Paginacion({
  pagina,
  totalPaginas,
  total,
  siguientePagina,
  paginaAnterior,
  irAPagina,
}: PaginacionProps) {
  if (totalPaginas <= 1) return null;

  const paginas: (number | "...")[] = [];
  for (let i = 1; i <= totalPaginas; i++) {
    if (i === 1 || i === totalPaginas || (i >= pagina - 1 && i <= pagina + 1)) {
      paginas.push(i);
    } else if (paginas[paginas.length - 1] !== "...") {
      paginas.push("...");
    }
  }

  return (
    <nav
      className="flex items-center justify-between mt-6"
      aria-label="Paginación"
      role="navigation"
    >
      <p className="text-sm text-slate-500" aria-live="polite">
        {total} resultado{total !== 1 ? "s" : ""} · Página {pagina} de {totalPaginas}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={paginaAnterior}
          disabled={pagina <= 1}
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>
        {paginas.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-slate-400 text-sm">...</span>
          ) : (
            <button
              key={p}
              onClick={() => irAPagina(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                p === pagina
                  ? "bg-[#787FF6] text-white shadow-md shadow-[#787FF6]/25"
                  : "border border-slate-200 hover:bg-slate-50 text-slate-600"
              }`}
              aria-label={`Ir a página ${p}`}
              aria-current={p === pagina ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={siguientePagina}
          disabled={pagina >= totalPaginas}
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Página siguiente"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
}
