"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CreditCard, AlertCircle, Building2, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { validateCardNumber } from "@/lib/payu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaymentMethodsProps {
  onMethodChange: (method: string) => void
  onCardDataChange?: (data: any) => void
  onPSEDataChange?: (data: any) => void
  disabled?: boolean
}

export function PaymentMethods({
  onMethodChange,
  onCardDataChange,
  onPSEDataChange,
  disabled = false,
}: PaymentMethodsProps) {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [banks, setBanks] = useState<Array<{ description: string; pseCode: string }>>([])
  const [loading, setLoading] = useState(false)
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvc: "",
  })
  const [cardErrors, setCardErrors] = useState({
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvc: "",
  })
  const [pseData, setPseData] = useState({
    bankCode: "",
    userType: "N", // N: Persona Natural, J: Persona Jurídica
    docType: "CC", // CC: Cédula de ciudadanía por defecto
    docNumber: "",
  })
  const [isTestMode, setIsTestMode] = useState(false)

  // Verificar si estamos en modo de prueba
  useEffect(() => {
    setIsTestMode(process.env.NEXT_PUBLIC_PAYU_TEST_MODE === "true")
  }, [])

  // Cargar la lista de bancos al iniciar
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/payment/get-pse-banks")
        if (!response.ok) {
          throw new Error("Error al obtener la lista de bancos")
        }
        const data = await response.json()
        if (data.success && Array.isArray(data.banks)) {
          setBanks(data.banks)
        } else {
          console.error("Formato de respuesta inesperado:", data)
        }
      } catch (error) {
        console.error("Error al cargar bancos PSE:", error)
      } finally {
        setLoading(false)
      }
    }

    if (paymentMethod === "pse") {
      fetchBanks()
    }
  }, [paymentMethod])

  // Notificar cambio de método de pago
  useEffect(() => {
    onMethodChange(paymentMethod)
  }, [paymentMethod, onMethodChange])

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value
    let error = ""

    // Formatear y validar según el tipo de campo
    if (name === "cardNumber") {
      // Eliminar espacios y caracteres no numéricos
      const cleaned = value.replace(/\D/g, "")

      // Formatear con espacios cada 4 dígitos
      formattedValue = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ").trim()

      // Validar con algoritmo de Luhn si tiene al menos 13 dígitos
      if (cleaned.length >= 13) {
        if (!validateCardNumber(cleaned)) {
          error = "Número de tarjeta inválido"
        }
      } else if (cleaned.length > 0) {
        error = "Número incompleto"
      }
    } else if (name === "cardExpiry") {
      // Formatear MM/YY
      const cleaned = value.replace(/\D/g, "")
      if (cleaned.length <= 2) {
        formattedValue = cleaned
      } else {
        formattedValue = `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`
      }

      // Validar fecha
      if (cleaned.length >= 4) {
        const month = Number.parseInt(cleaned.substring(0, 2))
        const year = Number.parseInt(cleaned.substring(2, 4))
        const currentYear = new Date().getFullYear() % 100
        const currentMonth = new Date().getMonth() + 1

        if (month < 1 || month > 12) {
          error = "Mes inválido"
        } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
          error = "Tarjeta expirada"
        }
      }
    } else if (name === "cardCvc") {
      // Solo permitir números y limitar a 4 dígitos
      formattedValue = value.replace(/\D/g, "").substring(0, 4)

      // Validar longitud
      if (formattedValue.length > 0 && formattedValue.length < 3) {
        error = "CVC incompleto"
      }
    }

    // Actualizar datos y errores
    setCardData((prev) => ({ ...prev, [name]: formattedValue }))
    setCardErrors((prev) => ({ ...prev, [name]: error }))
    onCardDataChange?.({ ...cardData, [name]: formattedValue })
  }

  // Manejar cambios en datos de PSE
  const handlePSEChange = (field: string, value: string) => {
    const newPSEData = { ...pseData, [field]: value }
    setPseData(newPSEData)

    if (onPSEDataChange) {
      onPSEDataChange(newPSEData)
    }
  }

  // Determinar si hay algún error en los datos de la tarjeta
  const hasCardErrors = Object.values(cardErrors).some((error) => error !== "")

  return (
    <div className="space-y-6">
      <div>
        <Label>Método de Pago</Label>
        <RadioGroup
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          className="flex flex-col space-y-2 mt-2"
          disabled={disabled}
        >
          <div className="flex items-center space-x-2 border rounded-md p-3">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
              <CreditCard className="h-5 w-5" />
              Tarjeta de Crédito/Débito
            </Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-3">
            <RadioGroupItem value="pse" id="pse" />
            <Label htmlFor="pse" className="flex items-center gap-2 cursor-pointer">
              <Building2 className="h-5 w-5" />
              PSE - Débito bancario
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Formulario de tarjeta de crédito */}
      {paymentMethod === "card" && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            {isTestMode && (
              <Alert className="mb-4 bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-600">
                  Modo de prueba: Usa la tarjeta 4111111111111111 con fecha futura y CVC 123.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Número de Tarjeta</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                placeholder="**** **** **** ****"
                value={cardData.cardNumber}
                onChange={handleCardInputChange}
                disabled={disabled}
                className={cardErrors.cardNumber ? "border-red-500" : ""}
              />
              {cardErrors.cardNumber && <p className="text-xs text-red-500 mt-1">{cardErrors.cardNumber}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
              <Input
                id="cardName"
                name="cardName"
                placeholder="Como aparece en la tarjeta"
                value={cardData.cardName}
                onChange={handleCardInputChange}
                disabled={disabled}
                className={cardErrors.cardName ? "border-red-500" : ""}
              />
              {cardErrors.cardName && <p className="text-xs text-red-500 mt-1">{cardErrors.cardName}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardExpiry">Fecha de Expiración</Label>
                <Input
                  id="cardExpiry"
                  name="cardExpiry"
                  placeholder="MM/AA"
                  value={cardData.cardExpiry}
                  onChange={handleCardInputChange}
                  disabled={disabled}
                  className={cardErrors.cardExpiry ? "border-red-500" : ""}
                />
                {cardErrors.cardExpiry && <p className="text-xs text-red-500 mt-1">{cardErrors.cardExpiry}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardCvc">CVC</Label>
                <Input
                  id="cardCvc"
                  name="cardCvc"
                  type="password"
                  placeholder="***"
                  value={cardData.cardCvc}
                  onChange={handleCardInputChange}
                  disabled={disabled}
                  className={cardErrors.cardCvc ? "border-red-500" : ""}
                />
                {cardErrors.cardCvc && <p className="text-xs text-red-500 mt-1">{cardErrors.cardCvc}</p>}
              </div>
            </div>

            <div className="text-xs text-muted-foreground mt-2">
              <p>Tus datos de pago están seguros y encriptados.</p>
              <p className="mt-1">Aceptamos Visa, Mastercard, American Express y Diners Club.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulario de PSE */}
      {paymentMethod === "pse" && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            {isTestMode && (
              <Alert className="mb-4 bg-amber-50 border-amber-200">
                <Info className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-600">
                  Modo de prueba: Puedes usar cualquier banco para simular un pago PSE.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="bankCode">Selecciona tu banco</Label>
              <Select
                value={pseData.bankCode}
                onValueChange={(value) => handlePSEChange("bankCode", value)}
                disabled={disabled || loading || banks.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona tu banco" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank.pseCode} value={bank.pseCode}>
                      {bank.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {loading && <p className="text-xs text-muted-foreground">Cargando bancos...</p>}
              {!loading && banks.length === 0 && (
                <p className="text-xs text-red-500">No se pudieron cargar los bancos. Intenta más tarde.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="userType">Tipo de persona</Label>
              <Select
                value={pseData.userType}
                onValueChange={(value) => handlePSEChange("userType", value)}
                disabled={disabled}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona tipo de persona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="N">Persona Natural</SelectItem>
                  <SelectItem value="J">Persona Jurídica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="docType">Tipo de documento</Label>
              <Select
                value={pseData.docType}
                onValueChange={(value) => handlePSEChange("docType", value)}
                disabled={disabled}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                  <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                  <SelectItem value="NIT">NIT</SelectItem>
                  <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                  <SelectItem value="PP">Pasaporte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="docNumber">Número de documento</Label>
              <Input
                id="docNumber"
                value={pseData.docNumber}
                onChange={(e) => handlePSEChange("docNumber", e.target.value)}
                placeholder="Ingresa tu número de documento"
                disabled={disabled}
              />
            </div>

            <div className="text-xs text-muted-foreground mt-2">
              <p>Al continuar, serás redirigido al sitio web de tu banco para completar el pago de forma segura.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
