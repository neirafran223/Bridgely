import { useState, useCallback, useRef } from "react";

interface UseOptimisticOptions<T> {
  onMutate: (data: T) => Promise<T>;
  onOptimistic: (current: T[], data: T) => T[];
  onRollback: (previous: T[], error: Error) => void;
}

export function useOptimisticList<T>({
  onMutate,
  onOptimistic,
  onRollback,
}: UseOptimisticOptions<T>) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const previousRef = useRef<T[]>([]);

  const ejecutar = useCallback(async (currentList: T[], data: T) => {
    previousRef.current = [...currentList];
    const optimisticList = onOptimistic(currentList, data);
    setCargando(true);
    setError(null);

    try {
      const result = await onMutate(data);
      return { success: true, result, updatedList: optimisticList };
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Error desconocido");
      setError(error);
      onRollback(previousRef.current, error);
      return { success: false, error, updatedList: previousRef.current };
    } finally {
      setCargando(false);
    }
  }, [onMutate, onOptimistic, onRollback]);

  return { ejecutar, cargando, error };
}
