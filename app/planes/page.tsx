import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, HelpCircle, X } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function PlanesPage() {
  // Planes individuales
  const planesIndividuales = [
    {
      id: "basico",
      nombre: "Básico",
      precio: "$19.99",
      periodo: "mes",
      descripcion: "Ideal para comenzar tu viaje de aprendizaje",
      caracteristicas: [
        { incluido: true, texto: "Acceso a 10 cursos básicos" },
        { incluido: true, texto: "Test DISC básico (1 evaluación)" },
        { incluido: true, texto: "Certificados digitales" },
        { incluido: true, texto: "Soporte por email" },
        { incluido: false, texto: "Cursos avanzados y especializados" },
        { incluido: false, texto: "Sesiones de mentoría" },
        { incluido: false, texto: "Acceso a eventos exclusivos" },
      ],
      popular: false,
      cta: "Comenzar ahora",
    },
    {
      id: "profesional",
      nombre: "Profesional",
      precio: "$39.99",
      periodo: "mes",
      descripcion: "La opción más popular para desarrollo profesional",
      caracteristicas: [
        { incluido: true, texto: "Acceso a todos los cursos (50+)" },
        { incluido: true, texto: "Test DISC profesional (3 evaluaciones)" },
        { incluido: true, texto: "Certificados digitales" },
        { incluido: true, texto: "Soporte prioritario" },
        { incluido: true, texto: "Cursos avanzados y especializados" },
        { incluido: true, texto: "1 sesión de mentoría mensual" },
        { incluido: false, texto: "Acceso a eventos exclusivos" },
      ],
      popular: true,
      cta: "Elegir Profesional",
    },
    {
      id: "premium",
      nombre: "Premium",
      precio: "$59.99",
      periodo: "mes",
      descripcion: "Experiencia completa para maximizar tu potencial",
      caracteristicas: [
        { incluido: true, texto: "Acceso a todos los cursos (50+)" },
        { incluido: true, texto: "Test DISC ilimitado" },
        { incluido: true, texto: "Certificados digitales premium" },
        { incluido: true, texto: "Soporte VIP 24/7" },
        { incluido: true, texto: "Cursos avanzados y especializados" },
        { incluido: true, texto: "4 sesiones de mentoría mensual" },
        { incluido: true, texto: "Acceso a eventos exclusivos" },
      ],
      popular: false,
      cta: "Elegir Premium",
    },
  ]

  // Planes empresariales
  const planesEmpresariales = [
    {
      id: "startup",
      nombre: "Startup",
      precio: "$199",
      periodo: "mes",
      descripcion: "Para equipos pequeños de hasta 10 personas",
      caracteristicas: [
        { incluido: true, texto: "Acceso a todos los cursos para 10 usuarios" },
        { incluido: true, texto: "10 evaluaciones DISC mensuales" },
        { incluido: true, texto: "Panel de administración" },
        { incluido: true, texto: "Informes de progreso del equipo" },
        { incluido: true, texto: "Soporte prioritario" },
        { incluido: false, texto: "Cursos personalizados" },
        { incluido: false, texto: "Sesión de consultoría" },
      ],
      popular: false,
      cta: "Contactar ventas",
    },
    {
      id: "business",
      nombre: "Business",
      precio: "$499",
      periodo: "mes",
      descripcion: "Para empresas medianas de hasta 50 personas",
      caracteristicas: [
        { incluido: true, texto: "Acceso a todos los cursos para 50 usuarios" },
        { incluido: true, texto: "50 evaluaciones DISC mensuales" },
        { incluido: true, texto: "Panel de administración avanzado" },
        { incluido: true, texto: "Informes detallados de progreso del equipo" },
        { incluido: true, texto: "Soporte prioritario 24/7" },
        { incluido: true, texto: "1 curso personalizado por trimestre" },
        { incluido: true, texto: "Sesión mensual de consultoría" },
      ],
      popular: true,
      cta: "Contactar ventas",
    },
    {
      id: "enterprise",
      nombre: "Enterprise",
      precio: "Personalizado",
      periodo: "",
      descripcion: "Solución a medida para grandes organizaciones",
      caracteristicas: [
        { incluido: true, texto: "Usuarios ilimitados" },
        { incluido: true, texto: "Evaluaciones DISC ilimitadas" },
        { incluido: true, texto: "Panel de administración personalizado" },
        { incluido: true, texto: "Informes y análisis avanzados" },
        { incluido: true, texto: "Soporte dedicado" },
        { incluido: true, texto: "Cursos totalmente personalizados" },
        { incluido: true, texto: "Consultoría estratégica" },
      ],
      popular: false,
      cta: "Contactar ventas",
    },
  ]

  // Preguntas frecuentes
  const faqs = [
    {
      pregunta: "¿Puedo cambiar de plan en cualquier momento?",
      respuesta:
        "Sí, puedes actualizar o cambiar tu plan en cualquier momento. Si actualizas a un plan superior, se te cobrará la diferencia prorrateada por el tiempo restante de tu suscripción actual. Si cambias a un plan inferior, el nuevo precio se aplicará en tu próximo ciclo de facturación.",
    },
    {
      pregunta: "¿Hay algún descuento por pago anual?",
      respuesta:
        "Sí, ofrecemos un descuento del 20% en todos nuestros planes individuales cuando eliges la facturación anual. Este descuento se aplica automáticamente al seleccionar la opción anual.",
    },
    {
      pregunta: "¿Qué métodos de pago aceptan?",
      respuesta:
        "Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), PayPal y transferencias bancarias para planes empresariales.",
    },
    {
      pregunta: "¿Puedo cancelar mi suscripción en cualquier momento?",
      respuesta:
        "Sí, puedes cancelar tu suscripción en cualquier momento desde tu panel de usuario. No hay penalizaciones por cancelación. Tendrás acceso a tu plan hasta el final del período de facturación actual.",
    },
    {
      pregunta: "¿Ofrecen una prueba gratuita?",
      respuesta:
        "Sí, ofrecemos una prueba gratuita de 7 días para nuestros planes Básico y Profesional. Durante este período, tendrás acceso completo a todas las características del plan seleccionado.",
    },
    {
      pregunta: "¿Qué incluye exactamente el Test DISC?",
      respuesta:
        "El Test DISC es una herramienta de evaluación de comportamiento que analiza cuatro dimensiones: Dominancia, Influencia, Estabilidad y Concienzudo. Dependiendo de tu plan, recibirás un informe básico o detallado con tu perfil, fortalezas, áreas de mejora y recomendaciones personalizadas.",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Planes y Precios de eduX Academy
              </h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Elige el plan perfecto para impulsar tu desarrollo personal y profesional con nuestros cursos y
                herramientas de evaluación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tabs */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="individual" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="individual">Planes Individuales</TabsTrigger>
                <TabsTrigger value="empresarial">Planes Empresariales</TabsTrigger>
              </TabsList>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center items-center mb-10 space-x-4">
              <span className="text-sm font-medium">Facturación Mensual</span>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                <span className="inline-block h-5 w-5 translate-x-1 rounded-full bg-primary transition-transform" />
              </div>
              <span className="text-sm font-medium">
                Facturación Anual{" "}
                <Badge variant="outline" className="ml-1 text-xs">
                  Ahorra 20%
                </Badge>
              </span>
            </div>

            {/* Individual Plans */}
            <TabsContent value="individual" className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {planesIndividuales.map((plan) => (
                  <Card key={plan.id} className={`flex flex-col ${plan.popular ? "border-primary shadow-lg" : ""}`}>
                    {plan.popular && (
                      <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                        Más Popular
                      </div>
                    )}
                    <CardHeader className="flex flex-col space-y-1.5 p-6">
                      <CardTitle>{plan.nombre}</CardTitle>
                      <CardDescription>{plan.descripcion}</CardDescription>
                      <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                        {plan.precio}
                        <span className="ml-1 text-xl font-normal text-muted-foreground">/{plan.periodo}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 flex-grow">
                      <ul className="space-y-3">
                        {plan.caracteristicas.map((caracteristica, index) => (
                          <li key={index} className="flex items-start">
                            {caracteristica.incluido ? (
                              <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground shrink-0 mr-2" />
                            )}
                            <span className={caracteristica.incluido ? "" : "text-muted-foreground"}>
                              {caracteristica.texto}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Button asChild className="w-full" variant={plan.popular ? "default" : "outline"}>
                        <Link href={`/registro?plan=${plan.id}`}>{plan.cta}</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Business Plans */}
            <TabsContent value="empresarial" className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {planesEmpresariales.map((plan) => (
                  <Card key={plan.id} className={`flex flex-col ${plan.popular ? "border-primary shadow-lg" : ""}`}>
                    {plan.popular && (
                      <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                        Más Popular
                      </div>
                    )}
                    <CardHeader className="flex flex-col space-y-1.5 p-6">
                      <CardTitle>{plan.nombre}</CardTitle>
                      <CardDescription>{plan.descripcion}</CardDescription>
                      <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                        {plan.precio}
                        {plan.periodo && (
                          <span className="ml-1 text-xl font-normal text-muted-foreground">/{plan.periodo}</span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 flex-grow">
                      <ul className="space-y-3">
                        {plan.caracteristicas.map((caracteristica, index) => (
                          <li key={index} className="flex items-start">
                            {caracteristica.incluido ? (
                              <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground shrink-0 mr-2" />
                            )}
                            <span className={caracteristica.incluido ? "" : "text-muted-foreground"}>
                              {caracteristica.texto}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Button asChild className="w-full" variant={plan.popular ? "default" : "outline"}>
                        <Link href="/contacto">{plan.cta}</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Comparación de Planes</h2>
              <p className="max-w-[700px] text-muted-foreground">
                Compara las características de nuestros planes para encontrar la opción perfecta para ti.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-4 px-4 text-left font-medium">Características</th>
                  <th className="py-4 px-4 text-center font-medium">Básico</th>
                  <th className="py-4 px-4 text-center font-medium bg-primary/5 border-x">
                    <div className="flex flex-col items-center">
                      Profesional
                      <Badge variant="outline" className="mt-1">
                        Recomendado
                      </Badge>
                    </div>
                  </th>
                  <th className="py-4 px-4 text-center font-medium">Premium</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Cursos disponibles</td>
                  <td className="py-4 px-4 text-center">10 cursos básicos</td>
                  <td className="py-4 px-4 text-center bg-primary/5 border-x">Todos los cursos (50+)</td>
                  <td className="py-4 px-4 text-center">Todos los cursos (50+)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Test DISC</td>
                  <td className="py-4 px-4 text-center">1 evaluación</td>
                  <td className="py-4 px-4 text-center bg-primary/5 border-x">3 evaluaciones</td>
                  <td className="py-4 px-4 text-center">Ilimitado</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Certificados</td>
                  <td className="py-4 px-4 text-center">Básicos</td>
                  <td className="py-4 px-4 text-center bg-primary/5 border-x">Estándar</td>
                  <td className="py-4 px-4 text-center">Premium</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Soporte</td>
                  <td className="py-4 px-4 text-center">Email</td>
                  <td className="py-4 px-4 text-center bg-primary/5 border-x">Prioritario</td>
                  <td className="py-4 px-4 text-center">VIP 24/7</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Sesiones de mentoría</td>
                  <td className="py-4 px-4 text-center">
                    <X className="h-5 w-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center bg-primary/5 border-x">1 por mes</td>
                  <td className="py-4 px-4 text-center">4 por mes</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Eventos exclusivos</td>
                  <td className="py-4 px-4 text-center">
                    <X className="h-5 w-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center bg-primary/5 border-x">
                    <X className="h-5 w-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4"></td>
                  <td className="py-4 px-4 text-center">
                    <Button asChild variant="outline" size="sm">
                      <Link href="/registro?plan=basico">Elegir Básico</Link>
                    </Button>
                  </td>
                  <td className="py-4 px-4 text-center bg-primary/5 border-x">
                    <Button asChild size="sm">
                      <Link href="/registro?plan=profesional">Elegir Profesional</Link>
                    </Button>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Button asChild variant="outline" size="sm">
                      <Link href="/registro?plan=premium">Elegir Premium</Link>
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Lo que dicen nuestros usuarios</h2>
              <p className="max-w-[700px] text-muted-foreground">
                Descubre cómo eduX Academy ha transformado la vida profesional de nuestros estudiantes.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-muted/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="rounded-full bg-primary/10 p-1">
                    <div className="h-12 w-12 rounded-full bg-muted" />
                  </div>
                  <div>
                    <h3 className="font-medium">Laura Martínez</h3>
                    <p className="text-sm text-muted-foreground">Plan Profesional</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "La inversión en el plan Profesional ha sido una de las mejores decisiones para mi carrera. Los cursos
                  son excelentes y las sesiones de mentoría me han ayudado a aplicar lo aprendido en mi trabajo diario."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="rounded-full bg-primary/10 p-1">
                    <div className="h-12 w-12 rounded-full bg-muted" />
                  </div>
                  <div>
                    <h3 className="font-medium">Carlos Rodríguez</h3>
                    <p className="text-sm text-muted-foreground">Plan Premium</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "El plan Premium ofrece un valor excepcional. Las sesiones de mentoría y el acceso ilimitado al test
                  DISC me han permitido desarrollar mis habilidades de liderazgo y entender mejor a mi equipo."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="rounded-full bg-primary/10 p-1">
                    <div className="h-12 w-12 rounded-full bg-muted" />
                  </div>
                  <div>
                    <h3 className="font-medium">Ana Gómez</h3>
                    <p className="text-sm text-muted-foreground">Plan Business</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "Implementamos el plan Business en nuestra empresa y hemos visto una mejora significativa en las
                  habilidades de nuestro equipo. El panel de administración y los informes de progreso son herramientas
                  invaluables."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Preguntas Frecuentes</h2>
              <p className="max-w-[700px] text-muted-foreground">
                Respuestas a las preguntas más comunes sobre nuestros planes y suscripciones.
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-primary" />
                      {faq.pregunta}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.respuesta}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-500 to-cyan-400">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Comienza tu viaje de aprendizaje hoy
              </h2>
              <p className="max-w-[900px] text-white/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Elige el plan que mejor se adapte a tus necesidades y da el primer paso hacia tu desarrollo profesional.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-white/90">
                <Link href="/registro">Crear Cuenta Gratis</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-black dark:text-white hover:bg-white/10"
              >
                <Link href="/contacto">¿Necesitas ayuda?</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

