export interface RateLimitOptions {
    interval: number
    uniqueTokenPerInterval: number
  }
  
  interface RateLimitManager {
    timestamp: number
    tokens: {
      [token: string]: number
    }
  }
  
  export function rateLimit(options: RateLimitOptions) {
    const managers: RateLimitManager[] = []
  
    return {
      check: (limit: number, token: string) =>
        new Promise<void>((resolve, reject) => {
          const now = Date.now()
  
          // Limpiar managers antiguos
          while (managers.length && now - managers[0].timestamp > options.interval) {
            managers.shift()
          }
  
          // Crear un nuevo manager si es necesario
          if (!managers.length) {
            managers.push({
              timestamp: now,
              tokens: {},
            })
          }
  
          // Obtener el manager actual
          const manager = managers[managers.length - 1]
  
          // Inicializar contador para el token si no existe
          if (!manager.tokens[token]) {
            manager.tokens[token] = 0
          }
  
          // Incrementar contador
          manager.tokens[token]++
  
          // Verificar si se ha excedido el límite
          if (manager.tokens[token] > limit) {
            return reject(new Error("Rate limit exceeded"))
          }
  
          // Si todo está bien, resolver la promesa
          return resolve()
        }),
    }
  }
  
  