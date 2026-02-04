import { type NextRequest, NextResponse } from "next/server"
import { createMoodleUser, testMoodleConnection } from "@/lib/moodle-api"

export async function GET(request: NextRequest) {
  try {
    // Verificar que las variables de entorno estén configuradas
    if (!process.env.MOODLE_URL || !process.env.MOODLE_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          error: "Faltan variables de entorno: MOODLE_URL o MOODLE_TOKEN",
          env: {
            MOODLE_URL: process.env.MOODLE_URL ? "Definida" : "No definida",
            MOODLE_TOKEN: process.env.MOODLE_TOKEN ? "Definida" : "No definida",
            ENABLE_MOODLE_INTEGRATION: process.env.ENABLE_MOODLE_INTEGRATION,
          },
        },
        { status: 500 },
      )
    }

    // Probar la conexión con Moodle
    console.log("Probando conexión con Moodle...")
    const connectionResult = await testMoodleConnection()

    if (!connectionResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Error al conectar con Moodle: ${connectionResult.error}`,
          details: connectionResult,
        },
        { status: 500 },
      )
    }

    // Obtener parámetros de prueba
    const testUser = request.nextUrl.searchParams.get("testUser") === "true"

    if (!testUser) {
      return NextResponse.json({
        success: true,
        message: "Conexión exitosa con Moodle",
        siteInfo: connectionResult.data,
        help: "Para probar la creación de un usuario, añade ?testUser=true a la URL",
      })
    }

    // Crear un usuario de prueba
    console.log("Creando usuario de prueba en Moodle...")
    const testEmail = `test_${Date.now()}@example.com`
    const testUsername = `test_${Date.now()}`

    const createResult = await createMoodleUser({
      username: testUsername,
      password: "Test123456!",
      firstname: "Usuario",
      lastname: "De Prueba",
      email: testEmail,
    })

    return NextResponse.json({
      success: true,
      connection: {
        success: connectionResult.success,
        siteInfo: connectionResult.data,
      },
      userCreation: createResult,
    })
  } catch (error) {
    console.error("Error al probar integración con Moodle:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
