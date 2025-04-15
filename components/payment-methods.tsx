"use client"

import { Button } from "@/components/ui/button"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PaymentMethods({ onMethodChange, onCardDataChange, onPSEDataChange, disabled }: any) {
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
  const [paymentMethod, setPaymentMethod] = useState("card")

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCardData((prev) => ({ ...prev, [name]: value }))
    onCardDataChange({ ...cardData, [name]: value })
  }

  const handlePSEInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPseData((prev) => ({ ...prev, [name]: value }))
    onPSEDataChange({ ...pseData, [name]: value })
  }

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method)
    onMethodChange(method)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button
          variant={paymentMethod === "card" ? "default" : "outline"}
          onClick={() => handlePaymentMethodChange("card")}
          disabled={disabled}
        >
          Tarjeta de Crédito
        </Button>
        {/* PSE está oculto pero mantenemos el código para uso futuro
        <Button
          variant={paymentMethod === "pse" ? "default" : "outline"}
          onClick={() => handlePaymentMethodChange("pse")}
          disabled={disabled}
        >
          PSE
        </Button>
        */}
      </div>

      {paymentMethod === "card" && (
        <Card>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Número de Tarjeta</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                placeholder="**** **** **** ****"
                value={cardData.cardNumber}
                onChange={handleCardInputChange}
                disabled={disabled}
              />
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
                  onChange={handleCardInputChange}
                  disabled={disabled}
                />
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
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {paymentMethod === "pse" && (
        <Card>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bankCode">Banco</Label>
              <Select
                onValueChange={(value) => {
                  setPseData((prev) => ({ ...prev, bankCode: value }))
                  onPSEDataChange({ ...pseData, bankCode: value })
                }}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu banco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1007">BANCOLOMBIA</SelectItem>
                  <SelectItem value="1019">NEQUI</SelectItem>
                  {/* Add more banks here */}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="docType">Tipo de Documento</Label>
              <Select
                onValueChange={(value) => {
                  setPseData((prev) => ({ ...prev, docType: value }))
                  onPSEDataChange({ ...pseData, docType: value })
                }}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                  <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                  <SelectItem value="NIT">NIT</SelectItem>
                  <SelectItem value="PP">Pasaporte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="docNumber">Número de Documento</Label>
              <Input
                id="docNumber"
                name="docNumber"
                placeholder="Número de documento"
                value={pseData.docNumber}
                onChange={handlePSEInputChange}
                disabled={disabled}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
