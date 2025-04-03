"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, CreditCard, Loader2 } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Tipo para los datos del usuario
interface UserData {
  name: string
  email: string
  password: string
  plan: string
  payment_status: string
  purchase_date: string
  amount: string
}

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [loading, setLoading] = useState(false)
  const [supabaseClient, setSupabaseClient] = useState<any>(null)
  const [supabaseError, setSupabaseError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    terms: false,
  })

  // Inicializar el cliente de Supabase después de que el componente se monte
  useEffect(() => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        setSupabaseError("No se pueden encontrar las credenciales de Supabase. Por favor, contacta al administrador.")
        return
      }

      const client = createClient(supabaseUrl, supabaseAnonKey)
      setSupabaseClient(client)

      // Verificar la conexión a Supabase
      client.auth
        .getSession()
        .then(({ data, error }) => {
          if (error) {
            setSupabaseError("No se puede conectar con el servidor de autenticación. Por favor, intenta más tarde.")
          }
        })
        .catch(() => {
          setSupabaseError("Error al conectar con Supabase. Por favor, intenta más tarde.")
        })
    } catch (error) {
      console.error("Error al inicializar Supabase:", error)
      setSupabaseError("Error al inicializar la conexión con la base de datos. Por favor, intenta más tarde.")
    }
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

  // Función para guardar el usuario en Supabase
  const saveUserToSupabase = async (userData: UserData) => {
    if (!supabaseClient) {
      return { success: false, error: "Cliente de Supabase no disponible" }
    }

    try {
      // 1. Crear el usuario en auth
      const { data: authData, error: authError } = await supabaseClient.auth.signUp({
        email: userData.email,
        password: userData.password,
      })

      if (authError) throw authError

      // 2. Guardar los datos del usuario y la compra en la tabla 'users'
      const { error: insertError } = await supabaseClient.from("users").insert([
        {
          id: authData.user?.id,
          name: userData.name,
          email: userData.email,
          plan: userData.plan,
          payment_status: userData.payment_status,
          purchase_date: userData.purchase_date,
          amount: userData.amount,
        },
      ])

      if (insertError) throw insertError

      return { success: true }
    } catch (error) {
      console.error("Error al guardar en Supabase:", error)
      return { success: false, error }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Verificar si Supabase está disponible
    if (!supabaseClient) {
      toast({
        title: "Error de conexión",
        description: "No se puede conectar con el servidor. Por favor, intenta más tarde.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      // Simular procesamiento de pago
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Fecha actual para el registro de la compra
      const purchaseDate = new Date().toISOString()

      // Datos del usuario para guardar en Supabase
      const userData: UserData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        plan: planId,
        payment_status: "approved",
        purchase_date: purchaseDate,
        amount: plan.price.replace("$", ""),
      }

      // Guardar en Supabase
      const { success, error } = await saveUserToSupabase(userData)

      if (!success) {
        toast({
          title: "Error al registrar usuario",
          description: "No se pudo completar el registro. Por favor, intenta nuevamente.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Guardar usuario en localStorage para la sesión actual
      localStorage.setItem(
        "eduXUser",
        JSON.stringify({
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
        description: "Hubo un problema con tu pago. Por favor, verifica tus datos e intenta nuevamente.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const isFormValid =
    formData.email &&
    formData.name &&
    formData.password &&
    formData.cardName &&
    formData.cardNumber &&
    formData.expiry &&
    formData.cvc &&
    formData.terms &&
    supabaseClient !== null && // Asegurarse de que Supabase esté disponible
    supabaseError === null // Y no haya errores de conexión

  return (
    <div className="container py-12 max-w-5xl">
      <h1 className="text-2xl font-bold mb-8 text-center">Checkout - Test DISC {plan.name}</h1>

      {supabaseError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error de conexión</AlertTitle>
          <AlertDescription>{supabaseError}</AlertDescription>
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
                        disabled={!!supabaseError}
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
                        disabled={!!supabaseError}
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
                        disabled={!!supabaseError}
                      />
                      <p className="text-xs text-muted-foreground">Debe tener al menos 8 caracteres</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Método de pago */}
                  <div>
                    <Label>Método de Pago</Label>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="flex flex-col space-y-2 mt-2"
                      disabled={!!supabaseError}
                    >
                      <div className="flex items-center space-x-2 border rounded-md p-3">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                          <CreditCard className="h-5 w-5" />
                          Tarjeta de Crédito/Débito
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Datos de tarjeta */}
                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          placeholder="Nombre completo"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          required
                          disabled={!!supabaseError}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          required
                          disabled={!!supabaseError}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Fecha de Expiración</Label>
                          <Input
                            id="expiry"
                            name="expiry"
                            placeholder="MM/AA"
                            value={formData.expiry}
                            onChange={handleInputChange}
                            required
                            disabled={!!supabaseError}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            name="cvc"
                            placeholder="123"
                            value={formData.cvc}
                            onChange={handleInputChange}
                            required
                            disabled={!!supabaseError}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Términos y condiciones */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.terms}
                      onCheckedChange={handleCheckboxChange}
                      required
                      disabled={!!supabaseError}
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
              <Button className="w-full" onClick={handleSubmit} disabled={loading || !isFormValid || !!supabaseError}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : supabaseError ? (
                  "No disponible"
                ) : (
                  "Completar Compra"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

