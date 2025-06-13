import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format an Ethereum address to show only the first and last few characters
export function formatAddress(address: string): string {
  if (!address) return ""
  if (address.length < 10) return address

  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
