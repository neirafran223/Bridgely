import { Search, X } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import { useState, useEffect } from "react";

interface BuscadorProps {
  valorInicial?: string;
  placeholder?: string;
  alBuscar: (termino: string) => void;
  debounceMs?: number;
}

export default function Buscador({
  valorInicial = "",
  placeholder = "Buscar...",
  alBuscar,
  debounceMs = 300,
}: BuscadorProps) {
  const [valor, setValor] = useState(valorInicial);
  const valorDebounced = useDebounce(valor, debounceMs);

  useEffect(() => {
    alBuscar(valorDebounced);
  }, [valorDebounced, alBuscar]);

  return (
    <div className="relative">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="search"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-slate-100 border border-transparent focus:border-[#787FF6] focus:bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#787FF6]/20 transition-all"
        aria-label={placeholder}
      />
      {valor && (
        <button
          onClick={() => setValor("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          aria-label="Limpiar búsqueda"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
