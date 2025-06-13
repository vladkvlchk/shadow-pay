import { v4 as uuidv4 } from "uuid"
import { generateRandomAddress } from "./intmax"

// Mock payment data store
const payments: Record<string, any> = {}

// Create a new payment request
export async function createPaymentRequest(
  amount: number,
  comment?: string,
): Promise<{ slug: string; paymentData: any }> {
  const slug = uuidv4().slice(0, 8)

  const paymentData = {
    id: uuidv4(),
    slug,
    amount,
    comment,
    recipientAddress: generateRandomAddress(),
    timestamp: Date.now(),
    status: "pending",
  }

  // Store the payment data (in a real app, this would be in a database)
  payments[slug] = paymentData

  return { slug, paymentData }
}

// Get payment by slug
export async function getPaymentBySlug(slug: string): Promise<any> {
  // In a real app, this would fetch from a database or IPFS

  // For demo purposes, we'll create a mock payment if it doesn't exist
  if (!payments[slug]) {
    payments[slug] = {
      id: uuidv4(),
      slug,
      amount: Math.floor(Math.random() * 100) / 100 + 0.01, // Random amount between 0.01 and 1
      comment: "Demo payment",
      recipientAddress: generateRandomAddress(),
      timestamp: Date.now(),
      status: "pending",
    }
  }

  return payments[slug]
}

// Process a payment
export async function processPayment(
  payment: any,
  senderAddress: string | null,
): Promise<{ success: boolean; txHash: string }> {
  // In a real app, this would use ethers.js or similar to send the transaction

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Generate a mock transaction hash
  const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`

  // Update payment status
  if (payments[payment.slug]) {
    payments[payment.slug] = {
      ...payments[payment.slug],
      status: "completed",
      senderAddress,
      txHash,
    }
  }

  return { success: true, txHash }
}
