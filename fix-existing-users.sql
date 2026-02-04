-- ============================================
-- Script para sincronizar usuarios de auth.users a public.users
-- Ejecutar DESPUÉS de crear las tablas
-- ============================================

-- Este script inserta en public.users todos los usuarios que existen en auth.users
-- pero que aún no tienen registro en public.users

INSERT INTO public.users (
    id,
    name,
    email,
    plan,
    payment_status,
    purchase_date,
    amount,
    transaction_id,
    reference_code,
    has_completed_disc,
    user_metadata,
    created_at,
    updated_at
)
SELECT 
    au.id,
    COALESCE((au.raw_user_meta_data->>'name')::TEXT, 'Usuario Sin Nombre'),
    au.email,
    COALESCE((au.raw_user_meta_data->>'plan')::TEXT, 'basic'),
    COALESCE((au.raw_user_meta_data->>'payment_status')::TEXT, 'PENDING'),
    COALESCE((au.raw_user_meta_data->>'purchase_date')::TIMESTAMPTZ, au.created_at),
    COALESCE((au.raw_user_meta_data->>'amount')::NUMERIC, 0),
    (au.raw_user_meta_data->>'transaction_id')::TEXT,
    (au.raw_user_meta_data->>'reference_code')::TEXT,
    false,
    au.raw_user_meta_data,
    au.created_at,
    au.updated_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- Verificar cuántos usuarios se sincronizaron
SELECT 
    COUNT(*) as total_usuarios_sincronizados
FROM public.users;
