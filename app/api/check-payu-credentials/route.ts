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

    // Análisis detallado de la API Key para detectar problemas de caracteres
    const apiKeyAnalysis = {
      value: payuCredentials.publicApiKey,
      length: payuCredentials.publicApiKey.length,
      lastChar: payuCredentials.publicApiKey.slice(-1),
      lastCharCode: payuCredentials.publicApiKey.slice(-1).charCodeAt(0),
      charCodes: Array.from(payuCredentials.publicApiKey).map((char) => char.charCodeAt(0)),
      base64: Buffer.from(payuCredentials.publicApiKey).toString("base64"),
    }

    // Verificar si las credenciales coinciden con las esperadas
    const expectedApiKey = "DQr8RmU97c4o41uLR8kpdsYF2I" // Actualizado con la API Key correcta
    const expectedApiLogin = "oO7dIsaFObz7118" // Actualizado con el API Login correcto
    const expectedMerchantId = "1031879" // Actualizado con el Merchant ID correcto

    const credentialsMatch = {
      apiKey: payuCredentials.apiKey === expectedApiKey,
      apiLogin: payuCredentials.apiLogin === expectedApiLogin,
      merchantId: payuCredentials.merchantId === expectedMerchantId,

      // Coincidencia de variables públicas
      publicApiKey: payuCredentials.publicApiKey === expectedApiKey,
      publicApiLogin: payuCredentials.publicApiLogin === expectedApiLogin,
      publicMerchantId: payuCredentials.publicMerchantId === expectedMerchantId,
    }

    return NextResponse.json({
      status: "success",
      message: "Verificación de credenciales de PayU",
      credentialsStatus,
      apiKeyAnalysis,
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
