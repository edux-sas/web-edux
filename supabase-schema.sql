-- ============================================
-- Script de creación de tablas para EDUX
-- Ejecutar este script en Supabase SQL Editor
-- ============================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    document TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'CO',
    postal_code TEXT,
    plan TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    purchase_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    amount NUMERIC(10, 2) NOT NULL,
    transaction_id TEXT,
    reference_code TEXT,
    has_completed_disc BOOLEAN DEFAULT FALSE,
    last_payment_update TIMESTAMPTZ,
    user_metadata JSONB,
    last_login TIMESTAMPTZ,
    plan_expiry_date TIMESTAMPTZ,
    moodle_username TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para la tabla users
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_transaction_id ON public.users(transaction_id);
CREATE INDEX IF NOT EXISTS idx_users_reference_code ON public.users(reference_code);
CREATE INDEX IF NOT EXISTS idx_users_moodle_username ON public.users(moodle_username);

-- Tabla de transacciones de pago
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    transaction_id TEXT NOT NULL,
    reference_code TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'COP',
    payment_method TEXT,
    payment_status TEXT NOT NULL,
    payment_response JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para la tabla payment_transactions
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON public.payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_transaction_id ON public.payment_transactions(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_reference_code ON public.payment_transactions(reference_code);

-- Tabla de resultados del test DISC
CREATE TABLE IF NOT EXISTS public.disc_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    d INTEGER NOT NULL,
    i INTEGER NOT NULL,
    s INTEGER NOT NULL,
    c INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para la tabla disc_results
CREATE INDEX IF NOT EXISTS idx_disc_results_user_id ON public.disc_results(user_id);
CREATE INDEX IF NOT EXISTS idx_disc_results_created_at ON public.disc_results(created_at DESC);

-- Tabla de mensajes de contacto
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    email_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para la tabla contact_messages
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON public.contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_processed ON public.contact_messages(processed);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_transactions_updated_at ON public.payment_transactions;
CREATE TRIGGER update_payment_transactions_updated_at
    BEFORE UPDATE ON public.payment_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON public.contact_messages;
CREATE TRIGGER update_contact_messages_updated_at
    BEFORE UPDATE ON public.contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Políticas de seguridad RLS (Row Level Security)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disc_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla users
-- Los usuarios pueden ver y actualizar solo sus propios datos
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
CREATE POLICY "Users can view own data" 
    ON public.users FOR SELECT 
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own data" ON public.users;
CREATE POLICY "Users can update own data" 
    ON public.users FOR UPDATE 
    USING (auth.uid() = id);

-- Permitir todas las operaciones para service role (bypass RLS cuando sea necesario)
DROP POLICY IF EXISTS "Service role full access users" ON public.users;
CREATE POLICY "Service role full access users" 
    ON public.users FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Políticas para la tabla payment_transactions
-- Los usuarios pueden ver solo sus propias transacciones
DROP POLICY IF EXISTS "Users can view own transactions" ON public.payment_transactions;
CREATE POLICY "Users can view own transactions" 
    ON public.payment_transactions FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role full access transactions" ON public.payment_transactions;
CREATE POLICY "Service role full access transactions" 
    ON public.payment_transactions FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Políticas para la tabla disc_results
-- Los usuarios pueden ver y crear sus propios resultados
DROP POLICY IF EXISTS "Users can view own results" ON public.disc_results;
CREATE POLICY "Users can view own results" 
    ON public.disc_results FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own results" ON public.disc_results;
CREATE POLICY "Users can insert own results" 
    ON public.disc_results FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role full access disc_results" ON public.disc_results;
CREATE POLICY "Service role full access disc_results" 
    ON public.disc_results FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Políticas para la tabla contact_messages
-- Cualquiera puede insertar mensajes de contacto
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can insert contact messages" 
    ON public.contact_messages FOR INSERT 
    WITH CHECK (true);

-- Service role tiene acceso completo a mensajes
DROP POLICY IF EXISTS "Service role full access messages" ON public.contact_messages;
CREATE POLICY "Service role full access messages" 
    ON public.contact_messages FOR ALL 
    USING (true)
    WITH CHECK (true);

-- ============================================
-- Datos de ejemplo (opcional, comentado)
-- ============================================

-- Comentar estas líneas si no desea datos de ejemplo
-- INSERT INTO public.users (id, name, email, plan, payment_status, amount)
-- VALUES 
--     (gen_random_uuid(), 'Usuario Test', 'test@example.com', 'professional', 'APPROVED', 169000);
