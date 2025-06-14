import { supabase, supabaseClient, type Payment } from "./supabase"
import { v4 as uuidv4 } from "uuid"

// Create a new payment in the database
export async function createPayment(
  amount: number,
  token: "ETH" | "USDC" = "ETH",
  comment?: string,
  receiver?: string,
): Promise<Payment> {
  const paymentData = {
    id: Math.floor(Math.random() * 10000000),
    amount,
    token,
    comment,
    receiver: receiver || generateMockAddress(),
    status: "pending" as const,
  }

  const { data, error } = await supabase.from("payments").insert([paymentData]).select().single()

  if (error) {
    console.error("Error creating payment:", error)
    throw new Error("Failed to create payment")
  }

  return data
}

// Get payment by ID
export async function getPaymentById(id: string): Promise<Payment | null> {
  const { data, error } = await supabase.from("payments").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching payment:", error)
    return null
  }

  return data
}

// Update payment status
export async function updatePaymentStatus(
  id: string,
  status: "pending" | "paid" | "expired",
  senderAddress?: string,
  txHash?: string,
): Promise<Payment | null> {
  const updateData: any = {
    status,
  }

  // Add sender_address and tx_hash as additional fields if they don't exist in the table
  if (senderAddress) {
    updateData.sender_address = senderAddress
  }

  if (txHash) {
    updateData.tx_hash = txHash
  }

  const { data, error } = await supabase.from("payments").update(updateData).eq("id", id).select().single()

  if (error) {
    console.error("Error updating payment:", error)
    return null
  }

  return data
}

// Subscribe to payment status changes
export function subscribeToPaymentUpdates(paymentId: string, callback: (payment: Payment) => void) {
  const subscription = supabaseClient
    .channel(`payment-${paymentId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "payments",
        filter: `id=eq.${paymentId}`,
      },
      (payload) => {
        callback(payload.new as Payment)
      },
    )
    .subscribe()

  return subscription
}

// Generate a mock address for demo purposes
function generateMockAddress(): string {
  const chars = "0123456789abcdef"
  let address = "0x"
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)]
  }
  return address
}

// Get all payments (for admin/testing purposes)
export async function getAllPayments(): Promise<Payment[]> {
  const { data, error } = await supabase.from("payments").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching payments:", error)
    return []
  }

  return data || []
}
