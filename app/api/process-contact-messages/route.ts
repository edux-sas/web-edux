import { type NextRequest, NextResponse } from "next/server"
import { getUnprocessedContactMessages, markContactMessageAsProcessed } from "@/lib/contact-service"
import { sendContactConfirmation, sendAdminNotification } from "@/lib/email-service"

// Esta ruta debe estar protegida en producción con algún tipo de autenticación
export async function GET(request: NextRequest) {
  try {
    // Verificar clave de API (simple, para demostración)
    const apiKey = request.nextUrl.searchParams.get("key")
    if (apiKey !== process.env.CONTACT_PROCESSOR_API_KEY) {
      return NextResponse.json({ success: false, error: "Clave de API inválida" }, { status: 401 })
    }

    // Obtener mensajes no procesados
    const { success, data: messages, error } = await getUnprocessedContactMessages()

    if (!success || !messages) {
      return NextResponse.json({ success: false, error }, { status: 500 })
    }

    console.log(`Procesando ${messages.length} mensajes de contacto pendientes`)

    // Procesar cada mensaje
    const results = []
    for (const message of messages) {
      try {
        console.log(`Procesando mensaje ID ${message.id} de ${message.email}`)

        // Intentar enviar correo al usuario
        console.log(`Enviando confirmación a ${message.email}...`)
        const userEmailResult = await sendContactConfirmation(
          message.name,
          message.email,
          message.subject,
          message.message,
        )
        console.log(`Resultado envío a usuario:`, userEmailResult)

        // Intentar enviar correo al administrador
        console.log(`Enviando notificación al administrador sobre mensaje de ${message.email}...`)
        const adminEmailResult = await sendAdminNotification(
          message.name,
          message.email,
          message.subject,
          message.message,
          message.phone,
        )
        console.log(`Resultado envío a administrador:`, adminEmailResult)

        // Marcar como procesado
        const emailSent = userEmailResult.success && adminEmailResult.success
        await markContactMessageAsProcessed(message.id, emailSent)

        results.push({
          id: message.id,
          success: true,
          emailSent,
          userEmailResult,
          adminEmailResult,
        })
      } catch (processError) {
        console.error(`Error al procesar mensaje ${message.id}:`, processError)
        results.push({
          id: message.id,
          success: false,
          error: processError instanceof Error ? processError.message : "Error desconocido",
        })
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    })
  } catch (error) {
    console.error("Error al procesar mensajes de contacto:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
