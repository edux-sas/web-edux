import { NextResponse } from "next/server"

export async function GET() {
  // Check environment variables
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Defined" : "Not defined",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Defined" : "Not defined",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
      ? `Defined (length: ${process.env.SUPABASE_SERVICE_ROLE_KEY.length})`
      : "Not defined",
    // Add other environment variables you want to check
  }

  return NextResponse.json({
    message: "Environment variables check",
    environment: process.env.NODE_ENV,
    variables: envVars,
  })
}
