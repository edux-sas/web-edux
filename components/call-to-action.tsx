"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { LicenseIcon } from "./icons/license-icon"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

// Actualizar el array techLogos para incluir los nuevos logos

const techLogos = [
  { name: "Microsoft 365", src: "/images/logos/microsoft365.png", width: 180, height: 60 },
  { name: "Adobe Creative Cloud", src: "/images/logos/adobe-creative-cloud.png", width: 180, height: 60 },
  { name: "Power BI", src: "/images/logos/power-bi.png", width: 180, height: 60 },
  { name: "Logitech", src: "/images/logos/logitech.png", width: 160, height: 50 },
  { name: "Toshiba", src: "/images/logos/toshiba.png", width: 160, height: 50 },
  { name: "TP-Link", src: "/images/logos/tp-link.png", width: 160, height: 50 },
  { name: "Wacom", src: "/images/logos/wacom.png", width: 160, height: 50 },
  { name: "Xiaomi", src: "/images/logos/xiaomi.png", width: 180, height: 60 },
  { name: "Lenovo", src: "/images/logos/lenovo.png", width: 160, height: 50 },
  { name: "ASUS", src: "/images/logos/asus.png", width: 180, height: 60 },
  { name: "Acer", src: "/images/logos/acer.png", width: 180, height: 50 },
  { name: "Adobe", src: "/images/logos/adobe.png", width: 180, height: 60 },
  { name: "Acronis", src: "/images/logos/acronis.png", width: 180, height: 50 },
  { name: "AMD", src: "/images/logos/amd.png", width: 180, height: 60 },
  { name: "HP", src: "/images/logos/hp.png", width: 160, height: 160 },
  { name: "ADATA", src: "/images/logos/adata.png", width: 180, height: 60 },
  { name: "Autodesk", src: "/images/logos/autodesk.png", width: 180, height: 50 },
  { name: "EPSON", src: "/images/logos/epson.png", width: 180, height: 50 },
]

export default function CallToAction() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-slate-100 dark:bg-slate-900">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
          {/* Columna izquierda con información - 40% */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-4">
              <LicenseIcon />
              <h2 className="text-3xl font-bold tracking-tighter text-primary">Licencias y equipos</h2>
            </div>
            <p className="text-muted-foreground md:text-lg">
              Complementamos nuestras soluciones digitales con una oferta exclusiva en licencias y hardware de alta
              calidad. Nuestro portafolio está diseñado para proporcionar a empresas e instituciones las herramientas
              tecnológicas necesarias para mantener su competitividad en un entorno digital en constante evolución.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-primary">Bajos Costos de Ejecución</h3>
                <p className="text-muted-foreground">
                  Optimizamos cada proceso para brindar servicios de alta calidad sin comprometer la eficiencia y la
                  inversión de nuestros clientes.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-primary">Comunicación Abierta y Directa</h3>
                <p className="text-muted-foreground">
                  Creemos en la transparencia y el diálogo continuo, lo que nos permite construir relaciones sólidas y
                  colaborativas con quienes confían en nosotros.
                </p>
              </div>
            </div>
            <Button asChild size="lg" className="mt-4">
              <Link href="/contacto">Saber más</Link>
            </Button>
          </div>

          {/* Columna derecha con logos - 60% */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 dark:from-primary/20 dark:via-slate-800 dark:to-secondary/20 rounded-xl shadow-lg p-8 overflow-hidden relative"
            >
              {/* Elementos decorativos de fondo */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"></div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-center justify-items-center relative z-10">
                {techLogos.map((logo, index) => (
                  <motion.div
                    key={logo.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: index * 0.02,
                      duration: 0.3,
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileHover={{
                      scale: 1.05,
                      rotate: Math.random() > 0.5 ? 3 : -3,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                    className="flex items-center justify-center w-[120px] h-[80px] bg-white dark:bg-slate-700 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-600 p-3"
                  >
                    <Image
                      src={logo.src || "/placeholder.svg"}
                      alt={logo.name}
                      width={100}
                      height={50}
                      className="object-contain max-h-12 max-w-full transition-all duration-300 filter hover:brightness-110"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
