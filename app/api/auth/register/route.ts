import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createMoodleUser } from "@/lib/moodle" // Import the createMoodleUser function

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
    console.log("Cliente Supabase creado correctamente")
  } else {
    console.error("No se pudo crear el cliente Supabase: faltan credenciales")
  }
} catch (error) {
  console.error("Error al crear el cliente Supabase:", error)
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
    console.log("Recibidos datos de registro de usuario")

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
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmar el email
      user_metadata: userData, // Guardar todos los datos en los metadatos
    })

    if (authError) {
      console.error("Error al crear usuario:", authError)
      return NextResponse.json({ success: false, error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ success: false, error: "No se pudo crear el usuario" }, { status: 400 })
    }

    // 2. Insertar datos del usuario en la tabla users
    // IMPORTANTE: Solo incluir campos que existen en la tabla users
    const { error: insertError } = await supabaseAdmin
      .schema("api")
      .from("users")
      .insert([
        {
          id: authData.user.id,
          name: userData.name,
          email: userData.email,
          plan: userData.plan,
          payment_status: userData.payment_status,
          purchase_date: userData.purchase_date,
          amount: userData.amount,
          transaction_id: userData.transaction_id,
          reference_code: userData.reference_code,
          has_completed_disc: false, // Inicialmente, el usuario no ha completado el test DISC
        },
      ])

    if (insertError) {
      console.error("Error al insertar usuario en la tabla:", insertError)
      return NextResponse.json({ success: false, error: insertError.message }, { status: 400 })
    }

    // 3. Registrar usuario en Moodle si está habilitado
    let moodleResult = { success: true, message: "Integración con Moodle desactivada" }
    let moodleUsername = null // Variable para almacenar el nombre de usuario de Moodle
    let enrollmentResults = null // Variable para almacenar los resultados de inscripción

    if (process.env.ENABLE_MOODLE_INTEGRATION === "true") {
      try {
        // Extraer nombre y apellido del nombre completo
        const nameParts = userData.name.split(" ")
        const firstname = nameParts[0]
        const lastname = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "-"

        // Generar un nombre de usuario único basado en el email
        const username = email.split("@")[0] + Math.floor(Math.random() * 1000)

        console.log(`Intentando crear usuario en Moodle con los siguientes datos:`, {
          username,
          firstname,
          lastname,
          email,
        })

        // Crear usuario en Moodle e inscribirlo automáticamente en los cursos de la categoría 2
        const moodleResponse = await createMoodleUser({
          username,
          password,
          firstname,
          lastname,
          email,
          // No es necesario especificar categoryid aquí, ya que ahora siempre inscribimos en la categoría 2
        })

        if (!moodleResponse.success) {
          console.warn("Usuario creado en Supabase pero falló en Moodle:", moodleResponse.error)
          moodleResult = {
            success: false,
            message: `Usuario creado en Supabase pero falló en Moodle: ${moodleResponse.error}`,
          }
          // Opcionalmente, puedes decidir si quieres fallar todo el proceso o solo registrar el error
        } else {
          moodleUsername = moodleResponse.username // Guardar el nombre de usuario de Moodle

          // Obtener los resultados de inscripción
          const enrollmentData = moodleResponse.data?.enrollments || []

          // Guardar información sobre la inscripción
          enrollmentResults = enrollmentData

          moodleResult = {
            success: true,
            message: `Usuario creado correctamente en Supabase y Moodle e inscrito en ${moodleResponse.data?.successfulEnrollments || 0} cursos de Formación DISC`,
            enrollments: enrollmentResults,
          }

          // Registrar información adicional para depuración
          console.log("✅ MOODLE: Usuario creado exitosamente", {
            email,
            username,
            firstname,
            lastname,
            moodleData: moodleResponse.data,
          })

          // Actualizar el usuario en Supabase con el nombre de usuario de Moodle
          if (moodleUsername) {
            console.log(`Intentando guardar moodle_username para el usuario`)

            // Actualizar en la tabla users
            const { error: updateError } = await supabaseAdmin
              .schema("api")
              .from("users")
              .update({ moodle_username: moodleUsername })
              .eq("id", authData.user.id)

            if (updateError) {
              console.error("Error al actualizar moodle_username en la tabla users:", updateError)
              console.error("Detalles del error:", JSON.stringify(updateError, null, 2))
            } else {
              console.log(`✅ Moodle username '${moodleUsername}' guardado en la tabla users`)

              // Verificar que se guardó correctamente
              const { data: userData, error: getUserError } = await supabaseAdmin
                .schema("api")
                .from("users")
                .select("moodle_username")
                .eq("id", authData.user.id)
                .single()

              if (getUserError) {
                console.error("Error al verificar moodle_username:", getUserError)
              } else {
                console.log("Verificación de moodle_username completada")
              }
            }

            // También actualizar los metadatos del usuario
            const { error: metadataError } = await supabaseAdmin.auth.admin.updateUserById(authData.user.id, {
              user_metadata: { ...userData, moodle_username: moodleUsername },
            })

            if (metadataError) {
              console.error("Error al actualizar metadatos del usuario:", metadataError)
              console.error("Detalles del error:", JSON.stringify(metadataError, null, 2))
            } else {
              console.log("✅ Moodle username guardado en los metadatos del usuario")
            }
          }
        }
      } catch (moodleError) {
        console.error("Error al registrar en Moodle:", moodleError)
        moodleResult = {
          success: false,
          message: `Error al registrar en Moodle: ${moodleError instanceof Error ? moodleError.message : "Error desconocido"}`,
        }
      }
    } else {
      console.log("⚠️ MOODLE: Integración desactivada. Configure ENABLE_MOODLE_INTEGRATION=true para activarla.")
    }

    return NextResponse.json({
      success: true,
      user: authData.user,
      moodle: {
        ...moodleResult,
        username: moodleUsername, // Incluir el nombre de usuario de Moodle en la respuesta
        enrollments: enrollmentResults, // Incluir resultados de inscripción en la respuesta
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
