"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"

export default function CompanyOverview() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const glowVariants = {
    initial: { opacity: 0.5, scale: 1 },
    animate: {
      opacity: [0.5, 0.8, 0.5],
      scale: [1, 1.05, 1],
      transition: {
        duration: 8,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      },
    },
  }

  return (
    <section className="w-full py-24 md:py-32 bg-background text-foreground overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl dark:bg-primary/5"
          variants={glowVariants}
          initial="initial"
          animate="animate"
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl dark:bg-primary/5"
          variants={glowVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 2 }}
        />
      </div>

      <div className="container px-6 md:px-8 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8"
        >
          {/* Left column - Features */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div
              variants={itemVariants}
              className="bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group"
            >
              <h3 className="text-2xl font-bold text-primary mb-4 group-hover:translate-x-1 transition-transform">
                Trabajo Altamente Personalizado
              </h3>
              <p className="text-card-foreground/90 leading-relaxed">
                Nos dedicamos a comprender a fondo las necesidades de cada cliente, ofreciendo soluciones a medida que
                garantizan resultados efectivos. Nuestro enfoque personalizado asegura que cada proyecto sea único.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group"
            >
              <h3 className="text-2xl font-bold text-primary mb-4 group-hover:translate-x-1 transition-transform">
                Alianzas Estratégicas en Educación Superior
              </h3>
              <p className="text-card-foreground/90 leading-relaxed">
                Contamos con colaboradores y aliados en el sector educativo que fortalecen nuestras propuestas y aportan
                valor añadido a nuestros proyectos, creando un ecosistema de innovación.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group"
            >
              <h3 className="text-2xl font-bold text-primary mb-4 group-hover:translate-x-1 transition-transform">
                Bajos Costos de Ejecución
              </h3>
              <p className="text-card-foreground/90 leading-relaxed">
                Optimizamos cada proceso para brindar servicios de alta calidad sin comprometer la eficiencia y la
                inversión de nuestros clientes. Nuestra metodología ágil permite maximizar resultados.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group"
            >
              <h3 className="text-2xl font-bold text-primary mb-4 group-hover:translate-x-1 transition-transform">
                Comunicación Abierta y Directa
              </h3>
              <p className="text-card-foreground/90 leading-relaxed">
                Creemos en la transparencia y el diálogo continuo, lo que nos permite construir relaciones sólidas y
                colaborativas con quienes confían en nosotros. Mantenemos canales de comunicación efectivos.
              </p>
            </motion.div>
          </div>

          {/* Right column - Company overview */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 bg-card/90 backdrop-blur-sm p-10 rounded-2xl border border-border flex flex-col justify-center"
          >
            <h2 className="text-5xl font-bold mb-8 text-primary">eduX en un vistazo</h2>

            <p className="text-card-foreground/90 leading-relaxed mb-6">
              En eduX impulsamos la transformación digital a través de soluciones innovadoras y adaptadas a las
              necesidades de cada cliente. Somos una empresa joven y dinámica, comprometida a conectar tecnología y
              educación para potenciar el desarrollo profesional y personal.
            </p>

            <p className="text-card-foreground/90 leading-relaxed mb-8">
              Nuestra misión es transformar la experiencia digital en una herramienta de crecimiento, mientras que
              nuestra visión se centra en construir un futuro en el que la tecnología y la educación se integren para
              abrir nuevas oportunidades de aprendizaje y progreso.
            </p>

            <div className="flex space-x-3">
              <div className="h-2 w-16 bg-primary rounded-full"></div>
              <div className="h-2 w-8 bg-primary opacity-70 rounded-full"></div>
              <div className="h-2 w-4 bg-primary opacity-40 rounded-full"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
