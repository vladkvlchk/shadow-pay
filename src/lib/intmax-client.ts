// // import { IntMaxClient, type TokenBalance } from "intmax2-client-sdk"

// // Singleton pattern for INTMAX client
// let client: IntMaxClient | null = null

// export async function getIntMaxClient(): Promise<IntMaxClient> {
//   if (!client) {
//     client = await IntMaxClient.init({
//       environment: "testnet", // Change to "mainnet" for production
//     })
//   }
//   return client
// }

// export async function loginToIntMax(): Promise<IntMaxClient> {
//   const client = await getIntMaxClient()
//   await client.login()
//   return client
// }

// export async function logoutFromIntMax(): Promise<void> {
//   const client = await getIntMaxClient()
//   await client.logout()
// }

// export async function getWalletAddress(): Promise<string | null> {
//   try {
//     const client = await getIntMaxClient()
//     return client.address || null
//   } catch {
//     return null
//   }
// }

// export async function getPrivateKey(): Promise<string | null> {
//   try {
//     const client = await getIntMaxClient()
//     return await client.getPrivateKey()
//   } catch {
//     return null
//   }
// }

// export async function getTokenBalances(): Promise<TokenBalance[]> {
//   try {
//     const client = await getIntMaxClient()
//     const { balances } = await client.fetchTokenBalances()
//     return balances
//   } catch {
//     return []
//   }
// }

// export async function sendPayment(recipientAddress: string, amount: number, tokenIndex?: number): Promise<any> {
//   const client = await getIntMaxClient()

//   // Get available tokens
//   const { balances } = await client.fetchTokenBalances()

//   // Find the token to send (default to first available token if not specified)
//   const tokenBalance = tokenIndex
//     ? balances.find((b) => b.token.tokenIndex === tokenIndex)
//     : balances.find((b) => b.amount > 0)

//   if (!tokenBalance) {
//     throw new Error("No tokens available for payment")
//   }

//   if (tokenBalance.amount < amount) {
//     throw new Error("Insufficient balance")
//   }

//   // For INTMAX, we use withdraw to send to external addresses
//   return await client.withdraw({
//     amount,
//     token: tokenBalance.token,
//     address: recipientAddress as `0x${string}`,
//   })
// }

// export async function isLoggedIn(): Promise<boolean> {
//   try {
//     const client = await getIntMaxClient()
//     return !!client.address
//   } catch {
//     return false
//   }
// }
