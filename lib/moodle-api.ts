/**
 * Biblioteca para interactuar con la API de Moodle
 * Documentación: https://docs.moodle.org/dev/Web_service_API_functions
 */
import axios from "axios"

export type MoodleUserData = {
  username: string
  password: string
  firstname: string
  lastname?: string
  email: string
  city?: string
  country?: string
  courseid?: number // ID del curso para inscripción automática
  categoryid?: number // ID de la categoría para inscripción automática en todos los cursos
}

type MoodleResponse<T> = {
  success: boolean
  data?: T
  error?: string
  username?: string // Añadido para devolver el nombre de usuario
}

/**
 * Inscribe a un usuario en un curso específico
 */
export async function enrollUserInCourse(userId: number, courseId: number): Promise<MoodleResponse<any>> {
  try {
    // Verificar que las variables de entorno estén configuradas
    if (!process.env.MOODLE_URL || !process.env.MOODLE_TOKEN) {
      throw new Error("Faltan variables de entorno: MOODLE_URL o MOODLE_TOKEN")
    }

    const MOODLE_URL = process.env.MOODLE_URL
    const MOODLE_TOKEN = process.env.MOODLE_TOKEN

    console.log(`Inscribiendo usuario ${userId} en curso ${courseId}...`)

    // Construir la URL con los parámetros como query string
    const url = new URL(`${MOODLE_URL}/webservice/rest/server.php`)

    // Añadir parámetros básicos
    url.searchParams.append("wstoken", MOODLE_TOKEN)
    url.searchParams.append("wsfunction", "enrol_manual_enrol_users")
    url.searchParams.append("moodlewsrestformat", "json")

    // Añadir datos de inscripción
    url.searchParams.append("enrolments[0][roleid]", "5") // 5 = estudiante
    url.searchParams.append("enrolments[0][userid]", userId.toString())
    url.searchParams.append("enrolments[0][courseid]", courseId.toString())

    console.log(`Preparando inscripción de usuario ${userId} en curso ${courseId}`)

    // Hacer la solicitud GET
    const response = await axios.get(url.toString())

    const result = response.data

    // Verificar si hay errores
    if (result && result.exception) {
      throw new Error(`Error de Moodle: ${result.message}`)
    }

    console.log(`✅ Usuario ${userId} inscrito correctamente en curso ${courseId}`)
    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error("Error al inscribir usuario en curso:", error)

    let errorMessage = "Error desconocido al inscribir usuario"

    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Respuesta de error:", error.response.data)
        errorMessage = `Error ${error.response.status}: ${error.message}`
      } else if (error.request) {
        errorMessage = "No se recibió respuesta del servidor de Moodle"
      } else {
        errorMessage = `Error de configuración: ${error.message}`
      }
    } else if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Obtiene los cursos de una categoría específica
 */
export async function getCoursesByCategory(categoryId: number): Promise<MoodleResponse<any>> {
  try {
    // Verificar que las variables de entorno estén configuradas
    if (!process.env.MOODLE_URL || !process.env.MOODLE_TOKEN) {
      throw new Error("Faltan variables de entorno: MOODLE_URL o MOODLE_TOKEN")
    }

    const MOODLE_URL = process.env.MOODLE_URL
    const MOODLE_TOKEN = process.env.MOODLE_TOKEN

    console.log(`Obteniendo cursos de la categoría ${categoryId}...`)

    // Construir la URL con los parámetros como query string
    const url = new URL(`${MOODLE_URL}/webservice/rest/server.php`)

    // Añadir parámetros
    url.searchParams.append("wstoken", MOODLE_TOKEN)
    url.searchParams.append("wsfunction", "core_course_get_courses_by_field")
    url.searchParams.append("moodlewsrestformat", "json")
    url.searchParams.append("field", "category")
    url.searchParams.append("value", categoryId.toString())

    // Hacer la solicitud GET
    const response = await axios.get(url.toString())

    const result = response.data

    // Verificar si hay errores
    if (result && result.exception) {
      throw new Error(`Error de Moodle: ${result.message}`)
    }

    // Verificar si hay cursos
    if (!result.courses || !Array.isArray(result.courses)) {
      console.warn(`No se encontraron cursos en la categoría ${categoryId} o formato de respuesta inesperado:`, result)
      return {
        success: true,
        data: [],
      }
    }

    console.log(`Se encontraron ${result.courses.length} cursos en la categoría ${categoryId}`)

    return {
      success: true,
      data: result.courses,
    }
  } catch (error) {
    console.error("Error al obtener cursos por categoría:", error)

    let errorMessage = "Error desconocido al obtener cursos"

    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Respuesta de error:", error.response.data)
        errorMessage = `Error ${error.response.status}: ${error.message}`
      } else if (error.request) {
        errorMessage = "No se recibió respuesta del servidor de Moodle"
      } else {
        errorMessage = `Error de configuración: ${error.message}`
      }
    } else if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Inscribe a un usuario en todos los cursos de una categoría
 */
export async function enrollUserInCategoryCourses(userId: number, categoryId: number): Promise<MoodleResponse<any>> {
  try {
    console.log(`Iniciando inscripción del usuario ${userId} en cursos de la categoría ${categoryId}...`)

    // Obtener los cursos de la categoría
    const coursesResponse = await getCoursesByCategory(categoryId)

    if (!coursesResponse.success) {
      throw new Error(`Error al obtener cursos: ${coursesResponse.error}`)
    }

    const courses = coursesResponse.data
    console.log(`Se encontraron ${courses.length} cursos en la categoría ${categoryId}`)

    if (!courses || courses.length === 0) {
      return {
        success: true,
        data: { message: "No hay cursos en esta categoría", successfulEnrollments: 0 },
      }
    }

    // Inscribir al usuario en cada curso
    const enrollmentResults = []
    let hasErrors = false
    let successCount = 0

    for (const course of courses) {
      try {
        // Llamar a la función enrollUserInCourse para cada curso
        const enrollResult = await enrollUserInCourse(userId, course.id)

        if (enrollResult.success) {
          successCount++
        } else {
          hasErrors = true
        }

        enrollmentResults.push({
          courseId: course.id,
          courseName: course.fullname,
          success: enrollResult.success,
          error: enrollResult.error || null,
        })
      } catch (error) {
        console.error(`❌ Excepción al inscribir usuario ${userId} en curso ${course.id}:`, error)
        hasErrors = true

        enrollmentResults.push({
          courseId: course.id,
          courseName: course.fullname || `Curso ${course.id}`,
          success: false,
          error: error instanceof Error ? error.message : "Error desconocido",
        })
      }
    }

    return {
      success: !hasErrors || successCount > 0, // Consideramos éxito parcial si al menos un curso fue inscrito
      data: {
        enrollments: enrollmentResults,
        totalCourses: courses.length,
        successfulEnrollments: successCount,
        message: `Usuario inscrito en ${successCount} de ${courses.length} cursos de la categoría ${categoryId}`,
      },
    }
  } catch (error) {
    console.error("Error al inscribir usuario en cursos de categoría:", error)

    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}

/**
 * Crea un usuario en Moodle a través de la API Web Services
 */
export async function createMoodleUser(userData: MoodleUserData): Promise<MoodleResponse<any>> {
  try {
    // Verificar que las variables de entorno estén configuradas
    if (!process.env.MOODLE_URL || !process.env.MOODLE_TOKEN) {
      throw new Error("Faltan variables de entorno: MOODLE_URL o MOODLE_TOKEN")
    }

    const MOODLE_URL = process.env.MOODLE_URL
    const MOODLE_TOKEN = process.env.MOODLE_TOKEN

    // Validar datos de entrada
    if (!userData.username || !userData.password || !userData.firstname || !userData.email) {
      throw new Error("Faltan datos requeridos para crear el usuario en Moodle")
    }

    // Asegurarse de que el apellido no esté vacío
    const lastname = userData.lastname || "-"

    console.log("Iniciando creación de usuario en Moodle...")

    // Construir la URL con los parámetros como query string
    // Este enfoque funciona mejor con algunas versiones de Moodle
    const url = new URL(`${MOODLE_URL}/webservice/rest/server.php`)

    // Añadir parámetros básicos
    url.searchParams.append("wstoken", MOODLE_TOKEN)
    url.searchParams.append("wsfunction", "core_user_create_users")
    url.searchParams.append("moodlewsrestformat", "json")

    // Añadir datos del usuario
    url.searchParams.append("users[0][username]", userData.username)
    url.searchParams.append("users[0][password]", userData.password)
    url.searchParams.append("users[0][firstname]", userData.firstname)
    url.searchParams.append("users[0][lastname]", lastname)
    url.searchParams.append("users[0][email]", userData.email)
    url.searchParams.append("users[0][city]", userData.city || "Ciudad")
    url.searchParams.append("users[0][country]", userData.country || "CO")
    url.searchParams.append("users[0][auth]", "manual")
    url.searchParams.append("users[0][lang]", "es")

    console.log("Preparando solicitud para crear usuario en Moodle")

    // Hacer la solicitud GET en lugar de POST
    // Algunas versiones de Moodle funcionan mejor con GET para esta operación
    const response = await axios.get(url.toString())

    const result = response.data

    // Verificar si hay errores
    if (result && result.exception) {
      throw new Error(`Error de Moodle: ${result.message}`)
    }

    // Obtener el ID del usuario creado
    const userId = result && Array.isArray(result) && result.length > 0 ? result[0].id : null

    if (!userId) {
      throw new Error("No se pudo obtener el ID del usuario creado")
    }

    console.log(`✅ Usuario creado en Moodle con ID: ${userId}`)

    // Si se especificó un curso, inscribir al usuario
    if (userData.courseid) {
      await enrollUserInCourse(userId, userData.courseid)
    } else {
      // Inscribir en todos los cursos de la categoría 2 (Formación DISC)
      const enrollmentResult = await enrollUserInCategoryCourses(userId, 2)

      if (enrollmentResult.success) {
        console.log(`✅ Usuario inscrito en cursos de la categoría 2 correctamente`)
        return {
          success: true,
          data: {
            ...result,
            enrollments: enrollmentResult.data?.enrollments,
            successfulEnrollments: enrollmentResult.data?.successfulEnrollments,
          },
          username: userData.username,
        }
      } else {
        console.error(`❌ Error al inscribir usuario en cursos: ${enrollmentResult.error}`)
        // Aún consideramos exitosa la creación del usuario aunque falle la inscripción
        return {
          success: true,
          data: {
            ...result,
            enrollmentError: enrollmentResult.error,
          },
          username: userData.username,
          error: `Usuario creado pero no se pudo inscribir en cursos: ${enrollmentResult.error}`,
        }
      }
    }

    return {
      success: true,
      data: result,
      username: userData.username,
    }
  } catch (error) {
    console.error("Error al crear usuario en Moodle:", error)

    let errorMessage = "Error desconocido al crear usuario en Moodle"

    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Respuesta de error de Moodle:", {
          status: error.response.status,
          headers: error.response.headers,
          data: error.response.data,
        })
        errorMessage = `Error ${error.response.status}: ${error.message}`

        if (error.response.data && typeof error.response.data === "object") {
          console.error("Detalles del error de Moodle:", JSON.stringify(error.response.data, null, 2))
          if (error.response.data.message) {
            errorMessage += ` - ${error.response.data.message}`
          }
          if (error.response.data.debuginfo) {
            errorMessage += ` - Debug: ${error.response.data.debuginfo}`
          }
        }
      } else if (error.request) {
        console.error("No se recibió respuesta de Moodle:", error.request)
        errorMessage = "No se recibió respuesta del servidor de Moodle"
      } else {
        errorMessage = `Error de configuración: ${error.message}`
      }
    } else if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Obtiene información de un usuario de Moodle por su email
 */
export async function getMoodleUserByEmail(email: string): Promise<MoodleResponse<any>> {
  try {
    // Verificar que las variables de entorno estén configuradas
    if (!process.env.MOODLE_URL || !process.env.MOODLE_TOKEN) {
      throw new Error("Faltan variables de entorno: MOODLE_URL o MOODLE_TOKEN")
    }

    const MOODLE_URL = process.env.MOODLE_URL
    const MOODLE_TOKEN = process.env.MOODLE_TOKEN

    // Construir la URL con los parámetros como query string
    const url = new URL(`${MOODLE_URL}/webservice/rest/server.php`)

    // Añadir parámetros
    url.searchParams.append("wstoken", MOODLE_TOKEN)
    url.searchParams.append("wsfunction", "core_user_get_users_by_field")
    url.searchParams.append("moodlewsrestformat", "json")
    url.searchParams.append("field", "email")
    url.searchParams.append("values[0]", email)

    // Hacer la solicitud GET
    const response = await axios.get(url.toString())

    const result = response.data

    // Verificar si hay errores
    if (result && result.exception) {
      throw new Error(`Error de Moodle: ${result.message}`)
    }

    // Si encontramos el usuario, devolver su nombre de usuario
    let username = null
    if (result && result.length > 0) {
      username = result[0].username
    }

    return {
      success: true,
      data: result,
      username: username,
    }
  } catch (error) {
    console.error("Error al obtener usuario de Moodle:", error)

    let errorMessage = "Error desconocido al obtener usuario"

    if (axios.isAxiosError(error)) {
      if (error.response) {
        errorMessage = `Error ${error.response.status}: ${error.message}`
      } else if (error.request) {
        errorMessage = "No se recibió respuesta del servidor de Moodle"
      } else {
        errorMessage = `Error de configuración: ${error.message}`
      }
    } else if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Verifica la conexión con Moodle y devuelve información del sitio
 */
export async function testMoodleConnection(): Promise<MoodleResponse<any>> {
  try {
    // Verificar que las variables de entorno estén configuradas
    if (!process.env.MOODLE_URL || !process.env.MOODLE_TOKEN) {
      throw new Error("Faltan variables de entorno: MOODLE_URL o MOODLE_TOKEN")
    }

    const MOODLE_URL = process.env.MOODLE_URL
    const MOODLE_TOKEN = process.env.MOODLE_TOKEN

    // Construir la URL con los parámetros como query string
    const url = new URL(`${MOODLE_URL}/webservice/rest/server.php`)

    // Añadir parámetros
    url.searchParams.append("wstoken", MOODLE_TOKEN)
    url.searchParams.append("wsfunction", "core_webservice_get_site_info")
    url.searchParams.append("moodlewsrestformat", "json")

    // Hacer la solicitud GET
    const response = await axios.get(url.toString())

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error("Error al probar conexión con Moodle:", error)

    let errorMessage = "Error desconocido al conectar con Moodle"

    if (axios.isAxiosError(error)) {
      if (error.response) {
        errorMessage = `Error ${error.response.status}: ${error.message}`
      } else if (error.request) {
        errorMessage = "No se recibió respuesta del servidor de Moodle"
      } else {
        errorMessage = `Error de configuración: ${error.message}`
      }
    } else if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}
