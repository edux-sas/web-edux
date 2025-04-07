import { type NextRequest, NextResponse } from "next/server"
import { sendContactConfirmation, sendAdminNotification, validateContactForm, getSubjectFromId } from "@/lib/mailersend"
import { rateLimit } from "@/lib/rate-limit"

// Configurar limitador de tasa para prevenir spam
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minuto
  uniqueTokenPerInterval: 10, // Máximo 10 usuarios por intervalo
})

export async function POST(request: NextRequest) {
  try {
    // Obtener la IP del cliente para rate limiting
    const ip = request.headers.get("x-forwarded-for") || "anonymous"

    // Aplicar rate limiting (máximo 3 solicitudes por minuto por IP)
    try {
      await limiter.check(3, ip)
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Demasiadas solicitudes. Por favor, inténtalo de nuevo más tarde." },
        { status: 429 },
      )
    }

    // Obtener datos del formulario
    const data = await request.json()
    const { name, email, subject: subjectId, message, phone, honeypot } = data

    // Convertir el ID del asunto a texto legible
    const subject = getSubjectFromId(subjectId)

    // Validar el formulario
    const validation = validateContactForm(name, email, subjectId, message, honeypot)
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 })
    }

    // Enviar correo de confirmación al usuario
    const userEmailResult = await sendContactConfirmation(name, email, subject, message)
    if (!userEmailResult.success) {
      console.error("Error al enviar correo al usuario:", userEmailResult.error)
    }

    // Enviar notificación al administrador
    const adminEmailResult = await sendAdminNotification(name, email, subject, message, phone)
    if (!adminEmailResult.success) {
      console.error("Error al enviar correo al administrador:", adminEmailResult.error)
      return NextResponse.json(
        { success: false, error: "Error al procesar el formulario. Por favor, inténtalo de nuevo más tarde." },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error en el procesamiento del formulario de contacto:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

