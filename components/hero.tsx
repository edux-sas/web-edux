import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ContactModal } from "@/components/contact-modal"

export default function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-background/80 dark:from-background dark:to-background/80">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                Impulsa la transformación y lidera en tu segmento
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                En eduX convertimos tu visión en innovación. Descubre soluciones integrales en software a la medida,
                educación virtual, desarrollo de habilidades blandas y tecnología de punta para instituciones.
              </p>
            </div>
            <div className="flex flex-col gap-3 min-[400px]:flex-row">
              <ContactModal
                trigger={<Button size="lg">Habla con nuestro CEO</Button>}
                defaultSubject="ceo"
                title="Habla con nuestro CEO"
                description="Completa el formulario y nuestro CEO se pondrá en contacto contigo a la brevedad."
              />
              <Button asChild variant="outline" size="lg">
                <Link href="/test-disc">Realizar Test DISC</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full h-[350px] md:h-[450px] lg:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg opacity-20 blur-3xl"></div>
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <Image
                  src="/images/edux-building-transparent.webp"
                  alt="eduX - Edificio educativo digital"
                  className="object-contain w-full h-full"
                  width={550}
                  height={500}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
