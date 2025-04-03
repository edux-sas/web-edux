"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Clock, AlertCircle } from "lucide-react"
import { getCurrentUser, getDiscResults } from "@/lib/supabase"
import { getTimeUntilNextTest, formatTimeRemaining } from "@/lib/disc-utils"
import Link from "next/link"

// Palabras para el test DISC
const palabras = [
  ["Rápido", "Entusiasta", "Apacible", "Lógico"],
  ["Decidido", "Receptivo", "Bondadoso", "Cauteloso"],
  ["Franco", "Amigable", "Tranquilo", "Preciso"],
  ["Decisivo", "Elocuente", "Tolerante", "Controlado"],
  ["Atrevido", "Comunicativo", "Moderado", "Concienzudo"],
  ["Acepta riesgos", "Ingenioso", "Ameno", "Investigador"],
  ["Dominante", "Expresivo", "Sensible", "Cuidadoso"],
  ["Impaciente", "Extrovertido", "Constante", "Precavido"],
  ["Insistente", "Encantador", "Complaciente", "Discreto"],
  ["Valeroso", "Anima a los demás", "Pacífico", "Perfeccionista"],
  ["Osado", "Alegre", "Atento", "Reservado"],
  ["Independiente", "Estimulante", "Gentil", "Perceptivo"],
  ["Competitivo", "Alegre", "Considerado", "Sagaz"],
  ["Ideas firmes", "Alentador", "Obediente", "Meticuloso"],
  ["Tenaz", "Popular", "Calmado", "Reflexivo"],
  ["Audaz", "Promotor", "Leal", "Analítico"],
  ["Autosuficiente", "Sociable", "Paciente", "Certero"],
  ["Adaptable", "Vivaz", "Resuelto", "Prevenido"],
  ["Agresivo", "Impetuoso", "Amistoso", "Discerniente"],
  ["Habla directo", "De trato fácil", "Compasivo", "Cauto"],
  ["Persistente", "Animado", "Generoso", "Evaluador"],
  ["Energico", "Implulsivo", "Tranquilo", "Cuida los detalles"],
  ["Vigoroso", "Tolerante", "Sociable", "Sistemático"],
  ["Exigente", "Cautivador", "Contento", "Apegado a la norma"],
  ["Le agrada discutir", "Comedido", "Métodico", "Desenvuelto"],
  ["Directo", "Jovial", "Ecuánime", "Preciso"],
  ["Inquieto", "Elocuente", "Amable", "Cuidadoso"],
  ["Pionero", "Espontáneo", "Colaborador", "Prudente"],
]

export default function TestDiscStart() {
  const router = useRouter()
  const [indiceGrupoActual, setIndiceGrupoActual] = useState(0)
  const [selecciones, setSelecciones] = useState({
    mas: Array(palabras.length).fill(null),
    menos: Array(palabras.length).fill(null),
  })
  const [puntajes, setPuntajes] = useState({
    d: 0,
    i: 0,
    s: 0,
    c: 0,
    d2: 0,
    i2: 0,
    s2: 0,
    c2: 0,
    d3: 0,
    i3: 0,
    s3: 0,
    c3: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [canTakeTest, setCanTakeTest] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null)
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(true)

  // Verificar si el usuario puede realizar el test
  useEffect(() => {
    const checkEligibility = async () => {
      setIsCheckingEligibility(true)

      // Intentar obtener el usuario del localStorage primero
      const storedUser = localStorage.getItem("eduXUser")
      let currentUserId = null

      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          if (userData.id) {
            currentUserId = userData.id
            setUserId(userData.id)
          }
        } catch (e) {
          console.error("Error parsing user data", e)
        }
      }

      // Si no hay usuario en localStorage, intentar obtenerlo de Supabase
      if (!currentUserId) {
        const { success, user } = await getCurrentUser()
        if (success && user) {
          currentUserId = user.id
          setUserId(user.id)
        } else {
          // No hay usuario autenticado, redirigir a login
          router.push("/iniciar-sesion")
          return
        }
      }

      // Verificar si el usuario ya ha realizado un test
      if (currentUserId) {
        const { success, results } = await getDiscResults(currentUserId)

        if (success && results && results.created_at) {
          // Verificar si puede realizar el test nuevamente
          const { canTakeTest: canTake, timeRemaining: remaining } = getTimeUntilNextTest(results.created_at)
          setCanTakeTest(canTake)

          if (!canTake && remaining) {
            setTimeRemaining(formatTimeRemaining(remaining))
          }
        }
      }

      setIsCheckingEligibility(false)
    }

    checkEligibility()
  }, [router])

  const handleSelectionChange = (tipo, index) => {
    setSelecciones((prevSelecciones) => ({
      ...prevSelecciones,
      [tipo]: prevSelecciones[tipo].map((seleccion, idx) =>
        idx === indiceGrupoActual ? (seleccion === index ? null : index) : seleccion,
      ),
      [tipo === "mas" ? "menos" : "mas"]: prevSelecciones[tipo === "mas" ? "menos" : "mas"].map((seleccion, idx) =>
        idx === indiceGrupoActual && seleccion === index ? null : seleccion,
      ),
    }))
  }

  const handleNextClick = async () => {
    // Verificar si el usuario ha seleccionado una opción en "más como yo" y una en "menos como yo"
    const seleccionMas = selecciones.mas[indiceGrupoActual]
    const seleccionMenos = selecciones.menos[indiceGrupoActual]

    if (seleccionMas === null || seleccionMenos === null) {
      setError("Debes seleccionar una opción en 'Más como yo' y una en 'Menos como yo'")
      return
    }

    setError("")

    // Mapear las selecciones a las claves correspondientes
    const keys = ["d", "i", "s", "c"]
    const keys2 = ["d2", "i2", "s2", "c2"]
    const keys3 = ["d3", "i3", "s3", "c3"]

    // Actualizar los puntajes basados en la selección 'más'
    setPuntajes((prevPuntajes) => ({
      ...prevPuntajes,
      [keys[seleccionMas]]: prevPuntajes[keys[seleccionMas]] + 1,
      [keys2[seleccionMas]]: prevPuntajes[keys2[seleccionMas]] + 1,
      [keys3[seleccionMas]]: prevPuntajes[keys3[seleccionMas]] + 1,
    }))

    // Actualizar los puntajes basados en la selección 'menos'
    setPuntajes((prevPuntajes) => ({
      ...prevPuntajes,
      [keys[seleccionMenos]]: prevPuntajes[keys[seleccionMenos]] + 1,
      [keys2[seleccionMenos]]: prevPuntajes[keys2[seleccionMenos]] + 1,
      [keys3[seleccionMenos]]: prevPuntajes[keys3[seleccionMenos]] - 1,
    }))

    // Verificar si el test ha concluido
    if (indiceGrupoActual < palabras.length - 1) {
      setIndiceGrupoActual((prev) => prev + 1)
    } else {
      // Guardar resultados y navegar a la página de resultados
      await guardarResultados()
    }
  }

  const guardarResultados = async () => {
    setLoading(true)
    try {
      // Simular procesamiento del test
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Calcular resultados finales
      const results = {
        D: puntajes.d + puntajes.d2 + puntajes.d3,
        I: puntajes.i + puntajes.i2 + puntajes.i3,
        S: puntajes.s + puntajes.s2 + puntajes.s3,
        C: puntajes.c + puntajes.c2 + puntajes.c3,
      }

      // Guardar resultados en localStorage para la página de resultados
      localStorage.setItem("discResults", JSON.stringify(results))

      // Guardar el ID del usuario si está disponible
      if (userId) {
        localStorage.setItem("discUserId", userId)
      }

      // Redirigir a la página de resultados
      router.push("/test-disc/results")
    } catch (error) {
      console.error("Error al guardar los resultados:", error)
      setError("Hubo un error al procesar tus resultados. Por favor, intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const grupoPalabrasActual = palabras[indiceGrupoActual]
  const progreso = ((indiceGrupoActual + 1) / palabras.length) * 100

  if (isCheckingEligibility) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Verificando elegibilidad</h1>
        <p className="text-muted-foreground mb-6">
          Por favor espera mientras verificamos si puedes realizar el test...
        </p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!canTakeTest) {
    return (
      <div className="container py-12 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Test DISC no disponible</CardTitle>
            <CardDescription>Debes esperar antes de poder realizar el test nuevamente</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="warning" className="mb-6">
              <Clock className="h-4 w-4" />
              <AlertTitle>Tiempo de espera</AlertTitle>
              <AlertDescription>
                Para mantener la precisión de los resultados, debes esperar {timeRemaining} antes de poder realizar el
                test nuevamente.
              </AlertDescription>
            </Alert>
            <p className="text-muted-foreground">Puedes revisar tus resultados anteriores mientras tanto.</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/dashboard">Volver al Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/test-disc/results">Ver resultados anteriores</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Test DISC</CardTitle>
          <CardDescription>
            Elige dos opciones y marca una como "Más como yo" y otra como "Menos como yo" según tu personalidad, siendo
            sincero y espontáneo sin pensar demasiado.
          </CardDescription>
          <Progress value={progreso} className="mt-4" />
          <p className="text-sm text-muted-foreground mt-2">
            Pregunta {indiceGrupoActual + 1} de {palabras.length}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 gap-4">
              {grupoPalabrasActual.map((palabra, index) => (
                <div key={index} className="flex items-center justify-between border rounded-md p-3">
                  <span className="font-medium">{palabra}</span>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id={`mas-${index}`}
                        name={`grupo-${indiceGrupoActual}-mas`}
                        checked={selecciones.mas[indiceGrupoActual] === index}
                        onChange={() => handleSelectionChange("mas", index)}
                        className="h-4 w-4 text-primary"
                      />
                      <Label htmlFor={`mas-${index}`} className="text-sm">
                        Más como yo
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id={`menos-${index}`}
                        name={`grupo-${indiceGrupoActual}-menos`}
                        checked={selecciones.menos[indiceGrupoActual] === index}
                        onChange={() => handleSelectionChange("menos", index)}
                        className="h-4 w-4 text-primary"
                      />
                      <Label htmlFor={`menos-${index}`} className="text-sm">
                        Menos como yo
                      </Label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              if (indiceGrupoActual > 0) {
                setIndiceGrupoActual(indiceGrupoActual - 1)
              }
            }}
            disabled={indiceGrupoActual === 0 || loading}
          >
            Anterior
          </Button>
          <Button onClick={handleNextClick} disabled={loading}>
            {loading ? "Procesando..." : indiceGrupoActual === palabras.length - 1 ? "Finalizar" : "Siguiente"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

