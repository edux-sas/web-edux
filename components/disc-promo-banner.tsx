"use client"
import { Zap, Heart, Shield, Brain } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

export default function DiscPromoBanner() {
  const [hoveredQuadrant, setHoveredQuadrant] = useState<string | null>(null)

  return (
    <div className="rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/30 dark:from-primary/20 dark:to-primary/40 text-foreground my-16 border border-border">
      <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-5">
          <h3 className="text-3xl font-bold">Descubre tu verdadero potencial con DISC</h3>
          <p className="text-foreground/90 text-lg">
            El test DISC es una herramienta científicamente validada que analiza tu comportamiento en cuatro dimensiones
            fundamentales:
          </p>
          <ul className="space-y-3 list-inside text-lg">
            <li className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20">
                <Zap className="h-4 w-4 text-primary" />
              </span>
              <span>Dominancia - Cómo respondes a los desafíos</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20">
                <Heart className="h-4 w-4 text-primary" />
              </span>
              <span>Influencia - Cómo te relacionas con otros</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20">
                <Shield className="h-4 w-4 text-primary" />
              </span>
              <span>Estabilidad - Cómo respondes al cambio</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20">
                <Brain className="h-4 w-4 text-primary" />
              </span>
              <span>Conciencia - Cómo enfrentas las reglas</span>
            </li>
          </ul>
        </div>

        {/* Diagrama DISC mejorado */}
        <div className="relative h-[350px] flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, type: "spring" }}
            className="relative w-[320px] h-[320px] rounded-full overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.2)] dark:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            {/* Círculo central con logo DISC */}
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
              className="absolute inset-0 m-auto w-[120px] h-[120px] bg-black rounded-full z-20 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            >
              <div className="font-bold text-4xl tracking-tight">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                  className="text-red-500"
                >
                  d
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.3 }}
                  className="text-yellow-500"
                >
                  i
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.3 }}
                  className="text-green-500"
                >
                  s
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.3 }}
                  className="text-blue-500"
                >
                  c
                </motion.span>
              </div>

              {/* Efecto de brillo alrededor del logo */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-white/10 to-transparent animate-pulse"></div>
            </motion.div>

            {/* Cuadrantes DISC con efectos de hover */}
            <div className="absolute w-full h-full">
              {/* Cuadrante D - Dominancia (rojo) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                onMouseEnter={() => setHoveredQuadrant("D")}
                onMouseLeave={() => setHoveredQuadrant(null)}
                className={`absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center cursor-pointer transition-all duration-300 ${hoveredQuadrant === "D" ? "brightness-110 scale-[1.02] z-10" : "brightness-100"}`}
              >
                <motion.div
                  animate={{
                    scale: hoveredQuadrant === "D" ? 1.2 : 1,
                    y: hoveredQuadrant === "D" ? -5 : 0,
                    x: hoveredQuadrant === "D" ? 5 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="absolute"
                  style={{ top: "35%", right: "35%" }}
                >
                  <Zap className="h-10 w-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                </motion.div>
              </motion.div>

              {/* Cuadrante C - Concienzudo (azul) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                onMouseEnter={() => setHoveredQuadrant("C")}
                onMouseLeave={() => setHoveredQuadrant(null)}
                className={`absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center cursor-pointer transition-all duration-300 ${hoveredQuadrant === "C" ? "brightness-110 scale-[1.02] z-10" : "brightness-100"}`}
              >
                <motion.div
                  animate={{
                    scale: hoveredQuadrant === "C" ? 1.2 : 1,
                    y: hoveredQuadrant === "C" ? -5 : 0,
                    x: hoveredQuadrant === "C" ? -5 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="absolute"
                  style={{ top: "35%", left: "35%" }}
                >
                  <Brain className="h-10 w-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                </motion.div>
              </motion.div>

              {/* Cuadrante S - Estabilidad (verde) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onMouseEnter={() => setHoveredQuadrant("S")}
                onMouseLeave={() => setHoveredQuadrant(null)}
                className={`absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center cursor-pointer transition-all duration-300 ${hoveredQuadrant === "S" ? "brightness-110 scale-[1.02] z-10" : "brightness-100"}`}
              >
                <motion.div
                  animate={{
                    scale: hoveredQuadrant === "S" ? 1.2 : 1,
                    y: hoveredQuadrant === "S" ? 5 : 0,
                    x: hoveredQuadrant === "S" ? -5 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="absolute"
                  style={{ bottom: "35%", left: "35%" }}
                >
                  <Shield className="h-10 w-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                </motion.div>
              </motion.div>

              {/* Cuadrante I - Influencia (amarillo) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                onMouseEnter={() => setHoveredQuadrant("I")}
                onMouseLeave={() => setHoveredQuadrant(null)}
                className={`absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center cursor-pointer transition-all duration-300 ${hoveredQuadrant === "I" ? "brightness-110 scale-[1.02] z-10" : "brightness-100"}`}
              >
                <motion.div
                  animate={{
                    scale: hoveredQuadrant === "I" ? 1.2 : 1,
                    y: hoveredQuadrant === "I" ? 5 : 0,
                    x: hoveredQuadrant === "I" ? 5 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="absolute"
                  style={{ bottom: "35%", right: "35%" }}
                >
                  <Heart className="h-10 w-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                </motion.div>
              </motion.div>

              {/* Líneas divisorias con efecto de brillo */}
              <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-black transform -translate-x-1/2 z-10 after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:via-white/30 after:to-transparent"></div>
              <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-black transform -translate-y-1/2 z-10 after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent"></div>
            </div>
          </motion.div>

          {/* Efecto de brillo exterior */}
          <div className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-br from-primary/0 via-primary/10 to-primary/0 animate-[spin_20s_linear_infinite] pointer-events-none"></div>
        </div>
      </div>
    </div>
  )
}

