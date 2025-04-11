import { type NextRequest, NextResponse } from "next/server"
import {
  sendContactConfirmation,
  sendAdminNotification,
  validateContactForm,
  getSubjectFromId,
} from "@/lib/email-service"
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

    // Registrar la solicitud para depuración
    console.log(`Procesando solicitud de contacto de ${name} (${email}), asunto: ${subject}`)

    // Establecer un tiempo límite para el envío de correos
    const emailTimeout = 10000 // 10 segundos

    // Enviar correo de confirmación al usuario con tiempo límite
    const userEmailPromise = Promise.race([
      sendContactConfirmation(name, email, subject, message),
      new Promise<{ success: false; error: string }>((resolve) =>
        setTimeout(() => resolve({ success: false, error: "Tiempo de espera agotado" }), emailTimeout),
      ),
    ])

    const userEmailResult = await userEmailPromise

    if (!userEmailResult.success) {
      console.error("Error al enviar correo al usuario:", userEmailResult.error)
      // Continuamos con el proceso aunque falle el correo al usuario
    }

    // Enviar notificación al administrador con tiempo límite
    const adminEmailPromise = Promise.race([
      sendAdminNotification(name, email, subject, message, phone),
      new Promise<{ success: false; error: string }>((resolve) =>
        setTimeout(() => resolve({ success: false, error: "Tiempo de espera agotado" }), emailTimeout),
      ),
    ])

    const adminEmailResult = await adminEmailPromise

    if (!adminEmailResult.success) {
      console.error("Error al enviar correo al administrador:", adminEmailResult.error)

      // Guardar los datos del formulario en un archivo de registro o base de datos como respaldo
      console.log(
        "DATOS DE CONTACTO (RESPALDO):",
        JSON.stringify({
          timestamp: new Date().toISOString(),
          name,
          email,
          phone,
          subject,
          message,
        }),
      )

      // Devolver un mensaje de éxito parcial
      return NextResponse.json({
        success: true,
        warning:
          "Tu mensaje ha sido recibido, pero es posible que haya un retraso en nuestra respuesta debido a problemas técnicos.",
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error en el procesamiento del formulario de contacto:", error)

    // Asegurarse de que la respuesta siempre sea JSON válido
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
