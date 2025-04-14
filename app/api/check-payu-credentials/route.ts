import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Verificar las credenciales de PayU
    const payuCredentials = {
      // Variables del servidor (sin prefijo)
      apiKey: process.env.PAYU_API_KEY || "",
      apiLogin: process.env.PAYU_API_LOGIN || "",
      merchantId: process.env.PAYU_MERCHANT_ID || "",
      testMode: process.env.PAYU_TEST_MODE === "true",

      // Variables públicas (con prefijo)
      publicApiKey: process.env.NEXT_PUBLIC_PAYU_API_KEY || "",
      publicApiLogin: process.env.NEXT_PUBLIC_PAYU_API_LOGIN || "",
      publicMerchantId: process.env.NEXT_PUBLIC_PAYU_MERCHANT_ID || "",
      publicTestMode: process.env.NEXT_PUBLIC_PAYU_TEST_MODE === "true",
    }

    // Verificar si las credenciales están definidas
    const credentialsStatus = {
      apiKey: payuCredentials.apiKey ? "Definida" : "No definida",
      apiLogin: payuCredentials.apiLogin ? "Definida" : "No definida",
      merchantId: payuCredentials.merchantId ? "Definida" : "No definida",
      testMode: payuCredentials.testMode ? "Activado" : "Desactivado",

      // Estado de las variables públicas
      publicApiKey: payuCredentials.publicApiKey ? "Definida" : "No definida",
      publicApiLogin: payuCredentials.publicApiLogin ? "Definida" : "No definida",
      publicMerchantId: payuCredentials.publicMerchantId ? "Definida" : "No definida",
      publicTestMode: payuCredentials.publicTestMode ? "Activado" : "Desactivado",
    }

    // Verificar si las credenciales coinciden entre sí
    const credentialsMatch = {
      apiKeyMatchesPublic: payuCredentials.apiKey === payuCredentials.publicApiKey,
      apiLoginMatchesPublic: payuCredentials.apiLogin === payuCredentials.publicApiLogin,
      merchantIdMatchesPublic: payuCredentials.merchantId === payuCredentials.publicMerchantId,
      testModeMatchesPublic: payuCredentials.testMode === payuCredentials.publicTestMode,
    }

    // Verificar si hay algún problema con las credenciales
    const hasCredentialIssues =
      !payuCredentials.publicApiKey ||
      !payuCredentials.publicApiLogin ||
      !payuCredentials.publicMerchantId ||
      !credentialsMatch.apiKeyMatchesPublic ||
      !credentialsMatch.apiLoginMatchesPublic ||
      !credentialsMatch.merchantIdMatchesPublic

    return NextResponse.json({
      status: hasCredentialIssues ? "warning" : "success",
      message: hasCredentialIssues
        ? "Hay problemas con las credenciales de PayU"
        : "Verificación de credenciales de PayU exitosa",
      credentialsStatus,
      credentialsMatch,
      apiUrl: payuCredentials.publicTestMode
        ? "https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi"
        : "https://api.payulatam.com/payments-api/4.0/service.cgi",
    })
  } catch (error) {
    console.error("Error al verificar credenciales de PayU:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
