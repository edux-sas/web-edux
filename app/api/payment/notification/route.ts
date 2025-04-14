import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { processPaymentNotification, type PayUNotification } from "@/lib/payu-sdk"
import { createMoodleUser } from "@/lib/moodle-api"
import { logPaymentEvent } from "@/lib/payment-logger"

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
    // PayU puede enviar datos como application/x-www-form-urlencoded o como JSON
    let notificationData: PayUNotification

    const contentType = request.headers.get("content-type") || ""

    if (contentType.includes("application/json")) {
      notificationData = await request.json()
    } else {
      // Procesar form-urlencoded
      const formData = await request.formData()
      notificationData = Object.fromEntries(formData.entries()) as unknown as PayUNotification
    }

    // Logear la notificación recibida para monitoreo
    logPaymentEvent({
      type: "notification_received",
      data: notificationData,
      timestamp: new Date().toISOString(),
    })

    // Procesar la notificación
    const result = processPaymentNotification(notificationData)

    // Si la notificación no es válida, responder con error
    if (!result.success) {
      logPaymentEvent({
        type: "notification_invalid",
        data: { error: result.message, reference: result.referenceCode },
        timestamp: new Date().toISOString(),
      })

      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    // Guardar la transacción en la base de datos
    if (!supabaseAdmin) {
      throw new Error("No se ha configurado la conexión con Supabase")
    }

    // Buscar el usuario asociado a esta referencia de venta
    const { data: userData, error: userError } = await supabaseAdmin
      .schema("api")
      .from("users")
      .select("*")
      .eq("reference_code", result.referenceCode)
      .single()

    if (userError || !userData) {
      logPaymentEvent({
        type: "notification_user_not_found",
        data: { reference: result.referenceCode, state: result.isApproved ? "APPROVED" : "NOT_APPROVED" },
        timestamp: new Date().toISOString(),
      })

      // Si no encontramos el usuario por reference_code, intentamos por transaction_id
      if (result.transactionId) {
        const { data: userByTransaction, error: txError } = await supabaseAdmin
          .schema("api")
          .from("users")
          .select("*")
          .eq("transaction_id", result.transactionId)
          .single()

        if (txError || !userByTransaction) {
          return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
        }

        // Asignar el usuario encontrado
        const userData = userByTransaction
      } else {
        return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
      }
    }

    // Actualizar el estado del pago en la base de datos
    const { error: updateError } = await supabaseAdmin
      .schema("api")
      .from("users")
      .update({
        payment_status: result.isApproved ? "APPROVED" : notificationData.state_pol === "7" ? "PENDING" : "REJECTED",
        last_payment_update: new Date().toISOString(),
        transaction_id: result.transactionId || userData.transaction_id,
      })
      .eq("id", userData.id)

    if (updateError) {
      logPaymentEvent({
        type: "notification_update_error",
        data: {
          reference: result.referenceCode,
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
        payment_status: result.isApproved ? "APPROVED" : notificationData.state_pol === "7" ? "PENDING" : "REJECTED",
        last_payment_update: new Date().toISOString(),
        transaction_id: result.transactionId || userData.transaction_id,
      },
    })

    if (metadataError) {
      // Solo lo registramos pero no fallamos la operación
      console.error("Error al actualizar metadatos:", metadataError)
    }

    // Registrar el evento de procesamiento
    logPaymentEvent({
      type: "notification_processed",
      data: {
        reference: result.referenceCode,
        user_id: userData.id,
        status: result.isApproved ? "APPROVED" : notificationData.state_pol === "7" ? "PENDING" : "REJECTED",
      },
      timestamp: new Date().toISOString(),
    })

    // Si el pago se aprobó y el usuario no tiene cuenta en Moodle, crearla
    if (result.isApproved && !userData.moodle_username && process.env.ENABLE_MOODLE_INTEGRATION === "true") {
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
            .schema("api")
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
