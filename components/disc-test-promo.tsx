import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function DiscTestPromo() {
  const benefits = [
    "Informe detallado de tu perfil DISC en tiempo real",
    "Análisis de fortalezas y áreas de mejora",
    "Recomendaciones personalizadas para desarrollo profesional",
    "Compatibilidad con roles laborales específicos",
    "Estrategias de comunicación efectiva según tu perfil",
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-500/10 to-cyan-400/10">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Descubre tu perfil DISC</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                El test DISC es una herramienta poderosa para entender tu estilo de comportamiento y mejorar tus
                relaciones personales y profesionales.
              </p>
            </div>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
              <Button asChild size="lg">
                <Link href="/test-disc">Realizar Test DISC</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full h-[350px] md:h-[450px]">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg opacity-20 blur-3xl"></div>
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <img
                  src="/images/discover-profile.png"
                  alt="Persona descubriendo su perfil DISC en eduX"
                  className="object-cover rounded-lg shadow-xl"
                  width={550}
                  height={550}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
