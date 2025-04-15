"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir a la página de planes de DISC
    router.push("/test-disc")
  }, [router])

  return (
    <div className="container py-12 md:py-16 max-w-md">
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Crear una cuenta</CardTitle>
          <CardDescription className="text-center">
            Para registrarte en eduX, debes adquirir uno de nuestros planes.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-center mb-6">Estás siendo redirigido a nuestra página de planes...</p>
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild variant="outline">
            <Link href="/test-disc">Ir a Planes</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
