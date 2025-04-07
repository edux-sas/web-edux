"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { User, BarChart3, Info, GraduationCap, Zap, Heart, Shield, Brain, Clock } from "lucide-react"
import { getCurrentUser, getDiscResults } from "@/lib/supabase"
import { getTimeUntilNextTest, formatTimeRemaining } from "@/lib/disc-utils"

type UserData = {
  id?: string
  name: string
  email: string
  isLoggedIn: boolean
  moodle_username?: string // Añadido para almacenar el nombre de usuario de Moodle
}

type DiscResultData = {
  d: number
  i: number
  s: number
  c: number
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [discResults, setDiscResults] = useState<DiscResultData | null>(null)
  const [canTakeTest, setCanTakeTest] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Función para cargar los datos del usuario y resultados DISC
    const loadUserData = async () => {
      setIsLoading(true)

      // Verificar si hay un usuario en localStorage
      const storedUser = localStorage.getItem("eduXUser")
      let userData: UserData | null = null

      if (storedUser) {
        try {
          userData = JSON.parse(storedUser)
          setUser(userData)

          // Si el usuario tiene ID, intentar obtener sus resultados DISC
          if (userData.id) {
            const { success, results } = await getDiscResults(userData.id)

            if (success && results) {
              setDiscResults({
                d: results.d,
                i: results.i,
                s: results.s,
                c: results.c,
                created_at: results.created_at || new Date().toISOString(),
              })

              // Verificar si puede realizar el test nuevamente
              const { canTakeTest: canTake, timeRemaining: remaining } = getTimeUntilNextTest(results.created_at)
              setCanTakeTest(canTake)

              if (!canTake && remaining) {
                setTimeRemaining(formatTimeRemaining(remaining))
              }
            }
          }
        } catch (e) {
          console.error("Error parsing user data", e)
        }
      }

      // Si no hay usuario en localStorage, intentar obtenerlo de Supabase
      if (!userData) {
        const { success, user: supabaseUser } = await getCurrentUser()

        if (success && supabaseUser) {
          const newUserData = {
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.name || "Usuario",
            email: supabaseUser.email || "",
            isLoggedIn: true,
            moodle_username: supabaseUser.user_metadata?.moodle_username || undefined,
          }

          setUser(newUserData)
          localStorage.setItem("eduXUser", JSON.stringify(newUserData))

          // Intentar obtener resultados DISC
          const { success: discSuccess, results, error: discError } = await getDiscResults(supabaseUser.id)

          if (discSuccess && results) {
            setDiscResults({
              d: results.d,
              i: results.i,
              s: results.s,
              c: results.c,
              created_at: results.created_at || new Date().toISOString(),
            })

            // Verificar si puede realizar el test nuevamente
            const { canTakeTest: canTake, timeRemaining: remaining } = getTimeUntilNextTest(results.created_at)
            setCanTakeTest(canTake)

            if (!canTake && remaining) {
              setTimeRemaining(formatTimeRemaining(remaining))
            }
          } else if (discError && !discError.toString().includes("No se encontraron resultados")) {
            // Solo mostrar errores que no sean "No se encontraron resultados"
            console.error("Error al obtener resultados DISC:", discError)
          }
        } else {
          // No hay usuario autenticado, redirigir a login
          router.push("/iniciar-sesion")
        }
      }

      setIsLoading(false)
    }

    loadUserData()

    // Configurar un intervalo para actualizar el contador
    const interval = setInterval(() => {
      if (discResults?.created_at) {
        const { canTakeTest: canTake, timeRemaining: remaining } = getTimeUntilNextTest(discResults.created_at)
        setCanTakeTest(canTake)

        if (!canTake && remaining) {
          setTimeRemaining(formatTimeRemaining(remaining))
        } else if (canTake) {
          setTimeRemaining(null)
        }
      }
    }, 60000) // Actualizar cada minuto

    setCountdown(interval)

    return () => {
      if (countdown) {
        clearInterval(countdown)
      }
    }
  }, [router])

  // Determinar el perfil dominante
  const getDominantProfile = () => {
    if (!discResults) return null

    const profiles = [
      { type: "D", value: discResults.d, name: "Dominancia" },
      { type: "I", value: discResults.i, name: "Influencia" },
      { type: "S", value: discResults.s, name: "Estabilidad" },
      { type: "C", value: discResults.c, name: "Concienzudo" },
    ]

    profiles.sort((a, b) => b.value - a.value)
    return profiles[0]
  }

  const dominantProfile = getDominantProfile()

  // Función para obtener el icono según el tipo de perfil
  const getProfileIcon = (type: string) => {
    switch (type) {
      case "D":
        return <Zap className="h-5 w-5 text-blue-500" />
      case "I":
        return <Heart className="h-5 w-5 text-yellow-500" />
      case "S":
        return <Shield className="h-5 w-5 text-green-500" />
      case "C":
        return <Brain className="h-5 w-5 text-orange-500" />
      default:
        return <Info className="h-5 w-5 text-primary" />
    }
  }

  if (isLoading) {
    return <div className="container py-12">Cargando...</div>
  }

  if (!user) {
    return null // Router will redirect
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container py-6 md:py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Bienvenido, {user.name.split(" ")[0]}</h1>
          <p className="text-muted-foreground mt-1">Gestiona tus cursos y accede a tu perfil DISC</p>
        </div>

        <Tabs defaultValue="disc" className="space-y-6">
          <TabsList className="bg-background">
            <TabsTrigger value="disc" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Test DISC</span>
              <span className="sm:hidden">DISC</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Cursos</span>
              <span className="sm:hidden">Cursos</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Mi Perfil</span>
              <span className="sm:hidden">Perfil</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="disc" className="space-y-6">
            {discResults ? (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Resultados Test DISC</CardTitle>
                    <Badge>Profesional</Badge>
                  </div>
                  <CardDescription>
                    Test completado el {new Date(discResults.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Tu perfil dominante: {dominantProfile?.name}</h3>
                      <p className="text-muted-foreground">
                        {dominantProfile?.type === "I" &&
                          "Tu perfil DISC muestra una tendencia dominante hacia la Influencia, lo que indica que eres sociable, persuasivo y entusiasta."}
                        {dominantProfile?.type === "D" &&
                          "Tu perfil DISC muestra una tendencia dominante hacia la Dominancia, lo que indica que eres directo, decisivo y orientado a resultados."}
                        {dominantProfile?.type === "S" &&
                          "Tu perfil DISC muestra una tendencia dominante hacia la Estabilidad, lo que indica que eres paciente, leal y cooperativo."}
                        {dominantProfile?.type === "C" &&
                          "Tu perfil DISC muestra una tendencia dominante hacia el perfil Concienzudo, lo que indica que eres analítico, preciso y sistemático."}
                      </p>
                    </div>

                    <div className="grid grid-cols-4 gap-3 pt-3">
                      <div className="flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                          <Zap className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="text-xl font-bold">{discResults.d}</div>
                        <div className="text-sm text-muted-foreground">Dominancia</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-2">
                          <Heart className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div className="text-xl font-bold">{discResults.i}</div>
                        <div className="text-sm text-muted-foreground">Influencia</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
                          <Shield className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="text-xl font-bold">{discResults.s}</div>
                        <div className="text-sm text-muted-foreground">Estabilidad</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-2">
                          <Brain className="h-5 w-5 text-orange-500" />
                        </div>
                        <div className="text-xl font-bold">{discResults.c}</div>
                        <div className="text-sm text-muted-foreground">Concienzudo</div>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Aplicación práctica</h4>
                      <p className="text-sm text-muted-foreground">
                        {dominantProfile?.type === "I" &&
                          "Con tu perfil de Influencia, destacas en entornos sociales y de comunicación. Aprovecha tus habilidades para motivar a otros, generar entusiasmo en proyectos y crear conexiones. Trabaja en mantener el enfoque en los detalles y la organización."}
                        {dominantProfile?.type === "D" &&
                          "Con tu perfil de Dominancia, destacas en entornos competitivos y orientados a resultados. Aprovecha tus habilidades para tomar decisiones rápidas, enfrentar desafíos y liderar proyectos. Trabaja en desarrollar paciencia y escucha activa."}
                        {dominantProfile?.type === "S" &&
                          "Con tu perfil de Estabilidad, destacas en entornos colaborativos y de apoyo. Aprovecha tus habilidades para mantener la armonía, trabajar en equipo y ser consistente. Trabaja en adaptarte a los cambios y ser más asertivo."}
                        {dominantProfile?.type === "C" &&
                          "Con tu perfil Concienzudo, destacas en entornos que requieren precisión y análisis. Aprovecha tus habilidades para resolver problemas complejos, atender detalles y mantener altos estándares. Trabaja en ser más flexible y expresar tus ideas."}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                  <Button variant="outline" asChild>
                    <Link href="/test-disc/results">Ver informe completo</Link>
                  </Button>
                  {canTakeTest ? (
                    <Button variant="outline" asChild>
                      <Link href="/test-disc/start">Realizar nuevamente</Link>
                    </Button>
                  ) : (
                    <Button variant="outline" disabled className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Disponible en {timeRemaining}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Test DISC</CardTitle>
                  <CardDescription>Descubre tu perfil de comportamiento con el test DISC</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>
                      El test DISC es una herramienta poderosa para entender tu estilo de comportamiento y mejorar tus
                      relaciones personales y profesionales.
                    </p>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Información</AlertTitle>
                      <AlertDescription>
                        Necesitas adquirir un plan para realizar el test DISC completo y recibir un informe detallado.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-3">
                  <Button asChild>
                    <Link href="/test-disc">Ver planes</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/test-disc/demo">Probar demo gratuito</Link>
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Reemplazar el componente DiscPromoBanner con un Card informativo */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-100 dark:border-blue-900">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Descubre más sobre tu perfil DISC</h3>
                    <p className="text-muted-foreground mb-4">
                      Explora todas las características y beneficios del test DISC en nuestra página dedicada.
                    </p>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/test-disc">Ir a la página del Test DISC</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Mis Cursos</CardTitle>
                <CardDescription>Accede a tu plataforma de aprendizaje Moodle</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Plataforma de Aprendizaje</h3>
                  <p className="text-muted-foreground mb-4">
                    Todos tus cursos están disponibles en nuestra plataforma Moodle. Haz clic en el botón de abajo para
                    acceder con tus credenciales.
                  </p>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm">
                      <span className="font-medium">Usuario:</span>{" "}
                      {user?.moodle_username || user?.email?.split("@")[0] + "..."}
                      {!user?.moodle_username && (
                        <span className="text-xs text-amber-500 ml-2">
                          (El nombre de usuario exacto se muestra al iniciar sesión en Moodle)
                        </span>
                      )}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Contraseña:</span> La misma que utilizas para acceder a eduX
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <a
                    href={process.env.NEXT_PUBLIC_MOODLE_URL || "https://campus.edux.com.co"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Acceder a Moodle
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Mi Perfil</CardTitle>
                <CardDescription>Gestiona tu información personal y preferencias</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Nombre</p>
                  <p>{user.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Correo electrónico</p>
                  <p>{user.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Miembro desde</p>
                  <p>Mayo 2023</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Plan actual</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Profesional</Badge>
                    <Button variant="link" className="h-auto p-0 text-sm" asChild>
                      <Link href="/test-disc">Cambiar a Empresarial</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline">Editar perfil</Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    // Remove user from localStorage
                    localStorage.removeItem("eduXUser")

                    // También eliminar cualquier otro dato de sesión que pueda existir
                    localStorage.removeItem("discResults")
                    localStorage.removeItem("discUserId")
                    localStorage.removeItem("moodleRegistrationStatus")

                    // Sign out from Supabase
                    try {
                      const { signOutUser } = await import("@/lib/supabase")
                      await signOutUser()
                    } catch (error) {
                      console.error("Error signing out:", error)
                    }

                    // Redirect to home page
                    router.push("/")
                  }}
                >
                  Cerrar sesión
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

