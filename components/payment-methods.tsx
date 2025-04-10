"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CreditCard } from "lucide-react"

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
  const [pseData, setPseData] = useState({
    bankCode: "",
    userType: "N", // N: Persona Natural, J: Persona Jurídica
    docType: "CC", // CC: Cédula de ciudadanía por defecto
    docNumber: "",
  })

  // Cargar bancos disponibles para PSE - Comentado pero mantenido para uso futuro
  /*
  useEffect(() => {
    const loadBanks = async () => {
      setLoading(true)
      try {
        const response = await getAvailableBanks()
        setBanks(response.banks)
      } catch (error) {
        console.error("Error al cargar bancos:", error)
      } finally {
        setLoading(false)
      }
    }

    if (paymentMethod === "pse") {
      loadBanks()
    }
  }, [paymentMethod])
  */

  // Notificar cambio de método de pago
  useEffect(() => {
    onMethodChange(paymentMethod)
  }, [paymentMethod, onMethodChange])

  // Manejar cambios en datos de tarjeta
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const newCardData = { ...cardData, [name]: formattedValue }
    setCardData(newCardData)

    if (onCardDataChange) {
      onCardDataChange(newCardData)
    }
  }

  // Manejar cambios en datos de PSE - Comentado pero mantenido para uso futuro
  /*
  const handlePSEChange = (field: string, value: string) => {
    const newPSEData = { ...pseData, [field]: value }
    setPseData(newPSEData)

    if (onPSEDataChange) {
      onPSEDataChange(newPSEData)
    }
  }
  */

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
            <div className="space-y-2">
              <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
              <Input
                id="cardName"
                name="cardName"
                placeholder="Nombre completo como aparece en la tarjeta"
                value={cardData.cardName}
                onChange={handleCardChange}
                required
                disabled={disabled}
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
                onChange={handleCardChange}
                required
                disabled={disabled}
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
                  onChange={handleCardChange}
                  required
                  disabled={disabled}
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
                  onChange={handleCardChange}
                  required
                  disabled={disabled}
                  className="font-mono focus:border-primary"
                  autoComplete="cc-csc"
                  type="password"
                />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              <p>Tus datos de pago están seguros y encriptados.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulario de PSE - Comentado pero mantenido para uso futuro 
      {paymentMethod === "pse" && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2">Cargando bancos...</span>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="bankSelect">Selecciona tu banco</Label>
                  <Select
                    value={pseData.bankCode}
                    onValueChange={(value) => handlePSEChange("bankCode", value)}
                    disabled={disabled}
                  >
                    <SelectTrigger id="bankSelect">
                      <SelectValue placeholder="Selecciona un banco" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map((bank) => (
                        <SelectItem key={bank.pseCode} value={bank.pseCode}>
                          {bank.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userType">Tipo de persona</Label>
                  <Select
                    value={pseData.userType}
                    onValueChange={(value) => handlePSEChange("userType", value)}
                    disabled={disabled}
                  >
                    <SelectTrigger id="userType">
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
                    <SelectTrigger id="docType">
                      <SelectValue placeholder="Selecciona tipo de documento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CC">Cédula de ciudadanía</SelectItem>
                      <SelectItem value="CE">Cédula de extranjería</SelectItem>
                      <SelectItem value="NIT">NIT</SelectItem>
                      <SelectItem value="TI">Tarjeta de identidad</SelectItem>
                      <SelectItem value="PP">Pasaporte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="docNumber">Número de documento</Label>
                  <Input
                    id="docNumber"
                    name="docNumber"
                    placeholder="Ingresa tu número de documento"
                    value={pseData.docNumber}
                    onChange={(e) => handlePSEChange("docNumber", e.target.value)}
                    required
                    disabled={disabled}
                  />
                </div>

                <div className="flex items-center p-3 bg-blue-50 rounded-md text-sm">
                  <AlertCircle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                  <p className="text-blue-700">
                    Al continuar, serás redirigido al sitio web de tu banco para completar el pago.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
      */}
    </div>
  )
}
