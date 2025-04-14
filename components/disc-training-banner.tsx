"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Clock, FileText, Award, Lightbulb } from "lucide-react"

export default function DiscTrainingBanner() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const features = [
    {
      icon: <Clock className="h-10 w-10" />,
      title: "Modalidad flexible",
      description:
        "Estudia a tu ritmo sin afectar tu vida profesional. Puedes consultar todo nuestro material a cualquier hora sin calendario de cierre.",
    },
    {
      icon: <FileText className="h-10 w-10" />,
      title: "Informe DISC personal",
      description: "Recibe un informe detallado descargable sobre tu evaluación personal junto a su interpretación.",
    },
    {
      icon: <Award className="h-10 w-10" />,
      title: "Certificación",
      description:
        "Añade a tu currículo profesional nuestra formación en habilidades blandas y establece un precedente de tus desarrollo personal en habilidades blandas.",
    },
    {
      icon: <Lightbulb className="h-10 w-10" />,
      title: "Contenido clave",
      description:
        "Técnicas de comunicación efectiva, resolución de conflictos, inteligencia emocional y liderazgo colaborativo, entre otras habilidades esenciales.",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } },
  }

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background dark:from-primary/10 dark:to-background border-t border-primary/20 dark:border-primary/10 rounded-2xl">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Desarrolla Tus habilidades blandas</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Complementando el test DISC, hemos diseñado un programa de formación en habilidades blandas que te brindará
            herramientas prácticas para gestionar y potenciar tu personalidad.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className="relative overflow-hidden"
            >
              <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-primary/10 dark:bg-primary/20 z-0" />

              <div
                className={`
  relative z-10 rounded-xl p-6 md:p-8 h-full flex flex-col
  bg-card border border-primary/20 
  transition-all duration-300
  ${hoveredCard === index ? "shadow-xl shadow-primary/20 scale-[1.02]" : "shadow-lg"}
`}
              >
                <div className="mb-4 bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-card-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm md:text-base">{feature.description}</p>

                {/* Decorative elements - all with rounded shapes */}
                <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full opacity-10 bg-primary/30" />
                <div className="absolute top-1/2 right-4 w-2 h-2 rounded-full bg-primary/20" />
                <div className="absolute bottom-8 left-4 w-3 h-3 rounded-full bg-primary/20" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
