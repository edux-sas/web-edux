import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, Clock, CheckCircle, Lightbulb, Heart, TrendingUp } from "lucide-react"

export default function AboutUsPage() {
  const teamMembers = [
    {
      name: "Jaime Diego Gutierrez",
      role: "Fundador y CEO",
      bio: "Con más de 15 años de experiencia en educación y desarrollo profesional, Jaime fundó eduX con la visión de transformar la forma en que las personas aprenden y crecen profesionalmente.",
      image: "/images/team-leadership.png",
    },
    {
      name: "Carlos Mendoza",
      role: "Director Académico",
      bio: "Doctor en Psicología Organizacional, Carlos ha dedicado su carrera a investigar y aplicar metodologías innovadoras de aprendizaje y desarrollo de habilidades blandas.",
      image: "/images/team-project-management.png",
    },
    {
      name: "Ana Valencia",
      role: "Directora de Tecnología",
      bio: "Ingeniera de software con especialización en e-learning, Ana lidera el desarrollo de nuestra plataforma educativa y las herramientas de evaluación DISC.",
      image: "/images/team-leadership.png",
    },
    {
      name: "Javier Torres",
      role: "Director de Contenidos",
      bio: "Con experiencia en diseño instruccional y pedagogía, Javier supervisa la creación de todos nuestros cursos para garantizar la máxima calidad y efectividad.",
      image: "/images/team-project-management.png",
    },
  ]

  const values = [
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: "Innovación",
      description:
        "Buscamos constantemente nuevas formas de mejorar la experiencia de aprendizaje y desarrollo profesional.",
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Pasión",
      description: "Amamos lo que hacemos y creemos en el poder transformador de la educación y el autoconocimiento.",
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      title: "Excelencia",
      description:
        "Nos comprometemos a ofrecer la más alta calidad en todos nuestros cursos y herramientas de evaluación.",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Crecimiento",
      description: "Fomentamos el desarrollo continuo, tanto en nuestros estudiantes como en nuestro equipo.",
    },
  ]

  const milestones = [
    {
      year: "2015",
      title: "Fundación de eduX",
      description: "María Rodríguez funda eduX con la visión de transformar la educación profesional en Latinoamérica.",
    },
    {
      year: "2017",
      title: "Lanzamiento de la plataforma online",
      description:
        "Expandimos nuestros servicios con una plataforma digital que permite acceso a nuestros cursos desde cualquier lugar.",
    },
    {
      year: "2019",
      title: "Integración del test DISC",
      description:
        "Incorporamos la metodología DISC para ofrecer evaluaciones de comportamiento y personalidad de alta precisión.",
    },
    {
      year: "2021",
      title: "Expansión internacional",
      description:
        "Comenzamos operaciones en varios países de Latinoamérica, llevando nuestra metodología a miles de nuevos estudiantes.",
    },
    {
      year: "2023",
      title: "Renovación tecnológica",
      description:
        "Lanzamos nuestra plataforma completamente renovada con informes DISC en tiempo real y experiencia de usuario mejorada.",
    },
  ]

  const stats = [
    { value: "50,000+", label: "Estudiantes" },
    { value: "100+", label: "Cursos" },
    { value: "25,000+", label: "Tests DISC realizados" },
    { value: "8", label: "Países" },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_450px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Sobre eduX </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Somos una academia dedicada a transformar el desarrollo personal y profesional a través de cursos de
                  alta calidad y herramientas de evaluación como el Test DISC.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/cursos">Explorar Cursos</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contacto">Contactar</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg">
                <Image
                  src="/images/edux-building-hologram.png"
                  alt="eduX Academia Virtual"
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

      {/* Mission & Vision */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Nuestra Misión y Visión</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Impulsamos el crecimiento personal y profesional a través de educación de calidad y autoconocimiento.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 mt-12">
            <Card className="flex flex-col items-center text-center p-6 space-y-4">
              <Target className="h-12 w-12 text-primary" />
              <h3 className="text-2xl font-bold">Misión</h3>
              <p className="text-muted-foreground">
                Proporcionar herramientas educativas y de evaluación de alta calidad que permitan a las personas y
                organizaciones alcanzar su máximo potencial, fomentando el desarrollo de habilidades técnicas y blandas
                en un entorno de aprendizaje innovador y accesible.
              </p>
            </Card>
            <Card className="flex flex-col items-center text-center p-6 space-y-4">
              <Lightbulb className="h-12 w-12 text-primary" />
              <h3 className="text-2xl font-bold">Visión</h3>
              <p className="text-muted-foreground">
                Ser reconocidos como líderes en la transformación educativa en Latinoamérica, creando un impacto
                positivo en la vida profesional de miles de personas a través de metodologías innovadoras que combinen
                el aprendizaje técnico con el desarrollo personal.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Nuestros Valores</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Los principios que guían nuestro trabajo y compromiso con la excelencia educativa.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 mt-12">
            {values.map((value, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10">{value.icon}</div>
                    <h3 className="text-xl font-bold">{value.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Nuestro Equipo</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Conoce a los profesionales apasionados que hacen posible eduX Academy.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mt-12">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* History & Stats */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Nuestra Historia</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                El camino que hemos recorrido para convertirnos en líderes en educación y desarrollo profesional.
              </p>
            </div>
          </div>

          <Tabs defaultValue="timeline" className="mx-auto max-w-4xl">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Línea de Tiempo
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Estadísticas
              </TabsTrigger>
            </TabsList>
            <TabsContent value="timeline" className="mt-6 space-y-8">
              <div className="relative border-l border-primary/30 pl-6 ml-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className="mb-10 relative">
                    <div className="absolute -left-10 mt-1.5 h-6 w-6 rounded-full border-4 border-background bg-primary"></div>
                    <div className="mb-1 flex items-baseline">
                      <span className="text-sm font-semibold text-primary mr-2">{milestone.year}</span>
                      <h3 className="text-xl font-bold">{milestone.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="stats" className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {stats.map((stat, index) => (
                  <Card key={index} className="p-6">
                    <CardContent className="p-0 space-y-2">
                      <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                      <p className="text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-center text-muted-foreground mt-8">
                Datos actualizados a {new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long" })}
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-500 to-cyan-400">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Únete a nuestra comunidad
              </h2>
              <p className="max-w-[900px] text-white/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Comienza tu viaje de aprendizaje y desarrollo profesional con eduX Academy.
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
                <Link href="/contacto">Contactar con Nosotros</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

