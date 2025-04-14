import { type NextRequest, NextResponse } from "next/server"
import { processCardPayment } from "@/lib/payu-sdk"
import { createClient } from "@supabase/supabase-js"

// Crear un cliente de Supabase con la clave de servicio para operaciones administrativas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

let supabaseAdmin = null
try {
  if (supabaseUrl && supabaseServiceKey) {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
    console.log("Cliente Supabase Admin creado correctamente para procesar pagos con tarjeta")
  } else {
    console.error("No se pudo crear el cliente Supabase Admin: faltan credenciales")
  }
} catch (error) {
  console.error("Error al crear el cliente Supabase Admin:", error)
}

export async function POST(request: NextRequest) {
  try {
    // Obtener datos del cuerpo de la solicitud
    const requestData = await request.json()

    // Validar datos requeridos
    const {
      cardNumber,
      cardName,
      cardExpiry,
      cardCvc,
      amount,
      referenceCode,
      description,
      currency,
      buyerInfo,
      userId,
    } = requestData

    if (!cardNumber || !cardName || !cardExpiry || !cardCvc || !amount || !referenceCode || !buyerInfo) {
      return NextResponse.json(
        { success: false, error: "Faltan datos requeridos para procesar el pago" },
        { status: 400 },
      )
    }

    // Procesar pago con tarjeta
    const paymentResponse = await processCardPayment({
      cardNumber,
      cardName,
      cardExpiry,
      cardCvc,
      amount,
      referenceCode,
      description: description || "Pago eduX",
      currency: currency || "COP",
      buyerInfo,
    })

    if (
      paymentResponse.code !== "SUCCESS" ||
      !paymentResponse.transactionResponse ||
      (paymentResponse.transactionResponse.state !== "APPROVED" &&
        paymentResponse.transactionResponse.state !== "PENDING")
    ) {
      const errorMessage =
        paymentResponse.transactionResponse?.responseMessage ||
        paymentResponse.error ||
        "Error en el procesamiento del pago"

      return NextResponse.json({ success: false, error: errorMessage }, { status: 400 })
    }

    // Si tenemos un userId, actualizar el estado del pago en la base de datos
    if (userId && supabaseAdmin) {
      const { error: updateError } = await supabaseAdmin
        .schema("api")
        .from("users")
        .update({
          payment_status: paymentResponse.transactionResponse.state,
          transaction_id: paymentResponse.transactionResponse.transactionId,
          reference_code: referenceCode,
          last_payment_update: new Date().toISOString(),
        })
        .eq("id", userId)

      if (updateError) {
        console.error("Error al actualizar estado de pago:", updateError)
      }
    }

    return NextResponse.json({
      success: true,
      transactionId: paymentResponse.transactionResponse.transactionId,
      state: paymentResponse.transactionResponse.state,
      responseCode: paymentResponse.transactionResponse.responseCode,
      responseMessage: paymentResponse.transactionResponse.responseMessage,
    })
  } catch (error) {
    console.error("Error al procesar pago con tarjeta:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}
