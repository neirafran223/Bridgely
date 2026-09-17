function escaparRegExp(texto: string) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const palabrasDeAltaComplejidad = [
  "inteligencia artificial",
  "machine learning",
  "ia",
  "pagos",
  "pasarela de pago",
  "pasarela",
  "stripe",
  "paypal",
  "webhook",
  "microservicios",
  "criptografía",
  "notificaciones push",
  "panel de administración",
  "multiusuario",
  "multi-usuario",
  "e-commerce",
  "ecommerce",
  "geolocalización",
  "mapas",
];

const palabrasDeComplejidadMedia = [
  "app móvil",
  "apps móviles",
  "api",
  "apis",
  "integración",
  "integraciones",
  "chat",
  "tiempo real",
  "real-time",
  "autenticación",
  "auth",
  "base de datos",
  "analytics",
  "análisis de datos",
  "reportes",
  "tienda",
];

export type DificultadSugerida = "basica" | "intermedia" | "avanzada";

export function sugerirDificultad(
  descripcion: string,
  presupuesto: number,
  plazo?: string,
): DificultadSugerida {
  const texto = (descripcion + " " + (plazo ?? "")).toLowerCase();
  let puntaje = 0;

  for (const palabra of [...palabrasDeAltaComplejidad, ...palabrasDeComplejidadMedia]) {
    const regex = new RegExp(`\\b${escaparRegExp(palabra)}\\b`, "i");
    if (regex.test(texto)) {
      puntaje += palabrasDeAltaComplejidad.includes(palabra) ? 2 : 1;
    }
  }

  if (presupuesto >= 5000000) {
    puntaje += 2;
  } else if (presupuesto >= 2000000) {
    puntaje += 1;
  }

  const meses = Number(plazo?.match(/\d+/)?.[0] ?? "0");
  if (meses >= 3) {
    puntaje += 1;
  }

  if (puntaje >= 5) {
    return "avanzada";
  }

  if (puntaje >= 2) {
    return "intermedia";
  }

  return "basica";
}