import { Resend } from "resend"

// Inicializar Resend como servicio de correo alternativo
// Nota: Necesitarás configurar RESEND_API_KEY en tus variables de entorno
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function sendEmailViaResend(
  to: string,
  subject: string,
  html: string,
  from = "Soporte eduX <onboarding@resend.dev>",
) {
  if (!resend) {
    console.warn("Resend no está configurado. Configure RESEND_API_KEY para usar este servicio alternativo.")
    return { success: false, error: "Resend no está configurado" }
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })

    if (error) {
      console.error("Error al enviar correo con Resend:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error al enviar correo con Resend:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}

// Función para probar el servicio alternativo
export async function testAlternativeEmailService() {
  return sendEmailViaResend(
    "soporte@edux.com.co",
    "Prueba de servicio alternativo de correo",
    `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <h2 style="color: #0ea5e9;">Prueba de Servicio Alternativo</h2>
        <p>Este es un correo de prueba enviado a las ${new Date().toLocaleString()}</p>
        <p>Si estás viendo este mensaje, el servicio alternativo de correo está funcionando correctamente.</p>
      </div>
    `,
  )
}
