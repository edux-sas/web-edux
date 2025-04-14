"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  Download,
  Share2,
  CheckCircle,
  BarChart,
  Award,
  Target,
  Zap,
  Brain,
  Heart,
  Shield,
  Lightbulb,
  Loader2,
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import dynamic from "next/dynamic"
import { saveDiscResults, getDiscResults } from "@/lib/supabase"

// Importación dinámica para evitar errores de SSR
const html2canvasModule = dynamic(() => import("html2canvas"), {
  ssr: false,
})
const jsPDFModule = dynamic(() => import("jspdf"), {
  ssr: false,
})

type DiscResults = {
  D: number
  I: number
  S: number
  C: number
}

// Función para obtener la descripción basada en el perfil dominante y menos dominante
function obtenerDescripcionPorPerfil(max: string, min: string) {
  const perfiles: Record<string, Record<string, string>> = {
    D: {
      I: "Tiende a ser lógico, crítico e incisivo en sus enfoques hacia la obtención de metas.",
      S: "Responde rápidamente a los retos, demuestra movilidad y flexibilidad en sus enfoques.",
      C: "Actúa de una manera directa y positiva ante la oposición.",
    },
    I: {
      D: 'Tiende a comportarse de manera equilibrada y cordial, desplegando "agresividad social".',
      S: "Tiende a buscar a las personas con entusiasmo y chispa, mostrando un optimismo contagioso.",
      C: "Despliega confianza en sí mismo en la mayoría de sus tratos con otras personas.",
    },
    S: {
      D: "Tiende a ser constante y consistente, prefiriendo tratar un proyecto o tarea a la vez.",
      I: "Es un individuo controlado y paciente, se mueve con moderación y premeditación.",
      C: "Individuo persistente y perseverante, no se desvía fácilmente de su objetivo.",
    },
    C: {
      D: "Tiende a actuar de manera cuidadosa y conservadora, buscando modificar su posición.",
      S: "Es un seguidor del orden y los sistemas, toma decisiones basadas en hechos conocidos.",
      I: "Evita riesgos y busca significados ocultos, puede sentirse intranquilo si no tiene claro lo que sucede.",
    },
  }

  return perfiles[max]?.[min] || "No hay suficiente información para generar una descripción detallada."
}

// Función para obtener la relación entre perfiles
function obtenerRelacionPorPerfil(max: string, min: string) {
  const relaciones: Record<string, Record<string, string>> = {
    D: {
      I: "D/I Creatividad",
      S: "D/S Empuje",
      C: "D/C Individualidad",
    },
    I: {
      D: "I/D Buena Voluntad",
      S: "I/S Habilidad de Contactos",
      C: "I/C Confianza en sí mismo",
    },
    S: {
      D: "S/D Paciencia",
      I: "S/I Reflexión (Concentración)",
      C: "S/C Persistencia",
    },
    C: {
      D: "C/D Adaptabilidad",
      S: "C/S Perfeccionismo",
      I: "C/I Sensibilidad",
    },
  }

  return relaciones[max]?.[min] || "Relación no definida"
}

// Función para obtener un emoji basado en el perfil
function getProfileEmoji(type: string): { emoji: React.ReactNode; color: string } {
  switch (type) {
    case "D":
      return { emoji: <Zap className="h-6 w-6" />, color: "text-red-500" }
    case "I":
      return { emoji: <Heart className="h-6 w-6" />, color: "text-yellow-500" }
    case "S":
      return { emoji: <Shield className="h-6 w-6" />, color: "text-green-500" }
    case "C":
      return { emoji: <Brain className="h-6 w-6" />, color: "text-blue-500" }
    default:
      return { emoji: <Lightbulb className="h-6 w-6" />, color: "text-primary" }
  }
}

// Componente para el gráfico de radar
const RadarChart = ({ results }: { results: DiscResults }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 20

    // Normalizar valores (0-100%)
    const normalizedD = (results.D / 28) * 100
    const normalizedI = (results.I / 28) * 100
    const normalizedS = (results.S / 28) * 100
    const normalizedC = (results.C / 28) * 100

    // Dibujar ejes
    ctx.beginPath()
    ctx.strokeStyle = "#ccc"
    ctx.moveTo(centerX, centerY - radius)
    ctx.lineTo(centerX, centerY + radius)
    ctx.moveTo(centerX - radius, centerY)
    ctx.lineTo(centerX + radius, centerY)
    ctx.stroke()

    // Dibujar círculos concéntricos
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath()
      ctx.strokeStyle = "#eee"
      ctx.arc(centerX, centerY, (radius * i) / 4, 0, 2 * Math.PI)
      ctx.stroke()
    }

    // Calcular puntos
    const angleD = Math.PI * 0.5 // Arriba
    const angleI = Math.PI * 0 // Derecha
    const angleS = Math.PI * 1.5 // Abajo
    const angleC = Math.PI * 1 // Izquierda

    const pointD = {
      x: centerX + (Math.cos(angleD) * radius * normalizedD) / 100,
      y: centerY - (Math.sin(angleD) * radius * normalizedD) / 100,
    }

    const pointI = {
      x: centerX + (Math.cos(angleI) * radius * normalizedI) / 100,
      y: centerY - (Math.sin(angleI) * radius * normalizedI) / 100,
    }

    const pointS = {
      x: centerX + (Math.cos(angleS) * radius * normalizedS) / 100,
      y: centerY - (Math.sin(angleS) * radius * normalizedS) / 100,
    }

    const pointC = {
      x: centerX + (Math.cos(angleC) * radius * normalizedC) / 100,
      y: centerY - (Math.sin(angleC) * radius * normalizedC) / 100,
    }

    // Dibujar etiquetas
    ctx.font = "bold 14px Arial"
    ctx.fillStyle = "#f43f5e" // Rojo para D
    ctx.textAlign = "center"
    ctx.fillText("D", centerX, centerY - radius - 10)

    ctx.fillStyle = "#eab308" // Amarillo para I
    ctx.textAlign = "left"
    ctx.fillText("I", centerX + radius + 10, centerY)

    ctx.fillStyle = "#22c55e" // Verde para S
    ctx.textAlign = "center"
    ctx.fillText("S", centerX, centerY + radius + 20)

    ctx.fillStyle = "#3b82f6" // Azul para C
    ctx.textAlign = "right"
    ctx.fillText("C", centerX - radius - 10, centerY)

    // Dibujar área
    ctx.beginPath()
    ctx.moveTo(pointD.x, pointD.y)
    ctx.lineTo(pointI.x, pointI.y)
    ctx.lineTo(pointS.x, pointS.y)
    ctx.lineTo(pointC.x, pointC.y)
    ctx.closePath()

    // Rellenar con gradiente
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "rgba(244, 63, 94, 0.2)") // Rojo
    gradient.addColorStop(0.33, "rgba(234, 179, 8, 0.2)") // Amarillo
    gradient.addColorStop(0.66, "rgba(34, 197, 94, 0.2)") // Verde
    gradient.addColorStop(1, "rgba(59, 130, 246, 0.2)") // Azul

    ctx.fillStyle = gradient
    ctx.fill()

    // Dibujar líneas
    ctx.beginPath()
    ctx.strokeStyle = "rgba(244, 63, 94, 0.8)" // Rojo
    ctx.lineWidth = 2
    ctx.moveTo(pointD.x, pointD.y)
    ctx.lineTo(pointI.x, pointI.y)
    ctx.strokeStyle = "rgba(234, 179, 8, 0.8)" // Amarillo
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = "rgba(234, 179, 8, 0.8)" // Amarillo
    ctx.moveTo(pointI.x, pointI.y)
    ctx.lineTo(pointS.x, pointS.y)
    ctx.strokeStyle = "rgba(34, 197, 94, 0.8)" // Verde
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = "rgba(34, 197, 94, 0.8)" // Verde
    ctx.moveTo(pointS.x, pointS.y)
    ctx.lineTo(pointC.x, pointC.y)
    ctx.strokeStyle = "rgba(59, 130, 246, 0.8)" // Azul
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = "rgba(59, 130, 246, 0.8)" // Azul
    ctx.moveTo(pointC.x, pointC.y)
    ctx.lineTo(pointD.x, pointD.y)
    ctx.strokeStyle = "rgba(244, 63, 94, 0.8)" // Rojo
    ctx.stroke()

    // Dibujar puntos
    ctx.beginPath()
    ctx.fillStyle = "#f43f5e" // Rojo
    ctx.arc(pointD.x, pointD.y, 6, 0, 2 * Math.PI)
    ctx.fill()

    ctx.beginPath()
    ctx.fillStyle = "#eab308" // Amarillo
    ctx.arc(pointI.x, pointI.y, 6, 0, 2 * Math.PI)
    ctx.fill()

    ctx.beginPath()
    ctx.fillStyle = "#22c55e" // Verde
    ctx.arc(pointS.x, pointS.y, 6, 0, 2 * Math.PI)
    ctx.fill()

    ctx.beginPath()
    ctx.fillStyle = "#3b82f6" // Azul
    ctx.arc(pointC.x, pointC.y, 6, 0, 2 * Math.PI)
    ctx.fill()
  }, [results])

  return <canvas ref={canvasRef} width={300} height={300} className="mx-auto" />
}

// Componente para el gráfico de donut
const DonutChart = ({ results }: { results: DiscResults }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 20

    const total = results.D + results.I + results.S + results.C

    // Calcular ángulos
    const angleD = (results.D / total) * 2 * Math.PI
    const angleI = (results.I / total) * 2 * Math.PI
    const angleS = (results.S / total) * 2 * Math.PI
    const angleC = (results.C / total) * 2 * Math.PI

    let startAngle = 0

    // Dibujar segmento D
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + angleD)
    ctx.closePath()
    ctx.fillStyle = "rgba(244, 63, 94, 0.7)" // Rojo
    ctx.fill()

    // Dibujar segmento I
    startAngle += angleD
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + angleI)
    ctx.closePath()
    ctx.fillStyle = "rgba(234, 179, 8, 0.7)" // Amarillo
    ctx.fill()

    // Dibujar segmento S
    startAngle += angleI
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + angleS)
    ctx.closePath()
    ctx.fillStyle = "rgba(34, 197, 94, 0.7)" // Verde
    ctx.fill()

    // Dibujar segmento C
    startAngle += angleS
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + angleC)
    ctx.closePath()
    ctx.fillStyle = "rgba(59, 130, 246, 0.7)" // Azul
    ctx.fill()

    // Dibujar círculo interior (para hacer el donut)
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI)
    ctx.fillStyle = "white"
    ctx.fill()

    // Añadir etiquetas
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Calcular posiciones para las etiquetas
    const labelRadius = radius * 0.8

    // Posición para D
    const labelAngleD = startAngle - angleC - angleS - angleI - angleD / 2
    const labelXD = centerX + Math.cos(labelAngleD) * labelRadius
    const labelYD = centerY + Math.sin(labelAngleD) * labelRadius

    // Posición para I
    const labelAngleI = startAngle - angleC - angleS - angleI / 2
    const labelXI = centerX + Math.cos(labelAngleI) * labelRadius
    const labelYI = centerY + Math.sin(labelAngleI) * labelRadius

    // Posición para S
    const labelAngleS = startAngle - angleC - angleS / 2
    const labelXS = centerX + Math.cos(labelAngleS) * labelRadius
    const labelYS = centerY + Math.sin(labelAngleS) * labelRadius

    // Posición para C
    const labelAngleC = startAngle - angleC / 2
    const labelXC = centerX + Math.cos(labelAngleC) * labelRadius
    const labelYC = centerY + Math.sin(labelAngleC) * labelRadius

    // Dibujar etiquetas
    ctx.fillStyle = "#f43f5e" // Rojo
    ctx.fillText("D", labelXD, labelYD)

    ctx.fillStyle = "#eab308" // Amarillo
    ctx.fillText("I", labelXI, labelYI)

    ctx.fillStyle = "#22c55e" // Verde
    ctx.fillText("S", labelXS, labelYS)

    ctx.fillStyle = "#3b82f6" // Azul
    ctx.fillText("C", labelXC, labelYC)

    // Añadir porcentajes en el centro
    ctx.font = "bold 14px Arial"
    ctx.fillStyle = "#333"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    const percentD = Math.round((results.D / total) * 100)
    const percentI = Math.round((results.I / total) * 100)
    const percentS = Math.round((results.S / total) * 100)
    const percentC = Math.round((results.C / total) * 100)

    ctx.fillText(`D: ${percentD}%`, centerX, centerY - 20)
    ctx.fillText(`I: ${percentI}%`, centerX, centerY)
    ctx.fillText(`S: ${percentS}%`, centerX, centerY + 20)
    ctx.fillText(`C: ${percentC}%`, centerX, centerY + 40)
  }, [results])

  return <canvas ref={canvasRef} width={300} height={300} className="mx-auto" />
}

export default function ResultsPage() {
  const [results, setResults] = useState<DiscResults | null>(null)
  const [dominantType, setDominantType] = useState<string>("")
  const [leastDominantType, setLeastDominantType] = useState<string>("")
  const [relationshipPattern, setRelationshipPattern] = useState<string>("")
  const [analysisDescription, setAnalysisDescription] = useState<string>("")
  const [userName, setUserName] = useState<string>("Usuario")
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isSavingResults, setSavingResults] = useState(false)
  const [resultsSaved, setResultsSaved] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Función para cargar los resultados
    const loadResults = async () => {
      // Recuperar usuario del localStorage
      const storedUser = localStorage.getItem("eduXUser")
      let userId: string | null = null

      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          if (userData.name) {
            setUserName(userData.name.split(" ")[0])
          }
          userId = userData.id || null
        } catch (e) {
          console.error("Error parsing user data", e)
        }
      }

      // Si tenemos un userId, intentar obtener los resultados de la base de datos
      if (userId) {
        try {
          const { success, results } = await getDiscResults(userId)

          if (success && results) {
            // Convertir los resultados al formato esperado
            const discResults = {
              D: results.d,
              I: results.i,
              S: results.s,
              C: results.c,
            }

            setResults(discResults)

            // Determinar el tipo dominante y menos dominante
            const types = Object.entries(discResults)
            types.sort((a, b) => b[1] - a[1])

            setDominantType(types[0][0])
            setLeastDominantType(types[types.length - 1][0])

            // Generar descripción y patrón de relación
            setAnalysisDescription(obtenerDescripcionPorPerfil(types[0][0], types[types.length - 1][0]))
            setRelationshipPattern(obtenerRelacionPorPerfil(types[0][0], types[types.length - 1][0]))

            // Marcar como guardado ya que se cargó de la base de datos
            setResultsSaved(true)
            return
          }
        } catch (error) {
          console.error("Error al cargar resultados:", error)
        }
      }

      // Si no se pudieron cargar los resultados de la base de datos, intentar cargarlos del localStorage
      const storedResults = localStorage.getItem("discResults")

      if (storedResults) {
        const parsedResults = JSON.parse(storedResults) as DiscResults
        setResults(parsedResults)

        // Determinar el tipo dominante y menos dominante
        const types = Object.entries(parsedResults)
        types.sort((a, b) => b[1] - a[1])

        setDominantType(types[0][0])
        setLeastDominantType(types[types.length - 1][0])

        // Generar descripción y patrón de relación
        setAnalysisDescription(obtenerDescripcionPorPerfil(types[0][0], types[types.length - 1][0]))
        setRelationshipPattern(obtenerRelacionPorPerfil(types[0][0], types[types.length - 1][0]))

        // Guardar resultados en Supabase si hay un usuario autenticado
        if (userId) {
          const saveResultsToSupabase = async () => {
            setSavingResults(true)
            const { success } = await saveDiscResults(userId, parsedResults)
            setSavingResults(false)
            setResultsSaved(success)

            if (success) {
              toast({
                title: "Resultados guardados",
                description: "Tus resultados del test DISC han sido guardados correctamente.",
              })
            } else {
              toast({
                title: "Error al guardar resultados",
                description: "No se pudieron guardar tus resultados. Por favor, inténtalo de nuevo más tarde.",
                variant: "destructive",
              })
            }
          }

          saveResultsToSupabase()
        }
      }
    }

    loadResults()
  }, [toast])

  // Función para descargar como PDF
  const handleDownloadPDF = async () => {
    if (!resultRef.current) return

    setIsGeneratingPDF(true)

    try {
      // Importar las bibliotecas dinámicamente
      const html2canvas = await import("html2canvas")
      const jsPDF = await import("jspdf")

      // Preparar el elemento para captura
      const element = resultRef.current
      const originalDisplay = element.style.display

      // Asegurarse de que todos los elementos estén visibles
      element.style.display = "block"

      // Capturar el contenido como imagen
      const canvas = await html2canvas.default(element, {
        scale: 1.5, // Mayor calidad
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: "#ffffff",
      })

      // Restaurar el estilo original
      element.style.display = originalDisplay

      // Calcular dimensiones para el PDF
      const imgData = canvas.toDataURL("image/png")
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Crear PDF
      const pdf = new jsPDF.default("p", "mm", "a4")

      // Dividir en múltiples páginas si es necesario
      let heightLeft = imgHeight
      let position = 0

      // Primera página
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Páginas adicionales si es necesario
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Guardar PDF
      pdf.save(`Resultados_DISC_${userName}.pdf`)

      toast({
        title: "PDF generado con éxito",
        description: "Tu informe DISC ha sido descargado correctamente.",
      })
    } catch (error) {
      console.error("Error al generar PDF:", error)
      toast({
        title: "Error al generar PDF",
        description: "Hubo un problema al crear el PDF. Por favor, intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Función para imprimir
  const handlePrint = () => {
    window.print()
  }

  // Función para compartir
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mis resultados del Test DISC",
          text: `¡He completado el Test DISC! Mi perfil dominante es ${dominantType}. ¡Descubre el tuyo!`,
          url: window.location.href,
        })

        toast({
          title: "Compartido con éxito",
          description: "Has compartido tus resultados DISC.",
        })
      } catch (error) {
        console.error("Error al compartir:", error)
        // Fallback para copiar al portapapeles
        copyToClipboard()
      }
    } else {
      // Fallback para navegadores que no soportan Web Share API
      copyToClipboard()
    }
  }

  // Función para copiar al portapapeles
  const copyToClipboard = () => {
    const shareText = `¡He completado el Test DISC! Mi perfil dominante es ${dominantType}. ¡Descubre el tuyo en ${window.location.href}!`

    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        toast({
          title: "Enlace copiado",
          description: "El enlace ha sido copiado al portapapeles.",
        })
      })
      .catch((err) => {
        console.error("Error al copiar:", err)
        toast({
          title: "Error al copiar",
          description: "No se pudo copiar al portapapeles. Por favor, comparte el enlace manualmente.",
          variant: "destructive",
        })
      })
  }

  if (!results) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Resultados no disponibles</h1>
        <p className="text-muted-foreground mb-6">No se encontraron resultados del test DISC.</p>
        <Button asChild>
          <Link href="/test-disc/start">Realizar Test DISC</Link>
        </Button>
      </div>
    )
  }

  const profileDescriptions = {
    D: {
      title: "Dominante",
      description: "Eres directo, decisivo y orientado a resultados. Te gusta tomar el control y enfrentar desafíos.",
      strengths: ["Liderazgo", "Toma de decisiones rápida", "Orientación a resultados", "Determinación"],
      challenges: [
        "Puede parecer demasiado directo",
        "Impaciencia",
        "Puede ignorar detalles",
        "Resistencia a la autoridad",
      ],
      careers: ["Gerencia", "Emprendimiento", "Ventas", "Consultoría estratégica"],
      fullDescription:
        "Individuos líderes, proactivos y decididos. Orientados a resultados, toman decisiones audaces y destacan en roles que exigen dirección firme y control efectivo.",
      icon: <Zap className="h-8 w-8" />,
      color: "text-red-500",
      bgColor: "bg-red-100 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
    },
    I: {
      title: "Influyente",
      description: "Eres sociable, persuasivo y entusiasta. Te gusta interactuar con otros y expresar tus ideas.",
      strengths: ["Comunicación", "Persuasión", "Optimismo", "Construcción de relaciones"],
      challenges: ["Puede ser desorganizado", "Hablar más que escuchar", "Impulsividad", "Aversión a los detalles"],
      careers: ["Marketing", "Relaciones públicas", "Ventas", "Entretenimiento"],
      fullDescription:
        "Personas expresivas, sociables y persuasivas. Optimistas, colaboran bien en entornos sociales. Inspiradores y eficaces en roles que requieren interacción interpersonal y motivación.",
      icon: <Heart className="h-8 w-8" />,
      color: "text-yellow-500",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
    },
    S: {
      title: "Estable",
      description: "Eres paciente, leal y cooperativo. Valoras la armonía y prefieres entornos estables y predecibles.",
      strengths: ["Paciencia", "Lealtad", "Escucha activa", "Trabajo en equipo"],
      challenges: ["Resistencia al cambio", "Dificultad para decir 'no'", "Evitar conflictos", "Indecisión"],
      careers: ["Recursos humanos", "Atención al cliente", "Educación", "Trabajo social"],
      fullDescription:
        "Personalidades pacientes, leales y centradas en el equipo. Buscan armonía, son colaborativos y excelentes oyentes. Destacan en roles que demandan estabilidad emocional y trabajo en equipo.",
      icon: <Shield className="h-8 w-8" />,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
    },
    C: {
      title: "Concienzudo",
      description: "Eres analítico, preciso y sistemático. Te gusta la calidad y la exactitud en todo lo que haces.",
      strengths: ["Atención al detalle", "Análisis", "Organización", "Pensamiento crítico"],
      challenges: ["Perfeccionismo", "Excesiva autocrítica", "Resistencia a la espontaneidad", "Evitar riesgos"],
      careers: ["Finanzas", "Investigación", "Programación", "Control de calidad"],
      fullDescription:
        "Individuos detallados, analíticos y centrados en la calidad. Altamente organizados y orientados a procesos. Sobresalen en roles que exigen precisión, atención a los detalles y planificación cuidadosa.",
      icon: <Brain className="h-8 w-8" />,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
  }

  const profile = profileDescriptions[dominantType as keyof typeof profileDescriptions]
  const { emoji, color } = getProfileEmoji(dominantType)

  return (
    <div className="container py-12 md:py-20 max-w-5xl" ref={resultRef}>
      {isSavingResults && (
        <div className="mb-4 flex items-center justify-center gap-2 text-primary">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Guardando resultados...</span>
        </div>
      )}

      {resultsSaved && (
        <div className="mb-4 flex items-center justify-center gap-2 text-green-500">
          <CheckCircle className="h-4 w-4" />
          <span>Resultados guardados correctamente</span>
        </div>
      )}

      <Card className="print:shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Resultados de tu Test DISC</CardTitle>
          <CardDescription>Análisis de tu perfil de comportamiento basado en la metodología DISC</CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="mb-8">
            {/* Encabezado con saludo personalizado */}
            <div className="mb-8 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`inline-flex items-center justify-center p-4 rounded-full ${profile.bgColor} ${profile.color} mb-4`}
              >
                {profile.icon}
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">¡Hola, {userName}!</h2>
              <p className="text-muted-foreground">
                Estos son los resultados de tu test DISC. Recuerda que no hay perfiles buenos o malos, solo diferentes
                estilos de comportamiento.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
              <div className="flex-1">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={`p-6 rounded-lg border ${profile.borderColor} ${profile.bgColor} mb-6`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    {profile.icon}
                    <h3 className="text-2xl font-bold">Tu perfil dominante: {profile.title}</h3>
                  </div>
                  <p className="text-lg mb-4">{profile.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" /> Fortalezas
                      </h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {profile.strengths.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" /> Desafíos
                      </h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {profile.challenges.map((challenge, index) => (
                          <li key={index}>{challenge}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>

                <div className="bg-muted/50 p-4 rounded-lg mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Tus resultados</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>D - Dominancia:{" "}
                        {results.D}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>I - Influencia:{" "}
                        {results.I}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>S - Estabilidad:{" "}
                        {results.S}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>C - Concienzudo:{" "}
                        {results.C}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-64 bg-primary/10 rounded-lg p-4 flex flex-col items-center">
                <BarChart className="h-12 w-12 text-primary mb-2" />
                <h3 className="text-lg font-bold text-center mb-2">Técnica Cleaver</h3>
                <div className="w-full space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>D
                      </span>
                      <span>{results.D}</span>
                    </div>
                    <Progress value={(results.D / 28) * 100} className="h-2 bg-primary/20" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-yellow-500"></span>I
                      </span>
                      <span>{results.I}</span>
                    </div>
                    <Progress value={(results.I / 28) * 100} className="h-2 bg-primary/20" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>S
                      </span>
                      <span>{results.S}</span>
                    </div>
                    <Progress value={(results.S / 28) * 100} className="h-2 bg-primary/20" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>C
                      </span>
                      <span>{results.C}</span>
                    </div>
                    <Progress value={(results.C / 28) * 100} className="h-2 bg-primary/20" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4">Interpretación</h3>
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium text-primary mb-2">{relationshipPattern}</h4>
                <p className="text-muted-foreground">{analysisDescription}</p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-bold mb-6 text-center">Visualización de tu perfil DISC</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="bg-muted/20 p-4 rounded-lg">
                <h4 className="font-bold text-lg mb-4 text-center">Gráfico de Radar</h4>
                <RadarChart results={results} />
              </div>
              <div className="bg-muted/20 p-4 rounded-lg">
                <h4 className="font-bold text-lg mb-4 text-center">Distribución de Perfil</h4>
                <DonutChart results={results} />
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4 text-center">Conoce los otros perfiles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-red-500" />
                  <h4 className="font-bold text-lg text-red-500">D</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Dominante:</strong> {profileDescriptions.D.fullDescription}
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-yellow-100 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-5 w-5 text-yellow-500" />
                  <h4 className="font-bold text-lg text-yellow-500">I</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Influyente:</strong> {profileDescriptions.I.fullDescription}
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <h4 className="font-bold text-lg text-green-500">S</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Estable:</strong> {profileDescriptions.S.fullDescription}
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-5 w-5 text-blue-500" />
                  <h4 className="font-bold text-lg text-blue-500">C</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Concienzudo:</strong> {profileDescriptions.C.fullDescription}
                </p>
              </motion.div>
            </div>
          </div>

          <Tabs defaultValue="profile" className="mt-10">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Perfil Detallado</TabsTrigger>
              <TabsTrigger value="career">Carrera Profesional</TabsTrigger>
              <TabsTrigger value="communication">Comunicación</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="p-6">
              <h3 className="text-lg font-medium mb-4">Distribución de tu perfil DISC</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>D - Dominancia
                    </span>
                    <span>{Math.round((results.D / 28) * 100)}%</span>
                  </div>
                  <Progress value={(results.D / 28) * 100} className="h-3 bg-red-100 dark:bg-red-900/30" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>I - Influencia
                    </span>
                    <span>{Math.round((results.I / 28) * 100)}%</span>
                  </div>
                  <Progress value={(results.I / 28) * 100} className="h-3 bg-yellow-100 dark:bg-yellow-900/30" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>S - Estabilidad
                    </span>
                    <span>{Math.round((results.S / 28) * 100)}%</span>
                  </div>
                  <Progress value={(results.S / 28) * 100} className="h-3 bg-green-100 dark:bg-green-900/30" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>C - Concienzudo
                    </span>
                    <span>{Math.round((results.C / 28) * 100)}%</span>
                  </div>
                  <Progress value={(results.C / 28) * 100} className="h-3 bg-blue-100 dark:bg-blue-900/30" />
                </div>
              </div>
              <div className="mt-6">
                <h4 className="font-medium mb-2">Interpretación</h4>
                <p className="text-muted-foreground">
                  Tu perfil muestra una tendencia dominante hacia el tipo {profile.title}. Esto significa que tus
                  comportamientos naturales se alinean con las características de este perfil, aunque también muestras
                  rasgos de los otros tipos en diferentes proporciones.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="career" className="p-6">
              <h3 className="text-lg font-medium mb-4">Compatibilidad Profesional</h3>
              <p className="text-muted-foreground mb-4">
                Basado en tu perfil DISC, estas son algunas áreas profesionales donde podrías destacar:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                {profile.careers.map((career, index) => (
                  <li key={index}>{career}</li>
                ))}
              </ul>
              <div className="mt-6">
                <h4 className="font-medium mb-2">Ambiente de Trabajo Ideal</h4>
                <p className="text-muted-foreground">
                  Como persona con perfil {profile.title}, te desempeñas mejor en entornos que valoran tus fortalezas
                  naturales y te permiten expresar tu estilo de comportamiento preferido.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="communication" className="p-6">
              <h3 className="text-lg font-medium mb-4">Estilo de Comunicación</h3>
              <p className="text-muted-foreground mb-4">
                Tu estilo de comunicación refleja tu perfil DISC dominante. Aquí hay algunas recomendaciones para
                mejorar tu comunicación con diferentes tipos de personas:
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Con personas tipo D (Dominantes):</h4>
                  <p className="text-muted-foreground">
                    Sé directo, conciso y enfócate en resultados. Evita divagar y presenta tus ideas con confianza.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Con personas tipo I (Influyentes):</h4>
                  <p className="text-muted-foreground">
                    Sé amigable, muestra entusiasmo y permite tiempo para socializar. Reconoce sus ideas y
                    contribuciones.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Con personas tipo S (Estables):</h4>
                  <p className="text-muted-foreground">
                    Sé paciente, genuino y asegúrales que los cambios son seguros. Proporciona detalles y tiempo para
                    adaptarse.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Con personas tipo C (Concienzudos):</h4>
                  <p className="text-muted-foreground">
                    Sé preciso, lógico y bien preparado. Proporciona datos, hechos y respeta su necesidad de análisis.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 justify-center">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generando PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Descargar PDF
              </>
            )}
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            Compartir
          </Button>
          <Button asChild>
            <Link href="/dashboard">Acceder a tu Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Estilos para impresión */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #resultRef, #resultRef * {
            visibility: visible;
          }
          #resultRef {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  )
}
