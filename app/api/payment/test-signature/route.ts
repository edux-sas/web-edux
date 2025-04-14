import { NextResponse } from "next/server"
import crypto from "crypto"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Obtener las credenciales de PayU
    const apiKey = process.env.NEXT_PUBLIC_PAYU_API_KEY || ""
    const merchantId = process.env.NEXT_PUBLIC_PAYU_MERCHANT_ID || ""

    // Generar un código de referencia para pruebas
    const referenceCode = `TEST_${Date.now()}`

    // Monto de prueba
    const amount = 3000
    const currency = "COP"

    // Generar diferentes variantes de la firma para depuración
    const signatures = generateSignatureVariants(apiKey, merchantId, referenceCode, amount, currency)

    return NextResponse.json({
      success: true,
      message: "Firmas generadas para depuración",
      credentials: {
        apiKey: apiKey ? `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 5)}` : "No definido",
        merchantId,
        isTestMode: process.env.NEXT_PUBLIC_PAYU_TEST_MODE === "true",
      },
      testData: {
        referenceCode,
        amount,
        currency,
      },
      signatures,
    })
  } catch (error) {
    console.error("Error al generar firmas de prueba:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}

function generateSignatureVariants(
  apiKey: string,
  merchantId: string,
  referenceCode: string,
  amount: number,
  currency: string,
) {
  // Diferentes formatos de monto
  const amountFormats = {
    integer: Math.round(amount).toString(),
    decimal2: amount.toFixed(2),
    decimal1: amount.toFixed(1),
    raw: amount.toString(),
  }

  // Diferentes combinaciones para la firma
  const variants = [
    // Variante 1: Estándar con monto entero
    {
      name: "Estándar (monto entero)",
      string: `${apiKey}~${merchantId}~${referenceCode}~${amountFormats.integer}~${currency}`,
    },
    // Variante 2: Estándar con 2 decimales
    {
      name: "Estándar (2 decimales)",
      string: `${apiKey}~${merchantId}~${referenceCode}~${amountFormats.decimal2}~${currency}`,
    },
    // Variante 3: Con espacios adicionales
    {
      name: "Con espacios adicionales (trimmed)",
      string: `${apiKey.trim()}~${merchantId.trim()}~${referenceCode.trim()}~${amountFormats.integer.trim()}~${currency.trim()}`,
    },
    // Variante 4: Con estado (para notificaciones)
    {
      name: "Con estado APPROVED",
      string: `${apiKey}~${merchantId}~${referenceCode}~${amountFormats.integer}~${currency}~4`,
    },
    // Variante 5: Con estado PENDING
    {
      name: "Con estado PENDING",
      string: `${apiKey}~${merchantId}~${referenceCode}~${amountFormats.integer}~${currency}~7`,
    },
    // Variante 6: Minúsculas
    {
      name: "Todo en minúsculas",
      string: `${apiKey.toLowerCase()}~${merchantId.toLowerCase()}~${referenceCode.toLowerCase()}~${amountFormats.integer}~${currency.toLowerCase()}`,
    },
    // Variante 7: Sin ~ al final
    {
      name: "Sin ~ al final",
      string: `${apiKey}~${merchantId}~${referenceCode}~${amountFormats.integer}~${currency}`,
    },
  ]

  // Generar firmas MD5 para cada variante
  return variants.map((variant) => ({
    name: variant.name,
    string: variant.string,
    signature: crypto.createHash("md5").update(variant.string).digest("hex"),
  }))
}
