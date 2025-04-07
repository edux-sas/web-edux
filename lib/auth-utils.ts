import { getCurrentUser } from "./supabase"

/**
 * Verifica si el usuario está autenticado
 * @returns {Promise<{isAuthenticated: boolean, userId: string | null, userData: any | null}>}
 */
export async function checkAuthentication() {
  // Primero intentar obtener el usuario de Supabase
  const { success, user: supabaseUser } = await getCurrentUser()

  if (success && supabaseUser) {
    return {
      isAuthenticated: true,
      userId: supabaseUser.id,
      userData: {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.name || "Usuario",
        email: supabaseUser.email,
        isLoggedIn: true,
        plan: supabaseUser.user_metadata?.plan || "free",
        moodle_username: supabaseUser.user_metadata?.moodle_username,
      },
    }
  }

  // Si no hay usuario en Supabase, verificar localStorage
  const storedUser = localStorage.getItem("eduXUser")
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser)
      if (userData.isLoggedIn && userData.id) {
        return {
          isAuthenticated: true,
          userId: userData.id,
          userData,
        }
      }
    } catch (e) {
      console.error("Error parsing user data", e)
      // Limpiar datos corruptos
      localStorage.removeItem("eduXUser")
    }
  }

  // Si no hay usuario autenticado
  return {
    isAuthenticated: false,
    userId: null,
    userData: null,
  }
}

/**
 * Limpia todos los datos de sesión
 */
export function clearSessionData() {
  localStorage.removeItem("eduXUser")
  localStorage.removeItem("discResults")
  localStorage.removeItem("discUserId")
  localStorage.removeItem("moodleRegistrationStatus")
}

