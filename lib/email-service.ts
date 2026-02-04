import nodemailer from "nodemailer"

// Configuración del transporter de nodemailer con manejo de errores mejorado
let transporter: nodemailer.Transporter

try {
  transporter = nodemailer.createTransport({
    host: "mail.edux.com.co", // Servidor SMTP correcto
    port: 465,
    secure: true, // true para puerto 465, false para otros puertos
    auth: {
      user: process.env.EMAIL_USER || "soporte@edux.com.co",
      pass: process.env.EMAIL_PASSWORD || "",
    },
    // Opciones de tiempo de espera
    connectionTimeout: 10000, // 10 segundos para conectar
    socketTimeout: 15000, // 15 segundos para operaciones de socket
  })

  // Verificar la conexión al iniciar
  transporter.verify((error, success) => {
    if (error) {
      console.error("Error al verificar la conexión con el servidor de correo:", error)
    } else {
      console.log("Servidor de correo listo para enviar mensajes")
    }
  })
} catch (error) {
  console.error("Error al crear el transporter de nodemailer:", error)
  // Crear un transporter de respaldo que registre los correos en la consola
  transporter = {
    sendMail: (mailOptions: any) => {
      console.log("CORREO (MODO FALLBACK):", JSON.stringify(mailOptions))
      return Promise.resolve({ messageId: "fallback-" + Date.now() })
    },
  } as any
}

// Verificar que las credenciales de correo estén configuradas
if (!process.env.EMAIL_PASSWORD) {
  console.warn(
    "ADVERTENCIA: La contraseña de correo electrónico no está configurada. Configure la variable de entorno EMAIL_PASSWORD.",
  )
}

// Dirección de correo desde la que se enviarán los emails
const FROM_EMAIL = "soporte@edux.com.co"
const FROM_NAME = "eduX"

// Dirección de correo para recibir copias de los formularios
const ADMIN_EMAIL = "gerencia@edux.digital"

// Función para enviar correo de confirmación al usuario
export async function sendContactConfirmation(name: string, email: string, subject: string, message: string) {
  try {
    const mailOptions = {
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: email,
      subject: "Hemos recibido tu mensaje - eduX",
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmación de Contacto</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb; color: #1f2937;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-top: 20px; margin-bottom: 20px;">
            <!-- Header -->
            <tr>
              <td style="background-color: #0ea5e9; padding: 30px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">eduX </h1>
              </td>
            </tr>
            
            <!-- Content -->
            <tr>
              <td style="padding: 30px 20px;">
                <h2 style="color: #0ea5e9; margin-top: 0;">¡Gracias por contactarnos!</h2>
                <p style="margin-bottom: 20px; line-height: 1.6;">Hola <strong>${name}</strong>,</p>
                <p style="margin-bottom: 20px; line-height: 1.6;">Hemos recibido tu mensaje y te responderemos a la brevedad posible. Nuestro equipo está trabajando para brindarte la mejor atención.</p>
                <p style="margin-bottom: 20px; line-height: 1.6;">Estos son los detalles de tu mensaje:</p>
                
                <table style="width: 100%; background-color: #f8fafc; border-radius: 6px; margin-bottom: 20px; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 15px;">
                      <p style="margin: 0 0 10px 0;"><strong>Asunto:</strong> ${subject}</p>
                      <p style="margin: 0 0 10px 0;"><strong>Mensaje:</strong></p>
                      <p style="margin: 0; white-space: pre-line;">${message.replace(/\n/g, "<br>")}</p>
                    </td>
                  </tr>
                </table>
                
                <p style="margin-bottom: 10px; line-height: 1.6;">Si tienes alguna pregunta adicional, no dudes en responder a este correo.</p>
                <p style="margin-bottom: 20px; line-height: 1.6;">Saludos cordiales,</p>
                <p style="margin-bottom: 10px; line-height: 1.6;"><strong>El equipo de eduX </strong></p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
                <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} eduX. Todos los derechos reservados.</p>
                <p style="margin: 0;">Este es un correo automático, por favor no respondas directamente a este mensaje.</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    }

    console.log(`Intentando enviar correo de confirmación a ${email}...`)
    const info = await transporter.sendMail(mailOptions)
    console.log("Email de confirmación enviado:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error al enviar correo de confirmación:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al enviar correo",
    }
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
    const mailOptions = {
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `Nuevo mensaje de contacto: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nuevo Mensaje de Contacto</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb; color: #1f2937;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-top: 20px; margin-bottom: 20px;">
            <!-- Header -->
            <tr>
              <td style="background-color: #0ea5e9; padding: 30px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Nuevo Mensaje de Contacto</h1>
              </td>
            </tr>
            
            <!-- Content -->
            <tr>
              <td style="padding: 30px 20px;">
                <h2 style="color: #0ea5e9; margin-top: 0;">Detalles del mensaje</h2>
                <p style="margin-bottom: 20px; line-height: 1.6;">Se ha recibido un nuevo mensaje a través del formulario de contacto:</p>
                
                <table style="width: 100%; background-color: #f8fafc; border-radius: 6px; margin-bottom: 20px; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 15px;">
                      <p style="margin: 0 0 10px 0;"><strong>Nombre:</strong> ${name}</p>
                      <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #0ea5e9; text-decoration: none;">${email}</a></p>
                      ${phone ? `<p style="margin: 0 0 10px 0;"><strong>Teléfono:</strong> <a href="tel:${phone}" style="color: #0ea5e9; text-decoration: none;">${phone}</a></p>` : ""}
                      <p style="margin: 0 0 10px 0;"><strong>Asunto:</strong> ${subject}</p>
                      <p style="margin: 0 0 10px 0;"><strong>Mensaje:</strong></p>
                      <p style="margin: 0; white-space: pre-line;">${message.replace(/\n/g, "<br>")}</p>
                    </td>
                  </tr>
                </table>
                
                <div style="text-align: center; margin-top: 30px;">
                  <a href="mailto:${email}" style="display: inline-block; background-color: #0ea5e9; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold;">Responder al remitente</a>
                </div>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
                <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} eduX. Todos los derechos reservados.</p>
                <p style="margin: 0;">Puedes responder directamente a este correo para contactar al remitente.</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    }

    console.log(`Intentando enviar notificación al administrador sobre mensaje de ${email}...`)
    const info = await transporter.sendMail(mailOptions)
    console.log("Email de notificación enviado:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error al enviar notificación al administrador:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al enviar correo",
    }
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
    "demo-sie": "Solicitud de Demo SIE",
    otro: "Consulta general",
  }

  return subjects[subjectId] || "Consulta general"
}
