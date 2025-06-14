// "use client"

// import type React from "react"
// import { useState, useEffect, createContext, useContext } from "react"
// import {
//   loginToIntMax,
//   logoutFromIntMax,
//   getWalletAddress,
//   getTokenBalances,
//   sendPayment,
//   isLoggedIn,
// } from "@/lib/intmax-client"
// // import type { TokenBalance } from "intmax2-client-sdk"

// type IntMaxWalletContextType = {
//   address: string | null
//   isConnected: boolean
//   isConnecting: boolean
//   balances: TokenBalance[]
//   login: () => Promise<void>
//   logout: () => Promise<void>
//   refreshBalances: () => Promise<void>
//   sendPayment: (recipientAddress: string, amount: number, tokenIndex?: number) => Promise<any>
//   error: string | null
// }

// const IntMaxWalletContext = createContext<IntMaxWalletContextType>({
//   address: null,
//   isConnected: false,
//   isConnecting: false,
//   balances: [],
//   login: async () => {},
//   logout: async () => {},
//   refreshBalances: async () => {},
//   sendPayment: async () => {},
//   error: null,
// })

// export function IntMaxWalletProvider({ children }: { children: React.ReactNode }) {
//   const [address, setAddress] = useState<string | null>(null)
//   const [isConnected, setIsConnected] = useState(false)
//   const [isConnecting, setIsConnecting] = useState(false)
//   const [balances, setBalances] = useState<TokenBalance[]>([])
//   const [error, setError] = useState<string | null>(null)

//   // Check for existing login on mount
//   useEffect(() => {
//     const checkExistingLogin = async () => {
//       try {
//         const loggedIn = await isLoggedIn()
//         if (loggedIn) {
//           const walletAddress = await getWalletAddress()
//           if (walletAddress) {
//             setAddress(walletAddress)
//             setIsConnected(true)
//             await refreshBalances()
//           }
//         }
//       } catch (err) {
//         console.error("Error checking existing login:", err)
//       }
//     }

//     checkExistingLogin()
//   }, [])

//   const login = async () => {
//     try {
//       setIsConnecting(true)
//       setError(null)

//       const client = await loginToIntMax()
//       const walletAddress = client.address

//       if (walletAddress) {
//         setAddress(walletAddress)
//         setIsConnected(true)
//         await refreshBalances()
//       }
//     } catch (err: any) {
//       console.error("Login error:", err)
//       setError(err.message || "Failed to login to INTMAX wallet")
//     } finally {
//       setIsConnecting(false)
//     }
//   }

//   const logout = async () => {
//     try {
//       await logoutFromIntMax()
//       setAddress(null)
//       setIsConnected(false)
//       setBalances([])
//       setError(null)
//     } catch (err: any) {
//       console.error("Logout error:", err)
//       setError(err.message || "Failed to logout")
//     }
//   }

//   const refreshBalances = async () => {
//     try {
//       const tokenBalances = await getTokenBalances()
//       setBalances(tokenBalances)
//     } catch (err: any) {
//       console.error("Error fetching balances:", err)
//       setError(err.message || "Failed to fetch balances")
//     }
//   }

//   const handleSendPayment = async (recipientAddress: string, amount: number, tokenIndex?: number) => {
//     try {
//       setError(null)
//       const result = await sendPayment(recipientAddress, amount, tokenIndex)
//       await refreshBalances() // Refresh balances after payment
//       return result
//     } catch (err: any) {
//       console.error("Payment error:", err)
//       setError(err.message || "Payment failed")
//       throw err
//     }
//   }

//   return (
//     <IntMaxWalletContext.Provider
//       value={{
//         address,
//         isConnected,
//         isConnecting,
//         balances,
//         login,
//         logout,
//         refreshBalances,
//         sendPayment: handleSendPayment,
//         error,
//       }}
//     >
//       {children}
//     </IntMaxWalletContext.Provider>
//   )
// }

// export function useIntMaxWallet() {
//   return useContext(IntMaxWalletContext)
// }
