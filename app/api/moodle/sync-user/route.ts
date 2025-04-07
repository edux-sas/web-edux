import { type NextRequest, NextResponse } from "next/server"
import { createMoodleUser, getMoodleUserByEmail } from "@/lib/moodle-api"

/**
 * Endpoint para sincronizar manualmente un usuario con Moodle
 * Útil para reintentar sincronizaciones fallidas o para sincronizar usuarios existentes
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar si la integración con Moodle está habilitada
    if (process.env.ENABLE_MOODLE_INTEGRATION !== "true") {
      return NextResponse.json(
        { success: false, error: "La integración con Moodle no está habilitada" },
        { status: 400 },
      )
    }

    // Obtener datos del cuerpo de la solicitud
    const requestData = await request.json()
    const { email, password, firstname, lastname, username, courseid } = requestData

    if (!email || !password || !firstname) {
      return NextResponse.json(
        { success: false, error: "Faltan datos requeridos (email, password, firstname)" },
        { status: 400 },
      )
    }

    // Verificar si el usuario ya existe en Moodle
    const existingUser = await getMoodleUserByEmail(email)

    if (existingUser.success && existingUser.data && existingUser.data.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "El usuario ya existe en Moodle",
          user: existingUser.data[0],
        },
        { status: 409 },
      )
    }

    // Crear usuario en Moodle
    const finalUsername = username || email.split("@")[0] + Math.floor(Math.random() * 1000)
    const finalLastname = lastname || "-"

    const result = await createMoodleUser({
      username: finalUsername,
      password,
      firstname,
      lastname: finalLastname,
      email,
      courseid: courseid ? Number(courseid) : undefined,
    })

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Usuario sincronizado correctamente con Moodle",
      data: result.data,
    })
  } catch (error) {
    console.error("Error al sincronizar usuario con Moodle:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}

