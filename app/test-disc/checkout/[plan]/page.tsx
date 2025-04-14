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
import { AlertCircle, Loader2, Check, X, ShieldCheck, CreditCard } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { checkSupabaseConnection } from "@/lib/supabase"
import { PaymentMethods } from "@/components/payment-methods"
import { processCardPayment } from "@/lib/payu"

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
    confirmPassword: "",
    terms: false,
    phone: "", // Añadido campo de teléfono
    document: "", // Añadido campo de documento
    address: "", // Añadido campo de dirección
    city: "Bogotá", // Valor por defecto
    state: "Bogotá D.C.", // Valor por defecto
    country: "CO", // Valor por defecto
    postalCode: "000000", // Valor por defecto
  })
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
    matches: false,
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
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [showAdditionalFields, setShowAdditionalFields] = useState(false)
  const [isTestMode, setIsTestMode] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Verificar la conexión con Supabase al cargar la página
  useEffect(() => {
    const checkConnection = async () => {
      setIsCheckingConnection(true)
      const status = await checkSupabaseConnection()
      setSupabaseStatus(status)
      setIsCheckingConnection(false)
    }

    checkConnection()

    // Verificar si el usuario ya está autenticado
    const storedUser = localStorage.getItem("eduXUser")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        if (userData.isLoggedIn) {
          setIsAuthenticated(true)
          setUserId(userData.id)
          // Pre-llenar los datos del formulario
          setFormData((prev) => ({
            ...prev,
            email: userData.email || "",
            name: userData.name || "",
            terms: true,
          }))
        }
      } catch (e) {
        console.error("Error parsing user data", e)
      }
    }

    // Verificar si estamos en modo de prueba
    setIsTestMode(process.env.NEXT_PUBLIC_PAYU_TEST_MODE === "true")
  }, [])

  // Validar contraseña cuando cambia
  useEffect(() => {
    const { password, confirmPassword } = formData

    setPasswordValidation({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      matches: password === confirmPassword && password !== "",
    })
  }, [formData.password, formData.confirmPassword, formData])

  const planId = params.plan as string

  const planDetails = {
    professional: {
      name: "Profesional",
      price: "$169.000",
      priceCurrency: "COP",
      priceValue: 169000,
    },
    enterprise: {
      name: "Empresarial",
      price: "Contactar",
      priceCurrency: "COP",
      priceValue: 0,
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

  // Verificar si la contraseña cumple con todos los requisitos
  const isPasswordValid = Object.values(passwordValidation).every(Boolean)

  // Modificar la función handleSubmit para manejar usuarios autenticados
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFormError(null)

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

    // Verificar campos adicionales si están visibles
    if (showAdditionalFields) {
      if (!formData.phone || !formData.document || !formData.address) {
        toast({
          title: "Información incompleta",
          description: "Por favor completa todos los campos de información de contacto.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }
    }

    // Generar un código de referencia único para el seguimiento de la transacción
    // Asegurarnos de que sea alfanumérico sin caracteres especiales
    const referenceCode = `EDUX${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`.replace(
      /[^a-zA-Z0-9]/g,
      "",
    )

    // Verificar que la contraseña cumpla con los requisitos
    if (!isAuthenticated && !isPasswordValid) {
      toast({
        title: "Contraseña inválida",
        description: "Por favor, asegúrate de que la contraseña cumpla con todos los requisitos.",
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
        phone: formData.phone || "7563126", // Usar el teléfono ingresado o uno por defecto
        document: formData.document || "123456789", // Usar el documento ingresado o uno por defecto
        address: formData.address || "Dirección de ejemplo", // Usar la dirección ingresada o una por defecto
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postalCode: formData.postalCode,
      }

      // Monto del pago
      const amount = plan.priceValue

      // Limpiar número de tarjeta (quitar espacios)
      const cleanCardNumber = cardData.cardNumber.replace(/\s+/g, "")

      // Verificar las credenciales de PayU antes de procesar el pago
      try {
        const credentialsResponse = await fetch("/api/check-payu-credentials")
        const credentialsData = await credentialsResponse.json()

        console.log("Estado de las credenciales PayU:", credentialsData)

        if (!credentialsData.credentialsStatus.publicApiKey.includes("Definida")) {
          throw new Error("La API Key de PayU no está configurada correctamente.")
        }
      } catch (credError) {
        console.error("Error al verificar credenciales PayU:", credError)
        toast({
          title: "Error de configuración",
          description: "No se pudieron verificar las credenciales de pago. Por favor, contacta al administrador.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      if (paymentMethod === "card") {
        paymentResponse = await processCardPayment({
          cardNumber: cleanCardNumber,
          cardName: cardData.cardName,
          cardExpiry: cardData.cardExpiry,
          cardCvc: cardData.cardCvc,
          amount,
          buyerInfo,
          referenceCode, // Añadir el código de referencia limpio
        })

        console.log("Respuesta de PayU:", paymentResponse)
      }

      // Verificar si el pago fue exitoso
      if (
        !paymentResponse ||
        paymentResponse.code !== "SUCCESS" ||
        !paymentResponse.transactionResponse ||
        (paymentResponse.transactionResponse.state !== "APPROVED" &&
          paymentResponse.transactionResponse.state !== "PENDING")
      ) {
        const errorMessage =
          paymentResponse?.transactionResponse?.responseMessage ||
          paymentResponse?.error ||
          "Error en el procesamiento del pago. Por favor, intenta nuevamente."
        throw new Error(errorMessage)
      }

      // Fecha actual para el registro de la compra
      const purchaseDate = new Date().toISOString()

      // Si el usuario ya está autenticado, actualizar su plan
      if (isAuthenticated && userId) {
        try {
          const response = await fetch("/api/user/update-plan", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              plan: planId,
              payment_status: paymentResponse.transactionResponse.state,
              purchase_date: purchaseDate,
              amount,
              transaction_id: paymentResponse.transactionResponse.transactionId,
              reference_code: referenceCode, // Añadir el código de referencia
            }),
          })

          if (!response.ok) {
            throw new Error("Error al actualizar el plan del usuario")
          }

          // Actualizar la información del usuario en localStorage
          const userData = JSON.parse(localStorage.getItem("eduXUser") || "{}")
          userData.plan = planId
          localStorage.setItem("eduXUser", JSON.stringify(userData))

          // Redirigir a página de éxito
          router.push("/test-disc/success")
          return
        } catch (error) {
          console.error("Error al actualizar el plan:", error)
          throw error
        }
      }

      // Si no está autenticado, continuar con el registro normal
      const registerData = {
        email: formData.email,
        password: formData.password,
        userData: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          document: formData.document,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode,
          plan: planId,
          payment_status: paymentResponse.transactionResponse.state,
          purchase_date: purchaseDate,
          amount,
          transaction_id: paymentResponse.transactionResponse.transactionId,
          reference_code: referenceCode, // Añadir el código de referencia
        },
      }

      console.log("Enviando datos de registro:", JSON.stringify(registerData))

      // Registrar usuario a través de la API
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

      // Guardar el estado de la integración con Moodle
      if (registerResult.moodle) {
        console.log("Guardando estado de Moodle en localStorage:", registerResult.moodle)
        localStorage.setItem("moodleRegistrationStatus", JSON.stringify(registerResult.moodle))

        // Si hay un nombre de usuario de Moodle, asegurarnos de que se guarde en el objeto de usuario
        if (registerResult.moodle.username) {
          const userData = {
            id: user.id,
            name: formData.name,
            email: formData.email,
            isLoggedIn: true,
            plan: planId,
            moodle_username: registerResult.moodle.username,
          }

          console.log("Guardando usuario con moodle_username en localStorage:", userData)
          localStorage.setItem("eduXUser", JSON.stringify(userData))
        }
      }

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

  // Modificar la validación del formulario para usuarios autenticados
  const isFormValid = isAuthenticated
    ? formData.terms &&
      supabaseStatus?.connected === true &&
      (paymentMethod === "card"
        ? cardData.cardName && cardData.cardNumber && cardData.cardExpiry && cardData.cardCvc
        : false) // PSE está oculto
    : formData.email &&
      formData.name &&
      formData.password &&
      isPasswordValid &&
      formData.terms &&
      supabaseStatus?.connected === true &&
      (paymentMethod === "card"
        ? cardData.cardName && cardData.cardNumber && cardData.cardExpiry && cardData.cardCvc
        : false) && // PSE está oculto
      (!showAdditionalFields || (formData.phone && formData.document && formData.address))

  // Componente para mostrar el estado de validación de la contraseña
  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2">
      {met ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
      <span className={met ? "text-green-500" : "text-muted-foreground"}>{text}</span>
    </div>
  )

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
                  <CardDescription>
                    {isAuthenticated
                      ? "Completa la información de pago para actualizar tu plan"
                      : "Ingresa tus datos para procesar el pago y crear tu cuenta"}
                  </CardDescription>
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
                            disabled={isAuthenticated || !supabaseStatus?.connected}
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
                            disabled={isAuthenticated || !supabaseStatus?.connected}
                          />
                        </div>

                        {!isAuthenticated && (
                          <>
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
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                              <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="********"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                minLength={8}
                                disabled={!supabaseStatus?.connected}
                              />
                            </div>

                            <div className="bg-muted/30 p-4 rounded-lg space-y-2 text-sm">
                              <p className="font-medium">La contraseña debe contener:</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <PasswordRequirement met={passwordValidation.minLength} text="Mínimo 8 caracteres" />
                                <PasswordRequirement
                                  met={passwordValidation.hasUppercase}
                                  text="Letras mayúsculas (A-Z)"
                                />
                                <PasswordRequirement
                                  met={passwordValidation.hasLowercase}
                                  text="Letras minúsculas (a-z)"
                                />
                                <PasswordRequirement met={passwordValidation.hasNumber} text="Números (0-9)" />
                                <PasswordRequirement
                                  met={passwordValidation.hasSpecial}
                                  text="Caracteres especiales (!@#$%^&*)"
                                />
                                <PasswordRequirement
                                  met={passwordValidation.matches}
                                  text="Las contraseñas coinciden"
                                />
                              </div>
                            </div>
                          </>
                        )}

                        {/* Botón para mostrar/ocultar campos adicionales */}
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full mt-2"
                          onClick={() => setShowAdditionalFields(!showAdditionalFields)}
                        >
                          {showAdditionalFields ? "Ocultar información adicional" : "Añadir información de contacto"}
                        </Button>

                        {/* Campos adicionales */}
                        {showAdditionalFields && (
                          <div className="space-y-4 border p-4 rounded-md">
                            <h4 className="font-medium">Información de Contacto</h4>

                            <div className="space-y-2">
                              <Label htmlFor="phone">Teléfono</Label>
                              <Input
                                id="phone"
                                name="phone"
                                placeholder="300 123 4567"
                                value={formData.phone}
                                onChange={handleInputChange}
                                disabled={!supabaseStatus?.connected}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="document">Número de Documento</Label>
                              <Input
                                id="document"
                                name="document"
                                placeholder="1234567890"
                                value={formData.document}
                                onChange={handleInputChange}
                                disabled={!supabaseStatus?.connected}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="address">Dirección</Label>
                              <Input
                                id="address"
                                name="address"
                                placeholder="Calle 123 # 45-67"
                                value={formData.address}
                                onChange={handleInputChange}
                                disabled={!supabaseStatus?.connected}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <Separator />

                      {/* Métodos de pago */}
                      <div>
                        <h3 className="font-medium mb-4">Información de Pago</h3>
                        <PaymentMethods
                          onMethodChange={handlePaymentMethodChange}
                          onCardDataChange={handleCardDataChange}
                          onPSEDataChange={handlePSEDataChange}
                          disabled={!supabaseStatus?.connected}
                        />
                      </div>

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
                          <a href="/legal?section=terminos" className="text-primary hover:underline">
                            términos y condiciones
                          </a>
                        </Label>
                      </div>

                      {/* Mensaje de seguridad */}
                      <div className="flex items-center p-3 bg-green-50 rounded-md text-sm">
                        <ShieldCheck className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <p className="text-green-700">Tus datos están protegidos con encriptación de grado bancario.</p>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Resumen de compra con posición fija en desktop */}
            <div className="md:col-span-2">
              <div className="md:sticky md:top-24">
                <Card className="border-2">
                  <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
                    <CardTitle>Resumen de Compra</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Test DISC {plan.name}</span>
                        <span>
                          {plan.price} {plan.priceCurrency}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>
                          {plan.price} {plan.priceCurrency}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <p>Precio incluye IVA del 19%</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full" onClick={handleSubmit} disabled={loading || !isFormValid}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Procesando...
                        </>
                      ) : !supabaseStatus?.connected ? (
                        "No disponible"
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Completar Compra
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Pago seguro procesado por PayU Latam</span>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
