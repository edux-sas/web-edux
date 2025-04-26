import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = supabaseUrl ? createClient(supabaseUrl, supabaseAnonKey) : null

export async function GET(request: NextRequest) {
  try {
    // Verificar si el cliente de Supabase existe
    if (!supabase) {
      return NextResponse.json(
        {
          success: false,
          error: "No se ha configurado la conexión con Supabase",
        },
        { status: 500 },
      )
    }

    // Obtener el userId de los parámetros de consulta
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Falta el parámetro userId",
        },
        { status: 400 },
      )
    }

    // Consultar la tabla users para obtener el moodle_username
    const { data, error } = await supabase
      .schema("api")
      .from("users")
      .select("moodle_username")
      .eq("id", userId)
      .single()

    if (error) {
      console.error("Error al consultar moodle_username:", error)
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 },
      )
    }

    // Verificar si el usuario tiene un moodle_username
    if (data && data.moodle_username) {
      return NextResponse.json({
        success: true,
        moodleUsername: data.moodle_username,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "El usuario aún no tiene un nombre de usuario de Moodle",
        },
        { status: 404 },
      )
    }
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
