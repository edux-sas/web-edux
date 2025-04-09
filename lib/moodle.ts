import { type MoodleUserData, createMoodleUser as createMoodleUserAPI } from "@/lib/moodle-api"

/**
 * Wrapper function to create a Moodle user.  Handles potential errors and returns a standardized response.
 */
export async function createMoodleUser(
  userData: MoodleUserData,
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const result = await createMoodleUserAPI(userData)
    return { success: result.success, data: result.data, error: result.error }
  } catch (error) {
    console.error("Error creating Moodle user:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
