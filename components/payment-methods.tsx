"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CreditCard, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { validateCardNumber } from "@/lib/payu"

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

  // Notificar cambio de método de pago
  useEffect(() => {
    onMethodChange(paymentMethod)
  }, [paymentMethod, onMethodChange])

  // Función para validar el número de tarjeta usando el algoritmo de Luhn
  // const validateCardNumber = (cardNumber: string): boolean => {
  //   // Eliminar espacios y guiones
  //   const cleanNumber = cardNumber.replace(/[\s-]/g, "")

  //   // Verificar que solo contenga dígitos y tenga una longitud válida (13-19 dígitos)
  //   if (!/^\d{13,19}$/.test(cleanNumber)) {
  //     return false
  //   }

  //   // Algoritmo de Luhn (módulo 10)
  //   let sum = 0
  //   let shouldDouble = false

  //   // Recorrer el número de derecha a izquierda
  //   for (let i = cleanNumber.length - 1; i >= 0; i--) {
  //     let digit = Number.parseInt(cleanNumber.charAt(i))

  //     if (shouldDouble) {
  //       digit *= 2
  //       if (digit > 9) {
  //         digit -= 9
  //       }
  //     }

  //     sum += digit
  //     shouldDouble = !shouldDouble
  //   }

  //   return sum % 10 === 0
  // }

  // Manejar cambios en datos de tarjeta
  // const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target
  //   let formattedValue = value
  //   let error = ""

  //   // Formateo y validación específica para cada campo
  //   if (name === "cardNumber") {
  //     // Eliminar caracteres no numéricos
  //     const digitsOnly = value.replace(/\D/g, "")

  //     // Formatear con espacios cada 4 dígitos
  //     formattedValue = digitsOnly.replace(/(\d{4})(?=\d)/g, "$1 ").trim()

  //     // Limitar a 19 dígitos (16 dígitos + 3 espacios)
  //     formattedValue = formattedValue.substring(0, 19)

  //     // Validar el número de tarjeta si tiene al menos 13 dígitos
  //     if (digitsOnly.length >= 13) {
  //       if (!validateCardNumber(digitsOnly)) {
  //         error = "Número de tarjeta inválido"
  //       }
  //     }
  //   } else if (name === "cardName") {
  //     // Validar que el nombre tenga al menos 3 caracteres
  //     if (value.length > 0 && value.length < 3) {
  //       error = "Nombre demasiado corto"
  //     }
  //   } else if (name === "cardExpiry") {
  //     // Eliminar caracteres no numéricos excepto '/'
  //     const cleaned = value.replace(/[^\d/]/g, "")

  //     // Formatear como MM/YY
  //     if (cleaned.length <= 2) {
  //       formattedValue = cleaned
  //     } else {
  //       // Asegurar que solo haya un '/'
  //       const parts = cleaned.split("/")
  //       const month = parts[0].substring(0, 2)
  //       const year = parts.length > 1 ? parts[1].substring(0, 2) : cleaned.substring(2, 4)

  //       formattedValue = `${month}/${year}`
  //     }

  //     // Validar el mes y año
  //     if (formattedValue.length === 5) {
  //       const [month, year] = formattedValue.split("/")
  //       const currentDate = new Date()
  //       const currentYear = currentDate.getFullYear() % 100 // Últimos 2 dígitos del año actual
  //       const currentMonth = currentDate.getMonth() + 1 // Mes actual (1-12)

  //       const monthNum = Number.parseInt(month)
  //       const yearNum = Number.parseInt(year)

  //       if (monthNum < 1 || monthNum > 12) {
  //         error = "Mes inválido"
  //       } else if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
  //         error = "Tarjeta vencida"
  //       }
  //     }
  //   } else if (name === "cardCvc") {
  //     // Eliminar caracteres no numéricos
  //     formattedValue = value.replace(/\D/g, "")

  //     // Limitar a 4 dígitos
  //     formattedValue = formattedValue.substring(0, 4)

  //     // Validar longitud del CVC
  //     if (formattedValue.length > 0 && formattedValue.length < 3) {
  //       error = "CVC demasiado corto"
  //     }
  //   }

  //   // Actualizar datos de tarjeta
  //   const newCardData = { ...cardData, [name]: formattedValue }
  //   setCardData(newCardData)

  //   // Actualizar errores
  //   setCardErrors({ ...cardErrors, [name]: error })

  //   // Notificar cambios al componente padre
  //   if (onCardDataChange) {
  //     onCardDataChange(newCardData)
  //   }
  // }

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
    onCardDataChange({ ...cardData, [name]: formattedValue })
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
          {/* Opción de PSE oculta pero mantenida para uso futuro
         <div className="flex items-center space-x-2 border rounded-md p-3">
           <RadioGroupItem value="pse" id="pse" />
           <Label htmlFor="pse" className="flex items-center gap-2 cursor-pointer">
             <Building2 className="h-5 w-5" />
             PSE - Débito bancario
           </Label>
         </div>
         */}
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
                  Modo de prueba: Usa la tarjeta 4037997623271984 con fecha futura y CVC 321.
                </AlertDescription>
              </Alert>
            )}

            {/* <div className="space-y-2">
              <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
              <Input
                id="cardName"
                name="cardName"
                placeholder="Nombre completo como aparece en la tarjeta"
                value={cardData.cardName}
                onChange={handleCardChange}
                required
                disabled={disabled}
                className={`focus:border-primary ${cardErrors.cardName ? "border-red-500" : ""}`}
                autoComplete="cc-name"
              />
              {cardErrors.cardName && <p className="text-xs text-red-500 mt-1">{cardErrors.cardName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Número de Tarjeta</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardData.cardNumber}
                onChange={handleCardChange}
                required
                disabled={disabled}
                className={`font-mono focus:border-primary ${cardErrors.cardNumber ? "border-red-500" : ""}`}
                autoComplete="cc-number"
              />
              {cardErrors.cardNumber && <p className="text-xs text-red-500 mt-1">{cardErrors.cardNumber}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardExpiry">Fecha de Expiración</Label>
                <Input
                  id="cardExpiry"
                  name="cardExpiry"
                  placeholder="MM/AA"
                  value={cardData.cardExpiry}
                  onChange={handleCardChange}
                  required
                  disabled={disabled}
                  className={`font-mono focus:border-primary ${cardErrors.cardExpiry ? "border-red-500" : ""}`}
                  autoComplete="cc-exp"
                />
                {cardErrors.cardExpiry && <p className="text-xs text-red-500 mt-1">{cardErrors.cardExpiry}</p>}
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
                  disabled={disabled}
                  className={`font-mono focus:border-primary ${cardErrors.cardCvc ? "border-red-500" : ""}`}
                  autoComplete="cc-csc"
                  type="password"
                />
                {cardErrors.cardCvc && <p className="text-xs text-red-500 mt-1">{cardErrors.cardCvc}</p>}
              </div>
            </div> */}
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

      {/* Formulario de PSE - Comentado pero mantenido para uso futuro */}
    </div>
  )
}
