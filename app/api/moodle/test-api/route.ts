import { type NextRequest, NextResponse } from "next/server"
import { createMoodleUser, getMoodleUserByEmail, testMoodleConnection } from "@/lib/moodle-api"

/**
 * Endpoint para probar la API de Moodle
 * Permite verificar si las funciones de la API están funcionando correctamente
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
    const { action, email, password, firstname, lastname, username } = requestData

    // Verificar la conexión con Moodle
    const connectionTest = await testMoodleConnection()
    if (!connectionTest.success) {
      return NextResponse.json(
        {
          success: false,
          error: `No se pudo conectar con Moodle: ${connectionTest.error}`,
          connectionTest,
        },
        { status: 500 },
      )
    }

    // Ejecutar la acción solicitada
    switch (action) {
      case "test_connection":
        return NextResponse.json({
          success: true,
          message: "Conexión con Moodle establecida correctamente",
          data: connectionTest.data,
        })

      case "check_user":
        if (!email) {
          return NextResponse.json(
            { success: false, error: "Se requiere un email para verificar el usuario" },
            { status: 400 },
          )
        }

        const userCheck = await getMoodleUserByEmail(email)
        return NextResponse.json({
          success: userCheck.success,
          message: userCheck.success
            ? `Usuario encontrado: ${userCheck.username}`
            : `No se encontró el usuario: ${userCheck.error}`,
          data: userCheck.data,
          username: userCheck.username,
        })

      case "create_user":
        if (!email || !password || !firstname) {
          return NextResponse.json(
            { success: false, error: "Faltan datos requeridos (email, password, firstname)" },
            { status: 400 },
          )
        }

        // Generar un nombre de usuario único si no se proporciona
        const finalUsername = username || email.split("@")[0] + Math.floor(Math.random() * 1000)

        const createResult = await createMoodleUser({
          username: finalUsername,
          password,
          firstname,
          lastname: lastname || "-",
          email,
        })

        return NextResponse.json({
          success: createResult.success,
          message: createResult.success
            ? `Usuario creado correctamente: ${createResult.username}`
            : `Error al crear usuario: ${createResult.error}`,
          data: createResult.data,
          username: createResult.username,
          error: createResult.error,
        })

      default:
        return NextResponse.json(
          { success: false, error: "Acción no válida. Opciones: test_connection, check_user, create_user" },
          { status: 400 },
        )
    }
  } catch (error) {
    console.error("Error en la API de prueba de Moodle:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}
