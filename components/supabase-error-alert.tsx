import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

type SupabaseErrorAlertProps = {
  error: string
}

export function SupabaseErrorAlert({ error }: SupabaseErrorAlertProps) {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error de conexión con Supabase</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
}
