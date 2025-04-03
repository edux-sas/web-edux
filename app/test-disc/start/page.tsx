"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"

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
            {error && <p className="text-sm text-red-500">{error}</p>}

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

