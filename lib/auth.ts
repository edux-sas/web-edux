import { createClient } from "@supabase/supabase-js"

// Type for the user data
type UserData = {
  id?: string
  name: string
  email: string
  plan: string
  payment_status: string
  purchase_date: string
  amount: number
}

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Verify if the environment variables are defined
if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Supabase URL or Service Key are not defined. Please configure the environment variables.")
}

// Create a Supabase client with the service key
let supabaseAdmin = null
try {
  if (supabaseUrl && supabaseServiceKey) {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
    console.log("Supabase Admin client created successfully for user registration")
  } else {
    console.error("Failed to create Supabase Admin client: missing credentials")
  }
} catch (error) {
  console.error("Error creating Supabase Admin client:", error)
}

// Function to register a user
export async function register(userData: Omit<UserData, "id"> & { email: string; password: string }) {
  try {
    // Destructure data
    const { email, password, ...rest } = userData

    // Verify if the Supabase client exists
    if (!supabaseAdmin) {
      console.error("supabaseAdmin is null. URL:", supabaseUrl, "ServiceKey defined:", !!supabaseServiceKey)
      return {
        success: false,
        error: new Error("Supabase connection not configured. Please contact the administrator."),
      }
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email,
      password,
    })

    if (authError) {
      console.error("Error creating user:", authError)
      return { success: false, error: authError }
    }

    if (!authData.user) {
      throw new Error("Failed to create user")
    }

    return { success: true, data: authData }
  } catch (error) {
    console.error("Error in register function:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
