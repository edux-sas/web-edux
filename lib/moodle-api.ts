/**
 * Biblioteca para interactuar con la API de Moodle
 * Documentación: https://docs.moodle.org/dev/Web_service_API_functions
 */
import axios from "axios"

type MoodleUserData = {
  username: string
  password: string
  firstname: string
  lastname: string
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

    // Usar axios con params en lugar de FormData
    const response = await axios.post(`${MOODLE_URL}/webservice/rest/server.php`, null, {
      params: {
        wstoken: MOODLE_TOKEN,
        wsfunction: "enrol_manual_enrol_users",
        moodlewsrestformat: "json",
        "enrolments[0][roleid]": "5", // 5 = estudiante
        "enrolments[0][userid]": userId.toString(),
        "enrolments[0][courseid]": courseId.toString(),
      },
    })

    const result = response.data

    // Verificar si hay errores
    if (result.exception) {
      throw new Error(`Error de Moodle: ${result.message}`)
    }

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error("Error al inscribir usuario en curso:", error)

    let errorMessage = "Error desconocido al inscribir usuario"

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
 * Obtiene los cursos de una categoría específica
 */
export async function getCoursesByCategory(categoryId: number): Promise<MoodleResponse<any>> {
  try {
    console.log(`Obteniendo cursos de la categoría ${categoryId}...`)

    // Verificar que las variables de entorno estén configuradas
    if (!process.env.MOODLE_URL || !process.env.MOODLE_TOKEN) {
      throw new Error("Faltan variables de entorno: MOODLE_URL o MOODLE_TOKEN")
    }

    const MOODLE_URL = process.env.MOODLE_URL
    const MOODLE_TOKEN = process.env.MOODLE_TOKEN

    // Usar axios con params
    const response = await axios.get(`${MOODLE_URL}/webservice/rest/server.php`, {
      params: {
        wstoken: MOODLE_TOKEN,
        wsfunction: "core_course_get_courses_by_field",
        moodlewsrestformat: "json",
        field: "category",
        value: categoryId.toString(),
      },
    })

    const result = response.data

    // Verificar si hay errores
    if (result.exception) {
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

    // Mostrar información detallada de los cursos para depuración
    result.courses.forEach((course: any) => {
      console.log(`- Curso ID: ${course.id}, Nombre: ${course.fullname}`)
    })

    return {
      success: true,
      data: result.courses || [],
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

    // Verificar que las variables de entorno estén configuradas
    if (!process.env.MOODLE_URL || !process.env.MOODLE_TOKEN) {
      throw new Error("Faltan variables de entorno: MOODLE_URL o MOODLE_TOKEN")
    }

    const MOODLE_URL = process.env.MOODLE_URL
    const MOODLE_TOKEN = process.env.MOODLE_TOKEN

    // Inscribir al usuario en cada curso
    const enrollmentResults = []
    let hasErrors = false
    let successCount = 0

    for (const course of courses) {
      try {
        console.log(`Inscribiendo usuario ${userId} en curso ${course.id} (${course.fullname})...`)

        // Usar directamente la API de Moodle para inscribir al usuario
        const response = await axios.post(`${MOODLE_URL}/webservice/rest/server.php`, null, {
          params: {
            wstoken: MOODLE_TOKEN,
            wsfunction: "enrol_manual_enrol_users",
            moodlewsrestformat: "json",
            "enrolments[0][roleid]": "5", // 5 = estudiante
            "enrolments[0][userid]": userId.toString(),
            "enrolments[0][courseid]": course.id.toString(),
          },
        })

        // Verificar la respuesta
        const result = response.data

        // Si no hay error en la respuesta, la inscripción fue exitosa
        // (la API de Moodle devuelve un objeto vacío en caso de éxito)
        const isSuccess = !result.exception && Object.keys(result).length === 0

        if (isSuccess) {
          successCount++
          console.log(`✅ Usuario ${userId} inscrito correctamente en curso ${course.id} (${course.fullname})`)
        } else {
          console.error(`❌ Error al inscribir usuario ${userId} en curso ${course.id}:`, result)
          hasErrors = true
        }

        enrollmentResults.push({
          courseId: course.id,
          courseName: course.fullname,
          success: isSuccess,
          error: result.exception ? result.message : null,
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

    // Usar axios con params en lugar de FormData
    const response = await axios.post(`${MOODLE_URL}/webservice/rest/server.php`, null, {
      params: {
        wstoken: MOODLE_TOKEN,
        wsfunction: "core_user_create_users",
        moodlewsrestformat: "json",
        "users[0][username]": userData.username,
        "users[0][password]": userData.password,
        "users[0][firstname]": userData.firstname,
        "users[0][lastname]": userData.lastname,
        "users[0][email]": userData.email,
        "users[0][city]": userData.city || "Ciudad",
        "users[0][country]": userData.country || "CO",
        "users[0][auth]": "manual",
        "users[0][lang]": "es",
        "users[0][calendartype]": "gregorian",
      },
    })

    const result = response.data

    // Verificar si hay errores
    if (result.exception) {
      throw new Error(`Error de Moodle: ${result.message}`)
    }

    // Obtener el ID del usuario creado
    const userId = result.length > 0 ? result[0].id : null

    if (!userId) {
      throw new Error("No se pudo obtener el ID del usuario creado")
    }

    // Inscribir al usuario en un curso específico si se proporciona
    if (userData.courseid) {
      await enrollUserInCourse(userId, userData.courseid)
    }

    // Siempre inscribir al usuario en los cursos de la categoría 2 (Formación DISC)
    // independientemente de si se proporciona categoryid
    const categoryId = 2 // Categoría "Formación DISC" por defecto
    const enrollmentResult = await enrollUserInCategoryCourses(userId, categoryId)

    if (!enrollmentResult.success) {
      console.warn(
        `Advertencia: No se pudo inscribir al usuario en todos los cursos de la categoría ${categoryId}: ${enrollmentResult.error}`,
      )
    } else {
      console.log(
        `✅ Usuario inscrito en ${enrollmentResult.data?.successfulEnrollments || 0} cursos de la categoría ${categoryId}`,
      )
    }

    return {
      success: true,
      data: result,
      username: userData.username, // Devolver el nombre de usuario generado
    }
  } catch (error) {
    console.error("Error al crear usuario en Moodle:", error)

    // Mejorar el mensaje de error para diagnóstico
    let errorMessage = "Error desconocido al crear usuario en Moodle"

    if (axios.isAxiosError(error)) {
      if (error.response) {
        // La solicitud se realizó y el servidor respondió con un código de estado
        // que no está en el rango 2xx
        console.error("Respuesta de error de Moodle:", {
          status: error.response.status,
          headers: error.response.headers,
          data: error.response.data,
        })
        errorMessage = `Error ${error.response.status}: ${error.message}`
      } else if (error.request) {
        // La solicitud se realizó pero no se recibió respuesta
        console.error("No se recibió respuesta de Moodle:", error.request)
        errorMessage = "No se recibió respuesta del servidor de Moodle"
      } else {
        // Algo ocurrió al configurar la solicitud
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

    // Usar axios con params
    const response = await axios.get(`${MOODLE_URL}/webservice/rest/server.php`, {
      params: {
        wstoken: MOODLE_TOKEN,
        wsfunction: "core_user_get_users_by_field",
        moodlewsrestformat: "json",
        field: "email",
        "values[0]": email,
      },
    })

    const result = response.data

    // Verificar si hay errores
    if (result.exception) {
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

    // Usar una función simple para probar la conexión
    const response = await axios.get(`${MOODLE_URL}/webservice/rest/server.php`, {
      params: {
        wstoken: MOODLE_TOKEN,
        wsfunction: "core_webservice_get_site_info",
        moodlewsrestformat: "json",
      },
    })

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

