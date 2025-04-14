"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { PaymentForm } from "@/components/payment-form"
import { supabase } from "@/lib/supabase-service"

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  // Get product details from URL parameters
  const productId = searchParams.get("productId") || "default"
  const productName = searchParams.get("productName") || "Product"
  const amount = Number(searchParams.get("amount") || "0")

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      setLoading(true)

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setError("You must be logged in to make a payment")
          return
        }

        setUserId(user.id)
      } catch (err) {
        console.error("Authentication error:", err)
        setError("Authentication error. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Loading payment information...</p>
      </div>
    )
  }

  if (error || !userId) {
    return (
      <div className="container py-12 max-w-md">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Unknown error"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (amount <= 0) {
    return (
      <div className="container py-12 max-w-md">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Invalid Amount</AlertTitle>
          <AlertDescription>The payment amount must be greater than zero.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container py-12 max-w-md">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{productName}</CardTitle>
          <CardDescription>Complete your payment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <span>Amount:</span>
            <span className="font-bold">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "COP" }).format(amount)}
            </span>
          </div>
        </CardContent>
      </Card>

      <PaymentForm
        userId={userId}
        productId={productId}
        productName={productName}
        amount={amount}
        onError={(errorMessage) => setError(errorMessage)}
      />
    </div>
  )
}
