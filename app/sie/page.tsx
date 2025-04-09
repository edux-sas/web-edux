import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Users, Settings, BookOpen, BarChart3, FileText, Building2 } from "lucide-react"
import { ContactModal } from "@/components/contact-modal"

export default function SIEPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/10 to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_450px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  El software SaaS de gestión educativa más potente de Colombia
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Centraliza y optimiza todos tus procesos académicos y administrativos en una plataforma 100%
                  personalizable. Desde colegios hasta universidades y centros de formación técnica, adapta cada módulo
                  al "metalenguaje" de tu institución y pon fin al caos de sistemas desconectados.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Ahorra hasta un 70% de tiempo en trámites</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Implementación rápida y soporte local</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
                <ContactModal
                  trigger={<Button size="lg">Solicita tu demo personalizada</Button>}
                  defaultSubject="demo-sie"
                  title="Solicitar Demo de SIE"
                  description="Completa el formulario y te contactaremos para agendar una demostración personalizada de nuestro Sistema de Información Educativa."
                />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg">
                <Image
                  src="/images/hologram-education.png"
                  alt="Sistema de Información Educativa"
                  width={800}
                  height={450}
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personalización y control de usuarios */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Personalización y control de usuarios
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Una plataforma que habla tu idioma institucional
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 mt-12">
            <Card className="flex flex-col items-start p-6 space-y-4">
              <div className="p-2 rounded-full bg-primary/10">
                <Settings className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Metalenguaje a medida</h3>
              <p className="text-muted-foreground">
                Define nomenclaturas, campos y flujos según tu modelo educativo (módulos, materias, programas).
              </p>
            </Card>
            <Card className="flex flex-col items-start p-6 space-y-4">
              <div className="p-2 rounded-full bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Roles y permisos flexibles</h3>
              <p className="text-muted-foreground">
                Estudiantes, docentes, administrativos, psicólogos... crea perfiles operativos y asigna accesos en
                segundos.
              </p>
            </Card>
            <Card className="flex flex-col items-start p-6 space-y-4">
              <div className="p-2 rounded-full bg-primary/10">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Historial y trazabilidad</h3>
              <p className="text-muted-foreground">
                Registra cada cambio en planes de estudio, mallas curriculares y actualizaciones, y conoce a quién y por
                qué fue modificado.
              </p>
            </Card>
            <Card className="flex flex-col items-start p-6 space-y-4">
              <div className="p-2 rounded-full bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Interacción fluida</h3>
              <p className="text-muted-foreground">
                Todos los actores construyen relaciones administrativas y académicas desde un mismo tablero.
              </p>
            </Card>
          </div>          
        </div>
      </section>

      {/* Oferta Académica */}
      <section id="oferta-academica" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Oferta Académica 100% Personalizable
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                En un entorno educativo diverso, cada institución habla su propio "metalenguaje": nomenclaturas, flujos
                y reglas únicas. Nuestra plataforma SaaS te permite modelar la oferta académica exactamente como la
                necesitas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-primary/10 mt-1">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Programas, Módulos y Cursos</h3>
                  <p className="text-muted-foreground">
                    Define tus programas (pregrado, posgrado, técnico), descompónlos en módulos o materias, y crea
                    cursos con horarios, aulas y cupos. Todo configurado según tus políticas de crédito y duración.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-primary/10 mt-1">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Versiones y trazabilidad</h3>
                  <p className="text-muted-foreground">
                    Cada cambio en la malla curricular —agregar o retirar un módulo, actualizar requisitos— queda
                    registrado con fecha, responsable y motivo. Así mantienes un historial íntegro para auditorías y
                    acreditaciones.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-primary/10 mt-1">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Roles y permisos a medida</h3>
                  <p className="text-muted-foreground">
                    Desde estudiantes y docentes hasta psicólogos y operadores administrativos, asigna permisos finos
                    por función: quién puede editar planes de estudio, autorizar retiros, generar reportes o cargar
                    documentos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-primary/10 mt-1">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Gestión de campus e infraestructura</h3>
                  <p className="text-muted-foreground">
                    Administra sedes, edificios, aulas y recursos (laboratorios, bibliotecas) y vincúlalos
                    automáticamente a tus cursos. Los datos de infraestructura se alimentan en tiempo real en los
                    reportes SNIES.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-primary/10 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Beneficio clave</h3>
            <p className="text-muted-foreground">
              Adapta la plataforma a tu modelo educativo en cuestión de días, no meses, y garantiza coherencia en toda
              tu oferta académica.
            </p>
          </div>
        </div>
      </section>

      {/* Ciclo de Vida del Estudiante */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ciclo de Vida del Estudiante y Matrícula Integral
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Desde el primer contacto hasta la graduación, acompaña al estudiante en cada paso con flujos 100%
                integrados.
              </p>
            </div>
          </div>

          <Tabs defaultValue="preinscripciones" className="mx-auto max-w-4xl">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="preinscripciones">1. Preinscripciones</TabsTrigger>
              <TabsTrigger value="ficha">2. Ficha Estudiante</TabsTrigger>
              <TabsTrigger value="matricula">3. Matrícula</TabsTrigger>
              <TabsTrigger value="documentos">4. Gestión Documental</TabsTrigger>
              <TabsTrigger value="reportes">5. Reportes</TabsTrigger>
            </TabsList>

            <TabsContent value="preinscripciones" className="mt-6 p-6 border rounded-lg">
              <h3 className="text-xl font-bold mb-4">Preinscripciones y Postulaciones</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Captura de datos, documentos y cuestionarios de admisión.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>
                    Evaluaciones, entrevistas y caracterizaciones (psicológica, SNIES) directamente en la plataforma.
                  </span>
                </li>
              </ul>
            </TabsContent>

            <TabsContent value="ficha" className="mt-6 p-6 border rounded-lg">
              <h3 className="text-xl font-bold mb-4">Ficha del Estudiante</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Transforma al aspirante en usuario con rol "Estudiante" y acceso a su portal personal.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Registro de avance académico, asistencias y comunicaciones institucionales.</span>
                </li>
              </ul>
            </TabsContent>

            <TabsContent value="matricula" className="mt-6 p-6 border rounded-lg">
              <h3 className="text-xl font-bold mb-4">Matrícula Académica y Financiera</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>
                    Cruce automático de matrícula académica (asignación de cursos) y financiera (generación de órdenes
                    de pago, recibos y facturación electrónica).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>
                    Descuentos y ayudas configurables: becas, gratuidad, políticas de bienestar, con reglas por tipo de
                    estudiante o programa.
                  </span>
                </li>
              </ul>
            </TabsContent>

            <TabsContent value="documentos" className="mt-6 p-6 border rounded-lg">
              <h3 className="text-xl font-bold mb-4">Gestión Documental en Cada Etapa</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>
                    Almacenamiento de actas, certificados médicos, autorizaciones y cualquier archivo relevante.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Alertas de vencimiento y control de versiones de documentos.</span>
                </li>
              </ul>
            </TabsContent>

            <TabsContent value="reportes" className="mt-6 p-6 border rounded-lg">
              <h3 className="text-xl font-bold mb-4">Furag y Reportes de Aspirantes/Graduados</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>
                    Formato Único de Registro de Aspirantes y Graduados (Furag) generado automáticamente para SNIES y
                    Ministerio de Educación.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Historial completo de postulaciones, matrículas y egresos, listo para descarga.</span>
                </li>
              </ul>
            </TabsContent>
          </Tabs>

          <div className="mt-12 p-6 bg-primary/10 rounded-lg max-w-4xl mx-auto">
            <h3 className="text-xl font-bold mb-2">Beneficio clave</h3>
            <p className="text-muted-foreground">
              Reduce a cero la doble captura de datos y elimina los errores humanos al vincular todos los procesos de
              admisión, matrícula y documentación en un único flujo.
            </p>
          </div>
        </div>
      </section>

      {/* Finanzas y Reportes */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Finanzas, Reportes y Cumplimiento SNIES
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Controla tu tesorería y cumple con la normatividad sin esfuerzo
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="flex flex-col h-full">
              <CardContent className="flex flex-col h-full p-6">
                <div className="p-2 rounded-full bg-primary/10 w-fit mb-4">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Gestión Financiera Avanzada</h3>
                <ul className="space-y-2 flex-grow">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Cuentas por cobrar con alertas de morosidad y conciliación bancaria automatizada.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Emisión de órdenes de pago, recibos y facturas electrónicas en segundos.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Reportes dinámicos de flujo de caja, KPIs de ingresos y proyecciones financieras.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Exportación directa a tu ERP o sistema contable favorito.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="flex flex-col h-full">
              <CardContent className="flex flex-col h-full p-6">
                <div className="p-2 rounded-full bg-primary/10 w-fit mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Cumplimiento SNIES Garantizado</h3>
                <ul className="space-y-2 flex-grow">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>
                      Extracción de indicadores académicos, administrativos e infraestructurales desde cada módulo.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Generación automática de formatos oficiales, anexos y tablas SNIES.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Alertas y recordatorios de plazos de entrega, con historial de envíos y validaciones.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="flex flex-col h-full">
              <CardContent className="flex flex-col h-full p-6">
                <div className="p-2 rounded-full bg-primary/10 w-fit mb-4">
                  <Settings className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Configuraciones Globales</h3>
                <ul className="space-y-2 flex-grow">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>
                      Parámetros institucionales: calendarios académicos, tipos de documento, políticas de descuentos y
                      escalas de calificación.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Gestión de Roles y permisos a nivel de menú, acción y módulo para garantizar seguridad.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>
                      Activación opcional del módulo de Formación Continua para diplomados y cursos de extensión.
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-500 to-cyan-400">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Transforma tu institución educativa hoy
              </h2>
              <p className="max-w-[900px] text-white/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Solicita una demostración personalizada y descubre cómo SIE puede optimizar todos tus procesos
                académicos y administrativos.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <ContactModal
                trigger={
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90">
                    Solicitar Demo
                  </Button>
                }
                defaultSubject="demo-sie"
                title="Solicitar Demo de SIE"
                description="Completa el formulario y te contactaremos para agendar una demostración personalizada de nuestro Sistema de Información Educativa."
              />
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link href="/contacto">Contactar con Nosotros</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
