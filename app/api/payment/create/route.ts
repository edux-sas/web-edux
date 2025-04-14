import { type NextRequest, NextResponse } from "next/server"
import { createPaymentUrl } from "@/lib/payu-sdk"
import { rateLimit } from "@/lib/rate-limit"

// Configurar limitador de tasa para prevenir abusos
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minuto
  uniqueTokenPerInterval: 10, // Máximo 10 usuarios por intervalo
})

export async function POST(request: NextRequest) {
  try {
    // Obtener la IP del cliente para rate limiting
    const ip = request.headers.get("x-forwarded-for") || "anonymous"

    // Aplicar rate limiting (máximo 5 solicitudes por minuto por IP)
    try {
      await limiter.check(5, ip)
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Demasiadas solicitudes. Por favor, inténtalo de nuevo más tarde." },
        { status: 429 },
      )
    }

    // Obtener datos del cuerpo de la solicitud
    const requestData = await request.json()
    const { amount, description, buyerInfo, referenceCode } = requestData

    // Validar datos requeridos
    if (!amount || !description || !buyerInfo || !buyerInfo.email) {
      return NextResponse.json(
        { success: false, error: "Faltan datos requeridos (amount, description, buyerInfo)" },
        { status: 400 },
      )
    }

    // Crear URL de pago
    const paymentUrlResult = await createPaymentUrl({
      amount,
      description,
      buyerInfo,
      referenceCode,
    })

    if (!paymentUrlResult.success) {
      return NextResponse.json(
        { success: false, error: paymentUrlResult.error || "Error al crear URL de pago" },
        { status: 500 },
      )
    }

    // Devolver la URL de pago y el código de referencia
    return NextResponse.json({
      success: true,
      paymentUrl: paymentUrlResult.url,
      referenceCode: paymentUrlResult.referenceCode,
    })
  } catch (error) {
    console.error("Error al crear URL de pago:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}
