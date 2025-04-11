import { NextResponse } from "next/server"
import { sendContactConfirmation, sendAdminNotification } from "@/lib/email-service"

export async function GET() {
  try {
    // Datos de prueba
    const testData = {
      name: "Usuario de Prueba",
      email: "cristoferscalante@gmail.com", // Cambia esto por tu correo para probar
      subject: "Prueba de Correo",
      message: "Este es un mensaje de prueba para verificar el funcionamiento del sistema de correos.",
      phone: "+57 300 123 4567",
    }

    // Enviar correo de prueba al usuario
    const userEmailResult = await sendContactConfirmation(
      testData.name,
      testData.email,
      testData.subject,
      testData.message,
    )

    // Enviar correo de prueba al administrador
    const adminEmailResult = await sendAdminNotification(
      testData.name,
      testData.email,
      testData.subject,
      testData.message,
      testData.phone,
    )

    return NextResponse.json({
      success: true,
      userEmail: userEmailResult,
      adminEmail: adminEmailResult,
    })
  } catch (error) {
    console.error("Error en la prueba de correo:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
