import { type NextRequest, NextResponse } from "next/server"
import { createPaymentUrl } from "@/lib/payu-sdk"

export async function POST(request: NextRequest) {
  try {
    // Obtener datos del cuerpo de la solicitud
    const requestData = await request.json()

    // Validar datos requeridos
    const { referenceCode, description, amount, currency, buyerInfo, responseUrl } = requestData

    if (!referenceCode || !description || !amount || !currency || !buyerInfo) {
      return NextResponse.json({ success: false, error: "Faltan datos requeridos para crear el pago" }, { status: 400 })
    }

    // Crear URL de pago
    const paymentResponse = await createPaymentUrl({
      referenceCode,
      description,
      amount,
      currency,
      buyerInfo,
      responseUrl,
      notifyUrl: "https://edux.com.co/api/payment/notification",      
    })

    if (!paymentResponse.success) {
      return NextResponse.json({ success: false, error: paymentResponse.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      url: paymentResponse.url,
      signature: paymentResponse.signature,
    })
  } catch (error) {
    console.error("Error al crear pago:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}
