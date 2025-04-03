"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MapPin, Phone, Mail, Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function ContactPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formError, setFormError] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError(false)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Form submission successful
      setFormSubmitted(true)

      // Reset form
      const form = e.target as HTMLFormElement
      form.reset()
    } catch (error) {
      setFormError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Contacta con Nosotros</h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Estamos aquí para responder tus preguntas y ayudarte en tu viaje de aprendizaje y desarrollo
                profesional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Envíanos un mensaje</CardTitle>
                  <CardDescription>Completa el formulario y te responderemos a la brevedad.</CardDescription>
                </CardHeader>
                <CardContent>
                  {formSubmitted ? (
                    <Alert className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <AlertTitle>¡Mensaje enviado!</AlertTitle>
                      <AlertDescription>
                        Hemos recibido tu mensaje. Nos pondremos en contacto contigo pronto.
                      </AlertDescription>
                    </Alert>
                  ) : formError ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        Hubo un problema al enviar tu mensaje. Por favor, intenta nuevamente.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre completo</Label>
                          <Input id="name" name="name" placeholder="Tu nombre" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Correo electrónico</Label>
                          <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono (opcional)</Label>
                        <Input id="phone" name="phone" type="tel" placeholder="+57 300 123 4567" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Asunto</Label>
                        <Select name="subject" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un asunto" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="info-cursos">Información sobre cursos</SelectItem>
                            <SelectItem value="info-disc">Información sobre test DISC</SelectItem>
                            <SelectItem value="soporte">Soporte técnico</SelectItem>
                            <SelectItem value="ventas">Ventas corporativas</SelectItem>
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
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Información</TabsTrigger>
                  <TabsTrigger value="faq">Preguntas frecuentes</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Información de contacto</h3>
                    <p className="text-muted-foreground">Puedes contactarnos a través de los siguientes medios:</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Dirección</h4>
                        <p className="text-muted-foreground">Calle Principal 123, Bogotá, Colombia</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Teléfono</h4>
                        <p className="text-muted-foreground">+57 300 123 4567</p>
                        <p className="text-muted-foreground">+57 (1) 234 5678</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Correo electrónico</h4>
                        <p className="text-muted-foreground">info@edux.com.co</p>
                        <p className="text-muted-foreground">soporte@edux.com.co</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Horario de atención</h4>
                        <p className="text-muted-foreground">Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                        <p className="text-muted-foreground">Sábados: 9:00 AM - 1:00 PM</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="aspect-video overflow-hidden rounded-lg border">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d254508.39280650613!2d-74.24789182453524!3d4.648625932726193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9bfd2da6cb29%3A0x239d635520a33914!2zQm9nb3TDoQ!5e0!3m2!1ses!2sco!4v1650000000000!5m2!1ses!2sco"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Mapa de ubicación de eduX Academy"
                        className="w-full h-full"
                      ></iframe>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="faq" className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Preguntas frecuentes</h3>
                    <p className="text-muted-foreground">
                      Respuestas a las preguntas más comunes sobre nuestros servicios.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">¿Cómo puedo inscribirme en un curso?</h4>
                      <p className="text-muted-foreground">
                        Para inscribirte en un curso, simplemente crea una cuenta en nuestra plataforma, navega al curso
                        que te interesa y haz clic en "Inscribirme". Podrás realizar el pago a través de nuestras
                        opciones disponibles.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">¿Cuánto tiempo tengo acceso a un curso después de comprarlo?</h4>
                      <p className="text-muted-foreground">
                        Una vez adquieras un curso, tendrás acceso de por vida a su contenido, incluyendo
                        actualizaciones futuras.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">¿Cómo funciona el test DISC?</h4>
                      <p className="text-muted-foreground">
                        El test DISC es una evaluación de comportamiento que analiza cuatro dimensiones principales:
                        Dominancia, Influencia, Estabilidad y Concienzudo. Al completar el cuestionario, recibirás un
                        informe detallado sobre tu perfil.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">¿Ofrecen descuentos para empresas?</h4>
                      <p className="text-muted-foreground">
                        Sí, contamos con planes corporativos especiales para empresas. Contáctanos a través del
                        formulario o escríbenos a ventas@edux.com.co para recibir información personalizada.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">¿Emiten certificados por los cursos completados?</h4>
                      <p className="text-muted-foreground">
                        Sí, al finalizar cada curso y aprobar las evaluaciones correspondientes, recibirás un
                        certificado digital que podrás descargar e imprimir.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>      
    </div>
  )
}

