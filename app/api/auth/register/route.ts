import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createMoodleUser } from "@/lib/moodle" // Importar desde el wrapper

// Crear un cliente de Supabase con la clave de servicio para operaciones administrativas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Verificar si las variables de entorno están definidas
if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Supabase URL o Service Key no están definidas. Por favor, configura las variables de entorno.")
  console.error(`URL: ${supabaseUrl ? "Definida" : "No definida"}`)
  console.error(
    `Service Key: ${supabaseServiceKey ? "Definida (primeros 5 caracteres): " + supabaseServiceKey.substring(0, 5) + "..." : "No definida"}`,
  )
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
    console.log("Cliente Supabase Admin creado correctamente para registro")
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
    console.log("Datos recibidos para registro:", JSON.stringify(requestData))

    const { email, password, userData } = requestData

    if (!email || !password || !userData) {
      return NextResponse.json(
        { success: false, error: "Faltan datos requeridos (email, password o userData)" },
        { status: 400 },
      )
    }

    // Verificar que exista información de pago y que el estado sea APPROVED o PENDING
    if (
      !userData.payment_status ||
      !userData.transaction_id ||
      (userData.payment_status !== "APPROVED" && userData.payment_status !== "PENDING")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "No se puede registrar al usuario sin una transacción de pago exitosa",
        },
        { status: 400 },
      )
    }

    // 1. Registrar el usuario en auth con privilegios de servicio
    console.log("Creando usuario en Supabase Auth...")
    
    let userId
    let userAlreadyExists = false
    
    // Intentar crear el usuario primero
    const { data: newAuthData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmar el email
      user_metadata: userData,
    })

    if (authError) {
      // Si el error es porque el usuario ya existe, devolver mensaje para redirigir al login
      if (authError.message.includes("already been registered") || authError.message.includes("already exists")) {
        console.log(`Usuario con email ${email} ya existe. Redirigiendo al login...`)
        
        return NextResponse.json({
          success: false,
          userExists: true,
          error: "Este correo ya está registrado. Por favor, inicia sesión.",
          redirectTo: "/iniciar-sesion"
        }, { status: 409 })
      } else {
        // Si es otro tipo de error, devolverlo
        console.error("Error al crear usuario en Auth:", authError)
        return NextResponse.json({ success: false, error: authError.message }, { status: 400 })
      }
    } else {
      // Usuario creado exitosamente
      if (!newAuthData.user) {
        return NextResponse.json({ success: false, error: "No se pudo crear el usuario" }, { status: 400 })
      }
      
      userId = newAuthData.user.id
      console.log(`✅ Usuario creado en Auth con ID: ${userId}`)
    }

    // Fecha actual para el registro
    const currentDate = new Date().toISOString()

    // 2. Insertar o actualizar datos del usuario en la tabla users (UPSERT)
    // Asegurarse de que los campos coincidan exactamente con la estructura de la tabla
    console.log("Insertando/Actualizando datos en la tabla users...")
    const { error: upsertError } = await supabaseAdmin
      .schema("public")
      .from("users")
      .upsert([
        {
          id: userId,
          name: userData.name,
          email: userData.email,
          plan: userData.plan,
          payment_status: userData.payment_status,
          purchase_date: userData.purchase_date,
          amount: userData.amount,
          transaction_id: userData.transaction_id,
          reference_code: userData.reference_code,
          has_completed_disc: false,
          last_payment_update: currentDate,
          // Campos opcionales que podrían ser útiles
          user_metadata: userData, // Guardar todos los datos del usuario como JSON
          last_login: currentDate,
          // Si hay un plan_expiry_date en userData, usarlo, de lo contrario null
          plan_expiry_date: userData.plan_expiry_date || null,
        },
      ], {
        onConflict: 'id'
      })

    if (upsertError) {
      console.error("Error al insertar/actualizar usuario en la tabla users:", upsertError)
      return NextResponse.json({ success: false, error: upsertError.message }, { status: 400 })
    }

    console.log(`✅ Datos insertados/actualizados en la tabla users para el usuario ${userId}`)

    // 3. Registrar la transacción de pago
    console.log("Registrando transacción de pago...")
    const { error: transactionError } = await supabaseAdmin
      .schema("public")
      .from("payment_transactions")
      .insert([
        {
          user_id: userId,
          transaction_id: userData.transaction_id,
          reference_code: userData.reference_code,
          amount: userData.amount,
          currency: userData.currency || "COP", // Valor por defecto
          payment_method: userData.payment_method || "card", // Valor por defecto
          payment_status: userData.payment_status,
          payment_response: userData.payment_response || {}, // Respuesta completa del procesador de pagos
          created_at: currentDate,
          updated_at: currentDate,
        },
      ])

    if (transactionError) {
      console.error("Error al registrar transacción de pago:", transactionError)
      // No fallamos todo el proceso si falla el registro de la transacción
      // pero lo registramos para depuración
    } else {
      console.log(`✅ Transacción de pago registrada para el usuario ${userId}`)
    }

    // 4. Manejar la integración con Moodle de manera asíncrona
    // En lugar de esperar a que se complete, iniciamos el proceso y devolvemos la respuesta
    let moodleIntegrationStarted = false

    if (process.env.ENABLE_MOODLE_INTEGRATION === "true") {
      moodleIntegrationStarted = true

      // Extraer nombre y apellido del nombre completo
      const nameParts = userData.name.split(" ")
      const firstname = nameParts[0]
      const lastname = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "-"

      // Generar un nombre de usuario único basado en el email
      const username = email.split("@")[0] + Math.floor(Math.random() * 1000)

      console.log(`Iniciando proceso asíncrono para crear usuario en Moodle con los siguientes datos:`, {
        username,
        firstname,
        lastname,
        email,
      })

      // Iniciar el proceso de creación de usuario en Moodle sin esperar a que termine
      // Esto evitará el timeout de la función
      createMoodleUser({
        username,
        password,
        firstname,
        lastname,
        email,
      })
        .then(async (moodleResponse) => {
          // Verificar si la respuesta indica un error real, no un proceso pendiente
          if (!moodleResponse.success && !moodleResponse.status === "pending") {
            console.warn("Usuario creado en Supabase pero falló en Moodle:", moodleResponse.error)
            return
          }

          // Si tenemos un nombre de usuario de Moodle, actualizarlo en Supabase
          const moodleUsername = moodleResponse.username
          if (moodleUsername) {
            console.log(`Actualizando moodle_username '${moodleUsername}' para el usuario ${userId}`)

            // Actualizar el usuario en Supabase con el nombre de usuario de Moodle
            if (moodleUsername) {
              console.log(`Actualizando moodle_username '${moodleUsername}' para el usuario ${userId}`)

              // Actualizar en la tabla users
              const { error: updateError } = await supabaseAdmin
                .schema("public")
                .from("users")
                .update({ moodle_username: moodleUsername })
                .eq("id", userId)

              if (updateError) {
                console.error("Error al actualizar moodle_username en la tabla users:", updateError)
              } else {
                console.log(`✅ Moodle username '${moodleUsername}' guardado en la tabla users`)
              }

              // También actualizar los metadatos del usuario
              const { error: metadataError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
                user_metadata: { ...userData, moodle_username: moodleUsername },
              })

              if (metadataError) {
                console.error("Error al actualizar metadatos del usuario:", metadataError)
              } else {
                console.log(`✅ Moodle username '${moodleUsername}' guardado en los metadatos del usuario`)
              }
            }
          }
        })
        .catch((error) => {
          console.error("Error en el proceso asíncrono de Moodle:", error)
        })
    } else {
      console.log("⚠️ MOODLE: Integración desactivada. Configure ENABLE_MOODLE_INTEGRATION=true para activarla.")
    }

    // Devolver respuesta exitosa inmediatamente sin esperar a Moodle
    return NextResponse.json({
      success: true,
      user: { id: userId, email },
      moodle: {
        integrationStarted: moodleIntegrationStarted,
        message: moodleIntegrationStarted
          ? "Proceso de integración con Moodle iniciado. Los datos de acceso estarán disponibles en breve."
          : "Integración con Moodle desactivada",
      },
    })
  } catch (error) {
    console.error("Error en el registro:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}
