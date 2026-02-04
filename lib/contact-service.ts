import { createClient } from "@supabase/supabase-js"

// Crear un cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Verificar si las variables de entorno están definidas
if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Supabase URL o Service Key no están definidas. Por favor, configura las variables de entorno.")
}

// Crear un cliente de Supabase con la clave de servicio
let supabaseAdmin = null
try {
  if (supabaseUrl && supabaseServiceKey) {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
    console.log("Cliente Supabase Admin creado correctamente para mensajes de contacto")
  } else {
    console.error("No se pudo crear el cliente Supabase Admin: faltan credenciales")
  }
} catch (error) {
  console.error("Error al crear el cliente Supabase Admin:", error)
}

// Tipo para los mensajes de contacto
export type ContactMessage = {
  id?: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  created_at?: string
  processed?: boolean
  email_sent?: boolean
}

// Función para guardar un mensaje de contacto en Supabase
export async function saveContactMessage(
  message: Omit<ContactMessage, "id" | "created_at" | "processed" | "email_sent">,
) {
  try {
    // Verificar si el cliente de Supabase existe
    if (!supabaseAdmin) {
      console.error("supabaseAdmin es null. URL:", supabaseUrl, "ServiceKey definida:", !!supabaseServiceKey)
      return {
        success: false,
        error:
          "No se ha configurado la conexión con Supabase. Verifique las variables de entorno SUPABASE_SERVICE_ROLE_KEY y NEXT_PUBLIC_SUPABASE_URL.",
      }
    }

    // Insertar el mensaje en la tabla contact_messages
    const { data, error } = await supabaseAdmin
      .schema("public")
      .from("contact_messages")
      .insert([
        {
          ...message,
          processed: false,
          email_sent: false,
        },
      ])
      .select()

    if (error) {
      console.error("Error al guardar mensaje de contacto:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error al guardar mensaje de contacto:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}

// Función para obtener mensajes de contacto no procesados
export async function getUnprocessedContactMessages() {
  try {
    // Verificar si el cliente de Supabase existe
    if (!supabaseAdmin) {
      return {
        success: false,
        error: "No se ha configurado la conexión con Supabase.",
      }
    }

    // Obtener mensajes no procesados
    const { data, error } = await supabaseAdmin
      .schema("public")
      .from("contact_messages")
      .select("*")
      .eq("processed", false)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error al obtener mensajes de contacto:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error al obtener mensajes de contacto:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}

// Función para marcar un mensaje como procesado
export async function markContactMessageAsProcessed(id: string, emailSent = false) {
  try {
    // Verificar si el cliente de Supabase existe
    if (!supabaseAdmin) {
      return {
        success: false,
        error: "No se ha configurado la conexión con Supabase.",
      }
    }

    // Actualizar el mensaje
    const { error } = await supabaseAdmin
      .schema("public")
      .from("contact_messages")
      .update({
        processed: true,
        email_sent: emailSent,
      })
      .eq("id", id)

    if (error) {
      console.error("Error al marcar mensaje como procesado:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error al marcar mensaje como procesado:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}
