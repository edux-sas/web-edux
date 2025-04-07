import { Recipient, EmailParams, MailerSend } from "mailersend"

// Inicializar el cliente de MailerSend con la API key
const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || "",
})

// Dirección de correo desde la que se enviarán los emails
const FROM_EMAIL = "no-reply@edux.com.co"
const FROM_NAME = "eduX Academy"

// Dirección de correo para recibir copias de los formularios
const ADMIN_EMAIL = "formacionedux@gmail.com"

// Función para enviar correo de confirmación al usuario
export async function sendContactConfirmation(name: string, email: string, subject: string, message: string) {
  try {
    const recipients = [new Recipient(email, name)]

    const emailParams = new EmailParams()
      .setFrom(FROM_EMAIL)
      .setFromName(FROM_NAME)
      .setTo(recipients)
      .setSubject("Hemos recibido tu mensaje - eduX Academy")
      .setHtml(`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">Gracias por contactarnos</h2>
          <p>Hola ${name},</p>
          <p>Hemos recibido tu mensaje y te responderemos a la brevedad posible.</p>
          <p>Estos son los detalles de tu mensaje:</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Asunto:</strong> ${subject}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${message.replace(/\n/g, "<br>")}</p>
          </div>
          <p>Saludos cordiales,</p>
          <p>El equipo de eduX Academy</p>
        </div>
      `)

    const response = await mailerSend.email.send(emailParams)
    console.log("Email de confirmación enviado:", response)
    return { success: true }
  } catch (error) {
    console.error("Error al enviar correo de confirmación:", error)
    return { success: false, error }
  }
}

// Función para enviar notificación al administrador
export async function sendAdminNotification(
  name: string,
  email: string,
  subject: string,
  message: string,
  phone?: string,
) {
  try {
    const recipients = [new Recipient(ADMIN_EMAIL, "Administrador eduX")]

    const emailParams = new EmailParams()
      .setFrom(FROM_EMAIL)
      .setFromName(FROM_NAME)
      .setTo(recipients)
      .setReplyTo(email, name)
      .setSubject(`Nuevo mensaje de contacto: ${subject}`)
      .setHtml(`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">Nuevo mensaje de contacto</h2>
          <p>Se ha recibido un nuevo mensaje a través del formulario de contacto:</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ""}
            <p><strong>Asunto:</strong> ${subject}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${message.replace(/\n/g, "<br>")}</p>
          </div>
          <p>Puedes responder directamente a este correo para contactar al remitente.</p>
        </div>
      `)

    const response = await mailerSend.email.send(emailParams)
    console.log("Email de notificación enviado:", response)
    return { success: true }
  } catch (error) {
    console.error("Error al enviar notificación al administrador:", error)
    return { success: false, error }
  }
}

// Función para validar el formulario y prevenir spam
export function validateContactForm(name: string, email: string, subject: string, message: string, honeypot?: string) {
  // Verificar campo honeypot (anti-bot)
  if (honeypot) {
    return {
      valid: false,
      error: "Formulario detectado como spam",
    }
  }

  // Validar que los campos requeridos no estén vacíos
  if (!name || !email || !subject || !message) {
    return {
      valid: false,
      error: "Todos los campos son obligatorios",
    }
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      error: "El formato del correo electrónico no es válido",
    }
  }

  // Validar longitud del mensaje (para evitar mensajes muy cortos o muy largos)
  if (message.length < 10) {
    return {
      valid: false,
      error: "El mensaje es demasiado corto",
    }
  }

  if (message.length > 5000) {
    return {
      valid: false,
      error: "El mensaje es demasiado largo (máximo 5000 caracteres)",
    }
  }

  return { valid: true }
}

// Función para obtener el asunto a partir del ID
export function getSubjectFromId(subjectId: string): string {
  const subjects: Record<string, string> = {
    "info-cursos": "Información sobre cursos",
    "info-disc": "Información sobre test DISC",
    soporte: "Soporte técnico",
    ventas: "Ventas corporativas",
    ceo: "Hablar con el CEO",
    otro: "Consulta general",
  }

  return subjects[subjectId] || "Consulta general"
}

