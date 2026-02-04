// Tipo para los eventos de pago
export type PaymentEvent = {
  type: string // Tipo de evento (notification_received, payment_processed, etc.)
  data: any // Datos relevantes del evento
  timestamp: string // Marca de tiempo en formato ISO
}

// Límite de eventos en memoria
const MAX_EVENTS = 1000

// Array para almacenar eventos recientes en memoria
let recentEvents: PaymentEvent[] = []

// Función para registrar eventos de pago
export function logPaymentEvent(event: PaymentEvent): void {
  // Agregar evento al inicio del array
  recentEvents.unshift(event)

  // Limitar el tamaño del array
  if (recentEvents.length > MAX_EVENTS) {
    recentEvents = recentEvents.slice(0, MAX_EVENTS)
  }

  // Imprimir en consola para monitoreo en tiempo real
  console.log(`[PAYMENT-EVENT][${event.type}] ${JSON.stringify(event.data)}`)

  // En producción, aquí podrías implementar lógica adicional:
  // 1. Guardar en base de datos
  // 2. Enviar a un servicio de monitoreo externo
  // 3. Enviar alertas en caso de errores críticos

  // Ejemplo de alerta para errores críticos
  if (event.type.includes("error") || event.type.includes("invalid")) {
    // Aquí podrías integrar con servicios como Sentry, LogRocket, etc.
    console.error(`[PAYMENT-ALERT] Error en proceso de pago: ${event.type}`, event.data)

    // También podrías enviar una notificación al equipo
    if (process.env.NODE_ENV === "production") {
      // notifyTeam(event); // Función hipotética para enviar notificaciones
    }
  }
}

// Función para obtener eventos recientes (útil para un panel de administración)
export function getRecentPaymentEvents(limit = 100): PaymentEvent[] {
  return recentEvents.slice(0, limit)
}

// Función para buscar eventos específicos
export function findPaymentEvents(criteria: {
  type?: string
  fromDate?: string
  toDate?: string
  userId?: string
  reference?: string
}): PaymentEvent[] {
  return recentEvents.filter((event) => {
    // Filtrar por tipo
    if (criteria.type && !event.type.includes(criteria.type)) {
      return false
    }

    // Filtrar por fecha
    if (criteria.fromDate && event.timestamp < criteria.fromDate) {
      return false
    }

    if (criteria.toDate && event.timestamp > criteria.toDate) {
      return false
    }

    // Filtrar por userId (si está en los datos)
    if (criteria.userId && !event.data.userId && !event.data.user_id) {
      return false
    }

    // Filtrar por referencia
    if (criteria.reference && !event.data.reference && !event.data.referenceCode && !event.data.reference_sale) {
      return false
    }

    return true
  })
}
