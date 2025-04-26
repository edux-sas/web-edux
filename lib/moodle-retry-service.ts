import { createMoodleUser } from "@/lib/moodle"
import { createClient } from "@supabase/supabase-js"

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Crear cliente de Supabase con la clave de servicio
const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null

// Función para actualizar el nombre de usuario de Moodle en Supabase
async function updateMoodleUsername(userId: string, moodleUsername: string) {
  if (!supabaseAdmin) {
    console.error("No se pudo crear el cliente Supabase Admin")
    return false
  }

  try {
    // Actualizar en la tabla users
    const { error: updateError } = await supabaseAdmin
      .schema("api")
      .from("users")
      .update({ moodle_username: moodleUsername })
      .eq("id", userId)

    if (updateError) {
      console.error("Error al actualizar moodle_username en la tabla users:", updateError)
      return false
    }

    // También actualizar los metadatos del usuario
    const { error: metadataError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { moodle_username: moodleUsername },
    })

    if (metadataError) {
      console.error("Error al actualizar metadatos del usuario:", metadataError)
      return false
    }

    console.log(`✅ Moodle username '${moodleUsername}' guardado para el usuario ${userId}`)
    return true
  } catch (error) {
    console.error("Error al actualizar nombre de usuario de Moodle:", error)
    return false
  }
}

// Función principal para intentar crear usuario en Moodle con reintentos
export async function createMoodleUserWithRetry({
  userId,
  email,
  password,
  name,
  maxRetries = 5,
  delayBetweenRetries = 5000, // 5 segundos entre reintentos
}: {
  userId: string
  email: string
  password: string
  name: string
  maxRetries?: number
  delayBetweenRetries?: number
}) {
  // Extraer nombre y apellido
  const nameParts = name.split(" ")
  const firstname = nameParts[0]
  const lastname = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "-"

  // Generar un nombre de usuario único basado en el email
  const usernameBase = email.split("@")[0]

  let attempt = 0
  let success = false
  let lastError = ""
  let moodleUsername = ""

  while (attempt < maxRetries && !success) {
    attempt++

    try {
      // Generar un nombre de usuario único para cada intento
      const username = `${usernameBase}${Math.floor(Math.random() * 10000)}`

      console.log(`Intento ${attempt}/${maxRetries} de crear usuario en Moodle: ${username}`)

      const moodleResponse = await createMoodleUser({
        username,
        password,
        firstname,
        lastname,
        email,
      })

      if (moodleResponse.success) {
        success = true
        moodleUsername = moodleResponse.username || username

        // Actualizar el nombre de usuario en Supabase
        const updateSuccess = await updateMoodleUsername(userId, moodleUsername)

        if (updateSuccess) {
          console.log(`✅ Usuario de Moodle creado y actualizado en Supabase: ${moodleUsername}`)
        } else {
          console.error(`✅ Usuario de Moodle creado pero no se pudo actualizar en Supabase: ${moodleUsername}`)
        }

        return {
          success: true,
          username: moodleUsername,
          message: "Usuario creado correctamente en Moodle",
        }
      } else {
        lastError = moodleResponse.error || "Error desconocido al crear usuario en Moodle"
        console.warn(`Intento ${attempt} fallido: ${lastError}`)

        // Esperar antes del siguiente intento
        await new Promise((resolve) => setTimeout(resolve, delayBetweenRetries))
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Error desconocido"
      console.error(`Error en el intento ${attempt}:`, error)

      // Esperar antes del siguiente intento
      await new Promise((resolve) => setTimeout(resolve, delayBetweenRetries))
    }
  }

  console.error(
    `❌ No se pudo crear el usuario en Moodle después de ${maxRetries} intentos. Último error: ${lastError}`,
  )
  return {
    success: false,
    message: `No se pudo crear el usuario en Moodle después de ${maxRetries} intentos: ${lastError}`,
  }
}
