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
    console.log("Cliente Supabase Admin creado correctamente para guardar resultados DISC")
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
    console.log("Datos recibidos para guardar resultados DISC:", JSON.stringify(requestData))

    const { userId, results } = requestData

    if (!userId || !results) {
      return NextResponse.json({ success: false, error: "Faltan datos requeridos (userId o results)" }, { status: 400 })
    }

    // Verificar si el usuario ya ha realizado un test en los últimos 15 días
    const { data: lastTestData, error: lastTestError } = await supabaseAdmin
      .schema("api")
      .from("disc_results")
      .select("created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)

    if (lastTestError) {
      console.error("Error al verificar el último test:", lastTestError)
      return NextResponse.json({ success: false, error: lastTestError.message }, { status: 400 })
    }

    // Si hay un test previo, verificar si han pasado 15 días
    if (lastTestData && lastTestData.length > 0) {
      const lastTestDate = new Date(lastTestData[0].created_at)
      const now = new Date()
      const diffDays = Math.floor((now.getTime() - lastTestDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays < 15) {
        return NextResponse.json(
          {
            success: false,
            error: "Debes esperar 15 días para realizar el test nuevamente",
            lastTestDate: lastTestData[0].created_at,
            daysRemaining: 15 - diffDays,
          },
          { status: 403 },
        )
      }
    }

    // Insertar resultados en la tabla disc_results
    const { data, error } = await supabaseAdmin
      .schema("api")
      .from("disc_results")
      .insert([
        {
          user_id: userId,
          d: results.D,
          i: results.I,
          s: results.S,
          c: results.C,
          created_at: new Date().toISOString(), // Asegurar que se guarde la fecha actual
        },
      ])
      .select()

    if (error) {
      console.error("Error al guardar resultados DISC:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    // Actualizar el campo has_completed_disc en la tabla users
    const { error: updateError } = await supabaseAdmin
      .schema("api")
      .from("users")
      .update({ has_completed_disc: true })
      .eq("id", userId)

    if (updateError) {
      console.error("Error al actualizar has_completed_disc:", updateError)
      // No fallamos la operación completa, solo registramos el error
    } else {
      console.log(`✅ Campo has_completed_disc actualizado para el usuario ${userId}`)
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error al guardar resultados DISC:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}

