interface DificultadBadgeProps {
  dificultad: string | null;
}

const config: Record<string, { label: string; cls: string }> = {
  basica: { label: "Básica", cls: "bg-green-100 text-green-700" },
  intermedia: { label: "Intermedia", cls: "bg-amber-100 text-amber-700" },
  avanzada: { label: "Avanzada", cls: "bg-red-100 text-red-600" },
};

export default function DificultadBadge({ dificultad }: DificultadBadgeProps) {
  if (!dificultad || !config[dificultad]) return null;

  const { label, cls } = config[dificultad];
  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full ${cls}`}
    >
      {label}
    </span>
  );
}