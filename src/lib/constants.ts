// INTMAX chain configuration
export const INTMAX_CHAIN_ID = 11155111 // Replace with actual INTMAX chain ID if different

export const CHAIN_CONFIG = {
  name: "INTMAX",
  currency: "INTMAX",
  explorer: "https://explorer.intmax.io", // Replace with actual explorer URL
}

// Get explorer URL for a transaction
export function getExplorerUrl(txHash: string): string {
  return `${CHAIN_CONFIG.explorer}/tx/${txHash}`
}

// Get currency symbol
export function getCurrencySymbol(): string {
  return CHAIN_CONFIG.currency
}
