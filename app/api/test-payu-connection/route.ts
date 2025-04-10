import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Obtener las credenciales de PayU
    const apiKey = process.env.PAYU_API_KEY || ""
    const apiLogin = process.env.PAYU_API_LOGIN || ""
    const merchantId = process.env.PAYU_MERCHANT_ID || ""
    const isTestMode = process.env.PAYU_TEST_MODE === "true"

    // Verificar que las credenciales estén definidas
    if (!apiKey || !apiLogin || !merchantId) {
      return NextResponse.json(
        {
          status: "error",
          message: "Credenciales de PayU no configuradas correctamente",
          credentialsStatus: {
            apiKey: apiKey ? "Definida" : "No definida",
            apiLogin: apiLogin ? "Definida" : "No definida",
            merchantId: merchantId ? "Definida" : "No definida",
          },
        },
        { status: 400 },
      )
    }

    // URL de la API de PayU (sandbox o producción)
    const apiUrl = isTestMode
      ? "https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi"
      : "https://api.payulatam.com/payments-api/4.0/service.cgi"

    // Crear una solicitud simple para probar la conexión (GET_PAYMENT_METHODS)
    const payuRequest = {
      language: "es",
      command: "GET_PAYMENT_METHODS",
      merchant: {
        apiKey,
        apiLogin,
      },
      test: isTestMode,
    }

    // Enviar la solicitud a PayU
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payuRequest),
    })

    // Verificar la respuesta
    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        {
          status: "error",
          message: `Error en la respuesta de PayU: ${response.status} ${response.statusText}`,
          responseText: errorText,
        },
        { status: response.status },
      )
    }

    // Procesar la respuesta
    const data = await response.json()

    return NextResponse.json({
      status: "success",
      message: "Conexión con PayU establecida correctamente",
      payuResponse: data,
    })
  } catch (error) {
    console.error("Error al probar la conexión con PayU:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
