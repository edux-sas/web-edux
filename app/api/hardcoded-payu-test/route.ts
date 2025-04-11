import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Credenciales hardcodeadas para pruebas
    const apiKey = "DQr8RmU97c4o41uLR8kpdsYF2I"
    const apiLogin = "oO7dIsaFObz7118"
    const merchantId = "1031879"
    const isTestMode = true

    // URL de la API de PayU (sandbox o producción)
    const apiUrl = isTestMode
      ? "https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi"
      : "https://api.payulatam.com/payments-api/4.0/service.cgi"

    // Crear una solicitud simple para probar la conexión
    const request = {
      language: "es",
      command: "GET_PAYMENT_METHODS",
      merchant: {
        apiKey,
        apiLogin,
      },
      test: isTestMode,
    }

    console.log("Enviando solicitud a PayU con credenciales hardcodeadas:", {
      url: apiUrl,
      apiKey: apiKey ? "Definido" : "No definido",
      apiLogin: apiLogin ? "Definido" : "No definido",
      merchantId: merchantId ? "Definido" : "No definido",
      isTestMode,
    })

    // Enviar la solicitud a PayU
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error en la respuesta de PayU:", errorText)
      throw new Error(`Error en la respuesta de PayU: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Respuesta exitosa de PayU:", data)

    return NextResponse.json({
      status: "success",
      message: "Prueba de conexión con PayU exitosa",
      payuResponse: data,
      credentialsUsed: {
        apiKey: apiKey ? "Definido" : "No definido",
        apiLogin: apiLogin ? "Definido" : "No definido",
        merchantId: merchantId ? "Definido" : "No definido",
        isTestMode,
      },
    })
  } catch (error) {
    console.error("Error al probar conexión con PayU:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
