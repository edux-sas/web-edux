import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Verificar las credenciales de PayU
    const payuCredentials = {
      apiKey: process.env.PAYU_API_KEY || "",
      apiLogin: process.env.PAYU_API_LOGIN || "",
      merchantId: process.env.PAYU_MERCHANT_ID || "",
      testMode: process.env.PAYU_TEST_MODE === "true",
    }

    // Verificar si las credenciales están definidas
    const credentialsStatus = {
      apiKey: payuCredentials.apiKey ? "Definida" : "No definida",
      apiLogin: payuCredentials.apiLogin ? "Definida" : "No definida",
      merchantId: payuCredentials.merchantId ? "Definida" : "No definida",
      testMode: payuCredentials.testMode ? "Activado" : "Desactivado",
    }

    // Verificar si las credenciales coinciden con las esperadas
    const expectedApiKey = "DQr8RmU97c4o41uLR8kpdsYF2l"
    const expectedApiLogin = "oO7dlsaFObz7118"
    const expectedMerchantId = "1022766"

    const credentialsMatch = {
      apiKey: payuCredentials.apiKey === expectedApiKey,
      apiLogin: payuCredentials.apiLogin === expectedApiLogin,
      merchantId: payuCredentials.merchantId === expectedMerchantId,
    }

    return NextResponse.json({
      status: "success",
      message: "Verificación de credenciales de PayU",
      credentialsStatus,
      credentialsMatch,
      apiUrl: payuCredentials.testMode
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
