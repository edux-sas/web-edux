"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { Eye, EyeOff, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Check if user exists in localStorage (for demo purposes)
    const storedUser = localStorage.getItem("eduXUser")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      if (userData.email === email) {
        userData.isLoggedIn = true
        localStorage.setItem("eduXUser", JSON.stringify(userData))
        router.push("/dashboard")
        return
      }
    }

    // Create a demo user if no user found
    const demoUser = {
      name: "Usuario Demo",
      email: email,
      isLoggedIn: true,
    }
    localStorage.setItem("eduXUser", JSON.stringify(demoUser))
    router.push("/dashboard")
  }

  return (
    <div className="container py-12 md:py-16 max-w-md">
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Iniciar sesión</CardTitle>
          <CardDescription className="text-center">Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? "text" : "password"} required />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <Button variant="link" className="p-0 h-auto font-normal text-sm" asChild>
                <Link href="/recuperar-contrasena">¿Olvidaste tu contraseña?</Link>
              </Button>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground text-center">o continúa con</div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <Button variant="outline">Google</Button>
            <Button variant="outline">Facebook</Button>
          </div>
          <div className="text-sm text-center mt-4">
            ¿No tienes una cuenta?{" "}
            <Link href="/registro" className="text-primary hover:underline">
              Regístrate
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

