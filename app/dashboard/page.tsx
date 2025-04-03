"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { User, BarChart3, Info, GraduationCap, Zap, Heart, Shield, Brain } from "lucide-react"

type UserData = {
  name: string
  email: string
  isLoggedIn: boolean
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("eduXUser")

    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push("/iniciar-sesion")
    }

    setIsLoading(false)
  }, [router])

  // Sample DISC test results data
  const discTestData = {
    completed: true,
    plan: "Profesional",
    date: "15/05/2023",
    profile: "Influencia",
    scores: {
      D: 3,
      I: 5,
      S: 2,
      C: 2,
    },
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
            {discTestData.completed ? (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Resultados Test DISC</CardTitle>
                    <Badge>{discTestData.plan}</Badge>
                  </div>
                  <CardDescription>Test completado el {discTestData.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Tu perfil dominante: {discTestData.profile}</h3>
                      <p className="text-muted-foreground">
                        Tu perfil DISC muestra una tendencia dominante hacia la Influencia, lo que indica que eres
                        sociable, persuasivo y entusiasta.
                      </p>
                    </div>

                    <div className="grid grid-cols-4 gap-3 pt-3">
                      <div className="flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                          <Zap className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="text-xl font-bold">{discTestData.scores.D}</div>
                        <div className="text-sm text-muted-foreground">Dominancia</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-2">
                          <Heart className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div className="text-xl font-bold">{discTestData.scores.I}</div>
                        <div className="text-sm text-muted-foreground">Influencia</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
                          <Shield className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="text-xl font-bold">{discTestData.scores.S}</div>
                        <div className="text-sm text-muted-foreground">Estabilidad</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-2">
                          <Brain className="h-5 w-5 text-orange-500" />
                        </div>
                        <div className="text-xl font-bold">{discTestData.scores.C}</div>
                        <div className="text-sm text-muted-foreground">Concienzudo</div>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Aplicación práctica</h4>
                      <p className="text-sm text-muted-foreground">
                        Con tu perfil de Influencia, destacas en entornos sociales y de comunicación. Aprovecha tus
                        habilidades para motivar a otros, generar entusiasmo en proyectos y crear conexiones. Trabaja en
                        mantener el enfoque en los detalles y la organización.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                  <Button variant="outline" asChild>
                    <Link href="/test-disc/results">Ver informe completo</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/test-disc/start">Realizar nuevamente</Link>
                  </Button>
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
                      <span className="font-medium">Usuario:</span> {user?.email}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Contraseña:</span> La misma que utilizas para acceder a eduX
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <a href="https://moodle.edux.com.co" target="_blank" rel="noopener noreferrer">
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
                  onClick={() => {
                    localStorage.removeItem("eduXUser")
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

