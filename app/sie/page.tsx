"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  Users,
  Settings,
  BookOpen,
  BarChart3,
  FileText,
  Building2,
  Zap,
  ArrowRight,
  Database,
  GraduationCap,
  Calendar,
  CreditCard,
  FileCheck,
} from "lucide-react"
import { ContactModal } from "@/components/contact-modal"
import { motion } from "framer-motion"
import { useState } from "react"

// Variantes de animación
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, type: "spring" },
  },
}

const pulseAnimation = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse",
    },
  },
}

export default function SIEPage() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/10 to-background relative overflow-hidden">
        {/* Elementos decorativos animados */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_650px]">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="flex flex-col justify-center space-y-4"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  El software SaaS de gestión educativa más potente de Colombia
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Centraliza y optimiza todos tus procesos académicos y administrativos en una plataforma 100%
                  personalizable. Desde colegios hasta universidades y centros de formación técnica, adapta cada módulo
                  al "metalenguaje" de tu institución y pon fin al caos de sistemas desconectados.
                </p>
              </div>
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                <motion.div variants={itemFadeIn} className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <span>Ahorra hasta un 70% de tiempo en trámites</span>
                </motion.div>
                <motion.div variants={itemFadeIn} className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <span>Implementación rápida y soporte local</span>
                </motion.div>
              </motion.div>
              <motion.div variants={fadeIn} className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
                <ContactModal
                  trigger={
                    <Button size="lg" className="group">
                      Solicita tu demo personalizada
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  }
                  defaultSubject="demo-sie"
                  title="Solicitar Demo de SIE"
                  description="Completa el formulario y te contactaremos para agendar una demostración personalizada de nuestro Sistema de Información Educativa."
                />
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="flex items-center justify-center"
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 z-10 mix-blend-overlay" />
                <Image
                  src="/images/hologram-education.png"
                  alt="Sistema de Información Educativa"
                  width={600}
                  height={450}
                  className="object-cover transition-transform duration-10000 hover:scale-110"
                  priority
                />
                <motion.div
                  variants={pulseAnimation}
                  initial="initial"
                  animate="animate"
                  className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium"
                >
                  SIE
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Personalización y control de usuarios */}
      <section className="w-full py-10 md:py-24 lg:py-32 bg-muted/50 relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Settings className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
                Personalización y control de usuarios
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Una plataforma que habla tu idioma institucional
              </p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 mt-12"
          >
            <motion.div variants={itemFadeIn} whileHover={{ scale: 1.03 }} className="group">
              <Card className="flex flex-col items-start p-6 space-y-4 h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <Settings className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                  Metalenguaje a medida
                </h3>
                <p className="text-muted-foreground">
                  Define nomenclaturas, campos y flujos según tu modelo educativo (módulos, materias, programas).
                </p>
              </Card>
            </motion.div>

            <motion.div variants={itemFadeIn} whileHover={{ scale: 1.03 }} className="group">
              <Card className="flex flex-col items-start p-6 space-y-4 h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                  Roles y permisos flexibles
                </h3>
                <p className="text-muted-foreground">
                  Estudiantes, docentes, administrativos, psicólogos... crea perfiles operativos y asigna accesos en
                  segundos.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={itemFadeIn} whileHover={{ scale: 1.03 }} className="group">
              <Card className="flex flex-col items-start p-6 space-y-4 h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                  Historial y trazabilidad
                </h3>
                <p className="text-muted-foreground">
                  Registra cada cambio en planes de estudio, mallas curriculares y actualizaciones, y conoce a quién y
                  por qué fue modificado.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={itemFadeIn} whileHover={{ scale: 1.03 }} className="group">
              <Card className="flex flex-col items-start p-6 space-y-4 h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                  Interacción fluida
                </h3>
                <p className="text-muted-foreground">
                  Todos los actores construyen relaciones administrativas y académicas desde un mismo tablero.
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Oferta Académica */}
      <section id="oferta-academica" className="w-full py-10 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20"></div>

        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
                Oferta Académica 100% Personalizable
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                En un entorno educativo diverso, cada institución habla su propio "metalenguaje": nomenclaturas, flujos
                y reglas únicas. Nuestra plataforma SaaS te permite modelar la oferta académica exactamente como la
                necesitas.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start mt-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
              className="space-y-6"
            >
              <motion.div
                variants={itemFadeIn}
                whileHover={{ x: 5 }}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-primary/5 transition-colors duration-300"
                onMouseEnter={() => setActiveFeature(1)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div
                  className={`p-3 rounded-full ${activeFeature === 1 ? "bg-primary/30" : "bg-primary/10"} transition-colors duration-300`}
                >
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Programas, Módulos y Cursos</h3>
                  <p className="text-muted-foreground">
                    Define tus programas (pregrado, posgrado, técnico), descompónlos en módulos o materias, y crea
                    cursos con horarios, aulas y cupos. Todo configurado según tus políticas de crédito y duración.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={itemFadeIn}
                whileHover={{ x: 5 }}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-primary/5 transition-colors duration-300"
                onMouseEnter={() => setActiveFeature(2)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div
                  className={`p-3 rounded-full ${activeFeature === 2 ? "bg-primary/30" : "bg-primary/10"} transition-colors duration-300`}
                >
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
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
              className="space-y-6"
            >
              <motion.div
                variants={itemFadeIn}
                whileHover={{ x: 5 }}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-primary/5 transition-colors duration-300"
                onMouseEnter={() => setActiveFeature(3)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div
                  className={`p-3 rounded-full ${activeFeature === 3 ? "bg-primary/30" : "bg-primary/10"} transition-colors duration-300`}
                >
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
              </motion.div>

              <motion.div
                variants={itemFadeIn}
                whileHover={{ x: 5 }}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-primary/5 transition-colors duration-300"
                onMouseEnter={() => setActiveFeature(4)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div
                  className={`p-3 rounded-full ${activeFeature === 4 ? "bg-primary/30" : "bg-primary/10"} transition-colors duration-300`}
                >
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
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 p-6 bg-primary/10 rounded-lg"
          >
            <h3 className="text-xl font-bold mb-2 flex items-center">
              <Zap className="h-5 w-5 text-primary mr-2" />
              Beneficio clave
            </h3>
            <p className="text-muted-foreground">
              Adapta la plataforma a tu modelo educativo en cuestión de días, no meses, y garantiza coherencia en toda
              tu oferta académica.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ciclo de Vida del Estudiante */}
      <section className="w-full py-10 md:py-24 lg:py-32 bg-muted/50 relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-40 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
                Ciclo de Vida del Estudiante y Matrícula Integral
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Desde el primer contacto hasta la graduación, acompaña al estudiante en cada paso con flujos 100%
                integrados.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Tabs defaultValue="preinscripciones" className="mx-auto max-w-4xl">
              <div className="relative overflow-hidden rounded-lg border bg-muted/80 backdrop-blur-sm mb-6">
                <div className="flex overflow-x-auto snap-x scrollbar-hide">
                  <TabsList className="flex w-full min-w-max">
                    <TabsTrigger
                      value="preinscripciones"
                      className="flex-1 py-4 px-4 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:font-medium snap-start min-w-[160px]"
                    >
                      <div className="flex items-center gap-2 justify-center">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-xs font-medium">
                          1
                        </span>
                        <span>Preinscripciones</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value="ficha"
                      className="flex-1 py-4 px-4 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:font-medium snap-start min-w-[160px]"
                    >
                      <div className="flex items-center gap-2 justify-center">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-xs font-medium">
                          2
                        </span>
                        <span>Ficha Estudiante</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value="matricula"
                      className="flex-1 py-4 px-4 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:font-medium snap-start min-w-[160px]"
                    >
                      <div className="flex items-center gap-2 justify-center">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-xs font-medium">
                          3
                        </span>
                        <span>Matrícula</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value="documentos"
                      className="flex-1 py-4 px-4 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:font-medium snap-start min-w-[160px]"
                    >
                      <div className="flex items-center gap-2 justify-center">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-xs font-medium">
                          4
                        </span>
                        <span>Gestión Documental</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value="reportes"
                      className="flex-1 py-4 px-4 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:font-medium snap-start min-w-[160px]"
                    >
                      <div className="flex items-center gap-2 justify-center">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-xs font-medium">
                          5
                        </span>
                        <span>Reportes</span>
                      </div>
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <TabsContent value="preinscripciones" className="mt-6 p-6 border rounded-lg bg-card shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <FileCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Preinscripciones y Postulaciones</h3>
                </div>
                <ul className="space-y-3">
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Captura de datos, documentos y cuestionarios de admisión.</span>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>
                      Evaluaciones, entrevistas y caracterizaciones (psicológica, SNIES) directamente en la plataforma.
                    </span>
                  </motion.li>
                </ul>
              </TabsContent>

              <TabsContent value="ficha" className="mt-6 p-6 border rounded-lg bg-card shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Ficha del Estudiante</h3>
                </div>
                <ul className="space-y-3">
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Transforma al aspirante en usuario con rol "Estudiante" y acceso a su portal personal.</span>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Registro de avance académico, asistencias y comunicaciones institucionales.</span>
                  </motion.li>
                </ul>
              </TabsContent>

              <TabsContent value="matricula" className="mt-6 p-6 border rounded-lg bg-card shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Matrícula Académica y Financiera</h3>
                </div>
                <ul className="space-y-3">
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>
                      Cruce automático de matrícula académica (asignación de cursos) y financiera (generación de órdenes
                      de pago, recibos y facturación electrónica).
                    </span>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>
                      Descuentos y ayudas configurables: becas, gratuidad, políticas de bienestar, con reglas por tipo
                      de estudiante o programa.
                    </span>
                  </motion.li>
                </ul>
              </TabsContent>

              <TabsContent value="documentos" className="mt-6 p-6 border rounded-lg bg-card shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Gestión Documental en Cada Etapa</h3>
                </div>
                <ul className="space-y-3">
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>
                      Almacenamiento de actas, certificados médicos, autorizaciones y cualquier archivo relevante.
                    </span>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Alertas de vencimiento y control de versiones de documentos.</span>
                  </motion.li>
                </ul>
              </TabsContent>

              <TabsContent value="reportes" className="mt-6 p-6 border rounded-lg bg-card shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Furag y Reportes de Aspirantes/Graduados</h3>
                </div>
                <ul className="space-y-3">
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>
                      Formato Único de Registro de Aspirantes y Graduados (Furag) generado automáticamente para SNIES y
                      Ministerio de Educación.
                    </span>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Historial completo de postulaciones, matrículas y egresos, listo para descarga.</span>
                  </motion.li>
                </ul>
              </TabsContent>
            </Tabs>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 p-6 bg-primary/10 rounded-lg max-w-4xl mx-auto"
          >
            <h3 className="text-xl font-bold mb-2 flex items-center">
              <Zap className="h-5 w-5 text-primary mr-2" />
              Beneficio clave
            </h3>
            <p className="text-muted-foreground">
              Reduce a cero la doble captura de datos y elimina los errores humanos al vincular todos los procesos de
              admisión, matrícula y documentación en un único flujo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Finanzas y Reportes */}
      <section className="w-full py-10 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20"></div>

        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Database className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
                Finanzas, Reportes y Cumplimiento SNIES
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Controla tu tesorería y cumple con la normatividad sin esfuerzo
              </p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemFadeIn} whileHover={{ y: -5 }} className="flex flex-col h-full">
              <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                <CardContent className="flex flex-col h-full p-6">
                  <div className="p-3 rounded-full bg-primary/10 w-fit mb-4">
                    <CreditCard className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Gestión Financiera Avanzada</h3>
                  <ul className="space-y-3 flex-grow">
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
            </motion.div>

            <motion.div variants={itemFadeIn} whileHover={{ y: -5 }} className="flex flex-col h-full">
              <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                <CardContent className="flex flex-col h-full p-6">
                  <div className="p-3 rounded-full bg-primary/10 w-fit mb-4">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Cumplimiento SNIES Garantizado</h3>
                  <ul className="space-y-3 flex-grow">
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
            </motion.div>

            <motion.div variants={itemFadeIn} whileHover={{ y: -5 }} className="flex flex-col h-full">
              <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                <CardContent className="flex flex-col h-full p-6">
                  <div className="p-3 rounded-full bg-primary/10 w-fit mb-4">
                    <Settings className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Configuraciones Globales</h3>
                  <ul className="space-y-3 flex-grow">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        Parámetros institucionales: calendarios académicos, tipos de documento, políticas de descuentos
                        y escalas de calificación.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        Gestión de Roles y permisos a nivel de menú, acción y módulo para garantizar seguridad.
                      </span>
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
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-500 to-cyan-400 relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center space-y-4 text-center"
          >
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl text-white">
                Transforma tu institución educativa hoy
              </h2>
              <p className="max-w-[900px] text-white/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Solicita una demostración personalizada y descubre cómo SIE puede optimizar todos tus procesos
                académicos y administrativos.
              </p>
            </div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="flex flex-col gap-3 sm:flex-row pt-4 w-full sm:w-auto"
            >
              <motion.div variants={itemFadeIn}>
                <ContactModal
                  trigger={
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 group">
                      Solicitar Demo
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  }
                  defaultSubject="demo-sie"
                  title="Solicitar Demo de SIE"
                  description="Completa el formulario y te contactaremos para agendar una demostración personalizada de nuestro Sistema de Información Educativa."
                />
              </motion.div>
              <motion.div variants={itemFadeIn}>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10 dark:border-white dark:text-white dark:hover:bg-white/10 bg-blue-600/20 hover:bg-blue-600/30"
                >
                  <Link href="/contacto">Contactar con Nosotros</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
