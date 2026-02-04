"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

export default function CertificationSection() {
  return (
    <section className="w-full py-16 md:py-24 overflow-hidden relative">
      {/* Elementos decorativos de fondo */}

      <div className="container px-4 md:px-6 mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-center mb-16"
        >
          Impulsa Tu carrera y certificate
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Columna izquierda - Texto */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Al finalizar el curso, no solo obtendrás una certificación que avala tus nuevas competencias, sino también
              un cambio real y medible en tu desempeño laboral. Únete a cientos de profesionales que ya han dado el paso
              hacia un futuro más prometedor y demuestra tu compromiso con el crecimiento personal y la excelencia
              profesional.
            </p>

            <p className="text-2xl font-bold text-primary">¡Tu éxito empieza hoy!</p>
          </motion.div>

          {/* Columna derecha - Imagen del certificado */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative w-[340px] h-[340px] md:w-[400px] md:h-[400px]">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2031%20mar%202025%2C%2014_59_06-ht81Xutz3EHtNwQhwxyoEZFBY0PEYI.png"
                alt="Certificado eduX"
                width={480}
                height={480}
                className="object-contain"
              />

              {/* Efecto de brillo */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/10 to-transparent rounded-full animate-pulse"></div>
            </div>
          </motion.div>
        </div>

        {/* Sección de la institución */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Logo de la institución */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="rounded-xl p-6 flex justify-center border border-border"
          >
            <Image
              src="/images/logos/utede.png"
              alt="UTEDÉ - Unidad Técnica para el Desarrollo Profesional"
              width={200}
              height={120}
              className="object-contain"
            />
          </motion.div>

          {/* Información de la institución */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <p className="text-muted-foreground leading-relaxed">
              La Unidad Técnica para el Desarrollo Profesional es la entidad encargada de certificar a los profesionales
              que han culminado con éxito su proceso de formación en habilidades blandas basadas en el modelo DISC.
              Ubicada en Buga, Valle del Cauca, esta institución de educación superior pública cuenta con una larga
              trayectoria en investigación y en la formación de expertos, lo que la respalda como un referente en el
              ámbito educativo.
            </p>
          </motion.div>
        </div>

        {/* Texto adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-10 text-muted-foreground"
        >
          <p className="leading-relaxed mb-6">
            Su reconocida trayectoria y solidez académica hacen de esta institución el aliado ideal para quienes buscan
            potenciar sus habilidades interpersonales y alcanzar un desempeño sobresaliente en el competitivo mundo
            laboral. Garantizando que cada certificación no solo acredite competencias, sino que también impulse el
            crecimiento profesional de quienes confían en su formación.
          </p>

          <Link
            href="https://utede.edu.co"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 flex items-center gap-2 transition-colors"
          >
            Conoce más de la U en utede.edu.co
            <ExternalLink className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
