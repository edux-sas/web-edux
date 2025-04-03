// Función para calcular el tiempo restante para poder realizar el test nuevamente
export function getTimeUntilNextTest(lastTestDate: string | null): {
    canTakeTest: boolean
    timeRemaining: {
      days: number
      hours: number
      minutes: number
    } | null
  } {
    // Si no hay fecha del último test, puede realizarlo inmediatamente
    if (!lastTestDate) {
      return {
        canTakeTest: true,
        timeRemaining: null,
      }
    }
  
    const lastTest = new Date(lastTestDate)
    const now = new Date()
  
    // Calcular la fecha en que puede realizar el test nuevamente (15 días después)
    const nextAvailableDate = new Date(lastTest)
    nextAvailableDate.setDate(nextAvailableDate.getDate() + 15)
  
    // Verificar si ya puede realizar el test
    if (now >= nextAvailableDate) {
      return {
        canTakeTest: true,
        timeRemaining: null,
      }
    }
  
    // Calcular tiempo restante
    const diffMs = nextAvailableDate.getTime() - now.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  
    return {
      canTakeTest: false,
      timeRemaining: {
        days: diffDays,
        hours: diffHours,
        minutes: diffMinutes,
      },
    }
  }
  
  // Función para formatear el tiempo restante
  export function formatTimeRemaining(timeRemaining: { days: number; hours: number; minutes: number }): string {
    if (timeRemaining.days > 0) {
      return `${timeRemaining.days} día${timeRemaining.days !== 1 ? "s" : ""} y ${timeRemaining.hours} hora${timeRemaining.hours !== 1 ? "s" : ""}`
    } else if (timeRemaining.hours > 0) {
      return `${timeRemaining.hours} hora${timeRemaining.hours !== 1 ? "s" : ""} y ${timeRemaining.minutes} minuto${timeRemaining.minutes !== 1 ? "s" : ""}`
    } else {
      return `${timeRemaining.minutes} minuto${timeRemaining.minutes !== 1 ? "s" : ""}`
    }
  }
  
  