import { logger } from "../logger/logger";

export interface NotificationEmailData {
  to: string;
  nombre: string;
  asunto: string;
  mensaje: string;
  accionUrl?: string;
  accionTexto?: string;
}

function generarPlantilla(data: NotificationEmailData): string {
  const accionHtml = data.accionUrl && data.accionTexto
    ? `<a href="${data.accionUrl}" style="display:inline-block;background:#787FF6;color:#ffffff;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:600;margin-top:16px;">${data.accionTexto}</a>`
    : "";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f7fe;font-family:'Segoe UI',system-ui,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
    <div style="background:linear-gradient(135deg,#1F2F98,#787FF6);padding:32px;text-align:center;">
      <h1 style="color:#ffffff;font-size:24px;margin:0;">Bridgely</h1>
    </div>
    <div style="padding:32px;">
      <h2 style="color:#1F2F98;font-size:20px;margin:0 0 8px;">Hola, ${data.nombre}</h2>
      <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 24px;">${data.mensaje}</p>
      ${accionHtml}
      <hr style="border:none;border-top:#e2e8f0 1px solid;margin:32px 0 16px;">
      <p style="color:#94a3b8;font-size:12px;margin:0;">Este es un correo automático de Bridgely. No respondas a este mensaje.</p>
    </div>
  </div>
</body>
</html>`;
}

export async function enviarEmail(data: NotificationEmailData): Promise<boolean> {
  try {
    const nodemailer = await import("nodemailer");

    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    if (!process.env.SMTP_USER) {
      logger.info({ asunto: data.asunto }, "[Email] SMTP no configurado, saltando envío");
      return true;
    }

    await transporter.sendMail({
      from: `"Bridgely" <${process.env.SMTP_USER}>`,
      to: data.to,
      subject: data.asunto,
      html: generarPlantilla(data),
    });

    logger.info({ to: data.to, asunto: data.asunto }, "[Email] Enviado correctamente");
    return true;
  } catch (error) {
    logger.error({ err: error }, "[Email] Error al enviar");
    return false;
  }
}

export async function enviarEmailPostulacionAceptada(
  email: string,
  nombre: string,
  ideaTitle: string,
  ideaId: string
): Promise<boolean> {
  return enviarEmail({
    to: email,
    nombre,
    asunto: "Tu postulación ha sido aceptada",
    mensaje: `¡Felicidades! Tu postulación para "${ideaTitle}" ha sido aceptada. Ahora puedes empezar a trabajar en el proyecto.`,
    accionUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/ideas/${ideaId}`,
    accionTexto: "Ver proyecto",
  });
}

export async function enviarEmailPagoRecibido(
  email: string,
  nombre: string,
  monto: number,
  ideaTitle: string
): Promise<boolean> {
  return enviarEmail({
    to: email,
    nombre,
    asunto: "Pago recibido",
    mensaje: `Se ha registrado un pago de $${monto.toLocaleString()} para el proyecto "${ideaTitle}". El dinero está en custodia hasta que liberes la entrega.`,
  });
}

export async function enviarEmailTransaccionLiberada(
  email: string,
  nombre: string,
  monto: number,
  ideaTitle: string
): Promise<boolean> {
  return enviarEmail({
    to: email,
    nombre,
    asunto: "Fondos liberados",
    mensaje: `Los fondos de $${monto.toLocaleString()} por el proyecto "${ideaTitle}" han sido liberados correctamente.`,
  });
}

export async function enviarEmailInvitacionEquipo(
  email: string,
  nombre: string,
  equipoNombre: string,
  invitadoPor: string
): Promise<boolean> {
  return enviarEmail({
    to: email,
    nombre,
    asunto: `Invitación al equipo "${equipoNombre}"`,
    mensaje: `${invitadoPor} te ha invitado a unirte al equipo "${equipoNombre}". Revisa la invitación en tu dashboard.`,
    accionTexto: "Ver invitación",
    accionUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/mis-equipos`,
  });
}

export async function enviarEmailCalificacionRecibida(
  email: string,
  nombre: string,
  puntuacion: number,
  comentario: string,
  emisorNombre: string
): Promise<boolean> {
  return enviarEmail({
    to: email,
    nombre,
    asunto: "Nueva calificación recibida",
    mensaje: `${emisorNombre} te ha calificado con ${puntuacion}/5 estrellas. "${comentario}"`,
  });
}
