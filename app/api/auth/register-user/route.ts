import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with the service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Log environment variables for debugging
console.log("[register-user] Supabase URL:", supabaseUrl ? "Defined" : "Not defined")
console.log(
  "[register-user] Service Key:",
  supabaseServiceKey ? "Defined (length: " + supabaseServiceKey.length + ")" : "Not defined",
)

// Create a client of Supabase with the service role key
const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null

export async function POST(request: NextRequest) {
  try {
    // Verify if the Supabase client exists
    if (!supabaseAdmin) {
      console.error(
        "[register-user] supabaseAdmin is null. URL:",
        supabaseUrl,
        "ServiceKey defined:",
        !!supabaseServiceKey,
      )
      return NextResponse.json(
        {
          success: false,
          error: "Supabase connection not configured. Please contact the administrator.",
        },
        { status: 500 },
      )
    }

    // Get data from the request body
    const requestData = await request.json()
    console.log("[register-user] Received data:", JSON.stringify(requestData))

    const { email, password, userData } = requestData

    if (!email || !password || !userData) {
      return NextResponse.json(
        { success: false, error: "Missing required data (email, password, or userData)" },
        { status: 400 },
      )
    }

    // Register the user in auth with service privileges
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: userData,
    })

    if (authError) {
      console.error("[register-user] Error creating user:", authError)
      return NextResponse.json({ success: false, error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ success: false, error: "Could not create user" }, { status: 400 })
    }

    // Insert user data into the users table
    const { error: insertError } = await supabaseAdmin
      .schema("api")
      .from("users")
      .insert([
        {
          id: authData.user.id,
          ...userData,
          has_completed_disc: false, // Initially, the user has not completed the DISC test
        },
      ])

    if (insertError) {
      console.error("[register-user] Error inserting user into table:", insertError)
      return NextResponse.json({ success: false, error: insertError.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      user: authData.user,
    })
  } catch (error) {
    console.error("[register-user] Error in registration:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
