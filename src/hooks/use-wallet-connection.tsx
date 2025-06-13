// "use client"

// import type React from "react"
// import { useState, useEffect, createContext, useContext } from "react"
// import { WalletKit, Wallet } from "@reown/walletkit"
// import { Core } from "@walletconnect/core"

// // Initialize WalletConnect Core
// const core = new Core({
//   projectId: "YOUR_PROJECT_ID", // In production, use an environment variable
// })

// // Initialize WalletKit with INTMAX chain
// // Assuming INTMAX chain ID is 11235, replace with actual chain ID if different
// const INTMAX_CHAIN_ID = 11235

// // Initialize WalletKit
// const walletKit = new WalletKit({
//   core,
//   chains: [INTMAX_CHAIN_ID],
// })

// type WalletConnectionContextType = {
//   address: string | null
//   isConnected: boolean
//   isConnecting: boolean
//   connect: (walletType: string) => Promise<void>
//   disconnect: () => void
//   signMessage: (message: string) => Promise<string | null>
//   sendTransaction: (transaction: any) => Promise<string | null>
//   chainId: number | null
// }

// const WalletConnectionContext = createContext<WalletConnectionContextType>({
//   address: null,
//   isConnected: false,
//   isConnecting: false,
//   connect: async () => {},
//   disconnect: () => {},
//   signMessage: async () => null,
//   sendTransaction: async () => null,
//   chainId: null,
// })

// export function WalletConnectionProvider({ children }: { children: React.ReactNode }) {
//   const [address, setAddress] = useState<string | null>(null)
//   const [isConnected, setIsConnected] = useState(false)
//   const [isConnecting, setIsConnecting] = useState(false)
//   const [chainId, setChainId] = useState<number | null>(null)
//   const [wallet, setWallet] = useState<Wallet | null>(null)

//   // Check for existing connection on mount
//   useEffect(() => {
//     const checkConnection = async () => {
//       try {
//         // Check if we have an active session
//         const sessions = walletKit.getActiveSessions()
//         if (sessions.length > 0) {
//           const session = sessions[0]
//           const accounts = session.namespaces.eip155?.accounts || []

//           if (accounts.length > 0) {
//             // Format: "eip155:1:0x123..."
//             const accountParts = accounts[0].split(":")
//             const connectedAddress = accountParts[2]
//             const connectedChainId = Number.parseInt(accountParts[1])

//             setAddress(connectedAddress)
//             setChainId(connectedChainId)
//             setIsConnected(true)

//             // Reconnect to the wallet
//             const connectedWallet = await walletKit.reconnectWallet(session)
//             setWallet(connectedWallet)
//           }
//         }
//       } catch (error) {
//         console.error("Error checking wallet connection:", error)
//       }
//     }

//     checkConnection()

//     // Set up event listeners
//     walletKit.on("session_delete", () => {
//       setAddress(null)
//       setIsConnected(false)
//       setWallet(null)
//       setChainId(null)
//     })

//     return () => {
//       walletKit.off("session_delete")
//     }
//   }, [])

//   const connect = async (walletType: string) => {
//     try {
//       setIsConnecting(true)

//       let selectedWallet: Wallet | null = null

//       // Connect to the selected wallet
//       switch (walletType) {
//         case "metamask":
//           selectedWallet = await walletKit.connectWallet(Wallet.METAMASK)
//           break
//         case "walletconnect":
//           selectedWallet = await walletKit.connectWallet(Wallet.WALLETCONNECT)
//           break
//         case "coinbase":
//           selectedWallet = await walletKit.connectWallet(Wallet.COINBASE)
//           break
//         default:
//           throw new Error(`Unsupported wallet type: ${walletType}`)
//       }

//       if (!selectedWallet) {
//         throw new Error("Failed to connect wallet")
//       }

//       // Get the connected accounts
//       const accounts = await selectedWallet.getAccounts()
//       if (accounts.length === 0) {
//         throw new Error("No accounts found")
//       }

//       // Get the chain ID
//       const connectedChainId = await selectedWallet.getChainId()

//       setWallet(selectedWallet)
//       setAddress(accounts[0])
//       setChainId(connectedChainId)
//       setIsConnected(true)

//       console.log(`Connected to ${walletType} wallet: ${accounts[0]} on chain ${connectedChainId}`)
//     } catch (error) {
//       console.error("Error connecting wallet:", error)
//     } finally {
//       setIsConnecting(false)
//     }
//   }

//   const disconnect = async () => {
//     try {
//       if (wallet) {
//         await wallet.disconnect()
//       }
//     } catch (error) {
//       console.error("Error disconnecting wallet:", error)
//     } finally {
//       setAddress(null)
//       setIsConnected(false)
//       setWallet(null)
//       setChainId(null)
//     }
//   }

//   const signMessage = async (message: string): Promise<string | null> => {
//     if (!wallet || !address) return null

//     try {
//       return await wallet.signMessage(message, address)
//     } catch (error) {
//       console.error("Error signing message:", error)
//       return null
//     }
//   }

//   const sendTransaction = async (transaction: any): Promise<string | null> => {
//     if (!wallet || !address) return null

//     try {
//       // Add the from address if not provided
//       const txWithFrom = {
//         ...transaction,
//         from: transaction.from || address,
//       }

//       return await wallet.sendTransaction(txWithFrom)
//     } catch (error) {
//       console.error("Error sending transaction:", error)
//       return null
//     }
//   }

//   return (
//     <WalletConnectionContext.Provider
//       value={{
//         address,
//         isConnected,
//         isConnecting,
//         connect,
//         disconnect,
//         signMessage,
//         sendTransaction,
//         chainId,
//       }}
//     >
//       {children}
//     </WalletConnectionContext.Provider>
//   )
// }

// export function useWalletConnection() {
//   return useContext(WalletConnectionContext)
// }
