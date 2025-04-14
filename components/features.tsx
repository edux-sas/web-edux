import { BarChart3, Code, GraduationCap, Server } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <Code className="h-12 w-12 text-primary" />,
      title: "Software bajo demanda",
      description:
        "Desarrollamos soluciones digitales personalizadas que optimizan procesos y potencian el crecimiento de tu negocio.",
    },
    {
      icon: <GraduationCap className="h-12 w-12 text-primary" />,
      title: "Educación virtual",
      description:
        "Revoluciona la formación profesional con programas virtuales de alta calidad, diseñados para aprender a tu ritmo y adaptarse a las necesidades del mercado.",
    },
    {
      icon: <BarChart3 className="h-12 w-12 text-primary" />,
      title: "Formación en habilidades blandas (DISC)",
      description:
        "Transforma el talento humano con nuestros programas formativos basados en el test DISC, que fortalecen la comunicación, liderazgo y trabajo en equipo.",
    },
    {
      icon: <Server className="h-12 w-12 text-primary" />,
      title: "Infraestructura y recursos tecnológicos",
      description:
        "Implementa tecnología de vanguardia con soluciones integrales que garantizan un entorno digital seguro, eficiente y escalable para tu institución.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 dark:bg-slate-900/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-3 max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Explora nuestras soluciones</h2>
            <p className="text-muted-foreground md:text-lg max-w-[800px] mx-auto">
              Nuestra plataforma combina educación de calidad con herramientas de desarrollo personal y profesional.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 mt-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-4 rounded-lg border p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-3 rounded-full bg-primary/10 mb-2">{feature.icon}</div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
