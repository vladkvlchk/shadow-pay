"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext } from "react"
import {
  simulateWalletConnection,
  simulateWalletDisconnection,
  simulatePayment,
  getOrCreateMockWallet,
  getMockTransactions,
  type MockWallet,
  type MockTransaction,
} from "@/lib/mock-wallet";

type MockWalletContextType = {
  wallet: MockWallet | null
  transactions: MockTransaction[]
  isConnecting: boolean
  isProcessingPayment: boolean
  error: string | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  sendPayment: (recipientAddress: string, amount: number, comment?: string) => Promise<MockTransaction>
  refreshTransactions: () => void
  clearError: () => void
}

const MockWalletContext = createContext<MockWalletContextType>({
  wallet: null,
  transactions: [],
  isConnecting: false,
  isProcessingPayment: false,
  error: null,
  connect: async () => {},
  disconnect: async () => {},
  sendPayment: async () => ({}) as MockTransaction,
  refreshTransactions: () => {},
  clearError: () => {},
})

export function MockWalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<MockWallet | null>(null)
  const [transactions, setTransactions] = useState<MockTransaction[]>([])
  const [isConnecting, setIsConnecting] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load initial state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mockWallet = getOrCreateMockWallet()
      if (mockWallet.isConnected) {
        setWallet(mockWallet)
      }
      setTransactions(getMockTransactions())
    }
  }, [])

  const connect = async () => {
    try {
      setIsConnecting(true)
      setError(null)

      const connectedWallet = await simulateWalletConnection()
      setWallet(connectedWallet)
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet")
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = async () => {
    try {
      await simulateWalletDisconnection()
      setWallet(null)
    } catch (err: any) {
      setError(err.message || "Failed to disconnect wallet")
    }
  }

  const sendPayment = async (recipientAddress: string, amount: number, comment?: string) => {
    try {
      setIsProcessingPayment(true)
      setError(null)

      const transaction = await simulatePayment(recipientAddress, amount, comment)

      // Update local state
      const updatedWallet = getOrCreateMockWallet()
      setWallet(updatedWallet)
      setTransactions(getMockTransactions())

      return transaction
    } catch (err: any) {
      setError(err.message || "Payment failed")
      throw err
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const refreshTransactions = () => {
    setTransactions(getMockTransactions())
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <MockWalletContext.Provider
      value={{
        wallet,
        transactions,
        isConnecting,
        isProcessingPayment,
        error,
        connect,
        disconnect,
        sendPayment,
        refreshTransactions,
        clearError,
      }}
    >
      {children}
    </MockWalletContext.Provider>
  )
}

export function useMockWallet() {
  return useContext(MockWalletContext)
}
