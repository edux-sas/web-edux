"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CreditCard, AlertCircle, ShieldCheck } from "lucide-react"
import { processCardPayment } from "@/lib/payu-sdk"
import { savePaymentTransaction } from "@/lib/supabase-service"

interface PaymentFormProps {
  userId: string
  productId: string
  productName: string
  amount: number
  currency?: string
  onSuccess?: (transactionId: string) => void
  onError?: (error: string) => void
}

export function PaymentForm({
  userId,
  productId,
  productName,
  amount,
  currency = "COP",
  onSuccess,
  onError,
}: PaymentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvc: "",
  })
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
    address: "",
    city: "Bogotá",
    state: "Bogotá D.C.",
    country: "CO",
    postalCode: "000000",
  })
  const [showBuyerInfo, setShowBuyerInfo] = useState(false)

  // Handle card data changes
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Format specific fields
    let formattedValue = value

    // Format card number: add spaces every 4 digits
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
      formattedValue = formattedValue.substring(0, 19) // Limit to 16 digits + 3 spaces
    }

    // Format expiration date: add / after the first 2 digits
    if (name === "cardExpiry") {
      formattedValue = value.replace(/\//g, "")
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.substring(0, 2) + "/" + formattedValue.substring(2, 4)
      }
      formattedValue = formattedValue.substring(0, 5) // Limit to MM/YY
    }

    // Limit CVC to 3-4 digits
    if (name === "cardCvc") {
      formattedValue = value.replace(/\D/g, "").substring(0, 4)
    }

    setCardData({ ...cardData, [name]: formattedValue })
  }

  // Handle buyer info changes
  const handleBuyerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBuyerInfo({ ...buyerInfo, [name]: value })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate required fields
      if (!cardData.cardNumber || !cardData.cardName || !cardData.cardExpiry || !cardData.cardCvc) {
        throw new Error("Please fill in all card details")
      }

      if (
        showBuyerInfo &&
        (!buyerInfo.name || !buyerInfo.email || !buyerInfo.phone || !buyerInfo.document || !buyerInfo.address)
      ) {
        throw new Error("Please fill in all buyer information")
      }

      // Generate a unique reference code
      const referenceCode = `EDUX_${productId}_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`

      // Process payment
      const paymentResponse = await processCardPayment({
        cardInfo: cardData,
        amount,
        referenceCode,
        buyerInfo: {
          name: buyerInfo.name || "Test User",
          email: buyerInfo.email || "test@example.com",
          phone: buyerInfo.phone || "1234567890",
          document: buyerInfo.document || "1234567890",
          address: buyerInfo.address || "Test Address",
          city: buyerInfo.city,
          state: buyerInfo.state,
          country: buyerInfo.country,
          postalCode: buyerInfo.postalCode,
        },
        description: `Payment for ${productName}`,
      })

      // Save transaction to Supabase
      await savePaymentTransaction({
        user_id: userId,
        reference_code: referenceCode,
        amount,
        currency,
        payment_method: "CREDIT_CARD",
        status: paymentResponse.transactionResponse.state || "ERROR",
        transaction_id: paymentResponse.transactionResponse.transactionId,
        response_code: paymentResponse.transactionResponse.responseCode,
        response_message: paymentResponse.transactionResponse.responseMessage || paymentResponse.error,
      })

      // Check payment status
      if (paymentResponse.code !== "SUCCESS" || paymentResponse.transactionResponse.state !== "APPROVED") {
        throw new Error(
          paymentResponse.error ||
            paymentResponse.transactionResponse.responseMessage ||
            "Payment was not approved. Please try again.",
        )
      }

      // Handle success
      if (onSuccess) {
        onSuccess(paymentResponse.transactionResponse.transactionId || "")
      } else {
        // Redirect to success page
        router.push(`/payment/success?reference=${referenceCode}`)
      }
    } catch (err) {
      console.error("Payment error:", err)
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)

      if (onError) {
        onError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>Enter your card information to complete the purchase</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Payment Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardName">Name on Card</Label>
            <Input
              id="cardName"
              name="cardName"
              placeholder="Full name as shown on card"
              value={cardData.cardName}
              onChange={handleCardChange}
              required
              disabled={loading}
              className="focus:border-primary"
              autoComplete="cc-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardData.cardNumber}
              onChange={handleCardChange}
              required
              disabled={loading}
              className="font-mono focus:border-primary"
              autoComplete="cc-number"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cardExpiry">Expiration Date</Label>
              <Input
                id="cardExpiry"
                name="cardExpiry"
                placeholder="MM/YY"
                value={cardData.cardExpiry}
                onChange={handleCardChange}
                required
                disabled={loading}
                className="font-mono focus:border-primary"
                autoComplete="cc-exp"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardCvc">CVC/CVV</Label>
              <Input
                id="cardCvc"
                name="cardCvc"
                placeholder="123"
                value={cardData.cardCvc}
                onChange={handleCardChange}
                required
                disabled={loading}
                className="font-mono focus:border-primary"
                autoComplete="cc-csc"
                type="password"
              />
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full mt-2"
            onClick={() => setShowBuyerInfo(!showBuyerInfo)}
          >
            {showBuyerInfo ? "Hide buyer information" : "Add buyer information"}
          </Button>

          {showBuyerInfo && (
            <div className="space-y-4 border p-4 rounded-md">
              <h4 className="font-medium">Buyer Information</h4>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={buyerInfo.name}
                  onChange={handleBuyerInfoChange}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={buyerInfo.email}
                  onChange={handleBuyerInfoChange}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="123-456-7890"
                  value={buyerInfo.phone}
                  onChange={handleBuyerInfoChange}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="document">Document ID</Label>
                <Input
                  id="document"
                  name="document"
                  placeholder="ID Number"
                  value={buyerInfo.document}
                  onChange={handleBuyerInfoChange}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Main St"
                  value={buyerInfo.address}
                  onChange={handleBuyerInfoChange}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-md text-sm">
            <ShieldCheck className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
            <p className="text-green-700 dark:text-green-300">Your payment information is secure and encrypted</p>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay {new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
