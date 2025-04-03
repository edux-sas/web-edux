"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface ContactFormProps {
  onSuccess?: () => void
  defaultSubject?: string
  buttonText?: string
}

export function ContactForm({ onSuccess, defaultSubject, buttonText = "Enviar mensaje" }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formError, setFormError] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: defaultSubject || "",
    message: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError(false)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Form submission successful
      setFormSubmitted(true)

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      setFormError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {formSubmitted ? (
        <Alert className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle>¡Mensaje enviado!</AlertTitle>
          <AlertDescription>Hemos recibido tu mensaje. Nos pondremos en contacto contigo pronto.</AlertDescription>
        </Alert>
      ) : formError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Hubo un problema al enviar tu mensaje. Por favor, intenta nuevamente.</AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              name="name"
              placeholder="Tu nombre"
              required
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono (opcional)</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+57 300 123 4567"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Asunto</Label>
            <Select name="subject" required value={formData.subject} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un asunto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info-cursos">Información sobre cursos</SelectItem>
                <SelectItem value="info-disc">Información sobre test DISC</SelectItem>
                <SelectItem value="soporte">Soporte técnico</SelectItem>
                <SelectItem value="ventas">Ventas corporativas</SelectItem>
                <SelectItem value="ceo">Hablar con el CEO</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensaje</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="¿En qué podemos ayudarte?"
              className="min-h-[120px]"
              required
              value={formData.message}
              onChange={handleInputChange}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              buttonText
            )}
          </Button>
        </form>
      )}
    </div>
  )
}

