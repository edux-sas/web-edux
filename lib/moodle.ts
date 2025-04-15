import { createMoodleUser as createMoodleUserAPI } from "@/lib/moodle-api"
import type { MoodleUserData } from "@/lib/moodle-api"

/**
 * Wrapper function to create a Moodle user.  Handles potential errors and returns a standardized response.
 */
export async function createMoodleUser(
  userData: MoodleUserData,
): Promise<{ success: boolean; error?: string; data?: any; username?: string }> {
  try {
    // Añadir log para depuración
    console.log("Iniciando creación de usuario en Moodle")

    const result = await createMoodleUserAPI(userData)

    // Añadir log para depuración
    console.log("Procesado resultado de createMoodleUserAPI")

    // Asegurarnos de que el nombre de usuario se está devolviendo correctamente
    return {
      success: result.success,
      data: result.data,
      error: result.error,
      username: result.username || userData.username, // Asegurarnos de devolver el nombre de usuario
    }
  } catch (error) {
    console.error("Error creating Moodle user:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
