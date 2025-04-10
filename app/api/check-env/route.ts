import { NextResponse } from "next/server"

export async function GET() {
  // Verificar las variables de entorno
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Definida" : "No definida",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Definida" : "No definida",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
      ? "Definida (primeros 5 caracteres): " + process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 5) + "..."
      : "No definida",
    PAYU_API_KEY: process.env.PAYU_API_KEY ? "Definida" : "No definida",
    PAYU_API_LOGIN: process.env.PAYU_API_LOGIN ? "Definida" : "No definida",
    PAYU_MERCHANT_ID: process.env.PAYU_MERCHANT_ID ? "Definida" : "No definida",
    PAYU_TEST_MODE: process.env.PAYU_TEST_MODE ? "Definida" : "No definida",
    // Agregar las nuevas variables públicas
    NEXT_PUBLIC_PAYU_API_KEY: process.env.NEXT_PUBLIC_PAYU_API_KEY ? "Definida" : "No definida",
    NEXT_PUBLIC_PAYU_API_LOGIN: process.env.NEXT_PUBLIC_PAYU_API_LOGIN ? "Definida" : "No definida",
    NEXT_PUBLIC_PAYU_MERCHANT_ID: process.env.NEXT_PUBLIC_PAYU_MERCHANT_ID ? "Definida" : "No definida",
    NEXT_PUBLIC_PAYU_TEST_MODE: process.env.NEXT_PUBLIC_PAYU_TEST_MODE ? "Definida" : "No definida",
  }

  return NextResponse.json({
    message: "Verificación de variables de entorno",
    environment: process.env.NODE_ENV,
    variables: envVars,
  })
}

