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
    orderId: number
    transactionId: string
    state: string
    paymentNetworkResponseCode: string | null
    paymentNetworkResponseErrorMessage: string | null
    trazabilityCode: string
    authorizationCode: string | null
    pendingReason: string | null
    responseCode: string
    errorCode: string | null
    responseMessage: string | null
    transactionDate: string | null
    transactionTime: string | null
    operationDate: number
    extraParameters?: Record<string, string>
    additionalInfo?: {
      paymentNetwork: string
      rejectionType: string
      responseNetworkMessage: string | null
      cardType: string | null
      transactionType: string
    }
  }
}

// Función para generar la firma de PayU usando MD5
export function generatePayUSignature(
  apiKey: string,
  merchantId: string,
  referenceCode: string,
  amount: number,
  currency: string,
): string {
  // Crear el string para la firma: apiKey~merchantId~referenceCode~amount~currency
  const signatureString = `${apiKey}~${merchantId}~${referenceCode}~${amount}~${currency}`

  // Generar el hash MD5
  return crypto.createHash("md5").update(signatureString).digest("hex")
}

// Función para validar firmas de PayU
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
      // El formato estándar es: ApiKey~merchantId~referenceCode~valor~moneda~estado
      signatureString = `${apiKey}~${notificationData.merchant_id}~${notificationData.reference_sale}~${notificationData.value}~${notificationData.currency}~${notificationData.state_pol}`
    }
    // Para notificaciones de confirmación de transacción
    else if (notificationData.transaction_id && notificationData.reference_code && notificationData.amount) {
      // Otro formato común
      signatureString = `${apiKey}~${notificationData.merchant_id}~${notificationData.reference_code}~${notificationData.amount}~${notificationData.currency}`
    }
    // Si no reconocemos el formato, fallamos por seguridad
    else {
      console.error("Formato de notificación desconocido", notificationData)
      return false
    }

    // Generar el hash MD5 del signatureString
    const calculatedSignature = crypto.createHash("md5").update(signatureString).digest("hex")

    // Comparar la firma calculada con la recibida
    return calculatedSignature === receivedSignature
  } catch (error) {
    console.error("Error al validar firma de PayU:", error)
    return false
  }
}

// Función para procesar un pago con tarjeta de crédito
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
  }
}): Promise<PayUResponse> {
  // Configuración de PayU
  const apiKey = process.env.PAYU_API_KEY || ""
  const apiLogin = process.env.PAYU_API_LOGIN || ""
  const merchantId = process.env.PAYU_MERCHANT_ID || ""
  const isTestMode = process.env.PAYU_TEST_MODE === "true"

  // URL de la API de PayU (sandbox o producción)
  const apiUrl = isTestMode
    ? "https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi"
    : "https://api.payulatam.com/payments-api/4.0/service.cgi"

  // Usar el código de referencia proporcionado o generar uno nuevo
  const referenceCode = paymentData.referenceCode || `EDUX_${Date.now()}`

  // Generar firma
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
        number: paymentData.cardNumber,
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
      deviceSessionId: crypto.randomBytes(16).toString("hex"), // Generamos un ID de sesión aleatorio
      ipAddress: "127.0.0.1", // Esto debería ser la IP real del cliente
      cookie: crypto.randomBytes(16).toString("hex"), // Generamos una cookie aleatoria
      userAgent: "Mozilla/5.0", // Esto debería ser el User-Agent real
    },
    test: isTestMode,
  }

  try {
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
      throw new Error(`Error en la respuesta de PayU: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error al procesar el pago con PayU:", error)
    throw error
  }
}

// Función para procesar un pago con PSE
export async function processPSEPayment(paymentData: {
  amount: number
  bankCode: string
  userType: "N" | "J"
  docType: string
  docNumber: string
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
  }
}): Promise<PayUResponse> {
  // Configuración de PayU
  const apiKey = process.env.PAYU_API_KEY || ""
  const apiLogin = process.env.PAYU_API_LOGIN || ""
  const merchantId = process.env.PAYU_MERCHANT_ID || ""
  const isTestMode = process.env.PAYU_TEST_MODE === "true"

  // URL de la API de PayU (sandbox o producción)
  const apiUrl = isTestMode
    ? "https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi"
    : "https://api.payulatam.com/payments-api/4.0/service.cgi"

  // Usar el código de referencia proporcionado o generar uno nuevo
  const referenceCode = paymentData.referenceCode || `EDUX_${Date.now()}`

  // Generar firma
  const signature = generatePayUSignature(apiKey, merchantId, referenceCode, paymentData.amount, "COP")

  // Calcular base gravable e IVA (asumiendo que el precio ya incluye IVA del 19%)
  const taxBase = Math.round(paymentData.amount / 1.19)
  const taxValue = paymentData.amount - taxBase

  const payuRequest: PayURequest = {
    language: "es",
    command: "SUBMIT_TRANSACTION",
    merchant: {
      apiKey: apiKey,
      apiLogin: apiLogin,
    },
    transaction: {
      order: {
        accountId: merchantId,
        referenceCode: referenceCode,
        description: "Pago eduX - PSE",
        language: "es",
        signature: signature,
        notifyUrl: "https://edux.com.co/api/payment/notification",
        additionalValues: {
          TX_VALUE: {
            value: paymentData.amount,
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
        dniNumber: paymentData.docNumber,
        billingAddress: {
          street1: paymentData.buyerInfo.address,
          city: paymentData.buyerInfo.city,
          state: paymentData.buyerInfo.state,
          country: paymentData.buyerInfo.country,
          postalCode: paymentData.buyerInfo.postalCode,
          phone: paymentData.buyerInfo.phone,
        },
      },
      extraParameters: {
        RESPONSE_URL: "https://edux.com.co/payment/response",
        FINANCIAL_INSTITUTION_CODE: paymentData.bankCode,
        USER_TYPE: paymentData.userType,
        PSE_REFERENCE1: paymentData.docNumber,
        PSE_REFERENCE2: paymentData.docNumber,
        PSE_REFERENCE3: paymentData.docNumber,
        paymentMethod: "PSE",
      },
      type: "AUTHORIZATION_AND_CAPTURE",
      paymentMethod: "PSE",
      paymentCountry: "CO",
      deviceSessionId: crypto.randomBytes(16).toString("hex"),
      ipAddress: "127.0.0.1", // Esto debería ser la IP real del cliente
      cookie: crypto.randomBytes(16).toString("hex"),
      userAgent: "Mozilla/5.0", // Esto debería ser el User-Agent real
    },
    test: isTestMode,
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payuRequest),
    })

    if (!response.ok) {
      throw new Error(`Error en la respuesta de PayU: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error al procesar el pago con PSE:", error)
    throw error
  }
}

// Función para obtener los bancos disponibles para PSE
export async function getAvailableBanks(): Promise<{
  success: boolean
  banks: Array<{ description: string; pseCode: string }>
}> {
  // Configuración de PayU
  const apiKey = process.env.PAYU_API_KEY || ""
  const apiLogin = process.env.PAYU_API_LOGIN || ""
  const isTestMode = process.env.PAYU_TEST_MODE === "true"

  // URL de la API de PayU (sandbox o producción)
  const apiUrl = isTestMode
    ? "https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi"
    : "https://api.payulatam.com/payments-api/4.0/service.cgi"

  const request = {
    language: "es",
    command: "GET_BANKS_LIST",
    merchant: {
      apiKey: apiKey,
      apiLogin: apiLogin,
    },
    test: isTestMode,
    pseFinancialInstitutionCode: "",
    pseReference1: "",
    pseReference2: "",
    pseReference3: "",
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`Error al obtener bancos: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data.code !== "SUCCESS") {
      throw new Error(`Error al obtener bancos: ${data.error}`)
    }

    const banks = data.banks.map((bank: any) => ({
      description: bank.bankName,
      pseCode: bank.pseCode,
    }))

    return { success: true, banks: banks }
  } catch (error) {
    console.error("Error al obtener bancos:", error)
    return { success: false, banks: [] }
  }
}
