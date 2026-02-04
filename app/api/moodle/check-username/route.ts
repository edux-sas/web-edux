import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Crear cliente de Supabase con la clave de servicio
const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Se requiere el parámetro userId",
        },
        { status: 400 },
      )
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "No se pudo crear el cliente Supabase Admin",
        },
        { status: 500 },
      )
    }

    // Consultar la tabla users para obtener el nombre de usuario de Moodle
    const { data, error } = await supabaseAdmin
      .schema("public")
      .from("users")
      .select("moodle_username")
      .eq("id", userId)
      .single()

    if (error) {
      console.error("Error al consultar el nombre de usuario de Moodle:", error)
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 },
      )
    }

    if (!data || !data.moodle_username) {
      return NextResponse.json({
        success: false,
        message: "El usuario no tiene un nombre de usuario de Moodle",
      })
    }

    return NextResponse.json({
      success: true,
      moodleUsername: data.moodle_username,
    })
  } catch (error) {
    console.error("Error al verificar nombre de usuario de Moodle:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}

