import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Obtener las credenciales de PayU
    const apiKey = process.env.NEXT_PUBLIC_PAYU_API_KEY || ""
    const apiLogin = process.env.NEXT_PUBLIC_PAYU_API_LOGIN || ""
    const merchantId = process.env.NEXT_PUBLIC_PAYU_MERCHANT_ID || ""
    const isTestMode = process.env.NEXT_PUBLIC_PAYU_TEST_MODE === "true"

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

    // Añade esta sección al endpoint para probar específicamente la firma

    // Crear una solicitud de prueba con firma
    const testReferenceCode = `TEST${Date.now()}`
    const testAmount = 1000 // 1000 COP
    const testCurrency = "COP"

    // Generar firma para la prueba
    const crypto = require("crypto")
    const signatureString = `${apiKey}~${merchantId}~${testReferenceCode}~${testAmount}~${testCurrency}`
    const testSignature = crypto.createHash("md5").update(signatureString).digest("hex")

    // Crear una solicitud de prueba completa
    const testRequest = {
      language: "es",
      command: "PING",
      merchant: {
        apiKey,
        apiLogin,
      },
      test: isTestMode,
      // Incluir información adicional para verificar la firma
      transaction: {
        order: {
          accountId: merchantId,
          referenceCode: testReferenceCode,
          description: "Test de firma PayU",
          language: "es",
          signature: testSignature,
          additionalValues: {
            TX_VALUE: {
              value: testAmount,
              currency: testCurrency,
            },
          },
        },
      },
    }

    return NextResponse.json({
      status: "success",
      message: "Conexión con PayU establecida correctamente",
      payuResponse: data,
      signatureTest: {
        referenceCode: testReferenceCode,
        amount: testAmount,
        currency: testCurrency,
        signatureString,
        signature: testSignature,
      },
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
