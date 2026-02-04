"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function PaymentResponsePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "failure" | "pending">("loading")
  const [transactionDetails, setTransactionDetails] = useState<{
    referenceCode?: string
    transactionId?: string
    status?: string
    message?: string
  } | null>(null)

  useEffect(() => {
    // Extraer parámetros de la URL de respuesta de PayU
    const referenceCode = searchParams.get("referenceCode") || searchParams.get("reference_sale") || ""
    const transactionId = searchParams.get("transactionId") || ""
    const lapResponseCode = searchParams.get("lapResponseCode") || ""
    const polResponseCode = searchParams.get("polResponseCode") || ""
    const transactionState = searchParams.get("transactionState") || searchParams.get("state_pol") || ""

    // Guardar detalles de la transacción
    setTransactionDetails({
      referenceCode,
      transactionId,
      status: transactionState,
      message: searchParams.get("message") || "",
    })

    // Determinar el estado de la transacción
    if (transactionState === "4" || transactionState === "APPROVED") {
      setStatus("success")
    } else if (
      transactionState === "6" ||
      transactionState === "5" ||
      transactionState === "REJECTED" ||
      transactionState === "EXPIRED"
    ) {
      setStatus("failure")
    } else if (transactionState === "7" || transactionState === "PENDING") {
      setStatus("pending")
    } else {
      // Estado desconocido, verificar a través de la API
      checkTransactionStatus(referenceCode, transactionId)
    }
  }, [searchParams])

  const checkTransactionStatus = async (referenceCode: string, transactionId: string) => {
    try {
      if (!referenceCode && !transactionId) {
        setStatus("failure")
        return
      }

      // Llamar a un endpoint en nuestro backend para verificar el estado
      const response = await fetch(
        `/api/payment/check-status?referenceCode=${referenceCode}&transactionId=${transactionId}`,
      )

      if (!response.ok) {
        throw new Error("Error al verificar el estado de la transacción")
      }

      const data = await response.json()

      if (data.status === "APPROVED") {
        setStatus("success")
      } else if (data.status === "REJECTED" || data.status === "EXPIRED") {
        setStatus("failure")
      } else if (data.status === "PENDING") {
        setStatus("pending")
      } else {
        setStatus("failure")
      }
    } catch (error) {
      console.error("Error al verificar estado:", error)
      setStatus("failure")
    }
  }

  if (status === "loading") {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Verificando estado del pago</CardTitle>
            <CardDescription>Estamos consultando el estado de tu transacción</CardDescription>
          </CardHeader>
          <CardContent className="py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p>Por favor espera mientras verificamos el estado de tu pago...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>¡Pago Exitoso!</CardTitle>
            <CardDescription>Tu pago ha sido procesado correctamente</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Gracias por tu compra. Tu cuenta ha sido activada y ya puedes acceder a todos los beneficios.
            </p>
            {transactionDetails && (
              <div className="bg-muted p-4 rounded-md text-left mb-4">
                <p className="font-medium">Detalles de la transacción:</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {transactionDetails.referenceCode && (
                    <li>
                      <span className="text-muted-foreground">Referencia:</span> {transactionDetails.referenceCode}
                    </li>
                  )}
                  {transactionDetails.transactionId && (
                    <li>
                      <span className="text-muted-foreground">ID de Transacción:</span>{" "}
                      {transactionDetails.transactionId}
                    </li>
                  )}
                  <li>
                    <span className="text-muted-foreground">Fecha:</span> {new Date().toLocaleDateString()}
                  </li>
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button asChild className="w-full">
              <Link href="/test-disc/success">Continuar</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (status === "pending") {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle>Pago en Proceso</CardTitle>
            <CardDescription>Tu transacción está siendo procesada</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Pago pendiente</AlertTitle>
              <AlertDescription>
                Tu pago está siendo procesado por la entidad financiera. Una vez confirmado, te notificaremos por correo
                electrónico.
              </AlertDescription>
            </Alert>
            <p className="mb-4">Recuerda que los pagos con PSE pueden tardar hasta 24 horas en ser confirmados.</p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button asChild className="w-full">
              <Link href="/dashboard">Ir al Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12 flex flex-col items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle>Error en el Pago</CardTitle>
          <CardDescription>No pudimos procesar tu pago correctamente</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Transacción rechazada</AlertTitle>
            <AlertDescription>
              {transactionDetails?.message ||
                "Tu transacción no ha podido ser procesada. Por favor, intenta nuevamente."}
            </AlertDescription>
          </Alert>
          <p className="mb-4">
            Si el problema persiste, comunícate con nuestro equipo de soporte o intenta con otro método de pago.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/test-disc">Intentar nuevamente</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/contacto">Contactar Soporte</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
