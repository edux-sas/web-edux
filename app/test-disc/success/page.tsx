"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, AlertCircle, GraduationCap } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function SuccessPage() {
  const router = useRouter()
  const [moodleStatus, setMoodleStatus] = useState<{
    success: boolean
    message: string
    username?: string
    enrollments?: Array<{
      courseId: number
      courseName: string
      success: boolean
      error?: string
    }>
  } | null>(null)

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
  }, [])

  return (
    <div className="container py-12 max-w-md">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">¡Pago Exitoso!</CardTitle>
          <CardDescription>Tu compra del Test DISC ha sido procesada correctamente</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Hemos creado tu cuenta con los datos proporcionados. Ya puedes acceder a tu test DISC y a todos los
            beneficios de tu plan.
          </p>
          <div className="bg-muted p-4 rounded-md text-left mb-4">
            <p className="font-medium">Detalles de la compra:</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <span className="text-muted-foreground">Producto:</span> Test DISC Profesional
              </li>
              <li>
                <span className="text-muted-foreground">Fecha:</span> {new Date().toLocaleDateString()}
              </li>
              <li>
                <span className="text-muted-foreground">ID de Transacción:</span> TRX-
                {Math.random().toString(36).substring(2, 10).toUpperCase()}
              </li>
            </ul>
          </div>

          {/* Mostrar estado de Moodle si está disponible */}
          {moodleStatus && (
            <div
              className={`p-3 rounded-md text-sm mb-4 ${moodleStatus.success ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}
            >
              <div className="flex items-start gap-2">
                {moodleStatus.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <p>
                    {moodleStatus.success
                      ? "Tu cuenta de la plataforma de cursos ha sido creada correctamente."
                      : "Tu cuenta ha sido creada, pero hubo un problema con la plataforma de cursos. Nuestro equipo lo resolverá pronto."}
                  </p>
                  {moodleStatus.username && (
                    <p className="mt-2 font-medium">
                      Tu nombre de usuario para la plataforma Moodle es:{" "}
                      <span className="text-primary">{moodleStatus.username}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mostrar información sobre cursos inscritos */}
          {moodleStatus?.enrollments && moodleStatus.enrollments.length > 0 && (
            <div className="bg-blue-50 p-3 rounded-md text-sm mb-4 text-blue-700">
              <div className="flex items-start gap-2">
                <GraduationCap className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">¡Has sido inscrito automáticamente en los siguientes cursos!</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {moodleStatus.enrollments.map((enrollment, index) => (
                      <li key={index} className="flex items-center gap-1">
                        {enrollment.success ? (
                          <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-amber-500 shrink-0" />
                        )}
                        <span>{enrollment.courseName}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2">
                    Puedes acceder a estos cursos desde tu dashboard o directamente en la plataforma Moodle.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/test-disc/start">Comenzar Test DISC</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

