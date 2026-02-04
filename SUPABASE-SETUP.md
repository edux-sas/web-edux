# Configuración de Supabase para EDUX

## Problema Actual
Las tablas necesarias no existen en tu proyecto de Supabase. Esto causa los errores:
- `Could not find the table 'public.users' in the schema cache`
- `Could not find the table 'public.disc_results' in the schema cache`

## Solución: Crear las Tablas en Supabase

### Paso 1: Acceder a Supabase SQL Editor

1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión en tu cuenta
3. Selecciona tu proyecto (xrfvekijldimpzbggpdl)
4. En el menú lateral, haz clic en **SQL Editor**

### Paso 2: Ejecutar el Script SQL

1. En el SQL Editor, haz clic en **"New query"**
2. Copia y pega todo el contenido del archivo `supabase-schema.sql`
3. Haz clic en **"Run"** (o presiona Ctrl+Enter)
4. Espera a que se ejecute completamente (debería decir "Success")

### Paso 3: Verificar las Tablas

1. En el menú lateral de Supabase, haz clic en **Table Editor**
2. Deberías ver las siguientes tablas:
   - ✅ `users`
   - ✅ `payment_transactions`
   - ✅ `disc_results`
   - ✅ `contact_messages`

### Paso 4: Reiniciar la Aplicación

Después de crear las tablas, reinicia tu servidor de desarrollo:

```bash
# Detener el servidor (Ctrl+C)
# Iniciar nuevamente
npm run dev
# o
pnpm dev
```

## Estructura de las Tablas

### Tabla `users`
Almacena información de los usuarios registrados:
- Datos personales (nombre, email, teléfono, dirección)
- Información del plan y pago
- Estado del test DISC
- Credenciales de Moodle

### Tabla `payment_transactions`
Registra todas las transacciones de pago:
- ID de transacción
- Código de referencia
- Monto y moneda
- Estado del pago
- Respuesta completa del procesador de pagos

### Tabla `disc_results`
Almacena los resultados del test DISC:
- Puntuaciones D, I, S, C
- Fecha de realización
- Relación con el usuario

### Tabla `contact_messages`
Guarda mensajes del formulario de contacto:
- Datos del contacto
- Mensaje
- Estado de procesamiento
- Si se envió email

## Seguridad (RLS - Row Level Security)

El script incluye políticas de seguridad para:
- ✅ Los usuarios solo pueden ver sus propios datos
- ✅ Los usuarios solo pueden actualizar su propia información
- ✅ Las operaciones administrativas requieren service_role
- ✅ Los mensajes de contacto son públicos para inserción

## Verificación de Conexión

Una vez creadas las tablas, verifica que todo funciona:

1. Ve a `http://localhost:3000/api/check-env`
2. Deberías ver que todas las configuraciones están correctas
3. Intenta registrarte nuevamente en el checkout

## Problemas Comunes

### Error: "relation does not exist"
- **Solución**: Asegúrate de ejecutar todo el script SQL

### Error: "permission denied"
- **Solución**: Verifica que estás usando el `SUPABASE_SERVICE_ROLE_KEY` correcto en tu `.env`

### Error: "schema cache"
- **Solución**: Espera unos segundos después de crear las tablas y recarga la página

## Contacto

Si después de seguir estos pasos aún tienes problemas, verifica:
1. Que el proyecto de Supabase esté activo (no pausado)
2. Que las credenciales en `.env` sean correctas
3. Que no haya errores de red o firewall
