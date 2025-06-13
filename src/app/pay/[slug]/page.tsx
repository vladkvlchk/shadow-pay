"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle2, Loader2, ExternalLink } from "lucide-react"
import { WalletConnection } from "@/components/wallet-connection"
import { getPaymentBySlug, processPayment } from "@/lib/payment"
import { formatAddress } from "@/lib/utils"
import { useAccount, useChainId, useWriteContract } from "wagmi"
import { parseEther } from "viem"
import { intmaxChain } from "@/lib/wagmi"
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function PaymentPage() {
  const { slug } = useParams()
  const { address, isConnected } = useAccount()
  const chainId = useChainId()

  const [payment, setPayment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [txHash, setTxHash] = useState<string | null>(null)

  // Set up the contract write hook
  const { writeContractAsync, isPending, isError, error: writeError } = useWriteContract()

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        setLoading(true)
        setError(null)

        // In a real app, this would fetch from an API or IPFS
        const paymentData = await getPaymentBySlug(slug as string)
        setPayment(paymentData)
      } catch (err) {
        console.error("Error fetching payment:", err)
        setError("Failed to load payment details. The payment may not exist or has expired.")
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchPayment()
    }
  }, [slug])

  // Handle write contract errors
  useEffect(() => {
    if (isError && writeError) {
      setError(writeError.message || "Transaction failed. Please try again.")
      setPaymentStatus("error")
    }
  }, [isError, writeError])

  const handlePayment = async () => {
    if (!isConnected || !payment || !address) return

    try {
      setPaymentStatus("processing")
      setError(null)

      // Send the transaction
      const hash = await writeContractAsync({
        abi: [], // Empty ABI for simple ETH transfer
        address: payment.recipientAddress as `0x${string}`,
        functionName: "", // No function name for simple transfer
        value: parseEther(payment.amount.toString()),
      })

      setTxHash(hash)
      setPaymentStatus("success")

      // Update the payment status in your backend/storage
      await processPayment(payment, address)
    } catch (err: any) {
      console.error("Payment error:", err)
      setError(err.message || "Payment failed. Please try again.")
      setPaymentStatus("error")
    }
  }

  // Get explorer URL for a transaction
  const getExplorerUrl = (txHash: string): string => {
    return `${intmaxChain?.blockExplorers?.default.url}/tx/${txHash}`
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Complete Payment</h1>

        {loading ? (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <Skeleton className="h-8 w-3/4 bg-gray-800" />
              <Skeleton className="h-4 w-1/2 bg-gray-800 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-20 w-full bg-gray-800" />
                <Skeleton className="h-12 w-full bg-gray-800" />
              </div>
            </CardContent>
          </Card>
        ) : error && !payment ? (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : payment ? (
          <div className="max-w-md mx-auto">
            <Card className="bg-neutral-900 border-neutral-800 mb-6">
              <CardHeader>
                <CardTitle className="text-white">Payment Request</CardTitle>
                <div>
                    <ConnectButton />
                </div>
                <CardDescription className="text-neutral-400">
                  Connect your wallet to complete this payment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-neutral-800 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-neutral-400">Amount:</span>
                    <span className="font-bold text-lg text-white">{payment.amount} INTMAX</span>
                  </div>

                  {payment.comment && (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Comment:</span>
                      <span className="text-white">{payment.comment}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-400">Recipient:</span>
                    <span className="text-sm font-mono text-white">{formatAddress(payment.recipientAddress)}</span>
                  </div>
                </div>

                {paymentStatus === "success" ? (
                  <Alert className="bg-green-900/20 border-green-900 text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>Payment completed successfully!</AlertDescription>
                  </Alert>
                ) : paymentStatus === "error" ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : null}

                {txHash && (
                  <div className="text-center">
                    <a
                      href={getExplorerUrl(txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 flex items-center justify-center gap-1 text-sm"
                    >
                      View transaction <ExternalLink className="h-3 w-4" />
                    </a>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                {!isConnected ? (
                  <WalletConnection />
                ) : paymentStatus === "success" ? (
                  <Button
                    variant="outline"
                    className="w-full border-green-700 text-green-400"
                    onClick={() => (window.location.href = "/")}
                  >
                    Return to Home
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={handlePayment}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay ${payment.amount} INTMAX`
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>

            <div className="text-center text-neutral-500 text-sm">
              <p>Powered by INTMAX & ShadowPay</p>
              <p className="mt-1">Secure, private, and gasless transactions</p>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )
}
