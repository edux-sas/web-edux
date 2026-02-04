"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [productName, setProductName] = useState("")
  const [purchaseDate, setPurchaseDate] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [moodleError, setMoodleError] = useState(false)
  const [showMoodleError, setShowMoodleError] = useState(false)

  useEffect(() => {
    // Intentar obtener el estado de la sincronización con Moodle desde localStorage
    const storedMoodleStatus = localStorage.getItem("moodleRegistrationStatus")

    if (storedMoodleStatus) {
      try {
        const parsedStatus = JSON.parse(storedMoodleStatus)
        setMoodleStatus(parsedStatus)

        // Mostrar en consola el estado de la creación del usuario en Moodle
        if (parsedStatus.success) {
          console.log("✅ Usuario creado correctamente en Moodle:", parsedStatus.message)

          // Si hay un nombre de usuario de Moodle, actualizarlo en el usuario actual
          if (parsedStatus.username) {
            const userData = JSON.parse(localStorage.getItem("eduXUser") || "{}")
            userData.moodle_username = parsedStatus.username
            localStorage.setItem("eduXUser", JSON.stringify(userData))
          }
        } else {
          console.error("❌ Error al crear usuario en Moodle:", parsedStatus.message)
        }
      } catch (e) {
        console.error("Error al parsear el estado de Moodle:", e)
      }
    }

    // Obtener el parámetro moodleError
    const moodleErrorParam = searchParams.get("moodleError")
    setMoodleError(moodleErrorParam === "true")
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="rounded-full bg-green-100 dark:bg-green-900 p-6 mb-6 relative">
          <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto" />
          {moodleError && (
            <div className="absolute top-2 right-2">
              <AlertCircle 
                className="h-6 w-6 text-yellow-600 cursor-pointer hover:text-yellow-700 transition-colors" 
                onClick={() => setShowMoodleError(!showMoodleError)}
                title="Hay un problema con la plataforma de cursos"
              />
            </div>
          )}
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-4">¡Pago Exitoso!</h1>
        <p className="text-center text-muted-foreground mb-8">
          Tu compra del Test DISC ha sido procesada correctamente
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Tu cuenta ha sido creada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Hemos creado tu cuenta con los datos proporcionados. Ya puedes acceder a tu test DISC y a todos los beneficios de tu plan.
            </p>
            
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Producto:</span>
              <span className="font-medium">{productName}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Fecha:</span>
              <span className="font-medium">{purchaseDate}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">ID de Transacción:</span>
              <span className="font-medium">{transactionId}</span>
            </div>
          </CardContent>
        </Card>

        {moodleError && showMoodleError && (
          <Alert variant="default" className="mb-6 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800 dark:text-yellow-200">Información Importante</AlertTitle>
            <AlertDescription className="text-yellow-700 dark:text-yellow-300">
              Tu cuenta ha sido creada, pero hubo un problema con la plataforma de cursos. Nuestro equipo lo resolverá pronto.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-4">
          <Button onClick={() => router.push("/test-disc/start")} className="flex-1">
            Comenzar Test DISC
          </Button>
          <Button onClick={() => router.push("/dashboard")} variant="outline" className="flex-1">
            Ir al Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
