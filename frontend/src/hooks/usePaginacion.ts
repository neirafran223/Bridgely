import { useState, useEffect, useCallback, useRef } from "react";

interface UsePaginacionOptions<T> {
  fetchFn: (pagina: number, limite: number) => Promise<{ datos: T[]; total: number }>;
  limitePorPagina?: number;
}

interface UsePaginacionResult<T> {
  datos: T[];
  cargando: boolean;
  pagina: number;
  totalPaginas: number;
  total: number;
  hayMas: boolean;
  siguientePagina: () => void;
  paginaAnterior: () => void;
  irAPagina: (p: number) => void;
  recargar: () => void;
}

export function usePaginacion<T>({
  fetchFn,
  limitePorPagina = 10,
}: UsePaginacionOptions<T>): UsePaginacionResult<T> {
  const [datos, setDatos] = useState<T[]>([]);
  const [cargando, setCargando] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const mountedRef = useRef(true);

  const totalPaginas = Math.ceil(total / limitePorPagina);
  const hayMas = pagina < totalPaginas;

  const cargar = useCallback(async (p: number) => {
    setCargando(true);
    try {
      const resultado = await fetchFn(p, limitePorPagina);
      if (mountedRef.current) {
        setDatos(resultado.datos);
        setTotal(resultado.total);
      }
    } catch {
    } finally {
      if (mountedRef.current) setCargando(false);
    }
  }, [fetchFn, limitePorPagina]);

  useEffect(() => {
    mountedRef.current = true;
    cargar(pagina);
    return () => { mountedRef.current = false; };
  }, [pagina, cargar]);

  const siguientePagina = useCallback(() => {
    if (hayMas) setPagina((p) => p + 1);
  }, [hayMas]);

  const paginaAnterior = useCallback(() => {
    if (pagina > 1) setPagina((p) => p - 1);
  }, [pagina]);

  const irAPagina = useCallback((p: number) => {
    setPagina(Math.max(1, Math.min(p, totalPaginas)));
  }, [totalPaginas]);

  const recargar = useCallback(() => cargar(pagina), [cargar, pagina]);

  return { datos, cargando, pagina, totalPaginas, total, hayMas, siguientePagina, paginaAnterior, irAPagina, recargar };
}
