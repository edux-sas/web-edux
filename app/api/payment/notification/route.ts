import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { validatePayUSignature } from "@/lib/payu"
import { createMoodleUser } from "@/lib/moodle-api"
import { logPaymentEvent } from "@/lib/payment-logger"

// Importar las utilidades de modo de prueba
import { isTestMode } from "@/lib/test-mode-utils"

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
    console.log("Cliente Supabase Admin creado correctamente para notificaciones de pago")
  } else {
    console.error("No se pudo crear el cliente Supabase Admin: faltan credenciales")
  }
} catch (error) {
  console.error("Error al crear el cliente Supabase Admin:", error)
}

export async function POST(request: NextRequest) {
  try {
    // Obtener los datos de la notificación
    const notificationData = await request.json()

    // Logear la notificación recibida para monitoreo
    logPaymentEvent({
      type: "notification_received",
      data: notificationData,
      timestamp: new Date().toISOString(),
    })

    // Extraer información relevante de la notificación
    const {
      reference_sale, // Código de referencia de la venta
      state_pol, // Estado de la transacción
      transaction_id, // ID de la transacción
      value, // Valor de la transacción
      merchant_id, // ID del comercio
      signature, // Firma para validación
    } = notificationData

    // Validar la firma para asegurar que la notificación es legítima
    // En modo de prueba, omitimos la validación de firma
    const isValidSignature = isTestMode()
      ? true
      : validatePayUSignature(notificationData, process.env.PAYU_API_KEY || "")

    if (!isValidSignature) {
      logPaymentEvent({
        type: "notification_invalid_signature",
        data: { reference: reference_sale, transaction_id },
        timestamp: new Date().toISOString(),
      })

      return NextResponse.json({ error: "Firma inválida" }, { status: 400 })
    }

    // Verificar que el merchant_id coincida con nuestro ID
    // En modo de prueba, aceptamos cualquier merchant_id que venga en la notificación
    if (!isTestMode() && merchant_id !== process.env.PAYU_MERCHANT_ID) {
      logPaymentEvent({
        type: "notification_invalid_merchant",
        data: { reference: reference_sale, merchant_id },
        timestamp: new Date().toISOString(),
      })

      return NextResponse.json({ error: "ID de comercio inválido" }, { status: 400 })
    }

    // Actualizar el estado del pago en la base de datos
    if (!supabaseAdmin) {
      throw new Error("No se ha configurado la conexión con Supabase")
    }

    // Mapear los estados de PayU a nuestros estados internos
    let paymentStatus = "PENDING"
    if (state_pol === "4") {
      paymentStatus = "APPROVED" // Aprobado
    } else if (state_pol === "6" || state_pol === "5") {
      paymentStatus = "REJECTED" // Rechazado o expirado
    } else if (state_pol === "7") {
      paymentStatus = "PENDING" // Pendiente
    }

    // En modo de prueba, siempre establecemos el estado como APPROVED
    if (isTestMode()) {
      paymentStatus = "APPROVED"
    }

    // Buscar el usuario asociado a esta referencia de venta
    const { data: userData, error: userError } = await supabaseAdmin
      .schema("public")
      .from("users")
      .select("*")
      .eq("reference_code", reference_sale)
      .single()

    if (userError || !userData) {
      logPaymentEvent({
        type: "notification_user_not_found",
        data: { reference: reference_sale, state: paymentStatus },
        timestamp: new Date().toISOString(),
      })

      // Si no encontramos el usuario por reference_code, intentamos por transaction_id
      const { data: userByTransaction, error: txError } = await supabaseAdmin
        .schema("public")
        .from("users")
        .select("*")
        .eq("transaction_id", transaction_id)
        .single()

      if (txError || !userByTransaction) {
        return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
      }

      const userData = userByTransaction
    }

    // Actualizar el estado del pago en la base de datos
    const { error: updateError } = await supabaseAdmin
      .schema("public")
      .from("users")
      .update({
        payment_status: paymentStatus,
        last_payment_update: new Date().toISOString(),
      })
      .eq("id", userData.id)

    if (updateError) {
      logPaymentEvent({
        type: "notification_update_error",
        data: {
          reference: reference_sale,
          user_id: userData.id,
          error: updateError.message,
        },
        timestamp: new Date().toISOString(),
      })

      throw new Error(`Error al actualizar estado de pago: ${updateError.message}`)
    }

    // Actualizar también los metadatos del usuario para mantener consistencia
    const { error: metadataError } = await supabaseAdmin.auth.admin.updateUserById(userData.id, {
      user_metadata: {
        ...userData.user_metadata,
        payment_status: paymentStatus,
        last_payment_update: new Date().toISOString(),
      },
    })

    if (metadataError) {
      // Solo lo registramos pero no fallamos la operación
      console.error("Error al actualizar metadatos:", metadataError)
    }

    logPaymentEvent({
      type: "notification_processed",
      data: {
        reference: reference_sale,
        user_id: userData.id,
        status: paymentStatus,
      },
      timestamp: new Date().toISOString(),
    })

    // Si el pago se aprobó y el usuario no tiene cuenta en Moodle, crearla
    if (paymentStatus === "APPROVED" && !userData.moodle_username && process.env.ENABLE_MOODLE_INTEGRATION === "true") {
      try {
        // Extraer nombre y apellido
        const nameParts = userData.name.split(" ")
        const firstname = nameParts[0]
        const lastname = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "-"

        // Generar nombre de usuario único
        const username = userData.email.split("@")[0] + Math.floor(Math.random() * 1000)

        // Crear usuario en Moodle
        const moodleResponse = await createMoodleUser({
          username,
          password: "temporal123", // Esto debería ser más seguro en producción
          firstname,
          lastname,
          email: userData.email,
        })

        if (moodleResponse.success) {
          // Actualizar el nombre de usuario de Moodle en la base de datos
          await supabaseAdmin
            .schema("public")
            .from("users")
            .update({ moodle_username: moodleResponse.username })
            .eq("id", userData.id)

          logPaymentEvent({
            type: "moodle_user_created",
            data: {
              user_id: userData.id,
              moodle_username: moodleResponse.username,
            },
            timestamp: new Date().toISOString(),
          })
        } else {
          logPaymentEvent({
            type: "moodle_creation_error",
            data: {
              user_id: userData.id,
              error: moodleResponse.error,
            },
            timestamp: new Date().toISOString(),
          })
        }
      } catch (moodleError) {
        console.error("Error al crear usuario en Moodle:", moodleError)
      }
    }

    // Responder con éxito a PayU
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error en el procesamiento de la notificación:", error)

    logPaymentEvent({
      type: "notification_error",
      data: { error: error instanceof Error ? error.message : "Error desconocido" },
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
