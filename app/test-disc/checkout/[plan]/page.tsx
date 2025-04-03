"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { checkSupabaseConnection } from "@/lib/supabase"
import { PaymentMethods } from "@/components/payment-methods"
import { processCardPayment, processPSEPayment } from "@/lib/payu"

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [loading, setLoading] = useState(false)
  const [supabaseStatus, setSupabaseStatus] = useState<{
    connected: boolean
    error?: string
    supabaseUrl?: string
    supabaseAnonKey?: string
  } | null>(null)
  const [isCheckingConnection, setIsCheckingConnection] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    terms: false,
  })
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvc: "",
  })
  const [pseData, setPseData] = useState({
    bankCode: "",
    userType: "N",
    docType: "CC",
    docNumber: "",
  })

  // Verificar la conexión con Supabase al cargar la página
  useEffect(() => {
    const checkConnection = async () => {
      setIsCheckingConnection(true)
      const status = await checkSupabaseConnection()
      setSupabaseStatus(status)
      setIsCheckingConnection(false)
    }

    checkConnection()
  }, [])

  const planId = params.plan as string

  const planDetails = {
    professional: {
      name: "Profesional",
      price: "$59.99",
    },
    enterprise: {
      name: "Empresarial",
      price: "Contactar",
    },
  }

  const plan = planDetails[planId as keyof typeof planDetails]

  if (!plan) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Plan no encontrado</h1>
        <p className="text-muted-foreground mb-6">El plan seleccionado no existe.</p>
        <Button asChild>
          <a href="/test-disc">Volver a Planes</a>
        </Button>
      </div>
    )
  }

  // Si es plan empresarial, redirigir a contacto
  if (planId === "enterprise") {
    router.push("/contacto")
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, terms: checked }))
  }

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method)
  }

  const handleCardDataChange = (data: any) => {
    setCardData(data)
  }

  const handlePSEDataChange = (data: any) => {
    setPseData(data)
  }

  // Modificar la función handleSubmit para manejar mejor los errores
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Verificar si Supabase está disponible
    if (!supabaseStatus?.connected) {
      toast({
        title: "Error de conexión",
        description: "No se puede conectar con el servidor. Por favor, intenta más tarde.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      // Procesar el pago según el método seleccionado
      let paymentResponse

      // Datos del comprador para PayU
      const buyerInfo = {
        name: formData.name,
        email: formData.email,
        phone: "7563126", // Deberías recopilar este dato
        document: pseData.docNumber || "123456789", // Usar el documento de PSE o uno por defecto
        address: "Dirección de ejemplo", // Deberías recopilar este dato
        city: "Bogotá",
        state: "Bogotá D.C.",
        country: "CO",
        postalCode: "000000",
      }

      // Monto del pago
      const amount = Number.parseFloat(plan.price.replace("$", ""))

      if (paymentMethod === "card") {
        paymentResponse = await processCardPayment({
          cardNumber: cardData.cardNumber,
          cardName: cardData.cardName,
          cardExpiry: cardData.cardExpiry,
          cardCvc: cardData.cardCvc,
          amount,
          buyerInfo,
        })
      } else if (paymentMethod === "pse") {
        paymentResponse = await processPSEPayment({
          amount,
          bankCode: pseData.bankCode,
          userType: pseData.userType as "N" | "J",
          docType: pseData.docType,
          docNumber: pseData.docNumber,
          buyerInfo,
        })

        // Si es PSE y la respuesta es exitosa, redirigir al banco
        if (
          paymentResponse.code === "SUCCESS" &&
          paymentResponse.transactionResponse.state === "PENDING" &&
          paymentResponse.transactionResponse.extraParameters?.BANK_URL
        ) {
          window.location.href = paymentResponse.transactionResponse.extraParameters.BANK_URL
          return
        }
      }

      // Verificar si el pago fue exitoso
      if (
        paymentResponse.code !== "SUCCESS" ||
        (paymentResponse.transactionResponse.state !== "APPROVED" &&
          paymentResponse.transactionResponse.state !== "PENDING")
      ) {
        throw new Error(paymentResponse.transactionResponse.responseMessage || "Error en el pago")
      }

      // Fecha actual para el registro de la compra
      const purchaseDate = new Date().toISOString()

      // Datos para el registro de usuario
      const registerData = {
        email: formData.email,
        password: formData.password,
        userData: {
          name: formData.name,
          email: formData.email,
          plan: planId,
          payment_status: paymentResponse.transactionResponse.state,
          purchase_date: purchaseDate,
          amount,
        },
      }

      console.log("Enviando datos de registro:", JSON.stringify(registerData))

      // Verificar las variables de entorno antes de hacer la solicitud
      try {
        const envCheckResponse = await fetch("/api/check-env")
        const envCheckData = await envCheckResponse.json()
        console.log("Estado de las variables de entorno:", envCheckData)

        if (!envCheckData.variables.SUPABASE_SERVICE_ROLE_KEY.includes("Definida")) {
          throw new Error(
            "La clave de servicio de Supabase no está definida. Por favor, configura la variable de entorno SUPABASE_SERVICE_ROLE_KEY.",
          )
        }
      } catch (envError) {
        console.error("Error al verificar variables de entorno:", envError)
        toast({
          title: "Error de configuración",
          description:
            envError instanceof Error ? envError.message : "Error al verificar la configuración del servidor.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Registrar usuario a través de la API en lugar de directamente
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      })

      if (!registerResponse.ok) {
        const errorText = await registerResponse.text()
        console.error("Error en la respuesta del servidor:", errorText)

        // Intentar extraer el mensaje de error si es posible
        let errorMessage = "Error en el registro"
        try {
          if (errorText.includes("{") && errorText.includes("}")) {
            const jsonStart = errorText.indexOf("{")
            const jsonEnd = errorText.lastIndexOf("}") + 1
            const jsonStr = errorText.substring(jsonStart, jsonEnd)
            const errorObj = JSON.parse(jsonStr)
            if (errorObj.error) {
              errorMessage = errorObj.error
            }
          }
        } catch (e) {
          console.error("Error al parsear respuesta de error:", e)
        }

        throw new Error(`${errorMessage} (${registerResponse.status} ${registerResponse.statusText})`)
      }

      const registerResult = await registerResponse.json()

      if (!registerResult.success) {
        toast({
          title: "Error al registrar usuario",
          description: registerResult.error || "No se pudo completar el registro. Por favor, intenta nuevamente.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const user = registerResult.user

      // Guardar usuario en localStorage para la sesión actual
      localStorage.setItem(
        "eduXUser",
        JSON.stringify({
          id: user.id,
          name: formData.name,
          email: formData.email,
          isLoggedIn: true,
          plan: planId,
        }),
      )

      // Redirigir a página de éxito
      router.push("/test-disc/success")
    } catch (error) {
      console.error("Error en el proceso de pago:", error)
      toast({
        title: "Error al procesar el pago",
        description:
          error instanceof Error
            ? error.message
            : "Hubo un problema con tu pago. Por favor, verifica tus datos e intenta nuevamente.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const isFormValid =
    formData.email &&
    formData.name &&
    formData.password &&
    formData.terms &&
    supabaseStatus?.connected === true &&
    (paymentMethod === "card"
      ? cardData.cardName && cardData.cardNumber && cardData.cardExpiry && cardData.cardCvc
      : pseData.bankCode && pseData.docNumber)

  return (
    <div className="container py-12 max-w-5xl">
      <h1 className="text-2xl font-bold mb-8 text-center">Checkout - Test DISC {plan.name}</h1>

      {isCheckingConnection ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <p>Verificando conexión con el servidor...</p>
        </div>
      ) : (
        <>
          {!supabaseStatus?.connected && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error de conexión con Supabase</AlertTitle>
              <AlertDescription className="flex flex-col gap-2">
                <p>{supabaseStatus?.error || "No se puede conectar con el servidor de Supabase."}</p>
                <p className="text-sm mt-2">
                  Por favor, contacta al administrador para verificar la configuración de Supabase.
                </p>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Información de Pago y Registro</CardTitle>
                  <CardDescription>Ingresa tus datos para procesar el pago y crear tu cuenta</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      {/* Datos de registro */}
                      <div className="space-y-4">
                        <h3 className="font-medium">Datos de Cuenta</h3>

                        <div className="space-y-2">
                          <Label htmlFor="email">Correo Electrónico</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="tu@email.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            disabled={!supabaseStatus?.connected}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre Completo</Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Juan Pérez"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            disabled={!supabaseStatus?.connected}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password">Contraseña</Label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="********"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            minLength={8}
                            disabled={!supabaseStatus?.connected}
                          />
                          <p className="text-xs text-muted-foreground">Debe tener al menos 8 caracteres</p>
                        </div>
                      </div>

                      <Separator />

                      {/* Métodos de pago */}
                      <PaymentMethods
                        onMethodChange={handlePaymentMethodChange}
                        onCardDataChange={handleCardDataChange}
                        onPSEDataChange={handlePSEDataChange}
                        disabled={!supabaseStatus?.connected}
                      />

                      {/* Términos y condiciones */}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={formData.terms}
                          onCheckedChange={handleCheckboxChange}
                          required
                          disabled={!supabaseStatus?.connected}
                        />
                        <Label htmlFor="terms" className="text-sm">
                          Acepto los{" "}
                          <a href="/terminos" className="text-primary hover:underline">
                            términos y condiciones
                          </a>
                        </Label>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Resumen de Compra</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Test DISC {plan.name}</span>
                      <span>{plan.price}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{plan.price}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleSubmit} disabled={loading || !isFormValid}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Procesando...
                      </>
                    ) : !supabaseStatus?.connected ? (
                      "No disponible"
                    ) : (
                      "Completar Compra"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )
}



