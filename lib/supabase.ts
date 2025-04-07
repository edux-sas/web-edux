import { createClient } from "@supabase/supabase-js"

// Tipos para las tablas de Supabase
export type User = {
  id: string
  name: string
  email: string
  plan: string
  payment_status: string
  purchase_date: string
  amount: number
}

export type DiscResult = {
  id?: string
  user_id: string
  d: number
  i: number
  s: number
  c: number
  created_at?: string
}

// Crear cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Verificar si las variables de entorno están definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL o Anon Key no están definidas. Por favor, configura las variables de entorno.")
}

// Crear un cliente de Supabase solo si tenemos una URL válida
export const supabase = supabaseUrl ? createClient(supabaseUrl, supabaseAnonKey) : null

// Función para registrar un usuario
export async function signUpUser(email: string, password: string, userData: Omit<User, "id">) {
  try {
    // Verificar si el cliente de Supabase existe
    if (!supabase) {
      return {
        success: false,
        error: new Error("No se ha configurado la conexión con Supabase. Por favor, contacta al administrador."),
      }
    }

    // 1. Registrar el usuario en auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    if (!authData.user) {
      throw new Error("No se pudo crear el usuario")
    }

    // 2. Insertar datos del usuario en la tabla users usando el token de autenticación
    const { error: insertError } = await supabase
      .schema("api")
      .from("users")
      .insert([
        {
          id: authData.user.id,
          ...userData,
        },
      ])
      .select()

    if (insertError) {
      console.error("Error al insertar usuario en la tabla:", insertError)

      // Si falla la inserción, intentar con el cliente de servicio si está disponible
      if (supabase.auth.admin) {
        try {
          // Intentar insertar con privilegios de servicio
          const { error: serviceInsertError } = await supabase.auth.admin.createUser({
            email,
            password,
            user_metadata: userData,
          })

          if (serviceInsertError) throw serviceInsertError
        } catch (serviceError) {
          console.error("Error al usar service_role para insertar usuario:", serviceError)
          throw insertError // Lanzar el error original si el método de servicio también falla
        }
      } else {
        throw insertError
      }
    }

    return { success: true, user: authData.user }
  } catch (error) {
    console.error("Error al registrar usuario:", error)
    return { success: false, error }
  }
}

// Función para iniciar sesión
export async function signInUser(email: string, password: string) {
  try {
    if (!supabase) {
      return {
        success: false,
        error: new Error("No se ha configurado la conexión con Supabase. Por favor, contacta al administrador."),
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return { success: true, session: data.session, user: data.user }
  } catch (error) {
    console.error("Error al iniciar sesión:", error)
    return { success: false, error }
  }
}

// Mejorar la función signOutUser para asegurar que se limpie completamente la sesión

// Función para cerrar sesión
export async function signOutUser() {
  try {
    if (!supabase) {
      return {
        success: false,
        error: new Error("No se ha configurado la conexión con Supabase. Por favor, contacta al administrador."),
      }
    }

    // Cerrar sesión en Supabase
    const { error } = await supabase.auth.signOut()

    // Limpiar datos de localStorage
    localStorage.removeItem("eduXUser")
    localStorage.removeItem("discResults")
    localStorage.removeItem("discUserId")
    localStorage.removeItem("moodleRegistrationStatus")

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("Error al cerrar sesión:", error)
    return { success: false, error }
  }
}

// Función para obtener el usuario actual
export async function getCurrentUser() {
  try {
    if (!supabase) {
      return {
        success: false,
        error: new Error("No se ha configurado la conexión con Supabase. Por favor, contacta al administrador."),
      }
    }

    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return { success: true, user: data.user }
  } catch (error) {
    console.error("Error al obtener usuario actual:", error)
    return { success: false, error }
  }
}

// Función para guardar resultados del test DISC
export async function saveDiscResults(userId: string, results: { D: number; I: number; S: number; C: number }) {
  try {
    // Intentar guardar los resultados a través de la API
    const response = await fetch("/api/disc/save-results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, results }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error en la respuesta del servidor:", errorText)
      throw new Error(`Error al guardar resultados: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || "Error desconocido al guardar resultados")
    }

    return { success: true, data: data.data }
  } catch (error) {
    console.error("Error al guardar resultados DISC:", error)
    return { success: false, error }
  }
}

// Función para obtener resultados del test DISC de un usuario
export async function getDiscResults(userId: string) {
  try {
    // Intentar obtener los resultados a través de la API
    const response = await fetch(`/api/disc/get-latest-results?userId=${userId}`)

    if (!response.ok) {
      const errorText = await response.text()

      // Si el error es "No se encontraron resultados", no es un error real
      if (response.status === 404 && errorText.includes("No se encontraron resultados")) {
        return {
          success: false,
          error: "No se encontraron resultados para este usuario",
          notFound: true, // Indicador específico para este caso
        }
      }

      console.error("Error en la respuesta del servidor:", errorText)
      throw new Error(`Error al obtener resultados: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || "Error desconocido al obtener resultados")
    }

    // Transformar los datos al formato esperado
    const discResult: DiscResult = {
      id: data.data.id,
      user_id: data.data.user_id,
      d: data.data.d,
      i: data.data.i,
      s: data.data.s,
      c: data.data.c,
      created_at: data.data.created_at,
    }

    return { success: true, results: discResult }
  } catch (error) {
    console.error("Error al obtener resultados DISC:", error)
    return { success: false, error }
  }
}

// Función para verificar la conexión con Supabase
export async function checkSupabaseConnection() {
  try {
    // Verificar si el cliente de Supabase existe
    if (!supabase) {
      return {
        connected: false,
        error: "No se ha configurado la URL de Supabase. Por favor, verifica las variables de entorno.",
        supabaseUrl: "",
        supabaseAnonKey: "No definido",
      }
    }

    // Intentar una operación simple para verificar la conexión
    // En lugar de verificar la tabla users, verificamos la conexión con la API de autenticación
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      throw error
    }

    return { connected: true }
  } catch (error) {
    console.error("Error al verificar conexión con Supabase:", error)
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Error desconocido",
      supabaseUrl,
      supabaseAnonKey: supabaseAnonKey ? "***" + supabaseAnonKey.slice(-4) : "No definido",
    }
  }
}

