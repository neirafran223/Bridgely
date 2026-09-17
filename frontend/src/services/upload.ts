import { api } from "./api";

export interface UploadResult {
  url: string;
  filename: string;
}

export interface AdjuntoResult {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
}

export async function subirImagen(archivo: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("archivo", archivo);
  const { data } = await api.post("/upload/imagen", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function subirAdjunto(archivo: File): Promise<AdjuntoResult> {
  const formData = new FormData();
  formData.append("archivo", archivo);
  const { data } = await api.post("/upload/adjunto", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
