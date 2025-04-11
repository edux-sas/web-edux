import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function GET() {
  try {
    // Verificar que la API key esté configurada
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "RESEND_API_KEY no está configurada en las variables de entorno",
        },
        { status: 500 },
      )
    }

    console.log("Iniciando prueba directa de Resend...")

    const resend = new Resend(process.env.RESEND_API_KEY)

    const { data, error } = await resend.emails.send({
      from: "Soporte eduX <onboarding@resend.dev>",
      to: "soporte@edux.com.co",
      subject: "Prueba directa de Resend",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <h2 style="color: #0ea5e9;">Prueba Directa de Resend</h2>
          <p>Este es un correo de prueba enviado a las ${new Date().toLocaleString()}</p>
          <p>Si estás viendo este mensaje, Resend está funcionando correctamente.</p>
        </div>
      `,
    })

    if (error) {
      console.error("Error al enviar correo con Resend:", error)
      return NextResponse.json({ success: false, error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error al probar Resend:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
