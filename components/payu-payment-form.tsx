"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CreditCard } from "lucide-react"

interface PayUPaymentFormProps {
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
  onSuccess?: (url: string) => void
  onError?: (error: string) => void
}

export function PayUPaymentForm({
  referenceCode,
  description,
  amount,
  currency,
  buyerInfo,
  onSuccess,
  onError,
}: PayUPaymentFormProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handlePayment = async () => {
    try {
      setLoading(true)

      // Crear URL de pago con PayU
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referenceCode,
          description,
          amount,
          currency,
          buyerInfo,
          responseUrl: window.location.origin + "/payment/response",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success || !data.url) {
        throw new Error(data.error || "No se pudo crear la URL de pago")
      }

      // Notificar éxito
      if (onSuccess) {
        onSuccess(data.url)
      }

      // Redirigir al usuario a la página de pago de PayU
      window.location.href = data.url
    } catch (error) {
      console.error("Error al procesar el pago:", error)
      
      // Mostrar mensaje de error
      toast({
        title: "Error al procesar el pago",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      })

      // Notificar error
      if (onError) {
        onError(error instanceof Error ? error.message : "Error desconocido")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pagar con PayU</CardTitle>
        <CardDescription>Serás redirigido a la plataforma segura de PayU para completar tu pago</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Descripción:</span>
            <span>{description}</span>
          </div>
          <div className="flex justify-between">
            <span>Monto:</span>
            <span>
              {new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: currency,
              }).format(amount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Referencia:</span>
            <span>{referenceCode}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handlePayment} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pagar Ahora
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
