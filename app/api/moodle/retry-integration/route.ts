import { type NextRequest, NextResponse } from "next/server"
import { createMoodleUserWithRetry } from "@/lib/moodle-retry-service"
import { createClient } from "@supabase/supabase-js"

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = supabaseUrl ? createClient(supabaseUrl, supabaseAnonKey) : null

export async function POST(request: NextRequest) {
  try {
    // Verificar si la integración con Moodle está habilitada
    if (process.env.ENABLE_MOODLE_INTEGRATION !== "true") {
      return NextResponse.json(
        {
          success: false,
          error: "La integración con Moodle está desactivada",
        },
        { status: 400 },
      )
    }

    // Obtener datos del cuerpo de la solicitud
    const { userId, email, password, name } = await request.json()

    if (!userId || !email || !password || !name) {
      return NextResponse.json(
        {
          success: false,
          error: "Faltan datos requeridos (userId, email, password o name)",
        },
        { status: 400 },
      )
    }

    // Iniciar el proceso de reintentos en segundo plano
    // No esperamos a que termine para responder
    createMoodleUserWithRetry({
      userId,
      email,
      password,
      name,
      maxRetries: 10, // Intentar hasta 10 veces
      delayBetweenRetries: 10000, // 10 segundos entre intentos
    })
      .then((result) => {
        console.log("Resultado del proceso de reintentos:", result)
      })
      .catch((error) => {
        console.error("Error en el proceso de reintentos:", error)
      })

    // Responder inmediatamente que el proceso ha comenzado
    return NextResponse.json({
      success: true,
      message: "Proceso de reintentos iniciado en segundo plano",
    })
  } catch (error) {
    console.error("Error al iniciar proceso de reintentos:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
