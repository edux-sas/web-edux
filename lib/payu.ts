// Modificar la función processCardPayment para forzar una respuesta exitosa en modo de prueba local
import type { PayUResponse, PayURequest } from "./payu.types"
import { generatePayUSignature } from "./payu.utils"

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
    const isTestMode = process.env.NEXT_PUBLIC_PAYU_TEST_MODE === "true"

    // NUEVA FUNCIONALIDAD: Detectar si estamos en localhost
    const isLocalhost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")

    // Si estamos en modo de prueba y en localhost, simular respuestas según el nombre de la tarjeta
    if (isTestMode && isLocalhost) {
      console.log("Ejecutando en localhost en modo de prueba - simulando respuesta de PayU")

      // Simular diferentes respuestas basadas en el nombre de la tarjeta
      if (paymentData.cardName.toUpperCase().includes("REJECTED")) {
        return {
          code: "SUCCESS",
          error: null,
          transactionResponse: {
            orderId: Math.floor(Math.random() * 1000000000),
            transactionId: `sim-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
            state: "DECLINED",
            responseCode: "DECLINED",
            responseMessage: "Transacción rechazada por reglas del comercio",
            operationDate: Date.now(),
            extraParameters: {},
            additionalInfo: {
              paymentNetwork: "VISA",
              rejectionType: "SOFT_DECLINE",
              responseNetworkMessage: null,
              cardType: "CREDIT",
              transactionType: "AUTHORIZATION_AND_CAPTURE",
            },
          },
        }
      } else if (paymentData.cardName.toUpperCase().includes("PENDING")) {
        return {
          code: "SUCCESS",
          error: null,
          transactionResponse: {
            orderId: Math.floor(Math.random() * 1000000000),
            transactionId: `sim-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
            state: "PENDING",
            responseCode: "PENDING_TRANSACTION_CONFIRMATION",
            responseMessage: "Transacción pendiente de confirmación",
            operationDate: Date.now(),
            extraParameters: {},
            additionalInfo: {
              paymentNetwork: "VISA",
              rejectionType: null,
              responseNetworkMessage: null,
              cardType: "CREDIT",
              transactionType: "AUTHORIZATION_AND_CAPTURE",
            },
          },
        }
      } else if (paymentData.cardName.toUpperCase().includes("ERROR")) {
        return {
          code: "SUCCESS",
          error: null,
          transactionResponse: {
            orderId: Math.floor(Math.random() * 1000000000),
            transactionId: `sim-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
            state: "DECLINED",
            responseCode: "INTERNAL_PAYMENT_PROVIDER_ERROR",
            responseMessage: "Error interno del proveedor de pagos",
            operationDate: Date.now(),
            extraParameters: {},
            additionalInfo: {
              paymentNetwork: "VISA",
              rejectionType: "SOFT_DECLINE",
              responseNetworkMessage: null,
              cardType: "CREDIT",
              transactionType: "AUTHORIZATION_AND_CAPTURE",
            },
          },
        }
      } else {
        // Por defecto, simular una transacción exitosa
        return {
          code: "SUCCESS",
          error: null,
          transactionResponse: {
            orderId: Math.floor(Math.random() * 1000000000),
            transactionId: `sim-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
            state: "APPROVED",
            paymentNetworkResponseCode: "00",
            trazabilityCode: `sim-${Date.now()}`,
            authorizationCode: `AUTH-${Math.floor(Math.random() * 1000000)}`,
            responseCode: "APPROVED",
            responseMessage: "Transacción aprobada",
            operationDate: Date.now(),
            extraParameters: {},
            additionalInfo: {
              paymentNetwork: "VISA",
              rejectionType: null,
              responseNetworkMessage: null,
              cardType: "CREDIT",
              transactionType: "AUTHORIZATION_AND_CAPTURE",
            },
          },
        }
      }
    }

    // Continuar con el código original para entornos no locales o no de prueba
    // Usar credenciales específicas para modo de prueba o producción
    let apiKey, apiLogin, merchantId, accountId

    if (isTestMode) {
      // Credenciales para el entorno de pruebas (sandbox)
      apiKey = "4Vj8eK4rloUd272L48hsrarnUA"
      apiLogin = "pRRXKOl8ikMmt9u"
      merchantId = "508029"
      accountId = "512321"
      console.log("Usando credenciales de PRUEBA para PayU")
    } else {
      // Credenciales para el entorno de producción
      apiKey = process.env.NEXT_PUBLIC_PAYU_API_KEY || ""
      apiLogin = process.env.NEXT_PUBLIC_PAYU_API_LOGIN || ""
      merchantId = process.env.NEXT_PUBLIC_PAYU_MERCHANT_ID || ""
      accountId = process.env.NEXT_PUBLIC_PAYU_ACCOUNT_ID || ""
      console.log("Usando credenciales de PRODUCCIÓN para PayU")
    }

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

    console.log("Enviando solicitud a PayU", isTestMode ? "(modo prueba)" : "(modo producción)")

    // DEPURACIÓN: Imprimir la firma generada
    console.log("Firma generada para transacción")
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
    console.log("Enviando solicitud a PayU")

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
    console.log("Recibida respuesta de PayU")

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
