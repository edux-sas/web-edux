import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Crear un cliente de Supabase con la clave de servicio para operaciones administrativas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Verificar si las variables de entorno están definidas
if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Supabase URL o Service Key no están definidas. Por favor, configura las variables de entorno.")
}

// Crear un cliente de Supabase con la clave de servicio
let supabaseAdmin = null
try {
  if (supabaseUrl && supabaseServiceKey) {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
    console.log("Cliente Supabase Admin creado correctamente para actualizar plan")
  } else {
    console.error("No se pudo crear el cliente Supabase Admin: faltan credenciales")
  }
} catch (error) {
  console.error("Error al crear el cliente Supabase Admin:", error)
}

export async function POST(request: NextRequest) {
  try {
    // Verificar si el cliente de Supabase existe
    if (!supabaseAdmin) {
      console.error("supabaseAdmin es null. URL:", supabaseUrl, "ServiceKey definida:", !!supabaseServiceKey)
      return NextResponse.json(
        {
          success: false,
          error:
            "No se ha configurado la conexión con Supabase. Verifique las variables de entorno SUPABASE_SERVICE_ROLE_KEY y NEXT_PUBLIC_SUPABASE_URL.",
        },
        { status: 500 },
      )
    }

    // Obtener datos del cuerpo de la solicitud
    const requestData = await request.json()
    console.log("Datos recibidos para actualizar plan:", JSON.stringify(requestData))

    const { userId, plan, payment_status, purchase_date, amount, transaction_id } = requestData

    if (!userId || !plan || !payment_status || !purchase_date || !amount || !transaction_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Faltan datos requeridos (userId, plan, payment_status, purchase_date, amount, transaction_id)",
        },
        { status: 400 },
      )
    }

    // Verificar que el estado del pago sea válido
    if (payment_status !== "APPROVED" && payment_status !== "PENDING") {
      return NextResponse.json(
        {
          success: false,
          error: "El estado del pago debe ser APPROVED o PENDING",
        },
        { status: 400 },
      )
    }

    // Actualizar el plan del usuario en la tabla users
    const { error: updateError } = await supabaseAdmin
      .schema("public")
      .from("users")
      .update({
        plan,
        payment_status,
        purchase_date,
        amount,
        transaction_id,
      })
      .eq("id", userId)

    if (updateError) {
      console.error("Error al actualizar el plan del usuario:", updateError)
      return NextResponse.json({ success: false, error: updateError.message }, { status: 400 })
    }

    // También actualizar los metadatos del usuario
    const { error: metadataError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        plan,
        payment_status,
        purchase_date,
        amount,
        transaction_id,
      },
    })

    if (metadataError) {
      console.error("Error al actualizar metadatos del usuario:", metadataError)
      // No fallamos la operación completa, solo registramos el error
    }

    return NextResponse.json({
      success: true,
      message: "Plan actualizado correctamente",
    })
  } catch (error) {
    console.error("Error al actualizar plan:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}
