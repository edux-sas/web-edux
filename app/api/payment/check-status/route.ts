import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { logPaymentEvent } from "@/lib/payment-logger"

// Al inicio del archivo, importar las utilidades de modo de prueba
import { isTestMode, simulateApprovedPayment } from "@/lib/test-mode-utils"

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
  } else {
    console.error("No se pudo crear el cliente Supabase Admin: faltan credenciales")
  }
} catch (error) {
  console.error("Error al crear el cliente Supabase Admin:", error)
}

export async function GET(request: NextRequest) {
  try {
    // Obtener el ID de transacción de los parámetros de consulta
    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get("transactionId")
    const referenceCode = searchParams.get("referenceCode")

    if (!transactionId && !referenceCode) {
      return NextResponse.json(
        { error: "Se requiere transactionId o referenceCode para verificar el estado del pago" },
        { status: 400 },
      )
    }

    // Si estamos en modo de prueba, simular una respuesta aprobada
    if (isTestMode()) {
      const simulatedResponse = simulateApprovedPayment(
        referenceCode || `REF_${Date.now()}`,
        transactionId || undefined,
      )

      return NextResponse.json({
        success: true,
        status: "APPROVED",
        message: "Pago aprobado (SIMULACIÓN)",
        data: simulatedResponse,
      })
    }

    // Obtener los parámetros de la solicitud
    // const referenceCode = request.nextUrl.searchParams.get("referenceCode") || ""
    // const transactionId = request.nextUrl.searchParams.get("transactionId") || ""

    // if (!referenceCode && !transactionId) {
    //   return NextResponse.json({ success: false, error: "Se requiere referenceCode o transactionId" }, { status: 400 })
    // }

    // Verificar si el cliente de Supabase existe
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "No se ha configurado la conexión con Supabase" },
        { status: 500 },
      )
    }

    // Buscar la transacción en la base de datos
    let query = supabaseAdmin.schema("public").from("users").select("*")

    if (referenceCode) {
      query = query.eq("reference_code", referenceCode)
    } else if (transactionId) {
      query = query.eq("transaction_id", transactionId)
    }

    const { data, error } = await query.single()

    if (error || !data) {
      logPaymentEvent({
        type: "check_status_not_found",
        data: { referenceCode, transactionId },
        timestamp: new Date().toISOString(),
      })

      return NextResponse.json({ success: false, error: "Transacción no encontrada" }, { status: 404 })
    }

    logPaymentEvent({
      type: "check_status_success",
      data: {
        referenceCode,
        transactionId,
        status: data.payment_status,
        userId: data.id,
      },
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      status: data.payment_status,
      user: {
        id: data.id,
        email: data.email,
        plan: data.plan,
        purchase_date: data.purchase_date,
      },
    })
  } catch (error) {
    console.error("Error al verificar estado de pago:", error)

    logPaymentEvent({
      type: "check_status_error",
      data: { error: error instanceof Error ? error.message : "Error desconocido" },
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}
