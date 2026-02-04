import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Target,
  Clock,
  CheckCircle,
  Lightbulb,
  Heart,
  TrendingUp,
  Award,
  Trophy,
  Users,
  Star,
  Briefcase,
  GraduationCap,
  Code,
} from "lucide-react"

export default function AboutUsPage() {
  const values = [
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: "Innovación con propósito",
      description:
        "Adoptamos la tecnología y el conocimiento como medios para crear soluciones que realmente marcan la diferencia.",
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Humanismo digital",
      description:
        "Ponemos a las personas en el centro de la transformación, integrando lo humano con lo tecnológico para lograr un desarrollo más completo y sostenible.",
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      title: "Calidad y adaptabilidad",
      description:
        "Diseñamos experiencias formativas y tecnológicas que combinan excelencia con flexibilidad, adaptándose a cada necesidad.",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Colaboración estratégica",
      description:
        "Creemos en el poder de construir juntos: con nuestros clientes, aliados y equipo, para alcanzar metas comunes con visión de futuro.",
    },
  ]

  const milestones = [
    {
      year: "2017",
      title: "Fundación de eduX Futuro",
      description:
        "Jaime Diego Gutiérrez funda eduX Futuro con el propósito de transformar la educación virtual, apostando por la calidad, la innovación pedagógica y el acceso inclusivo al conocimiento.",
    },
    {
      year: "2018",
      title: "Diseño de cursos a la medida",
      description:
        "Lanzamos nuestra primera oferta virtual de cursos y diplomados certificados por instituciones de educación superior, adaptados a las necesidades reales del entorno profesional y laboral.",
    },
    {
      year: "2019 - 2020",
      title: "Creación del test DISC eduX",
      description:
        "Desarrollamos nuestro propio test DISC, una herramienta de autoconocimiento que permite identificar los perfiles Dominante, Influyente, Estable y Cumplidor, guiando a los usuarios en procesos de reskilling y upskilling. Esta metodología se integra con cursos virtuales certificados a través de la institución de educación superior Utedé (Unidad Técnica para el Desarrollo Profesional), con insignias digitales y certificados académicos respaldados.",
    },
    {
      year: "2023",
      title: "Metasistemas educativos institucionales",
      description:
        "Iniciamos la implementación de metasistemas en instituciones educativas, permitiéndoles construir ofertas de educación virtual con altos estándares de calidad, acompañadas de infraestructura tecnológica robusta.",
    },
    {
      year: "2024",
      title: "Lanzamiento del SIE (Sistema Integral Educativo)",
      description:
        "Desplegamos nuestra plataforma SIE, una solución completa de administración educativa que permite gestionar rutas formativas, matrícula, horarios, calificaciones y reportes académicos. El sistema está integrado con los requerimientos del SNIES, e incluye rutas de seguimiento financiero, académico y administrativo, adaptadas a cada institución.",
    },
    {
      year: "2025",
      title: "Infraestructura física e inteligencia artificial educativa",
      description:
        "Nos proyectamos como líderes en innovación educativa, integrando infraestructura tecnológica física, adecuaciones de laboratorios, licencias certificadas y capacidades de escalamiento institucional. Adicionalmente, lanzamos Aurora, nuestra inteligencia artificial educativa para desarrollos a la medida, que potencia la personalización de contenidos, el análisis de desempeño y la automatización de procesos formativos.",
    },
  ]

  const teamMembers = [
    {
      name: "Jaime Diego Gutiérrez",
      position: "CEO & Fundador",
      image: "/images/equipo-edux-2.png",
      description:
        "Visionario educativo con más de 15 años de experiencia en transformación digital y pedagogía innovadora.",
      // Ícono actualizado para un perfil ejecutivo
      icon: <Briefcase className="h-6 w-6 text-primary" />,
    },
    {
      name: "Diego Varela",
      position: "Director Tecnológico y Product Owner",
      image: "/images/equipo-edux-3.png",
      description:
        "Experto en desarrollo de software, metodología SCRUM y gestión de proyectos tecnológicos.",
      icon: <Code className="h-6 w-6 text-primary" />,
    },
    {
      name: "José Alexis Correa",
      position: "Director de Tecnología",
      image: "/images/equipo-edux-1.png",
      description:
        "Prompt Engineer, Arquitecto de Sistemas. Especialista en desarrollo FullStack.",
      icon: <Code className="h-6 w-6 text-primary" />,
    },
  ];

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
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_550px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Sobre eduX </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Somos una empresa especializada en transformación digital que impulsa el crecimiento personal y
                  organizacional a través de soluciones tecnológicas personalizadas, soluciones de infraestructura
                  fisica y digital, formación virtual y desarrollo de habilidades blandas con herramientas como el Test
                  DISC.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild variant="outline" size="lg">
                  <Link href="/contacto">Contactar</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg">
                <Image
                  src="/images/edux-academia-virtual.png"
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
              Conectamos innovación, conocimiento y tecnología para transformar desafíos en oportunidades de
              crecimiento sostenible.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 mt-12">
            <Card className="flex flex-col items-center text-center p-6 space-y-4">
              <Target className="h-12 w-12 text-primary" />
              <h3 className="text-2xl font-bold">Misión</h3>
              <p className="text-muted-foreground">
              Impulsamos la evolución digital de personas y organizaciones a través de soluciones de infraestructura
                fisica y virtual, soluciones tecnológicas personalizadas, formación virtual de alto impacto y el
                desarrollo de habilidades humanas clave. Conectamos innovación, conocimiento y tecnología para
                transformar desafíos en oportunidades de crecimiento sostenible.
              </p>
            </Card>
            <Card className="flex flex-col items-center text-center p-6 space-y-4">
              <Lightbulb className="h-12 w-12 text-primary" />
              <h3 className="text-2xl font-bold">Visión</h3>
              <p className="text-muted-foreground">
              Ser líderes en la transformación digital integral en Latinoamérica, siendo reconocidos por nuestra
                capacidad de conectar talento, tecnología y educación para construir un futuro más inteligente,
                colaborativo y humano.
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
              Los principios que guían cada solución, proyecto y experiencia que entregamos para transformar el futuro
              digital de personas y organizaciones.
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

      {/* Nuestro Equipo - Nueva sección */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Nuestro Equipo</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Conoce a los profesionales que hacen posible la transformación educativa en eduX.
              </p>
              <p className="max-w-[900px] text-sm text-muted-foreground italic">
                *Así ve nuestra IA a los colaboradores de eduX. ¡Si te quieres sumar al equipo, bienvenido!
              </p>
            </div>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="relative w-64 h-64 mb-6 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={256}
                    height={256}
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <div className="flex items-center gap-2 text-primary mb-2">
                  {member.icon}
                  <p className="font-medium">{member.position}</p>
                </div>
                <p className="text-muted-foreground max-w-xs">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nuestro Enfoque */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Nuestro Enfoque</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Aceleramos la transformación digital conectando talento, tecnología y educación. Nuestro enfoque combina
                metodologías pedagógicas innovadoras, herramientas tecnológicas avanzadas y acompañamiento humano, para
                generar experiencias de aprendizaje y desarrollo verdaderamente sostenibles.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 mt-12">
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <Image
                src="/images/metodologia-innovadora.png"
                alt="Metodología Innovadora"
                width={600}
                height={400}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <h3 className="text-2xl font-bold">Metodología Centrada en Resultados</h3>
              <p className="text-muted-foreground">
              Diseñamos experiencias que integran conocimiento, práctica y tecnología para lograr una transformación
                real. Nuestro modelo promueve el aprendizaje activo, la resolución de problemas reales y el desarrollo
                de habilidades aplicables de forma inmediata en contextos personales y organizacionales.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <span>Aprendizaje activo y aplicado</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <span>Personalización centrada en el usuario</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <span>Integración tecnológica estratégica</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <span>Desarrollo humano como eje de transformación</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* History & Stats */}
      <section className="w-full py-12 md:py-24 lg:py-32">
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

      {/* Reconocimientos */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Reconocimientos</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Nuestro compromiso con la excelencia educativa ha sido reconocido por diversas instituciones.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-5xl mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6">
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Excelencia Educativa 2023</h3>
                      <p className="text-muted-foreground">Cámara de Comercio</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Reconocimiento por nuestra contribución a la formación profesional y el desarrollo de talento en la
                    región.
                  </p>
                </CardContent>
              </Card>
              <Card className="p-6">
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Trophy className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Innovación Tecnológica</h3>
                      <p className="text-muted-foreground">Ministerio de Tecnologías de la Información</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Premio a la implementación de soluciones tecnológicas innovadoras en el ámbito educativo.
                  </p>
                </CardContent>
              </Card>
              <Card className="p-6">
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Impacto Social</h3>
                      <p className="text-muted-foreground">Fundación Educativa Nacional</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Reconocimiento por nuestro compromiso con la democratización del acceso a educación de calidad.
                  </p>
                </CardContent>
              </Card>
              <Card className="p-6">
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Star className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Calidad Formativa</h3>
                      <p className="text-muted-foreground">Asociación de Instituciones Educativas</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Distinción por la excelencia en nuestros programas formativos y metodologías de enseñanza.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
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
                Comienza tu viaje de aprendizaje y desarrollo profesional con eduX.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
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