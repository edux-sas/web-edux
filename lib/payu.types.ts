// Definición de tipos para PayU
// Este archivo solo contiene tipos, no modifica la lógica de producción

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
        merchantBuyerId?: string
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
  