/**
 * Cliente SDK de PayU para Next.js con TypeScript
 */
import axios from "axios"
import crypto from "crypto"

// Configuración de PayU
const PAYU_CONFIG = {
  apiKey: process.env.PAYU_API_KEY || "",
  apiLogin: process.env.PAYU_API_LOGIN || "",
  merchantId: process.env.PAYU_MERCHANT_ID || "",
  accountId: process.env.PAYU_ACCOUNT_ID || "512321", // Reemplaza con tu ID de cuenta
  isTest: process.env.PAYU_TEST_MODE === "true",
  language: "es",
}

// Tipos para la integración con PayU
export type PayUPaymentRequest = {
  referenceCode: string
  description: string
  amount: number
  currency: string
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
  paymentMethod: string
  installments?: number
  responseUrl?: string
  notifyUrl?: string
}

export type PayUPaymentResponse = {
  success: boolean
  url?: string
  orderId?: string
  transactionId?: string
  state?: string
  responseCode?: string
  responseMessage?: string
  error?: string
  signature?: string
}

export type PayUNotification = {
  merchant_id: string
  state_pol: string
  risk: string
  response_code_pol: string
  reference_sale: string
  reference_pol: string
  sign: string
  extra1?: string
  extra2?: string
  payment_method: string
  payment_method_type: string
  installments_number: string
  value: string
  tax: string
  additional_value: string
  transaction_date: string
  currency: string
  email_buyer: string
  cus?: string
  pse_bank?: string
  test?: string
  description: string
  billing_address?: string
  shipping_address?: string
  phone?: string
  office_phone?: string
  account_number_ach?: string
  account_type_ach?: string
  administrative_fee?: string
  administrative_fee_base?: string
  administrative_fee_tax?: string
  airline_code?: string
  attempts?: string
  authorization_code?: string
  bank_id?: string
  billing_city?: string
  billing_country?: string
  commision_pol?: string
  commision_pol_currency?: string
  customer_number?: string
  date?: string
  error_code_bank?: string
  error_message_bank?: string
  exchange_rate?: string
  ip?: string
  nickname_buyer?: string
  nickname_seller?: string
  payment_method_id?: string
  payment_request_state?: string
  pseReference1?: string
  pseReference2?: string
  pseReference3?: string
  response_message_pol?: string
  shipping_city?: string
  shipping_country?: string
  transaction_bank_id?: string
  transaction_id?: string
  payment_method_name?: string
}

/**
 * Genera la firma para PayU
 */
export function generateSignature(referenceCode: string, amount: number, currency: string): string {
  // Limpiar todos los valores para evitar problemas con espacios o caracteres especiales
  const cleanApiKey = PAYU_CONFIG.apiKey.trim()
  const cleanMerchantId = PAYU_CONFIG.merchantId.trim()
  const cleanReferenceCode = referenceCode.trim()

  // Formatear el monto según la moneda
  let formattedAmount: string
  if (currency === "COP") {
    formattedAmount = Math.round(amount).toString()
  } else {
    formattedAmount = amount.toFixed(2)
  }

  // Crear el string para la firma: apiKey~merchantId~referenceCode~amount~currency
  const signatureString = `${cleanApiKey}~${cleanMerchantId}~${cleanReferenceCode}~${formattedAmount}~${currency}`

  console.log("String para firma PayU:", signatureString)

  // Generar el hash MD5
  const signature = crypto.createHash("md5").update(signatureString).digest("hex")
  console.log("Firma generada (MD5):", signature)

  return signature
}

/**
 * Valida la firma de una notificación de PayU
 */
export function validateSignature(notification: PayUNotification): boolean {
  // Si no hay firma o no hay datos, la firma no es válida
  if (!notification || !notification.sign) {
    return false
  }

  // La firma recibida en la notificación
  const receivedSignature = notification.sign

  try {
    // Formatear el valor según la moneda
    let formattedValue: string
    if (notification.currency === "COP") {
      formattedValue = Math.round(Number.parseFloat(notification.value)).toString()
    } else {
      formattedValue = Number.parseFloat(notification.value).toFixed(2)
    }

    // El formato estándar es: apiKey~merchantId~referenceCode~valor~moneda~estado
    const signatureString = `${PAYU_CONFIG.apiKey}~${notification.merchant_id}~${notification.reference_sale}~${formattedValue}~${notification.currency}~${notification.state_pol}`

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

/**
 * Crea una URL de pago de PayU (Web Checkout)
 */
export async function createPaymentUrl(paymentData: PayUPaymentRequest): Promise<PayUPaymentResponse> {
  try {
    // Validar configuración
    if (!PAYU_CONFIG.apiKey || !PAYU_CONFIG.apiLogin || !PAYU_CONFIG.merchantId) {
      throw new Error("Configuración de PayU incompleta. Verifica tus credenciales.")
    }

    // Generar firma
    const signature = generateSignature(paymentData.referenceCode, paymentData.amount, paymentData.currency)

    // Calcular valores de impuestos (19% para Colombia)
    const taxBase = Math.round(paymentData.amount / 1.19)
    const taxValue = paymentData.amount - taxBase

    // Determinar URL de la API
    const apiUrl = PAYU_CONFIG.isTest
      ? "https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/"
      : "https://checkout.payulatam.com/ppp-web-gateway-payu/"

    // Construir los parámetros para el formulario de PayU
    const params = new URLSearchParams()
    params.append("merchantId", PAYU_CONFIG.merchantId)
    params.append("accountId", PAYU_CONFIG.accountId)
    params.append("description", paymentData.description)
    params.append("referenceCode", paymentData.referenceCode)
    params.append("amount", paymentData.amount.toString())
    params.append("tax", taxValue.toString())
    params.append("taxReturnBase", taxBase.toString())
    params.append("currency", paymentData.currency)
    params.append("signature", signature)
    params.append("test", PAYU_CONFIG.isTest ? "1" : "0")
    params.append("buyerEmail", paymentData.buyerInfo.email)
    params.append("buyerFullName", paymentData.buyerInfo.name)
    params.append("telephone", paymentData.buyerInfo.phone)
    params.append("shippingAddress", paymentData.buyerInfo.address)
    params.append("shippingCity", paymentData.buyerInfo.city)
    params.append("shippingCountry", paymentData.buyerInfo.country)

    // Añadir URLs de respuesta y notificación si se proporcionan
    if (paymentData.responseUrl) {
      params.append("responseUrl", paymentData.responseUrl)
    }

    if (paymentData.notifyUrl) {
      params.append("confirmationUrl", paymentData.notifyUrl)
    } else {
      // URL de notificación por defecto
      params.append("confirmationUrl", "https://edux.com.co/api/payment/notification")
    }

    // Construir la URL completa
    const paymentUrl = `${apiUrl}?${params.toString()}`

    return {
      success: true,
      url: paymentUrl,
      signature: signature,
    }
  } catch (error) {
    console.error("Error al crear URL de pago con PayU:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al crear URL de pago",
    }
  }
}

/**
 * Procesa un pago con tarjeta de crédito utilizando la API de PayU
 */
export async function processPayment(paymentData: {
  cardNumber: string
  cardName: string
  cardExpiry: string
  cardCvc: string
  amount: number
  referenceCode: string
  description: string
  currency: string
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
}): Promise<PayUPaymentResponse> {
  try {
    // Validar configuración
    if (!PAYU_CONFIG.apiKey || !PAYU_CONFIG.apiLogin || !PAYU_CONFIG.merchantId) {
      throw new Error("Configuración de PayU incompleta. Verifica tus credenciales.")
    }

    // Calcular valores de impuestos
    const taxBase = Math.round(paymentData.amount / 1.19)
    const taxValue = paymentData.amount - taxBase

    // Formatear fecha de expiración (MM/YY a YYYY/MM)
    const [month, year] = paymentData.cardExpiry.split("/")
    const formattedExpiry = `20${year}/${month}`

    // Generar firma
    const signature = generateSignature(paymentData.referenceCode, paymentData.amount, paymentData.currency)

    // Determinar URL de la API
    const apiUrl = PAYU_CONFIG.isTest
      ? "https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi"
      : "https://api.payulatam.com/payments-api/4.0/service.cgi"

    // Generar deviceSessionId
    const deviceSessionId = crypto
      .createHash("md5")
      .update(Date.now().toString() + Math.random().toString(36).substring(2, 15))
      .digest("hex")

    // Construir la solicitud para PayU
    const payuRequest = {
      language: PAYU_CONFIG.language,
      command: "SUBMIT_TRANSACTION",
      merchant: {
        apiKey: PAYU_CONFIG.apiKey,
        apiLogin: PAYU_CONFIG.apiLogin,
      },
      transaction: {
        order: {
          accountId: PAYU_CONFIG.accountId,
          referenceCode: paymentData.referenceCode,
          description: paymentData.description,
          language: PAYU_CONFIG.language,
          signature: signature,
          notifyUrl: "https://edux.com.co/api/payment/notification",
          additionalValues: {
            TX_VALUE: {
              value: Math.round(paymentData.amount),
              currency: paymentData.currency,
            },
            TX_TAX: {
              value: taxValue,
              currency: paymentData.currency,
            },
            TX_TAX_RETURN_BASE: {
              value: taxBase,
              currency: paymentData.currency,
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
          number: paymentData.cardNumber.replace(/\s+/g, ""),
          securityCode: paymentData.cardCvc,
          expirationDate: formattedExpiry,
          name: paymentData.cardName,
        },
        extraParameters: {
          INSTALLMENTS_NUMBER: "1",
        },
        type: "AUTHORIZATION_AND_CAPTURE",
        paymentMethod: "VISA", // Determinar dinámicamente según el número de tarjeta
        paymentCountry: "CO",
        deviceSessionId: deviceSessionId,
        ipAddress: "127.0.0.1",
        cookie: crypto.randomBytes(16).toString("hex"),
        userAgent: "Mozilla/5.0",
      },
      test: PAYU_CONFIG.isTest,
    }

    console.log("Enviando solicitud a PayU:", {
      url: apiUrl,
      referenceCode: paymentData.referenceCode,
      signature,
      amount: paymentData.amount,
    })

    // Enviar la solicitud a PayU
    const response = await axios.post(apiUrl, payuRequest, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    const data = response.data

    // Verificar que la respuesta tenga la estructura esperada
    if (!data || !data.code) {
      console.error("Respuesta de PayU inválida:", data)
      throw new Error("Respuesta de pago inválida. Por favor, intenta nuevamente.")
    }

    if (data.code === "SUCCESS") {
      return {
        success: true,
        orderId: data.transactionResponse?.orderId,
        transactionId: data.transactionResponse?.transactionId,
        state: data.transactionResponse?.state,
        responseCode: data.transactionResponse?.responseCode,
        responseMessage: data.transactionResponse?.responseMessage,
      }
    } else {
      return {
        success: false,
        error: data.error || "Error desconocido en el procesamiento del pago",
      }
    }
  } catch (error) {
    console.error("Error al procesar pago con PayU:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al procesar el pago",
    }
  }
}

/**
 * Procesa una notificación de pago de PayU
 */
export function processPaymentNotification(notificationData: PayUNotification): {
  success: boolean
  isApproved: boolean
  referenceCode: string
  transactionId?: string
  message: string
} {
  try {
    // Validar la firma de la notificación
    const isValidSignature = validateSignature(notificationData)

    if (!isValidSignature) {
      console.error("Firma inválida en notificación de PayU:", notificationData)
      return {
        success: false,
        isApproved: false,
        referenceCode: notificationData.reference_sale,
        message: "Firma inválida en la notificación",
      }
    }

    // Verificar el estado de la transacción
    // 4 = APPROVED, 6 = DECLINED, 5 = EXPIRED, 7 = PENDING
    const isApproved = notificationData.state_pol === "4"
    const isPending = notificationData.state_pol === "7"
    const isDeclined = notificationData.state_pol === "6" || notificationData.state_pol === "5"

    let message = ""
    if (isApproved) {
      message = "Pago aprobado"
    } else if (isPending) {
      message = "Pago pendiente"
    } else if (isDeclined) {
      message = "Pago rechazado"
    } else {
      message = `Estado desconocido: ${notificationData.state_pol}`
    }

    return {
      success: true,
      isApproved,
      referenceCode: notificationData.reference_sale,
      transactionId: notificationData.transaction_id,
      message,
    }
  } catch (error) {
    console.error("Error al procesar notificación de PayU:", error)
    return {
      success: false,
      isApproved: false,
      referenceCode: notificationData.reference_sale || "unknown",
      message: error instanceof Error ? error.message : "Error desconocido al procesar la notificación",
    }
  }
}
