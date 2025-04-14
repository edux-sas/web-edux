import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Create Supabase client with anonymous key (for client-side)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create Supabase admin client with service role key (for server-side)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Types for payment transactions
export type PaymentTransaction = {
  id?: string
  user_id: string
  reference_code: string
  amount: number
  currency: string
  payment_method: string
  status: string
  transaction_id?: string
  response_code?: string
  response_message?: string
  created_at?: string
}

/**
 * Save payment transaction to Supabase
 */
export async function savePaymentTransaction(transaction: Omit<PaymentTransaction, "id" | "created_at">): Promise<{
  success: boolean
  data?: PaymentTransaction
  error?: string
}> {
  try {
    const { data, error } = await supabaseAdmin.from("payment_transactions").insert([transaction]).select()

    if (error) {
      console.error("Error saving payment transaction:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data[0] }
  } catch (error) {
    console.error("Error in savePaymentTransaction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Update payment transaction status
 */
export async function updatePaymentTransactionStatus(
  referenceCode: string,
  status: string,
  transactionId?: string,
  responseCode?: string,
  responseMessage?: string,
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const updateData: Partial<PaymentTransaction> = {
      status,
    }

    if (transactionId) updateData.transaction_id = transactionId
    if (responseCode) updateData.response_code = responseCode
    if (responseMessage) updateData.response_message = responseMessage

    const { error } = await supabaseAdmin
      .from("payment_transactions")
      .update(updateData)
      .eq("reference_code", referenceCode)

    if (error) {
      console.error("Error updating payment transaction:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in updatePaymentTransactionStatus:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Get payment transaction by reference code
 */
export async function getPaymentTransactionByReference(referenceCode: string): Promise<{
  success: boolean
  data?: PaymentTransaction
  error?: string
}> {
  try {
    const { data, error } = await supabaseAdmin
      .from("payment_transactions")
      .select("*")
      .eq("reference_code", referenceCode)
      .single()

    if (error) {
      console.error("Error getting payment transaction:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getPaymentTransactionByReference:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Get user payment transactions
 */
export async function getUserPaymentTransactions(userId: string): Promise<{
  success: boolean
  data?: PaymentTransaction[]
  error?: string
}> {
  try {
    const { data, error } = await supabaseAdmin
      .from("payment_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error getting user payment transactions:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getUserPaymentTransactions:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
