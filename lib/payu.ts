import crypto from "crypto"

// Tipos para la integración con PayU
export type PayUTransaction = {
  order: {
    accountId: string
    referenceCode: string
    description: string
    language: string
    signature: string
    notifyUrl: string
    additionalValues: {
      TX_VALUE: {
        value: number
        currency: string
      }
      TX_TAX?: {
        value: number
        currency: string
      }
      TX_TAX_RETURN_BASE?: {
        value: number
        currency: string
      }
    }
    buyer: {
      merchantBuyerId?: string
      fullName: string
      emailAddress: string
      contactPhone: string
      dniNumber: string
      shippingAddress: {
        street1: string
        street2?: string
        city: string
        state: string
        country: string
        postalCode: string
        phone: string
      }
    }
    payer: {
      merchantPayerId?: string
      fullName: string
      emailAddress: string
      contactPhone: string
      dniNumber: string
      billingAddress: {
        street1: string
        street2?: string
        city: string
        state: string
        country: string
        postalCode: string
        phone: string
      }
    }
    creditCard?: {
      number: string
      securityCode: string
      expirationDate: string
      name: string
    }
    extraParameters?: Record<string, string>
    type: string
    paymentMethod: string
    paymentCountry: string
    deviceSessionId: string
    ipAddress: string
    cookie: string
    userAgent: string
  }
  payer: {
    merchantPayerId?: string
    fullName: string
    emailAddress: string
    contactPhone: string
    dniNumber: string
    billingAddress: {
      street1: string
      street2?: string
      city: string
      state: string
      country: string
      postalCode: string
      phone: string
    }
  }
  creditCard?: {
    number: string
    securityCode: string
    expirationDate: string
    name: string
  }
  extraParameters?: Record<string, string>
  type: string
  paymentMethod: string
  paymentCountry: string
  deviceSessionId: string
  ipAddress: string
  cookie: string
  userAgent: string
}

export type PayURequest = {
  language: string
  command: string
  merchant: {
    apiKey: string
    apiLogin: string
  }
  transaction: PayUTransaction
  test: boolean
}

export type PayUResponse = {
  code: string
  error: string | null
  transactionResponse: {
    orderId?: number
    transactionId?: string
    state: string
    paymentNetworkResponseCode?: string | null
    paymentNetworkResponseErrorMessage?: string | null
    trazabilityCode?: string
    authorizationCode?: string | null
    pendingReason?: string | null
    responseCode: string
    errorCode?: string | null
    responseMessage?: string | null
    transactionDate?: string | null
    transactionTime?: string | null
    operationDate?: number
    extraParameters?: Record<string, string>
    additionalInfo?: {
      paymentNetwork?: string
      rejectionType?: string
      responseNetworkMessage?: string | null
      cardType?: string | null
      transactionType?: string
    }
  }
}

// Función para generar la firma PayU
export function generatePayUSignature(
  apiKey: string,
  merchantId: string,
  referenceCode: string,
  amount: number,
  currency: string,
): string {
  // Asegurar que el referenceCode no tenga espacios al inicio o final
  const cleanReferenceCode = referenceCode.trim()

  // IMPORTANTE: Para COP, PayU espera valores enteros sin decimales
  // Para otras monedas, puede requerir 2 decimales
  let formattedAmount: string

  if (currency === "COP") {
    // Para COP, redondear a entero y convertir a string
    formattedAmount = Math.round(amount).toString()
  } else {
    // Para otras monedas, usar 2 decimales
    formattedAmount = amount.toFixed(2)
  }

  // Crear el string para la firma: apiKey~merchantId~referenceCode~amount~currency
  const signatureString = `${apiKey}~${merchantId}~${cleanReferenceCode}~${formattedAmount}~${currency}`

  console.log("String para firma PayU:", signatureString)

  // Generar el hash MD5
  const signature = crypto.createHash("md5").update(signatureString).digest("hex")
  console.log("Firma generada (MD5):", signature)

  return signature
}

// Función para validar la firma de PayU en notificaciones
export function validatePayUSignature(notificationData: any, apiKey: string): boolean {
  // Si no hay firma o no hay datos, la firma no es válida
  if (!notificationData || !notificationData.signature || !apiKey) {
    return false
  }

  // La firma recibida en la notificación
  const receivedSignature = notificationData.signature

  try {
    // Diferentes formatos de firma según el tipo de notificación
    let signatureString = ""

    // Para notificaciones estándar de PayU
    if (
      notificationData.reference_sale &&
      notificationData.value &&
      notificationData.currency &&
      notificationData.state_pol
    ) {
      // Formatear el valor según la moneda
      let formattedValue: string
      if (notificationData.currency === "COP") {
        formattedValue = Math.round(Number.parseFloat(notificationData.value)).toString()
      } else {
        formattedValue = Number.parseFloat(notificationData.value).toFixed(2)
      }

      // El formato estándar es: apiKey~merchantId~referenceCode~valor~moneda~estado
      signatureString = `${apiKey}~${notificationData.merchant_id}~${notificationData.reference_sale}~${formattedValue}~${notificationData.currency}~${notificationData.state_pol}`
    }
    // Para notificaciones de confirmación de transacción
    else if (notificationData.transaction_id && notificationData.reference_code && notificationData.amount) {
      // Formatear el monto según la moneda
      let formattedAmount: string
      if (notificationData.currency === "COP") {
        formattedAmount = Math.round(Number.parseFloat(notificationData.amount)).toString()
      } else {
        formattedAmount = Number.parseFloat(notificationData.amount).toFixed(2)
      }

      // Otro formato común
      signatureString = `${apiKey}~${notificationData.merchant_id}~${notificationData.reference_code}~${formattedAmount}~${notificationData.currency}`
    }
    // Si no reconocemos el formato, fallamos por seguridad
    else {
      console.error("Formato de notificación desconocido", notificationData)
      return false
    }

    console.log("String para validación de firma PayU:", signatureString)

    // Generar el hash MD5 del signatureString
    const calculatedSignature = crypto.createHash("md5").update(signatureString).digest("hex")

    console.log("Firma recibida:", receivedSignature)
    console.log("Firma calculada:", calculatedSignature)

    // Comparar la firma calculada con la recibida
    return calculatedSignature === receivedSignature
  } catch (error) {
    console.error("Error al validar firma de PayU:", error)
    return false
  }
}

// Función para validar el número de tarjeta usando el algoritmo de Luhn
export function validateCardNumber(cardNumber: string): boolean {
  // Eliminar espacios y guiones
  const cleanNumber = cardNumber.replace(/[\s-]/g, "")

  // Verificar que solo contenga dígitos y tenga una longitud válida (13-19 dígitos)
  if (!/^\d{13,19}$/.test(cleanNumber)) {
    return false
  }

  // Algoritmo de Luhn (módulo 10)
  let sum = 0
  let shouldDouble = false

  // Recorrer el número de derecha a izquierda
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(cleanNumber.charAt(i), 10)

    if (shouldDouble) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    shouldDouble = !shouldDouble
  }

  return sum % 10 === 0
}

// Función para obtener tarjetas de prueba según el tipo y resultado deseado
export function getTestCard(cardType: string, result = "APPROVED"): { number: string; name: string } {
  const testCards: Record<string, Record<string, { number: string; name: string }>> = {
    VISA: {
      APPROVED: { number: "4111111111111111", name: "APPROVED" },
      PENDING: { number: "4111111111111111", name: "PENDING" },
      DECLINED: { number: "4111111111111111", name: "REJECTED" },
    },
    MASTERCARD: {
      APPROVED: { number: "5500000000000004", name: "APPROVED" },
      PENDING: { number: "5500000000000004", name: "PENDING" },
      DECLINED: { number: "5500000000000004", name: "REJECTED" },
    },
    AMEX: {
      APPROVED: { number: "370000000000002", name: "APPROVED" },
      PENDING: { number: "370000000000002", name: "PENDING" },
      DECLINED: { number: "370000000000002", name: "REJECTED" },
    },
    DINERS: {
      APPROVED: { number: "36007777777772", name: "APPROVED" },
      PENDING: { number: "36007777777772", name: "PENDING" },
      DECLINED: { number: "36007777777772", name: "REJECTED" },
    },
  }

  // Si el tipo de tarjeta no existe, usar VISA por defecto
  if (!testCards[cardType]) {
    cardType = "VISA"
  }

  // Si el resultado no existe, usar APPROVED por defecto
  if (!testCards[cardType][result]) {
    result = "APPROVED"
  }

  return testCards[cardType][result]
}

// Función para formatear mensajes de error de tarjeta
export function formatCardErrorMessage(errorMessage: string): string {
  if (errorMessage.includes("número de la tarjeta de crédito no es válido")) {
    return "El número de tarjeta ingresado no es válido o no está habilitado para pagos en línea. Por favor, verifica los datos o intenta con otra tarjeta."
  }

  if (errorMessage.includes("DECLINED") || errorMessage.includes("RECHAZADA")) {
    return "La transacción ha sido rechazada por el banco emisor. Por favor, contacta a tu banco o intenta con otra tarjeta."
  }

  if (errorMessage.includes("EXPIRED_CARD") || errorMessage.includes("vencida")) {
    return "La tarjeta ha expirado. Por favor, utiliza otra tarjeta."
  }

  if (errorMessage.includes("INSUFFICIENT_FUNDS") || errorMessage.includes("fondos insuficientes")) {
    return "Fondos insuficientes en la tarjeta. Por favor, verifica tu saldo o utiliza otra tarjeta."
  }

  // Si no coincide con ninguno de los casos anteriores, devolver el mensaje original
  return errorMessage
}

// Función para procesar pagos con tarjeta
export async function processCardPayment(paymentData: {
  cardNumber: string
  cardName: string
  cardExpiry: string
  cardCvc: string
  amount: number
  referenceCode?: string
  buyerInfo: {
    name: string
    email: string
    phone: string
    document: string
    address: string
    city: string
    state: string
    country: string
    postalCode: string
    phone: string
  }
}): Promise<PayUResponse> {
  try {
    // Configuración de PayU - Usar las variables de entorno públicas
    const apiKey = process.env.NEXT_PUBLIC_PAYU_API_KEY || ""
    const apiLogin = process.env.NEXT_PUBLIC_PAYU_API_LOGIN || ""
    const merchantId = process.env.NEXT_PUBLIC_PAYU_MERCHANT_ID || ""
    const accountId = process.env.NEXT_PUBLIC_PAYU_ACCOUNT_ID || ""
    const isTestMode = process.env.NEXT_PUBLIC_PAYU_TEST_MODE === "true"

    // Verificar que las credenciales estén definidas
    if (!apiKey || !apiLogin || !merchantId || !accountId) {
      console.error("Credenciales de PayU no configuradas correctamente:", {
        apiKey: apiKey ? "Definido" : "No definido",
        apiLogin: apiLogin ? "Definido" : "No definido",
        merchantId: merchantId ? "Definido" : "No definido",
        accountId: accountId ? "Definido" : "No definido",
      })

      return {
        code: "ERROR",
        error: "Credenciales de PayU no configuradas correctamente. Contacta al administrador.",
        transactionResponse: {
          state: "ERROR",
          responseMessage: "Credenciales de PayU no configuradas",
          responseCode: "ERROR",
        },
      }
    }

    // URL de la API de PayU (sandbox o producción)
    const apiUrl = isTestMode
      ? "https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi"
      : "https://api.payulatam.com/payments-api/4.0/service.cgi"

    // Usar el código de referencia proporcionado o generar uno nuevo
    // Asegurarnos de que no tenga espacios ni caracteres problemáticos
    let referenceCode = paymentData.referenceCode || `EDUX${Date.now()}${Math.floor(Math.random() * 1000)}`
    referenceCode = referenceCode.trim().replace(/[^a-zA-Z0-9]/g, "")

    // Generar firma usando la API Key
    const signature = generatePayUSignature(apiKey, merchantId, referenceCode, paymentData.amount, "COP")

    // Formatear fecha de expiración (MM/YYYY a YYYY/MM)
    const [month, year] = paymentData.cardExpiry.split("/")
    const formattedExpiry = `20${year}/${month}`

    // Determinar el tipo de tarjeta basado en el primer dígito
    const cardFirstDigit = paymentData.cardNumber.charAt(0)
    let paymentMethod = "VISA" // Por defecto

    if (cardFirstDigit === "4") {
      paymentMethod = "VISA"
    } else if (cardFirstDigit === "5") {
      paymentMethod = "MASTERCARD"
    } else if (cardFirstDigit === "3") {
      paymentMethod = "AMEX"
    } else if (cardFirstDigit === "6") {
      paymentMethod = "DINERS"
    }

    // Calcular base gravable e IVA (asumiendo que el precio ya incluye IVA del 19%)
    const taxBase = Math.round(paymentData.amount / 1.19)
    const taxValue = paymentData.amount - taxBase

    // Generar deviceSessionId según la documentación de PayU
    const timestamp = Date.now().toString()
    const randomValue = Math.random().toString(36).substring(2, 15)
    const deviceSessionId = crypto
      .createHash("md5")
      .update(timestamp + randomValue)
      .digest("hex")

    // Construir la solicitud para PayU
    const payuRequest: PayURequest = {
      language: "es",
      command: "SUBMIT_TRANSACTION",
      merchant: {
        apiKey,
        apiLogin,
      },
      transaction: {
        order: {
          accountId: accountId, // Usar accountId en lugar de merchantId aquí
          referenceCode,
          description: "Pago eduX - Tarjeta de crédito",
          language: "es",
          signature,
          notifyUrl: "https://edux.com.co/api/payment/notification",
          additionalValues: {
            TX_VALUE: {
              value: paymentData.amount,
              currency: "COP",
            },
            TX_TAX: {
              value: taxValue, // IVA ya incluido en el precio
              currency: "COP",
            },
            TX_TAX_RETURN_BASE: {
              value: taxBase, // Base gravable
              currency: "COP",
            },
          },
          buyer: {
            fullName: paymentData.buyerInfo.name,
            emailAddress: paymentData.buyerInfo.email,
            contactPhone: paymentData.buyerInfo.phone,
            dniNumber: paymentData.buyerInfo.document,
            shippingAddress: {
              street1: paymentData.buyerInfo.address,
              city: paymentData.buyerInfo.city,
              state: paymentData.buyerInfo.state,
              country: paymentData.buyerInfo.country,
              postalCode: paymentData.buyerInfo.postalCode,
              phone: paymentData.buyerInfo.phone,
            },
          },
        },
        payer: {
          fullName: paymentData.buyerInfo.name,
          emailAddress: paymentData.buyerInfo.email,
          contactPhone: paymentData.buyerInfo.phone,
          dniNumber: paymentData.buyerInfo.document,
          billingAddress: {
            street1: paymentData.buyerInfo.address,
            city: paymentData.buyerInfo.city,
            state: paymentData.buyerInfo.state,
            country: paymentData.buyerInfo.country,
            postalCode: paymentData.buyerInfo.postalCode,
            phone: paymentData.buyerInfo.phone,
          },
        },
        creditCard: {
          number: paymentData.cardNumber, // Asegurarse de que sea el número completo sin enmascarar
          securityCode: paymentData.cardCvc,
          expirationDate: formattedExpiry,
          name: paymentData.cardName,
        },
        extraParameters: {
          INSTALLMENTS_NUMBER: "1", // Número de cuotas
        },
        type: "AUTHORIZATION_AND_CAPTURE",
        paymentMethod,
        paymentCountry: "CO",
        deviceSessionId, // Usar el deviceSessionId generado según la documentación
        ipAddress: "127.0.0.1", // Esto debería ser la IP real del cliente
        cookie: crypto.randomBytes(16).toString("hex"), // Generamos una cookie aleatoria
        userAgent: "Mozilla/5.0", // Esto debería ser el User-Agent real
      },
      test: isTestMode,
    }

    console.log("Enviando solicitud a PayU:", {
      url: apiUrl,
      apiKey: apiKey ? "Definido" : "No definido",
      apiLogin: apiLogin ? "Definido" : "No definido",
      merchantId: merchantId ? "Definido" : "No definido",
      accountId: accountId ? "Definido" : "No definido",
      isTestMode,
      referenceCode,
      deviceSessionId,
    })

    // DEPURACIÓN: Imprimir la firma generada
    console.log("Firma generada:", signature)
    console.log("Monto para transacción:", paymentData.amount)

    // Imprimir la solicitud completa para depuración (sin datos sensibles)
    const debugRequest = JSON.parse(JSON.stringify(payuRequest)) // Copia profunda
    if (debugRequest.transaction?.creditCard) {
      debugRequest.transaction.creditCard = {
        ...debugRequest.transaction.creditCard,
        number: `${debugRequest.transaction.creditCard.number.substring(0, 6)}******${debugRequest.transaction.creditCard.number.substring(debugRequest.transaction.creditCard.number.length - 4)}`,
        securityCode: "***",
      }
    }
    console.log("Solicitud completa a PayU (sin datos sensibles):", JSON.stringify(debugRequest, null, 2))

    // Enviar la solicitud a PayU
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payuRequest),
    })

    // Capturar la respuesta completa para depuración
    const responseText = await response.text()
    console.log("Respuesta completa de PayU:", responseText)

    if (!response.ok) {
      console.error(`Error en la respuesta de PayU: ${response.status} ${response.statusText}`)
      console.error("Respuesta de error completa:", responseText)

      throw new Error(
        `Error en la respuesta de PayU: ${response.status} ${response.statusText}. Detalles: ${responseText}`,
      )
    }

    // Intentar parsear la respuesta como JSON
    let data: PayUResponse
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("Error al parsear la respuesta de PayU como JSON:", parseError)
      console.error("Respuesta recibida:", responseText)
      throw new Error(
        `Error al parsear la respuesta de PayU: ${parseError instanceof Error ? parseError.message : "Error desconocido"}`,
      )
    }

    // Verificar que la respuesta tenga la estructura esperada
    if (!data || !data.code) {
      console.error("Respuesta de PayU inválida:", data)
      throw new Error("Respuesta de pago inválida. Por favor, intenta nuevamente.")
    }

    // Si hay un error en la respuesta de PayU, formatearlo adecuadamente
    if (data.code !== "SUCCESS") {
      const errorMessage =
        data.error ||
        (data.transactionResponse && data.transactionResponse.responseMessage) ||
        "Error en el procesamiento del pago"
      console.error("Error en respuesta de PayU:", errorMessage, data)

      // Asegurar que la respuesta tenga una estructura consistente incluso en caso de error
      return {
        code: data.code,
        error: errorMessage,
        transactionResponse: data.transactionResponse || {
          state: "DECLINED",
          responseMessage: errorMessage,
          responseCode: "ERROR",
        },
      }
    }

    return data
  } catch (error) {
    console.error("Error al procesar el pago con PayU:", error)

    // Devolver un objeto con estructura consistente en caso de error
    return {
      code: "ERROR",
      error: error instanceof Error ? error.message : "Error desconocido en el procesamiento del pago",
      transactionResponse: {
        state: "ERROR",
        responseMessage: error instanceof Error ? error.message : "Error desconocido",
        responseCode: "SYSTEM_ERROR",
      },
    }
  }
}
