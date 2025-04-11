import { NextResponse } from "next/server"
import { testAlternativeEmailService } from "@/lib/alternative-email-service"

export async function GET() {
  try {
    console.log("Iniciando prueba de servicio alternativo de correo...")

    const result = await testAlternativeEmailService()

    console.log("Resultado de prueba:", result)

    return NextResponse.json({
      success: result.success,
      data: result.data || result.error,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error al probar servicio alternativo:", error)

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
