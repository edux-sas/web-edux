import { type NextRequest, NextResponse } from "next/server"
import { enrollUserInCategoryCourses, getCoursesByCategory } from "@/lib/moodle-api"

/**
 * Endpoint para probar la inscripción de usuarios en cursos de una categoría
 * Útil para diagnosticar problemas con la inscripción automática
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar si la integración con Moodle está habilitada
    if (process.env.ENABLE_MOODLE_INTEGRATION !== "true") {
      return NextResponse.json(
        { success: false, error: "La integración con Moodle no está habilitada" },
        { status: 400 },
      )
    }

    // Obtener parámetros de la URL
    const userId = request.nextUrl.searchParams.get("userId")
    const categoryId = request.nextUrl.searchParams.get("categoryId") || "2" // Categoría 2 por defecto

    if (!userId) {
      return NextResponse.json({ success: false, error: "Falta el parámetro userId" }, { status: 400 })
    }

    // Primero, obtener los cursos de la categoría para verificar que existan
    const coursesResponse = await getCoursesByCategory(Number(categoryId))

    if (!coursesResponse.success) {
      return NextResponse.json(
        { success: false, error: `Error al obtener cursos: ${coursesResponse.error}` },
        { status: 500 },
      )
    }

    const courses = coursesResponse.data

    if (!courses || courses.length === 0) {
      return NextResponse.json(
        { success: false, error: `No se encontraron cursos en la categoría ${categoryId}` },
        { status: 404 },
      )
    }

    // Intentar inscribir al usuario en los cursos
    const enrollmentResponse = await enrollUserInCategoryCourses(Number(userId), Number(categoryId))

    if (!enrollmentResponse.success) {
      return NextResponse.json({ success: false, error: enrollmentResponse.error, courses }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Usuario inscrito en ${enrollmentResponse.data?.successfulEnrollments || 0} de ${courses.length} cursos`,
      data: enrollmentResponse.data,
      courses,
    })
  } catch (error) {
    console.error("Error al probar inscripción en Moodle:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}

