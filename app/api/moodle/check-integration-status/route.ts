import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Crear un cliente de Supabase con la clave de servicio para operaciones administrativas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Crear un cliente de Supabase con la clave de servicio
const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null

export async function GET(request: NextRequest) {
  try {
    // Verificar si el cliente de Supabase existe
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "No se ha configurado la conexión con Supabase correctamente.",
        },
        { status: 500 },
      )
    }

    // Obtener el ID de usuario de la consulta
    const userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "Se requiere el ID de usuario" }, { status: 400 })
    }

    // Consultar la información del usuario en Supabase
    const { data: userData, error: userError } = await supabaseAdmin
      .schema("api")
      .from("users")
      .select("moodle_username, user_metadata")
      .eq("id", userId)
      .single()

    if (userError) {
      return NextResponse.json({ success: false, error: userError.message }, { status: 404 })
    }

    // Verificar si el usuario tiene información de Moodle
    const hasMoodleIntegration = !!userData.moodle_username

    return NextResponse.json({
      success: true,
      moodleIntegration: {
        completed: hasMoodleIntegration,
        username: userData.moodle_username || null,
        // Incluir cualquier otra información relevante de Moodle que esté en los metadatos
        additionalInfo: userData.user_metadata?.moodle_info || null,
      },
    })
  } catch (error) {
    console.error("Error al verificar estado de integración con Moodle:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
