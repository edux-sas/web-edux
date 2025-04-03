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
const supabaseAdmin = supabaseUrl
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null

export async function POST(request: NextRequest) {
  try {
    // Verificar si el cliente de Supabase existe
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "No se ha configurado la conexión con Supabase." },
        { status: 500 },
      )
    }

    // Obtener datos del cuerpo de la solicitud
    const requestData = await request.json()
    console.log("Datos recibidos:", JSON.stringify(requestData))

    const { email, password, userData } = requestData

    if (!email || !password || !userData) {
      return NextResponse.json(
        { success: false, error: "Faltan datos requeridos (email, password o userData)" },
        { status: 400 },
      )
    }

    // 1. Registrar el usuario en auth con privilegios de servicio
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmar el email
      user_metadata: userData,
    })

    if (authError) {
      console.error("Error al crear usuario:", authError)
      return NextResponse.json({ success: false, error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ success: false, error: "No se pudo crear el usuario" }, { status: 400 })
    }

    // 2. Insertar datos del usuario en la tabla users
    const { error: insertError } = await supabaseAdmin
      .schema("api")
      .from("users")
      .insert([
        {
          id: authData.user.id,
          ...userData,
        },
      ])

    if (insertError) {
      console.error("Error al insertar usuario en la tabla:", insertError)
      return NextResponse.json({ success: false, error: insertError.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      user: authData.user,
    })
  } catch (error) {
    console.error("Error en el registro:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}

