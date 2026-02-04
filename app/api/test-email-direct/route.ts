import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function GET() {
  try {
    console.log("Iniciando prueba de correo directo...")

    // Crear un transporter específico para esta prueba
    const testTransporter = nodemailer.createTransport({
      host: "mail.edux.com.co",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER || "soporte@edux.com.co",
        pass: process.env.EMAIL_PASSWORD || "",
      },
      tls: {
        rejectUnauthorized: false,
      },
      debug: true,
    })

    // Registrar información de configuración
    console.log("Configuración de correo:", {
      host: "mail.edux.com.co",
      port: 465,
      secure: true,
      user: process.env.EMAIL_USER || "soporte@edux.com.co",
      passLength: process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 0,
    })

    // Enviar correo de prueba
    const info = await testTransporter.sendMail({
      from: `"Prueba eduX" <${process.env.EMAIL_USER || "soporte@edux.com.co"}>`,
      to: "soporte@edux.com.co",
      subject: "Correo de prueba " + new Date().toISOString(),
      text: "Este es un correo de prueba enviado a las " + new Date().toLocaleString(),
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <h2 style="color: #0ea5e9;">Correo de Prueba</h2>
          <p>Este es un correo de prueba enviado a las ${new Date().toLocaleString()}</p>
          <p>Si estás viendo este mensaje, la configuración de correo está funcionando correctamente.</p>
        </div>
      `,
    })

    console.log("Correo enviado:", info)

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      response: info.response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error al enviar correo de prueba:", error)

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
