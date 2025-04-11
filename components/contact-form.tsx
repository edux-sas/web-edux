"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2, Info } from "lucide-react"

interface ContactFormProps {
  onSuccess?: () => void
  defaultSubject?: string
  buttonText?: string
}

export function ContactForm({ onSuccess, defaultSubject, buttonText = "Enviar mensaje" }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formWarning, setFormWarning] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: defaultSubject || "",
    message: "",
  })

  // Campo honeypot para detectar bots (invisible para usuarios reales)
  const honeypotRef = useRef<HTMLInputElement>(null)

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
    setFormError(null)
    setFormWarning(null)

    try {
      // Verificar si el campo honeypot está lleno (indicaría un bot)
      const honeypotValue = honeypotRef.current?.value

      // Establecer un tiempo límite para la solicitud
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20000) // 20 segundos de tiempo límite

      // Enviar datos al endpoint
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          honeypot: honeypotValue,
        }),
        signal: controller.signal,
      }).catch((error) => {
        if (error.name === "AbortError") {
          throw new Error("La solicitud ha tardado demasiado tiempo. Por favor, inténtalo de nuevo más tarde.")
        }
        throw error
      })

      clearTimeout(timeoutId)

      // Manejar errores HTTP
      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`

        try {
          const errorData = await response.json()
          if (errorData && errorData.error) {
            errorMessage = errorData.error
          }
        } catch (jsonError) {
          console.error("Error al parsear respuesta JSON:", jsonError)
          // Si no podemos parsear JSON, usamos el mensaje de error HTTP
        }

        throw new Error(errorMessage)
      }

      const data = await response.json()

      // Verificar si hay advertencias
      if (data.warning) {
        setFormWarning(data.warning)
      }

      // Formulario enviado con éxito
      setFormSubmitted(true)

      // Llamar al callback de éxito si se proporciona
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 2000)
      }

      // Resetear formulario
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      console.error("Error al enviar formulario:", error)
      setFormError(error instanceof Error ? error.message : "Error desconocido")
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
          <AlertDescription>
            Hemos recibido tu mensaje.{" "}
            {formWarning
              ? formWarning
              : "Te hemos enviado una confirmación por correo electrónico y nos pondremos en contacto contigo pronto."}
          </AlertDescription>
        </Alert>
      ) : formError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {formWarning && (
            <Alert
              variant="default"
              className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900"
            >
              <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription>{formWarning}</AlertDescription>
            </Alert>
          )}

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
                <SelectItem value="demo-sie">Solicitud de Demo SIE</SelectItem>
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

          {/* Campo honeypot - invisible para usuarios reales, pero los bots lo llenarán */}
          <input
            ref={honeypotRef}
            type="text"
            name="website"
            tabIndex={-1}
            aria-hidden="true"
            style={{
              position: "absolute",
              width: "1px",
              height: "1px",
              padding: "0",
              margin: "-1px",
              overflow: "hidden",
              clip: "rect(0, 0, 0, 0)",
              whiteSpace: "nowrap",
              border: "0",
            }}
          />

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
