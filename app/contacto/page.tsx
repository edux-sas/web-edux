import { PageContactForm } from "@/components/page-contact-form"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ContactPage() {
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
              <PageContactForm />
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
                      <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Teléfono</h4>
                        <p className="text-muted-foreground">+57 3171165904</p>                        
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Correo electrónico</h4>
                        <p className="text-muted-foreground">formacionedux@gmail.com</p>                        
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
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.7226353396795!2d-76.53500518573602!3d3.4516465974934436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a6e8e04b7e29%3A0x7e725cc469d15df4!2sCali%2C%20Valle%20del%20Cauca!5e0!3m2!1ses!2sco!4v1712590000000!5m2!1ses!2sco" 
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

