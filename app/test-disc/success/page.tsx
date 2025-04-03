import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function SuccessPage() {
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
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/test-disc/start">Comenzar Test DISC</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard">Ir a mi Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

