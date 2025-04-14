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

// Modifiquemos la función generatePayUSignature para garantizar una firma correcta

export function generatePayUSignature(
  apiKey: string,
  merchantId: string,
  referenceCode: string,
  amount: number,
  currency: string,
): string {
  // Limpiar todos los valores para evitar problemas con espacios o caracteres especiales
  const cleanApiKey = apiKey.trim()
  const cleanMerchantId = merchantId.trim()
  const cleanReferenceCode = referenceCode.trim()

  // IMPORTANTE: Para COP, PayU espera valores enteros sin decimales
  let formattedAmount: string
  if (currency === "COP") {
    // Para COP, redondear a entero y convertir a string
    formattedAmount = Math.round(amount).toString()
  } else {
    // Para otras monedas, usar 2 decimales
    formattedAmount = amount.toFixed(2)
  }

  // Crear el string para la firma: apiKey~merchantId~referenceCode~amount~currency
  const signatureString = `${cleanApiKey}~${cleanMerchantId}~${cleanReferenceCode}~${formattedAmount}~${currency}`

  console.log("String para firma PayU (limpio):", signatureString)

  // Verificar cada componente individualmente para depuración
  console.log("Componentes de la firma:")
  console.log("- apiKey:", cleanApiKey, "- Longitud:", cleanApiKey.length)
  console.log("- merchantId:", cleanMerchantId, "- Longitud:", cleanMerchantId.length)
  console.log("- referenceCode:", cleanReferenceCode, "- Longitud:", cleanReferenceCode.length)
  console.log("- formattedAmount:", formattedAmount, "- Longitud:", formattedAmount.length)
  console.log("- currency:", currency, "- Longitud:", currency.length)

  // Generar el hash MD5
  const signature = crypto.createHash("md5").update(signatureString).digest("hex")
  console.log("Firma generada (MD5):", signature)

  return signature
}

// Actualizar la función validatePayUSignature para usar el mismo formato
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

// Añadir esta función de depuración justo antes de la función processCardPayment

// Función para depurar la consistencia del referenceCode
function debugReferenceCode(referenceCode: string, payuRequest: any) {
  console.log("=== DEPURACIÓN DE REFERENCE CODE ===")
  console.log("referenceCode usado para firma:", referenceCode)
  console.log("referenceCode en el JSON:", payuRequest.transaction.order.referenceCode)
  console.log("¿Son idénticos?", referenceCode === payuRequest.transaction.order.referenceCode)

  // Verificar si hay espacios o caracteres especiales
  console.log("Longitud del referenceCode:", referenceCode.length)
  console.log(
    "Caracteres del referenceCode:",
    Array.from(referenceCode).map((c) => `'${c}' (${c.charCodeAt(0)})`),
  )
  console.log("==============================")
}

// Añade esta función para verificar la firma generada
function verifySignature(request: PayURequest): boolean {
  const { apiKey } = request.merchant
  const { referenceCode, additionalValues } = request.transaction.order
  const amount = additionalValues.TX_VALUE.value
  const currency = additionalValues.TX_VALUE.currency
  const merchantId = request.transaction.order.accountId

  // Generar la firma de nuevo para verificar
  const calculatedSignature = generatePayUSignature(apiKey, merchantId, referenceCode, amount, currency)

  // Comparar con la firma en la solicitud
  const requestSignature = request.transaction.order.signature

  console.log("Verificación de firma:")
  console.log("- Firma en solicitud:", requestSignature)
  console.log("- Firma calculada:", calculatedSignature)
  console.log("- ¿Coinciden?", requestSignature === calculatedSignature)

  return requestSignature === calculatedSignature
}

// Mejoremos la función processCardPayment para manejar mejor los errores y la validación

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
    const isTestMode = process.env.NEXT_PUBLIC_PAYU_TEST_MODE === "true"

    // Verificar que las credenciales estén definidas
    if (!apiKey || !apiLogin || !merchantId) {
      console.error("Credenciales de PayU no configuradas correctamente:", {
        apiKey: apiKey ? "Definido" : "No definido",
        apiLogin: apiLogin ? "Definido" : "No definido",
        merchantId: merchantId ? "Definido" : "No definido",
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

    // Generar un código de referencia limpio y consistente
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
    const deviceSessionId = crypto
      .createHash("md5")
      .update(Date.now().toString() + Math.random().toString(36).substring(2, 15))
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
          accountId: merchantId,
          referenceCode,
          description: "Pago eduX - Test DISC",
          language: "es",
          signature,
          notifyUrl: "https://edux.com.co/api/payment/notification",
          additionalValues: {
            TX_VALUE: {
              value: Math.round(paymentData.amount), // Asegúrate de que sea el mismo formato que en la firma
              currency: "COP",
            },
            TX_TAX: {
              value: taxValue,
              currency: "COP",
            },
            TX_TAX_RETURN_BASE: {
              value: taxBase,
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
          number: paymentData.cardNumber,
          securityCode: paymentData.cardCvc,
          expirationDate: formattedExpiry,
          name: paymentData.cardName,
        },
        extraParameters: {
          INSTALLMENTS_NUMBER: "1",
        },
        type: "AUTHORIZATION_AND_CAPTURE",
        paymentMethod,
        paymentCountry: "CO",
        deviceSessionId,
        ipAddress: "127.0.0.1",
        cookie: crypto.randomBytes(16).toString("hex"),
        userAgent: "Mozilla/5.0",
      },
      test: isTestMode,
    }

    console.log("Enviando solicitud a PayU:", {
      url: apiUrl,
      referenceCode,
      signature,
      amount: paymentData.amount,
      formattedAmount: Math.round(paymentData.amount).toString(),
    })

    // Usa esta función justo antes de enviar la solicitud
    verifySignature(payuRequest)

    // Enviar la solicitud a PayU
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payuRequest),
    })

    if (!response.ok) {
      console.error(`Error en la respuesta de PayU: ${response.status} ${response.statusText}`)
      const errorText = await response.text()
      console.error("Respuesta de error completa:", errorText)

      throw new Error(`Error en la respuesta de PayU: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Verificar que la respuesta tenga la estructura esperada
    if (!data || !data.code) {
      console.error("Respuesta de PayU inválida:", data)
      throw new Error("Respuesta de pago inválida. Por favor, intenta nuevamente.")
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

// Las demás funciones se mantienen igual...
