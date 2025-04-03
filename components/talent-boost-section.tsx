"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Lightbulb, Users, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContactModal } from "@/components/contact-modal"

export default function TalentBoostSection() {
  return (
    <section className="w-full py-16 pb-16 mb-16 md:py-24 md:pb-16 relative overflow-hidden rounded-[20px] border border-primary/10">
      {/* Elementos decorativos de fondo */}
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl animate-pulse"></div>

      {/* Formas geométricas decorativas */}
      <div className="absolute top-20 right-10 w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-blue-400/20 rotate-12 hidden md:block"></div>
      <div className="absolute bottom-20 left-10 w-20 h-20 rounded-full border-4 border-primary/20 hidden md:block"></div>
      <div
        className="absolute top-1/2 left-5 w-8 h-8 rounded-full bg-yellow-400/30 animate-bounce hidden md:block"
        style={{ animationDuration: "3s" }}
      ></div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 dark:from-primary dark:to-blue-400"
        >
          Potencia el talento de tu organización
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Columna izquierda - Ilustración */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px] overflow-hidden flex items-center justify-center rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.2)] group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-400/10 group-hover:opacity-80 transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2031%20mar%202025%2C%2015_16_00-r3hvf3qf7bgXnt7E593nMAm599EMYj.png"
                  alt="Equipo profesional de eduX explicando servicios"
                  width={400}
                  height={400}
                  className="object-contain transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </motion.div>

          {/* Columna derecha - Texto */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
              Si eres dueño de una empresa o lideras un equipo, lleva la formación en habilidades blandas al siguiente
              nivel con nuestro innovador programa basado en el modelo DISC.
            </p>

            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
              Adaptamos nuestra metodología para capacitar a cada miembro de tu equipo, potenciando sus competencias
              interpersonales y su rendimiento profesional.
            </p>

            <div className="mt-8 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-colors duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-400/20 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Programa Personalizado</h3>
                  <p className="text-foreground/80">
                    Entrena a tu equipo con un enfoque adaptado a las necesidades específicas de tu organización.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-colors duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-400/20 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <BarChart3 className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Informe Corporativo Integral</h3>
                  <p className="text-foreground/80">
                    Recibe un análisis detallado de los atributos de personalidad de tus colaboradores.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-colors duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-400/20 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Lightbulb className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Liderazgo y Competitividad</h3>
                  <p className="text-foreground/80">
                    Fortalece el liderazgo en tu empresa, impulsando el crecimiento y la competitividad organizacional.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          viewport={{ once: true }}
          className="mt-10 mb-16 md:mb-20 flex justify-center"
        >
          <ContactModal
            trigger={<Button size="lg">¡Potencia tu equipo ahora!</Button>}
            defaultSubject="ventas"
            title="Potencia el talento de tu organización"
            description="Completa el formulario y te contactaremos para brindarte más información sobre nuestros programas de formación en habilidades blandas."
            buttonText="Enviar solicitud"
          />
        </motion.div>
      </div>
    </section>
  )
}

