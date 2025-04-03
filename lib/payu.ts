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

// Función para generar la firma de PayU
export function generatePayUSignature(
  apiKey: string,
  merchantId: string,
  referenceCode: string,
  amount: number,
  currency: string,
): string {
  // En un entorno real, deberías usar una biblioteca de hash como crypto-js
  // Aquí simulamos la generación de la firma para el ejemplo
  const signatureString = `${apiKey}~${merchantId}~${referenceCode}~${amount}~${currency}`

  // Esta es una simulación, en producción usarías:
  // return CryptoJS.MD5(signatureString).toString();
  return "1d6c33aed575c4974ad5c0be7c6a1c87" // Firma de ejemplo
}

// Función para procesar un pago con tarjeta de crédito
export async function processCardPayment(paymentData: {
  cardNumber: string
  cardName: string
  cardExpiry: string
  cardCvc: string
  amount: number
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
  const apiKey = process.env.NEXT_PUBLIC_PAYU_API_KEY || ""
  const apiLogin = process.env.NEXT_PUBLIC_PAYU_API_LOGIN || ""
  const merchantId = process.env.NEXT_PUBLIC_PAYU_MERCHANT_ID || ""
  const isTestMode = process.env.NEXT_PUBLIC_PAYU_TEST_MODE === "true"

  // URL de la API de PayU (sandbox o producción)
  const apiUrl = isTestMode
    ? "https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi"
    : "https://api.payulatam.com/payments-api/4.0/service.cgi"

  // Generar código de referencia único
  const referenceCode = `EDUX_${Date.now()}`

  // Generar firma
  const signature = generatePayUSignature(apiKey, merchantId, referenceCode, paymentData.amount, "COP")

  // Formatear fecha de expiración (MM/YYYY a YYYY/MM)
  const [month, year] = paymentData.cardExpiry.split("/")
  const formattedExpiry = `20${year}/${month}`

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
        description: "Test DISC - Pago con tarjeta",
        language: "es",
        signature,
        notifyUrl: "https://tu-sitio.com/confirmacion-payu",
        additionalValues: {
          TX_VALUE: {
            value: paymentData.amount,
            currency: "COP",
          },
          TX_TAX: {
            value: Math.round((paymentData.amount * 0.19) / 1.19), // Cálculo del IVA (19%)
            currency: "COP",
          },
          TX_TAX_RETURN_BASE: {
            value: Math.round(paymentData.amount / 1.19), // Base gravable
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
      paymentMethod: "VISA", // Esto debería determinarse según el número de tarjeta
      paymentCountry: "CO",
      deviceSessionId: "vghs6tvkcle931686k1900o6e1", // Esto debería generarse dinámicamente
      ipAddress: "127.0.0.1", // Esto debería ser la IP real del cliente
      cookie: "pt1t38347bs6jc9ruv2ecpv7o2", // Esto debería ser la cookie real
      userAgent: navigator.userAgent,
    },
    test: isTestMode,
  }

  try {
    // En un entorno real, enviarías esta solicitud a PayU
    // const response = await fetch(apiUrl, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json'
    //   },
    //   body: JSON.stringify(payuRequest)
    // });

    // const data = await response.json();
    // return data;

    // Para este ejemplo, simulamos una respuesta exitosa
    return {
      code: "SUCCESS",
      error: null,
      transactionResponse: {
        orderId: 1400449660,
        transactionId: "aa2f50b2-62a8-42de-b3be-c6fe08ec712f",
        state: "APPROVED",
        paymentNetworkResponseCode: "81",
        paymentNetworkResponseErrorMessage: null,
        trazabilityCode: "CRED - 666039677",
        authorizationCode: "123238",
        pendingReason: null,
        responseCode: "APPROVED",
        errorCode: null,
        responseMessage: "Aprobado",
        transactionDate: null,
        transactionTime: null,
        operationDate: Date.now(),
        extraParameters: {
          BANK_REFERENCED_CODE: "CREDIT",
        },
        additionalInfo: {
          paymentNetwork: "CREDIBANCO",
          rejectionType: "NONE",
          responseNetworkMessage: null,
          cardType: "CREDIT",
          transactionType: "AUTHORIZATION_AND_CAPTURE",
        },
      },
    }
  } catch (error) {
    console.error("Error al procesar el pago con PayU:", error)
    throw error
  }
}

// Función para procesar un pago con PSE
export async function processPSEPayment(paymentData: {
  amount: number
  bankCode: string
  userType: "N" | "J" // N: Persona Natural, J: Persona Jurídica
  docType: string // CC, CE, NIT, etc.
  docNumber: string
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
  const apiKey = process.env.NEXT_PUBLIC_PAYU_API_KEY || ""
  const apiLogin = process.env.NEXT_PUBLIC_PAYU_API_LOGIN || ""
  const merchantId = process.env.NEXT_PUBLIC_PAYU_MERCHANT_ID || ""
  const isTestMode = process.env.NEXT_PUBLIC_PAYU_TEST_MODE === "true"

  // URL de la API de PayU (sandbox o producción)
  const apiUrl = isTestMode
    ? "https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi"
    : "https://api.payulatam.com/payments-api/4.0/service.cgi"

  // Generar código de referencia único
  const referenceCode = `EDUX_${Date.now()}`

  // Generar firma
  const signature = generatePayUSignature(apiKey, merchantId, referenceCode, paymentData.amount, "COP")

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
        description: "Test DISC - Pago con PSE",
        language: "es",
        signature,
        notifyUrl: "https://tu-sitio.com/confirmacion-payu",
        additionalValues: {
          TX_VALUE: {
            value: paymentData.amount,
            currency: "COP",
          },
          TX_TAX: {
            value: Math.round((paymentData.amount * 0.19) / 1.19), // Cálculo del IVA (19%)
            currency: "COP",
          },
          TX_TAX_RETURN_BASE: {
            value: Math.round(paymentData.amount / 1.19), // Base gravable
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
      extraParameters: {
        RESPONSE_URL: "https://tu-sitio.com/respuesta-pse",
        PSE_REFERENCE1: "127.0.0.1", // IP del cliente
        FINANCIAL_INSTITUTION_CODE: paymentData.bankCode,
        USER_TYPE: paymentData.userType,
        PSE_REFERENCE2: paymentData.docType,
        PSE_REFERENCE3: paymentData.docNumber,
      },
      type: "AUTHORIZATION_AND_CAPTURE",
      paymentMethod: "PSE",
      paymentCountry: "CO",
      deviceSessionId: "vghs6tvkcle931686k1900o6e1", // Esto debería generarse dinámicamente
      ipAddress: "127.0.0.1", // Esto debería ser la IP real del cliente
      cookie: "pt1t38347bs6jc9ruv2ecpv7o2", // Esto debería ser la cookie real
      userAgent: navigator.userAgent,
    },
    test: isTestMode,
  }

  try {
    // En un entorno real, enviarías esta solicitud a PayU
    // const response = await fetch(apiUrl, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json'
    //   },
    //   body: JSON.stringify(payuRequest)
    // });

    // const data = await response.json();
    // return data;

    // Para este ejemplo, simulamos una respuesta de PSE
    return {
      code: "SUCCESS",
      error: null,
      transactionResponse: {
        orderId: 1400449959,
        transactionId: "4d49e544-e23f-474e-92b1-59357e0e85e8",
        state: "PENDING",
        paymentNetworkResponseCode: null,
        paymentNetworkResponseErrorMessage: null,
        trazabilityCode: "2204682",
        authorizationCode: null,
        pendingReason: "AWAITING_NOTIFICATION",
        responseCode: "PENDING_TRANSACTION_CONFIRMATION",
        errorCode: null,
        responseMessage: null,
        transactionDate: null,
        transactionTime: null,
        operationDate: Date.now(),
        extraParameters: {
          TRANSACTION_CYCLE: "1",
          BANK_URL:
            "https://sandbox.api.payulatam.com/payments-api/pse-caller?enc=aHR0cHM6Ly9yZWdpc3Ryby5kZXNhcnJvbGxvLnBzZS5jb20uY28vUFNFVXNlclJlZ2lzdGVyL1N0YXJ0VHJhbnNhY3Rpb24uYXNweD9lbmM9dG5QY0pITUtsU25tUnBITThmQWJ1NHVWTmt6YW92Q0tWR2g0b0IxbEpkOXNEeGlSU2E5cXl1Uk5TUW5mbkxSdiMjcGF5ZXJfdGVzdEB0ZXN0LmNvbSMjMTIzNDU2Nzg5IyNDQw==",
        },
        additionalInfo: {
          paymentNetwork: "PSE",
          rejectionType: "NONE",
          responseNetworkMessage: null,
          travelAgencyAuthorizationCode: null,
          cardType: null,
          transactionType: "AUTHORIZATION_AND_CAPTURE",
        },
      },
    }
  } catch (error) {
    console.error("Error al procesar el pago con PSE:", error)
    throw error
  }
}

// Función para consultar los bancos disponibles para PSE
export async function getAvailableBanks(): Promise<{
  banks: Array<{
    description: string
    pseCode: string
  }>
}> {
  // En un entorno real, consultarías la API de PayU
  // Aquí simulamos una respuesta con algunos bancos comunes
  return {
    banks: [
      { description: "Bancolombia", pseCode: "1022" },
      { description: "Banco de Bogotá", pseCode: "1001" },
      { description: "Davivienda", pseCode: "1051" },
      { description: "Banco de Occidente", pseCode: "1023" },
      { description: "BBVA Colombia", pseCode: "1013" },
      { description: "Banco AV Villas", pseCode: "1052" },
      { description: "Banco Popular", pseCode: "1002" },
      { description: "Banco Caja Social", pseCode: "1032" },
      { description: "Scotiabank Colpatria", pseCode: "1019" },
      { description: "Banco Agrario", pseCode: "1040" },
    ],
  }
}

