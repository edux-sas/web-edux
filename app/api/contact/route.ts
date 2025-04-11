import { type NextRequest, NextResponse } from "next/server"
import { validateContactForm, getSubjectFromId } from "@/lib/email-service"
import { saveContactMessage } from "@/lib/contact-service"
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

    // Guardar el mensaje en Supabase
    const saveResult = await saveContactMessage({
      name,
      email,
      phone,
      subject,
      message,
    })

    if (!saveResult.success) {
      console.error("Error al guardar mensaje en Supabase:", saveResult.error)
      return NextResponse.json(
        {
          success: false,
          error: "Error al procesar tu mensaje. Por favor, inténtalo de nuevo más tarde.",
        },
        { status: 500 },
      )
    }

    // Devolver respuesta exitosa
    return NextResponse.json({
      success: true,
      message: "Tu mensaje ha sido recibido. Nos pondremos en contacto contigo pronto.",
    })
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
