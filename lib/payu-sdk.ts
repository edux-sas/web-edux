import crypto from "crypto"
import axios from "axios"

// PayU SDK Configuration
export const PayUConfig = {
  apiKey: process.env.NEXT_PUBLIC_PAYU_API_KEY || "",
  apiLogin: process.env.NEXT_PUBLIC_PAYU_API_LOGIN || "",
  merchantId: process.env.NEXT_PUBLIC_PAYU_MERCHANT_ID || "",
  isTest: process.env.NEXT_PUBLIC_PAYU_TEST_MODE === "true",
  language: "es",
  paymentsUrl:
    process.env.NEXT_PUBLIC_PAYU_TEST_MODE === "true"
      ? "https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi"
      : "https://api.payulatam.com/payments-api/4.0/service.cgi",
  reportsUrl:
    process.env.NEXT_PUBLIC_PAYU_TEST_MODE === "true"
      ? "https://sandbox.api.payulatam.com/reports-api/4.0/service.cgi"
      : "https://api.payulatam.com/reports-api/4.0/service.cgi",
}

// Types for PayU SDK
export type PayUBuyerInfo = {
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

export type PayUCardInfo = {
  cardNumber: string
  cardName: string
  cardExpiry: string
  cardCvc: string
}

export type PayUPaymentResponse = {
  code: string
  error?: string
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
  }
}

/**
 * Process a credit card payment using PayU SDK
 */
export async function processCardPayment(paymentData: {
  cardInfo: PayUCardInfo
  amount: number
  referenceCode: string
  buyerInfo: PayUBuyerInfo
  description?: string
}): Promise<PayUPaymentResponse> {
  try {
    // Validate required configuration
    if (!PayUConfig.apiKey || !PayUConfig.apiLogin || !PayUConfig.merchantId) {
      console.error("PayU configuration is incomplete:", {
        apiKey: PayUConfig.apiKey ? "Defined" : "Not defined",
        apiLogin: PayUConfig.apiLogin ? "Defined" : "Not defined",
        merchantId: PayUConfig.merchantId ? "Defined" : "Not defined",
      })

      return {
        code: "ERROR",
        error: "PayU configuration is incomplete. Please contact the administrator.",
        transactionResponse: {
          state: "ERROR",
          responseMessage: "PayU configuration is incomplete",
          responseCode: "ERROR",
        },
      }
    }

    // Format expiration date (MM/YY to YYYY/MM)
    const [month, year] = paymentData.cardInfo.cardExpiry.split("/")
    const formattedExpiry = `20${year}/${month}`

    // Generate deviceSessionId
    const timestamp = Date.now().toString()
    const randomValue = Math.random().toString(36).substring(2, 15)
    const deviceSessionId = crypto
      .createHash("md5")
      .update(timestamp + randomValue)
      .digest("hex")

    // Calculate tax base and VAT (19%)
    const taxBase = Math.round(paymentData.amount / 1.19)
    const taxValue = paymentData.amount - taxBase

    // Determine card type based on first digit
    const cardType = determineCardType(paymentData.cardInfo.cardNumber.charAt(0))

    // Generate signature
    const signature = generateSignature(
      PayUConfig.apiKey,
      PayUConfig.merchantId,
      paymentData.referenceCode,
      paymentData.amount,
      "COP",
    )

    // Build PayU request
    const payuRequest = {
      language: PayUConfig.language,
      command: "SUBMIT_TRANSACTION",
      merchant: {
        apiKey: PayUConfig.apiKey,
        apiLogin: PayUConfig.apiLogin,
      },
      transaction: {
        order: {
          accountId: PayUConfig.merchantId,
          referenceCode: paymentData.referenceCode,
          description: paymentData.description || "Payment with credit card",
          language: PayUConfig.language,
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
          number: paymentData.cardInfo.cardNumber.replace(/\s/g, ""),
          securityCode: paymentData.cardInfo.cardCvc,
          expirationDate: formattedExpiry,
          name: paymentData.cardInfo.cardName,
        },
        extraParameters: {
          INSTALLMENTS_NUMBER: "1",
        },
        type: "AUTHORIZATION_AND_CAPTURE",
        paymentMethod: cardType,
        paymentCountry: "CO",
        deviceSessionId,
        ipAddress: "127.0.0.1", // Ideally, get the real client IP
        cookie: crypto.randomBytes(16).toString("hex"),
        userAgent: "Mozilla/5.0",
      },
      test: PayUConfig.isTest,
    }

    console.log("Sending request to PayU:", {
      url: PayUConfig.paymentsUrl,
      referenceCode: paymentData.referenceCode,
      signature,
      deviceSessionId,
    })

    // Send request to PayU
    const response = await axios.post(PayUConfig.paymentsUrl, payuRequest, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    if (!response.data || !response.data.code) {
      console.error("Invalid PayU response:", response.data)
      throw new Error("Invalid payment response. Please try again.")
    }

    // If there's an error in the PayU response, format it properly
    if (response.data.code !== "SUCCESS") {
      const errorMessage =
        response.data.error ||
        (response.data.transactionResponse && response.data.transactionResponse.responseMessage) ||
        "Error processing payment"
      console.error("Error in PayU response:", errorMessage, response.data)

      return {
        code: response.data.code,
        error: errorMessage,
        transactionResponse: response.data.transactionResponse || {
          state: "DECLINED",
          responseMessage: errorMessage,
          responseCode: "ERROR",
        },
      }
    }

    return response.data
  } catch (error) {
    console.error("Error processing payment with PayU SDK:", error)

    // Return a consistent object in case of error
    return {
      code: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error processing payment",
      transactionResponse: {
        state: "ERROR",
        responseMessage: error instanceof Error ? error.message : "Unknown error",
        responseCode: "SYSTEM_ERROR",
      },
    }
  }
}

/**
 * Generate PayU signature
 */
function generateSignature(
  apiKey: string,
  merchantId: string,
  referenceCode: string,
  amount: number,
  currency: string,
): string {
  // Clean referenceCode
  const cleanReferenceCode = referenceCode.trim()

  // Format amount
  let formattedAmount: string
  if (currency === "COP") {
    formattedAmount = Math.round(amount).toString()
  } else {
    formattedAmount = amount.toFixed(2)
  }

  // Create signature string: apiKey~merchantId~referenceCode~amount~currency
  const signatureString = `${apiKey}~${merchantId}~${cleanReferenceCode}~${formattedAmount}~${currency}`

  console.log("Signature string:", signatureString)

  // Generate MD5 hash
  const signature = crypto.createHash("md5").update(signatureString).digest("hex")
  console.log("Generated signature (MD5):", signature)

  return signature
}

/**
 * Determine card type based on first digit
 */
function determineCardType(firstDigit: string): string {
  if (firstDigit === "4") return "VISA"
  if (firstDigit === "5") return "MASTERCARD"
  if (firstDigit === "3") return "AMEX"
  if (firstDigit === "6") return "DINERS"
  return "VISA" // Default
}

/**
 * Validate PayU notification signature
 */
export function validatePayUSignature(notificationData: any): boolean {
  // If there's no signature or data, the signature is invalid
  if (!notificationData || !notificationData.signature || !PayUConfig.apiKey) {
    return false
  }

  // The signature received in the notification
  const receivedSignature = notificationData.signature

  try {
    // Different signature formats depending on the notification type
    let signatureString = ""

    // For standard PayU notifications
    if (
      notificationData.reference_sale &&
      notificationData.value &&
      notificationData.currency &&
      notificationData.state_pol
    ) {
      // Format value according to currency
      let formattedValue: string
      if (notificationData.currency === "COP") {
        formattedValue = Math.round(Number.parseFloat(notificationData.value)).toString()
      } else {
        formattedValue = Number.parseFloat(notificationData.value).toFixed(2)
      }

      // Standard format is: apiKey~merchantId~referenceCode~value~currency~state
      signatureString = `${PayUConfig.apiKey}~${notificationData.merchant_id}~${notificationData.reference_sale}~${formattedValue}~${notificationData.currency}~${notificationData.state_pol}`
    }
    // For transaction confirmation notifications
    else if (notificationData.transaction_id && notificationData.reference_code && notificationData.amount) {
      // Format amount according to currency
      let formattedAmount: string
      if (notificationData.currency === "COP") {
        formattedAmount = Math.round(Number.parseFloat(notificationData.amount)).toString()
      } else {
        formattedAmount = Number.parseFloat(notificationData.amount).toFixed(2)
      }

      // Another common format
      signatureString = `${PayUConfig.apiKey}~${notificationData.merchant_id}~${notificationData.reference_code}~${formattedAmount}~${notificationData.currency}`
    }
    // If we don't recognize the format, fail for security
    else {
      console.error("Unknown notification format", notificationData)
      return false
    }

    console.log("Signature validation string:", signatureString)

    // Generate MD5 hash of the signatureString
    const calculatedSignature = crypto.createHash("md5").update(signatureString).digest("hex")

    console.log("Received signature:", receivedSignature)
    console.log("Calculated signature:", calculatedSignature)

    // Compare the calculated signature with the received one
    return calculatedSignature === receivedSignature
  } catch (error) {
    console.error("Error validating PayU signature:", error)
    return false
  }
}

/**
 * Check PayU connection and credentials
 */
export async function testPayUConnection(): Promise<{
  success: boolean
  message: string
  details?: any
}> {
  try {
    // Verify that credentials are configured
    if (!PayUConfig.apiKey || !PayUConfig.apiLogin || !PayUConfig.merchantId) {
      return {
        success: false,
        message: "PayU credentials are not properly configured",
        details: {
          apiKey: PayUConfig.apiKey ? "Defined" : "Not defined",
          apiLogin: PayUConfig.apiLogin ? "Defined" : "Not defined",
          merchantId: PayUConfig.merchantId ? "Defined" : "Not defined",
        },
      }
    }

    // Create a simple request to test the connection (GET_PAYMENT_METHODS)
    const payuRequest = {
      language: PayUConfig.language,
      command: "GET_PAYMENT_METHODS",
      merchant: {
        apiKey: PayUConfig.apiKey,
        apiLogin: PayUConfig.apiLogin,
      },
      test: PayUConfig.isTest,
    }

    // Send request to PayU
    const response = await axios.post(PayUConfig.paymentsUrl, payuRequest, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    return {
      success: true,
      message: "Connection with PayU established successfully",
      details: response.data,
    }
  } catch (error) {
    console.error("Error testing PayU connection:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      details: error,
    }
  }
}
