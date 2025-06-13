import { type Transaction, submitTransaction } from "./intmax"

// Save a transaction to local storage
export async function saveTransaction(transaction: Transaction): Promise<void> {
  if (typeof window === "undefined") return

  try {
    // Get existing transactions
    const transactions = JSON.parse(localStorage.getItem("shadowpay_transactions") || "[]")

    // Add new transaction
    transactions.push(transaction)

    // Save back to storage
    localStorage.setItem("shadowpay_transactions", JSON.stringify(transactions))
  } catch (err) {
    console.error("Error saving transaction:", err)
    throw err
  }
}

// Get all transactions from local storage
export async function getTransactions(): Promise<Transaction[]> {
  if (typeof window === "undefined") return []

  try {
    return JSON.parse(localStorage.getItem("shadowpay_transactions") || "[]")
  } catch (err) {
    console.error("Error getting transactions:", err)
    return []
  }
}

// Sync all pending transactions with the INTMAX network
export async function syncPendingTransactions(): Promise<void> {
  if (typeof window === "undefined") return

  try {
    const transactions = await getTransactions()
    const pendingTransactions = transactions.filter((tx) => tx.status === "pending")

    // Process each pending transaction
    for (const tx of pendingTransactions) {
      await submitTransaction(tx)
    }
  } catch (err) {
    console.error("Error syncing transactions:", err)
    throw err
  }
}

// Clear all transaction history (for testing)
export async function clearTransactionHistory(): Promise<void> {
  if (typeof window === "undefined") return

  localStorage.removeItem("shadowpay_transactions")
}
