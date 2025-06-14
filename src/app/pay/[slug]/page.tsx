"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle2, Loader2, ExternalLink, Sparkles } from "lucide-react"
import { MockWalletConnection } from "@/components/mock-wallet-connection"
import { formatAddress } from "@/lib/utils"
import { useMockWallet } from "@/hooks/use-mock-wallet"
import { getPaymentById, updatePaymentStatus } from "@/lib/payments-db"
import { type Payment } from "@/lib/supabase";

export default function PaymentPage() {
  const { slug } = useParams()
  const { wallet, sendPayment, isProcessingPayment, error, clearError } = useMockWallet()

  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [txHash, setTxHash] = useState<string | null>(null)

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        setLoading(true)
        setPageError(null)

        const paymentData = await getPaymentById(slug as string)
        if (!paymentData) {
          setPageError("Payment not found or has expired.")
          return
        }

        setPayment(paymentData)

        // If payment is already paid, show success state
        if (paymentData.status === "paid") {
          setPaymentStatus("success")
          setTxHash(paymentData.tx_hash || null)
        }
      } catch (err) {
        console.error("Error fetching payment:", err)
        setPageError("Failed to load payment details.")
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchPayment()
    }
  }, [slug])

  const handlePayment = async () => {
    if (!wallet?.isConnected || !payment) return

    try {
      setPaymentStatus("processing")
      clearError()

      // Simulate the payment using mock wallet
      const transaction = await sendPayment(payment.receiver, payment.amount, payment.comment)

      // Update payment status in database
      const updatedPayment = await updatePaymentStatus(payment.id, "paid", wallet.address, transaction.hash)

      if (updatedPayment) {
        setPayment(updatedPayment)
        setTxHash(transaction.hash)
        setPaymentStatus("success")
      }
    } catch (err: any) {
      console.error("Payment error:", err)
      setPaymentStatus("error")
    }
  }

  const getExplorerUrl = (txHash: string): string => {
    return `https://testnet-explorer.intmax.io/tx/${txHash}`
  }

  const isConnected = wallet?.isConnected || false

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-2xl font-bold">Complete Payment</h1>
          <Sparkles className="h-5 w-5 text-purple-400" />
          <span className="text-sm text-purple-400">Demo Mode</span>
        </div>

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
        ) : pageError && !payment ? (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{pageError}</AlertDescription>
          </Alert>
        ) : payment ? (
          <div className="max-w-md mx-auto">
            <Card className="bg-gray-900 border-gray-800 mb-6">
              <CardHeader>
                <CardTitle>{payment.status === "paid" ? "Payment Completed" : "Payment Request"}</CardTitle>
                <CardDescription className="text-gray-400">
                  {payment.status === "paid"
                    ? "This payment has been completed successfully"
                    : "Connect your INTMAX wallet to complete this payment"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Amount:</span>
                    <span className="font-bold text-lg">
                      {payment.amount} {payment.token}
                    </span>
                  </div>

                  {payment.comment && (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Comment:</span>
                      <span>{payment.comment}</span>
                    </div>
                  )}

                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Receiver:</span>
                    <span className="text-sm font-mono">{formatAddress(payment.receiver)}</span>
                  </div>

                  {payment.sender_address && (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Sender:</span>
                      <span className="text-sm font-mono">{formatAddress(payment.sender_address)}</span>
                    </div>
                  )}

                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Status:</span>
                    <span
                      className={`text-sm font-medium ${
                        payment.status === "paid"
                          ? "text-green-400"
                          : payment.status === "pending"
                            ? "text-yellow-400"
                            : "text-gray-400"
                      }`}
                    >
                      {payment.status === "paid" ? "✓ Paid" : payment.status === "pending" ? "⏳ Pending" : "Expired"}
                    </span>
                  </div>

                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Token:</span>
                    <span className="text-sm font-medium">{payment.token}</span>
                  </div>

                  {isConnected && wallet && payment.status === "pending" && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Your Balance:</span>
                      <span className="text-sm">{wallet.balance.toFixed(4)} INTMAX</span>
                    </div>
                  )}
                </div>

                {paymentStatus === "success" || payment.status === "paid" ? (
                  <Alert className="bg-green-900/20 border-green-900 text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>Payment completed successfully!</AlertDescription>
                  </Alert>
                ) : paymentStatus === "error" || error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error || "Payment failed. Please try again."}</AlertDescription>
                  </Alert>
                ) : null}

                {(txHash || payment.tx_hash) && (
                  <div className="text-center">
                    <a
                      href={getExplorerUrl(txHash || payment.tx_hash!)}
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
                {payment.status === "paid" ? (
                  <Button
                    variant="outline"
                    className="w-full border-green-700 text-green-400"
                    onClick={() => (window.location.href = "/")}
                  >
                    Return to Home
                  </Button>
                ) : !isConnected ? (
                  <MockWalletConnection />
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
                    disabled={isProcessingPayment || !wallet || wallet.balance < payment.amount}
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Payment...
                      </>
                    ) : !wallet || wallet.balance < payment.amount ? (
                      "Insufficient Balance"
                    ) : (
                      `Pay ${payment.amount} ${payment.token}`
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>

            <div className="text-center text-gray-500 text-sm">
              <p>Powered by INTMAX & GhostPay</p>
              <p className="mt-1">✨ Demo Mode - No real transactions</p>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )
}
