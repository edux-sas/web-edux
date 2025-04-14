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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Loader2, Check, X, ShieldCheck } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { checkSupabaseConnection } from "@/lib/supabase"
import { PayUPaymentForm } from "@/components/payu-payment-form"
import { PayUCardForm } from "@/components/payu-card-form"

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState("redirect")
  const [loading, setLoading] = useState(false)
  const [supabaseStatus, setSupabaseStatus] = useState<{
    connected: boolean
    error?: string
  } | null>(null)
  const [isCheckingConnection, setIsCheckingConnection] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    terms: false,
    phone: "",
    document: "",
    address: "",
    city: "Bogotá",
    state: "Bogotá D.C.",
    country: "CO",
    postalCode: "000000",
  })
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
    matches: false,
  })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
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
  }, [formData.password, formData])

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

  // Verificar si la contraseña cumple con todos los requisitos
  const isPasswordValid = Object.values(passwordValidation).every(Boolean)

  // Función para registrar al usuario
  const registerUser = async () => {
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
      return null
    }

    // Verificar que la contraseña cumpla con los requisitos
    if (!isAuthenticated && !isPasswordValid) {
      toast({
        title: "Contraseña inválida",
        description: "Por favor, asegúrate de que la contraseña cumpla con todos los requisitos.",
        variant: "destructive",
      })
      setLoading(false)
      return null
    }

    try {
      // Generar un código de referencia único para el seguimiento de la transacción
      const referenceCode = `EDUX${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`.replace(
        /[^a-zA-Z0-9]/g,
        "",
      )

      // Fecha actual para el registro de la compra
      const purchaseDate = new Date().toISOString()

      // Si el usuario ya está autenticado, solo devolver la información necesaria
      if (isAuthenticated && userId) {
        return {
          userId,
          referenceCode,
          purchaseDate,
        }
      }

      // Si no está autenticado, registrar al usuario
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
            payment_status: "PENDING",
            purchase_date: purchaseDate,
            reference_code: referenceCode,
          },
        }),
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
        throw new Error(registerResult.error || "No se pudo completar el registro")
      }

      // Guardar usuario en localStorage para la sesión actual
      localStorage.setItem(
        "eduXUser",
        JSON.stringify({
          id: registerResult.user.id,
          name: formData.name,
          email: formData.email,
          isLoggedIn: true,
          plan: planId,
        }),
      )

      return {
        userId: registerResult.user.id,
        referenceCode,
        purchaseDate,
      }
    } catch (error) {
      console.error("Error en el registro:", error)
      setFormError(error instanceof Error ? error.message : "Error desconocido")
      setLoading(false)
      return null
    }
  }

  // Función para manejar el pago exitoso
  const handlePaymentSuccess = (transactionId: string) => {
    toast({
      title: "Pago exitoso",
      description: "Tu pago ha sido procesado correctamente",
    })

    // Redirigir a la página de éxito
    router.push("/test-disc/success")
  }

  // Función para manejar el error de pago
  const handlePaymentError = (error: string) => {
    toast({
      title: "Error en el pago",
      description: error,
      variant: "destructive",
    })
    setLoading(false)
  }

  // Función para iniciar el proceso de pago
  const handleStartPayment = async () => {
    setLoading(true)

    // Registrar o actualizar usuario
    const userInfo = await registerUser()

    if (!userInfo) {
      // El error ya fue manejado en registerUser
      return
    }

    // Ahora tenemos la información del usuario y podemos proceder con el pago
    setLoading(false)
  }

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
                  <CardTitle>Información de Registro</CardTitle>
                  <CardDescription>
                    {isAuthenticated
                      ? "Completa la información adicional para procesar el pago"
                      : "Ingresa tus datos para crear tu cuenta"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                              <PasswordRequirement met={passwordValidation.matches} text="Las contraseñas coinciden" />
                            </div>
                          </div>
                        </>
                      )}

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

                    <Separator />

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
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleStartPayment} disabled={loading || !formData.terms}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      "Continuar al Pago"
                    )}
                  </Button>
                </CardFooter>
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
                  <CardFooter>
                    <Tabs defaultValue="redirect" className="w-full" onValueChange={setPaymentMethod}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="redirect">PayU Checkout</TabsTrigger>
                        <TabsTrigger value="card">Tarjeta de Crédito</TabsTrigger>
                      </TabsList>
                      <TabsContent value="redirect" className="mt-4">
                        <PayUPaymentForm
                          referenceCode={`EDUX${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`}
                          description={`Test DISC ${plan.name}`}
                          amount={plan.priceValue}
                          currency="COP"
                          buyerInfo={{
                            name: formData.name,
                            email: formData.email,
                            phone: formData.phone || "3001234567",
                            document: formData.document || "1234567890",
                            address: formData.address || "Dirección de ejemplo",
                            city: formData.city,
                            state: formData.state,
                            country: formData.country,
                            postalCode: formData.postalCode,
                          }}
                          onSuccess={(url) => {
                            // Primero registrar al usuario
                            registerUser().then((userInfo) => {
                              if (userInfo) {
                                // Luego redirigir a la URL de pago
                                window.location.href = url
                              }
                            })
                          }}
                          onError={handlePaymentError}
                        />
                      </TabsContent>
                      <TabsContent value="card" className="mt-4">
                        <PayUCardForm
                          referenceCode={`EDUX${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`}
                          description={`Test DISC ${plan.name}`}
                          amount={plan.priceValue}
                          currency="COP"
                          buyerInfo={{
                            name: formData.name,
                            email: formData.email,
                            phone: formData.phone || "3001234567",
                            document: formData.document || "1234567890",
                            address: formData.address || "Dirección de ejemplo",
                            city: formData.city,
                            state: formData.state,
                            country: formData.country,
                            postalCode: formData.postalCode,
                          }}
                          onSuccess={(transactionId) => {
                            // Primero registrar al usuario
                            registerUser().then((userInfo) => {
                              if (userInfo) {
                                // Luego manejar el éxito del pago
                                handlePaymentSuccess(transactionId)
                              }
                            })
                          }}
                          onError={handlePaymentError}
                        />
                      </TabsContent>
                    </Tabs>
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
