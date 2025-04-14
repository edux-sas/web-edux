"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CreditCard } from "lucide-react"

interface PayUCardFormProps {
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
  onSuccess?: (transactionId: string) => void
  onError?: (error: string) => void
}

export function PayUCardForm({
  referenceCode,
  description,
  amount,
  currency,
  buyerInfo,
  onSuccess,
  onError,
}: PayUCardFormProps) {
  const [loading, setLoading] = useState(false)
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvc: "",
  })
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Formateo específico para cada campo
    let formattedValue = value

    // Formatear número de tarjeta: añadir espacios cada 4 dígitos
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
      formattedValue = formattedValue.substring(0, 19) // Limitar a 16 dígitos + 3 espacios
    }

    // Formatear fecha de expiración: añadir / después de los primeros 2 dígitos
    if (name === "cardExpiry") {
      formattedValue = value.replace(/\//g, "")
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.substring(0, 2) + "/" + formattedValue.substring(2, 4)
      }
      formattedValue = formattedValue.substring(0, 5) // Limitar a MM/YY
    }

    // Limitar CVC a 3-4 dígitos
    if (name === "cardCvc") {
      formattedValue = value.replace(/\D/g, "").substring(0, 4)
    }

    setCardData((prev) => ({ ...prev, [name]: formattedValue }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      // Validar datos de la tarjeta
      if (!cardData.cardNumber || !cardData.cardName || !cardData.cardExpiry || !cardData.cardCvc) {
        throw new Error("Por favor, completa todos los campos de la tarjeta")
      }

      // Procesar pago con tarjeta
      const response = await fetch("/api/payment/process-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardNumber: cardData.cardNumber,
          cardName: cardData.cardName,
          cardExpiry: cardData.cardExpiry,
          cardCvc: cardData.cardCvc,
          amount,
          referenceCode,
          description,
          currency,
          buyerInfo,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Error al procesar el pago")
      }

      // Mostrar mensaje de éxito
      toast({
        title: "Pago procesado correctamente",
        description: "Tu pago ha sido procesado con éxito",
      })

      // Notificar éxito
      if (onSuccess) {
        onSuccess(data.transactionId)
      }
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
        <CardTitle>Pagar con Tarjeta</CardTitle>
        <CardDescription>Ingresa los datos de tu tarjeta para completar el pago</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
            <Input
              id="cardName"
              name="cardName"
              placeholder="Nombre completo como aparece en la tarjeta"
              value={cardData.cardName}
              onChange={handleInputChange}
              required
              className="focus:border-primary"
              autoComplete="cc-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Número de Tarjeta</Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardData.cardNumber}
              onChange={handleInputChange}
              required
              className="font-mono focus:border-primary"
              autoComplete="cc-number"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cardExpiry">Fecha de Expiración</Label>
              <Input
                id="cardExpiry"
                name="cardExpiry"
                placeholder="MM/AA"
                value={cardData.cardExpiry}
                onChange={handleInputChange}
                required
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
                onChange={handleInputChange}
                required
                className="font-mono focus:border-primary"
                autoComplete="cc-csc"
                type="password"
              />
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            <p>Tus datos de pago están seguros y encriptados.</p>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pagar{" "}
              {new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: currency,
              }).format(amount)}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
