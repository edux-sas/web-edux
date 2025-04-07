import { NextResponse } from "next/server"
import { Recipient, EmailParams, MailerSend } from "mailersend"

export async function GET() {
  try {
    // Verificar que la API key esté configurada
    if (!process.env.MAILERSEND_API_KEY) {
      return NextResponse.json(
        { success: false, error: "La API key de MailerSend no está configurada" },
        { status: 500 },
      )
    }

    // Inicializar el cliente de MailerSend
    const mailerSend = new MailerSend({
      apiKey: process.env.MAILERSEND_API_KEY,
    })

    // Crear un correo de prueba
    const recipients = [new Recipient("formacionedux@gmail.com", "Administrador eduX")]

    const emailParams = new EmailParams()
      .setFrom("no-reply@edux.com.co")
      .setFromName("eduX Academy")
      .setTo(recipients)
      .setSubject("Prueba de conexión con MailerSend")
      .setHtml("<strong>Esta es una prueba de conexión con MailerSend</strong>")
      .setText("Esta es una prueba de conexión con MailerSend")

    // Enviar el correo
    const response = await mailerSend.email.send(emailParams)

    return NextResponse.json({
      success: true,
      message: "Correo de prueba enviado correctamente",
      response,
    })
  } catch (error) {
    console.error("Error al probar la conexión con MailerSend:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
        details: error,
      },
      { status: 500 },
    )
  }
}

