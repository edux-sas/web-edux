"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function MoodleTestPanel() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [action, setAction] = useState<string>("test_connection")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [firstname, setFirstname] = useState<string>("")
  const [lastname, setLastname] = useState<string>("")

  const handleTest = async () => {
    setLoading(true)
    setResult(null)

    try {
      const payload: any = { action }

      if (action === "check_user" || action === "create_user") {
        payload.email = email
      }

      if (action === "create_user") {
        payload.password = password
        payload.firstname = firstname
        payload.lastname = lastname
      }

      const response = await fetch("/api/moodle/test-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Prueba de API de Moodle</CardTitle>
        <CardDescription>
          Utiliza esta herramienta para probar la conexión con Moodle y verificar que las funciones de la API estén
          funcionando correctamente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="action">Acción</Label>
            <select
              id="action"
              className="w-full p-2 border rounded"
              value={action}
              onChange={(e) => setAction(e.target.value)}
            >
              <option value="test_connection">Probar conexión</option>
              <option value="check_user">Verificar usuario</option>
              <option value="create_user">Crear usuario</option>
            </select>
          </div>

          {(action === "check_user" || action === "create_user") && (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@ejemplo.com"
              />
            </div>
          )}

          {action === "create_user" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstname">Nombre</Label>
                <Input
                  id="firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  placeholder="Nombre"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Apellido</Label>
                <Input
                  id="lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Apellido"
                />
              </div>
            </>
          )}

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              <div className="flex items-center gap-2">
                {result.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>{result.success ? "Éxito" : "Error"}</AlertTitle>
              </div>
              <AlertDescription className="mt-2">
                {result.message || result.error}
                {result.username && <div className="mt-1 font-semibold">Usuario: {result.username}</div>}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleTest} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Probando...
            </>
          ) : (
            "Ejecutar prueba"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
