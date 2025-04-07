import { type NextRequest, NextResponse } from "next/server"
import { testMoodleConnection } from "@/lib/moodle-api"

/**
 * Endpoint para probar la conexión con Moodle
 * Útil para verificar que las credenciales y la configuración son correctas
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar que las variables de entorno estén configuradas
    if (!process.env.MOODLE_URL) {
      return NextResponse.json({ success: false, error: "Falta la variable de entorno MOODLE_URL" }, { status: 500 })
    }

    if (!process.env.MOODLE_TOKEN) {
      return NextResponse.json({ success: false, error: "Falta la variable de entorno MOODLE_TOKEN" }, { status: 500 })
    }

    if (process.env.ENABLE_MOODLE_INTEGRATION !== "true") {
      return NextResponse.json(
        { success: false, error: "La integración con Moodle no está habilitada (ENABLE_MOODLE_INTEGRATION != true)" },
        { status: 400 },
      )
    }

    // Probar la conexión con Moodle
    const result = await testMoodleConnection()

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Error al conectar con Moodle: ${result.error}`,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Conexión exitosa con Moodle",
      siteInfo: {
        sitename: result.data.sitename,
        username: result.data.username,
        firstname: result.data.firstname,
        lastname: result.data.lastname,
        fullname: result.data.fullname,
        version: result.data.release,
      },
    })
  } catch (error) {
    console.error("Error al probar conexión con Moodle:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}

