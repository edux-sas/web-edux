"use client"

import { CardFooter } from "@/components/ui/card"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  User,
  BarChart3,
  Info,
  GraduationCap,
  Zap,
  Heart,
  Shield,
  Brain,
  Clock,
  Copy,
  CheckCircle,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { getCurrentUser, getDiscResults, getUserData } from "@/lib/supabase"
import { getTimeUntilNextTest, formatTimeRemaining } from "@/lib/disc-utils"
import { useToast } from "@/components/ui/use-toast"

type UserData = {
  id?: string
  name: string
  email: string
  isLoggedIn: boolean
  moodle_username?: string
  has_completed_disc?: boolean
  purchase_date?: string
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
  const { toast } = useToast()
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [discResults, setDiscResults] = useState<DiscResultData | null>(null)
  const [canTakeTest, setCanTakeTest] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<NodeJS.Timeout | null>(null)
  const [copied, setCopied] = useState(false)
  const [checkingMoodle, setCheckingMoodle] = useState(false)
  const [moodleCheckInterval, setMoodleCheckInterval] = useState<NodeJS.Timeout | null>(null)
  const [retryingMoodle, setRetryingMoodle] = useState(false)

  // Función para verificar el nombre de usuario de Moodle
  const checkMoodleUsername = async (userId: string) => {
    if (!userId) return false

    try {
      setCheckingMoodle(true)
      const response = await fetch(`/api/moodle/check-username?userId=${userId}`)

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.moodleUsername) {
          // Actualizar el estado del usuario con el nombre de usuario de Moodle
          setUser((prevUser) => {
            if (!prevUser) return null

            const updatedUser = {
              ...prevUser,
              moodle_username: data.moodleUsername,
            }

            // Actualizar también en localStorage
            localStorage.setItem("eduXUser", JSON.stringify(updatedUser))

            return updatedUser
          })

          // Mostrar notificación
          toast({
            title: "¡Cuenta de Moodle creada!",
            description: `Tu nombre de usuario de Moodle es: ${data.moodleUsername}`,
          })

          // Detener el intervalo de verificación
          if (moodleCheckInterval) {
            clearInterval(moodleCheckInterval)
            setMoodleCheckInterval(null)
          }

          setCheckingMoodle(false)
          return true
        }
      }

      setCheckingMoodle(false)
      return false
    } catch (error) {
      console.error("Error al verificar nombre de usuario de Moodle:", error)
      setCheckingMoodle(false)
      return false
    }
  }

  // Función para iniciar el proceso de reintentos de integración con Moodle
  const retryMoodleIntegration = async () => {
    if (!user || !user.id || !user.email || !user.name) {
      toast({
        title: "Error",
        description: "No se puede iniciar el proceso de reintentos sin los datos del usuario",
        variant: "destructive",
      })
      return
    }

    try {
      setRetryingMoodle(true)

      // Solicitar al usuario su contraseña
      const password = prompt("Por favor, ingresa tu contraseña para continuar con la integración de Moodle:")

      if (!password) {
        setRetryingMoodle(false)
        return
      }

      const response = await fetch("/api/moodle/retry-integration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          password,
          name: user.name,
        }),
      })

      if (response.ok) {
        toast({
          title: "Proceso iniciado",
          description: "Se ha iniciado el proceso de integración con Moodle. Esto puede tardar unos minutos.",
        })

        // Iniciar un intervalo para verificar periódicamente si ya se creó el usuario en Moodle
        if (moodleCheckInterval) {
          clearInterval(moodleCheckInterval)
        }

        const interval = setInterval(() => {
          checkMoodleUsername(user.id!).then((success) => {
            if (success) {
              clearInterval(interval)
              setMoodleCheckInterval(null)
            }
          })
        }, 10000) // Verificar cada 10 segundos

        setMoodleCheckInterval(interval)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al iniciar el proceso de reintentos")
      }
    } catch (error) {
      console.error("Error al iniciar reintentos de Moodle:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      })
    } finally {
      setRetryingMoodle(false)
    }
  }

  useEffect(() => {
    // Función para cargar los datos del usuario y resultados DISC
    const loadUserData = async () => {
      setIsLoading(true)

      // Verificar si hay un usuario en localStorage
      const storedUser = localStorage.getItem("eduXUser")
      let userData: UserData | null = null
      let userId: string | null = null

      if (storedUser) {
        try {
          userData = JSON.parse(storedUser)
          userId = userData.id || null
          setUser(userData)
        } catch (e) {
          console.error("Error parsing user data", e)
        }
      }

      // Si no hay usuario en localStorage, intentar obtenerlo de Supabase
      if (!userData) {
        const { success, user: supabaseUser } = await getCurrentUser()

        if (success && supabaseUser) {
          userId = supabaseUser.id
          userData = {
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.name || "Usuario",
            email: supabaseUser.email || "",
            isLoggedIn: true,
            moodle_username: supabaseUser.user_metadata?.moodle_username || undefined,
          }

          setUser(userData)
          localStorage.setItem("eduXUser", JSON.stringify(userData))
        } else {
          // No hay usuario autenticado, redirigir a login
          router.push("/iniciar-sesion")
          return
        }
      }

      // Si tenemos un userId, obtener datos adicionales del usuario desde la tabla users
      if (userId) {
        const { success: userDataSuccess, userData: dbUserData } = await getUserData(userId)

        if (userDataSuccess && dbUserData) {
          // Actualizar el estado del usuario con los datos de la base de datos
          const updatedUserData = {
            ...userData,
            moodle_username: dbUserData.moodle_username || userData.moodle_username,
            has_completed_disc: dbUserData.has_completed_disc || false,
            purchase_date: dbUserData.purchase_date || userData.purchase_date,
          }

          setUser(updatedUserData)

          // Actualizar localStorage con los datos actualizados
          localStorage.setItem("eduXUser", JSON.stringify(updatedUserData))

          // Si el usuario no ha completado el test DISC, redirigir a la página del test
          if (!dbUserData.has_completed_disc) {
            toast({
              title: "Test DISC pendiente",
              description: "Debes completar el test DISC antes de acceder al dashboard",
            })
            router.push("/test-disc/start")
            return
          }
        }

        // Intentar obtener resultados DISC
        const { success: discSuccess, results } = await getDiscResults(userId)

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
        } else {
          // Si no hay resultados DISC pero el usuario debería haberlos completado, redirigir al test
          router.push("/test-disc/start")
          return
        }

        // Si el usuario no tiene un nombre de usuario de Moodle, iniciar verificación periódica
        if (!userData.moodle_username && userId) {
          // Verificar inmediatamente
          const hasMoodleUsername = await checkMoodleUsername(userId)

          // Si no tiene, configurar un intervalo para verificar periódicamente
          if (!hasMoodleUsername) {
            const interval = setInterval(() => {
              checkMoodleUsername(userId!).then((success) => {
                if (success) {
                  clearInterval(interval)
                  setMoodleCheckInterval(null)
                }
              })
            }, 30000) // Verificar cada 30 segundos

            setMoodleCheckInterval(interval)
          }
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
      if (moodleCheckInterval) {
        clearInterval(moodleCheckInterval)
      }
    }
  }, [router, toast])

  // Función para copiar el nombre de usuario de Moodle al portapapeles
  const copyMoodleUsername = () => {
    if (user?.moodle_username) {
      navigator.clipboard.writeText(user.moodle_username)
      setCopied(true)
      toast({
        title: "Nombre de usuario copiado",
        description: "El nombre de usuario de Moodle ha sido copiado al portapapeles",
      })

      // Restablecer el estado después de 2 segundos
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }

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

  if (isLoading) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Cargando información del usuario...</p>
      </div>
    )
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
                        Necesitas completar el test DISC para acceder a todas las funcionalidades del dashboard.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-3">
                  <Button asChild>
                    <Link href="/test-disc/start">Realizar Test DISC</Link>
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
                    <div className="flex items-center gap-2">
                      <p className="text-sm">
                        <span className="font-medium">Usuario:</span>{" "}
                        {user?.moodle_username ? (
                          <span className="bg-primary/10 px-2 py-1 rounded font-mono">{user.moodle_username}</span>
                        ) : (
                          <span className="text-muted-foreground">{user?.email?.split("@")[0] + "..."}</span>
                        )}
                      </p>
                      {user?.moodle_username && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={copyMoodleUsername}
                          title="Copiar nombre de usuario"
                        >
                          {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>
                    {!user?.moodle_username && (
                      <div className="flex flex-col gap-2">
                        <p className="text-xs text-amber-500">
                          {checkingMoodle ? (
                            <span className="flex items-center gap-1">
                              <Loader2 className="h-3 w-3 animate-spin" /> Verificando cuenta de Moodle...
                            </span>
                          ) : (
                            "(El nombre de usuario se mostrará al iniciar sesión en Moodle)"
                          )}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-fit flex items-center gap-2"
                          onClick={retryMoodleIntegration}
                          disabled={retryingMoodle || checkingMoodle}
                        >
                          {retryingMoodle ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                          Reintentar integración con Moodle
                        </Button>
                      </div>
                    )}
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
                  <p className="text-sm font-medium">Nombre de usuario Moodle</p>
                  {user.moodle_username ? (
                    <div className="flex items-center gap-2">
                      <p className="bg-primary/10 px-2 py-1 rounded font-mono">{user.moodle_username}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={copyMoodleUsername}
                        title="Copiar nombre de usuario"
                      >
                        {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-muted-foreground">No disponible</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-amber-500">
                          {checkingMoodle ? (
                            <span className="flex items-center gap-1">
                              <Loader2 className="h-3 w-3 animate-spin" /> Verificando cuenta de Moodle...
                            </span>
                          ) : (
                            "(El nombre de usuario se mostrará al iniciar sesión en Moodle)"
                          )}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 flex items-center gap-1 text-xs"
                          onClick={retryMoodleIntegration}
                          disabled={retryingMoodle || checkingMoodle}
                        >
                          {retryingMoodle ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3 w-3" />
                          )}
                          Reintentar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Miembro desde</p>
                  <p>
                    {new Date(user.purchase_date || Date.now()).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
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
              <CardFooter className="flex justify-end border-t pt-6">
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
