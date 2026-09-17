import { useRef, useState } from "react";
import { Upload, X, LoaderCircle, Image as ImageIcon } from "lucide-react";
import { subirImagen } from "../../services/upload";

interface SubirImagenProps {
  urlActual?: string | null;
  onSubida: (url: string) => void;
  tamaño?: "sm" | "md" | "lg";
}

const tamaños = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
};

export default function SubirImagen({
  urlActual,
  onSubida,
  tamaño = "md",
}: SubirImagenProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [preview, setPreview] = useState<string | null>(urlActual || null);
  const [error, setError] = useState<string | null>(null);

  async function handleArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    if (archivo.size > 5 * 1024 * 1024) {
      setError("El archivo debe ser menor a 5MB");
      return;
    }

    setSubiendo(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(archivo);

    try {
      const result = await subirImagen(archivo);
      onSubida(result.url);
    } catch {
      setError("Error al subir la imagen");
      setPreview(urlActual || null);
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${tamaños[tamaño]} rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#787FF6] transition-colors flex items-center justify-center overflow-hidden cursor-pointer relative group`}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Subir imagen de perfil"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
      >
        {subiendo ? (
          <LoaderCircle size={24} className="text-[#787FF6] animate-spin" />
        ) : preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload size={20} className="text-white" />
            </div>
          </>
        ) : (
          <ImageIcon size={24} className="text-slate-400" />
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleArchivo}
        className="hidden"
        aria-hidden="true"
      />

      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1" role="alert">
          <X size={12} />
          {error}
        </p>
      )}
    </div>
  );
}
