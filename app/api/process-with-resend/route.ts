import { type NextRequest, NextResponse } from "next/server"
import { getUnprocessedContactMessages, markContactMessageAsProcessed } from "@/lib/contact-service"
import { Resend } from "resend"

export async function GET(request: NextRequest) {
  try {
    // Verificar clave de API
    const apiKey = request.nextUrl.searchParams.get("key")
    if (apiKey !== process.env.CONTACT_PROCESSOR_API_KEY) {
      return NextResponse.json({ success: false, error: "Clave de API inválida" }, { status: 401 })
    }

    // Verificar que Resend esté configurado
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "RESEND_API_KEY no está configurada en las variables de entorno",
        },
        { status: 500 },
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    // Obtener mensajes no procesados
    const { success, data: messages, error } = await getUnprocessedContactMessages()

    if (!success || !messages) {
      return NextResponse.json({ success: false, error }, { status: 500 })
    }

    console.log(`Procesando ${messages.length} mensajes de contacto pendientes con Resend`)

    // Procesar cada mensaje
    const results = []
    for (const message of messages) {
      try {
        console.log(`Procesando mensaje ID ${message.id} de ${message.email}`)

        // Enviar correo al usuario
        console.log(`Enviando confirmación a ${message.email}...`)
        const userEmailResult = await resend.emails.send({
          from: "eduX Academy <onboarding@resend.dev>",
          to: message.email,
          subject: "Hemos recibido tu mensaje - eduX Academy",
          html: `
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="UTF-8">
              <title>Confirmación de Contacto</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb; color: #1f2937;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-top: 20px; margin-bottom: 20px;">
                <!-- Header -->
                <tr>
                  <td style="background-color: #0ea5e9; padding: 30px 20px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">eduX Academy</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 30px 20px;">
                    <h2 style="color: #0ea5e9; margin-top: 0;">¡Gracias por contactarnos!</h2>
                    <p style="margin-bottom: 20px; line-height: 1.6;">Hola <strong>${message.name}</strong>,</p>
                    <p style="margin-bottom: 20px; line-height: 1.6;">Hemos recibido tu mensaje y te responderemos a la brevedad posible. Nuestro equipo está trabajando para brindarte la mejor atención.</p>
                    <p style="margin-bottom: 20px; line-height: 1.6;">Estos son los detalles de tu mensaje:</p>
                    
                    <table style="width: 100%; background-color: #f8fafc; border-radius: 6px; margin-bottom: 20px; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 15px;">
                          <p style="margin: 0 0 10px 0;"><strong>Asunto:</strong> ${message.subject}</p>
                          <p style="margin: 0 0 10px 0;"><strong>Mensaje:</strong></p>
                          <p style="margin: 0; white-space: pre-line;">${message.message.replace(/\n/g, "<br>")}</p>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin-bottom: 10px; line-height: 1.6;">Si tienes alguna pregunta adicional, no dudes en responder a este correo.</p>
                    <p style="margin-bottom: 20px; line-height: 1.6;">Saludos cordiales,</p>
                    <p style="margin-bottom: 10px; line-height: 1.6;"><strong>El equipo de eduX Academy</strong></p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
                    <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} eduX Academy. Todos los derechos reservados.</p>
                    <p style="margin: 0;">Este es un correo automático, por favor no respondas directamente a este mensaje.</p>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `,
        })

        // Enviar correo al administrador
        console.log(`Enviando notificación al administrador sobre mensaje de ${message.email}...`)
        const adminEmailResult = await resend.emails.send({
          from: "eduX Academy <onboarding@resend.dev>",
          to: "soporte@edux.com.co",
          replyTo: message.email,
          subject: `Nuevo mensaje de contacto: ${message.subject}`,
          html: `
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="UTF-8">
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
                          <p style="margin: 0 0 10px 0;"><strong>Nombre:</strong> ${message.name}</p>
                          <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${message.email}" style="color: #0ea5e9; text-decoration: none;">${message.email}</a></p>
                          ${message.phone ? `<p style="margin: 0 0 10px 0;"><strong>Teléfono:</strong> <a href="tel:${message.phone}" style="color: #0ea5e9; text-decoration: none;">${message.phone}</a></p>` : ""}
                          <p style="margin: 0 0 10px 0;"><strong>Asunto:</strong> ${message.subject}</p>
                          <p style="margin: 0 0 10px 0;"><strong>Mensaje:</strong></p>
                          <p style="margin: 0; white-space: pre-line;">${message.message.replace(/\n/g, "<br>")}</p>
                        </td>
                      </tr>
                    </table>
                    
                    <div style="text-align: center; margin-top: 30px;">
                      <a href="mailto:${message.email}" style="display: inline-block; background-color: #0ea5e9; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold;">Responder al remitente</a>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
                    <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} eduX Academy. Todos los derechos reservados.</p>
                    <p style="margin: 0;">Puedes responder directamente a este correo para contactar al remitente.</p>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `,
        })

        // Marcar como procesado
        const userEmailSuccess = !userEmailResult.error
        const adminEmailSuccess = !adminEmailResult.error
        const emailSent = userEmailSuccess && adminEmailSuccess

        await markContactMessageAsProcessed(message.id, emailSent)

        results.push({
          id: message.id,
          success: true,
          emailSent,
          userEmail: {
            success: userEmailSuccess,
            data: userEmailResult.data,
            error: userEmailResult.error,
          },
          adminEmail: {
            success: adminEmailSuccess,
            data: adminEmailResult.data,
            error: adminEmailResult.error,
          },
        })
      } catch (processError) {
        console.error(`Error al procesar mensaje ${message.id}:`, processError)
        results.push({
          id: message.id,
          success: false,
          error: processError instanceof Error ? processError.message : "Error desconocido",
          stack: processError instanceof Error ? processError.stack : undefined,
        })
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    })
  } catch (error) {
    console.error("Error al procesar mensajes de contacto con Resend:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
