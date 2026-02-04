/**
 * Utilidades para el modo de prueba
 * Este archivo contiene funciones que solo se utilizan cuando el sistema está en modo de prueba
 * No afecta el funcionamiento en producción
 */

// Verifica si el sistema está en modo de prueba
export function isTestMode(): boolean {
  return process.env.NEXT_PUBLIC_PAYU_TEST_MODE === "true"
}

// Simula una respuesta de pago aprobada para el modo de prueba
export function simulateApprovedPayment(referenceCode: string, transactionId?: string) {
  const simulatedTransactionId = transactionId || `TEST_TX_${Date.now()}`

  return {
    code: "SUCCESS",
    error: null,
    transactionResponse: {
      orderId: Math.floor(Math.random() * 1000000),
      transactionId: simulatedTransactionId,
      state: "APPROVED",
      paymentNetworkResponseCode: "00",
      paymentNetworkResponseErrorMessage: null,
      trazabilityCode: `TEST_${Date.now()}`,
      authorizationCode: `AUTH_${Math.floor(Math.random() * 10000)}`,
      pendingReason: null,
      responseCode: "APPROVED",
      errorCode: null,
      responseMessage: "Transacción aprobada (SIMULACIÓN)",
      transactionDate: new Date().toISOString(),
      transactionTime: new Date().toISOString(),
      operationDate: Date.now(),
      extraParameters: {
        REFERENCE_CODE: referenceCode,
      },
    },
  }
}

// Simula una notificación de pago aprobada para el modo de prueba
export function simulatePaymentNotification(referenceCode: string, merchantId: string, value: number) {
  return {
    merchant_id: merchantId,
    state_pol: "4", // 4 = Aprobado en PayU
    reference_sale: referenceCode,
    value: value.toString(),
    transaction_id: `TEST_TX_${Date.now()}`,
    currency: "COP",
    payment_method: "TEST",
    payment_method_type: "TEST",
    transaction_date: new Date().toISOString(),
    // Otros campos que puedan ser necesarios
  }
}

