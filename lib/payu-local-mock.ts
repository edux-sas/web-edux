import type { PayUResponse } from "./payu.types" // Importar el tipo si existe, o definirlo aquí si no

/**
 * Función para simular respuestas de PayU en entorno local
 * Esta función NO modifica el código de producción
 */
export function mockPayUResponse(cardName: string): PayUResponse {
  console.log("Simulando respuesta de PayU en entorno local con nombre:", cardName)

  // Simular diferentes respuestas basadas en el nombre de la tarjeta
  if (cardName.toUpperCase().includes("REJECTED")) {
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
  } else if (cardName.toUpperCase().includes("PENDING")) {
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
  } else if (cardName.toUpperCase().includes("ERROR")) {
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

/**
 * Función para verificar si estamos en entorno local
 */
export function isLocalEnvironment(): boolean {
  if (typeof window === "undefined") return false
  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
}
