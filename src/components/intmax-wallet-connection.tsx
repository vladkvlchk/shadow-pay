// "use client"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Wallet, Loader2, AlertCircle, LogOut } from "lucide-react"
// // import { useIntMaxWallet } from "@/hooks/use-intmax-wallet"
// import { formatAddress } from "@/lib/utils"

// export function IntMaxWalletConnection() {
//   const { address, isConnected, isConnecting, login, logout, error, balances } = useIntMaxWallet()

//   if (isConnected && address) {
//     return (
//       <Card className="bg-gray-800 border-gray-700">
//         <CardHeader className="pb-3">
//           <CardTitle className="text-sm flex items-center gap-2">
//             <Wallet className="h-4 w-4 text-purple-400" />
//             INTMAX Wallet Connected
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           <div className="text-sm">
//             <span className="text-gray-400">Address: </span>
//             <span className="font-mono">{formatAddress(address)}</span>
//           </div>

//           {balances.length > 0 && (
//             <div className="text-sm">
//               <span className="text-gray-400">Balance: </span>
//               <span>
//                 {balances[0]?.amount || 0} {balances[0]?.token.symbol || "INTMAX"}
//               </span>
//             </div>
//           )}

//           <Button
//             variant="outline"
//             size="sm"
//             className="w-full border-red-700 text-red-400 hover:text-red-300"
//             onClick={logout}
//           >
//             <LogOut className="h-4 w-4 mr-2" />
//             Disconnect
//           </Button>
//         </CardContent>
//       </Card>
//     )
//   }

//   return (
//     <div className="w-full space-y-4">
//       {error && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       <Button
//         className="w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
//         onClick={login}
//         disabled={isConnecting}
//       >
//         {isConnecting ? (
//           <>
//             <Loader2 className="h-4 w-4 animate-spin" />
//             Connecting to INTMAX...
//           </>
//         ) : (
//           <>
//             <Wallet className="h-5 w-5" />
//             Connect INTMAX Wallet
//           </>
//         )}
//       </Button>

//       <div className="text-center text-xs text-gray-400">
//         <p>Your wallet will be created automatically if you don't have one</p>
//       </div>
//     </div>
//   )
// }
