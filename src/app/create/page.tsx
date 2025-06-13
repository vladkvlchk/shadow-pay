"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Download, Copy } from "lucide-react"
import { QRCodeSVG as QRCode } from "qrcode.react"
import { createTransaction } from "@/lib/intmax"
import { saveTransaction } from "@/lib/storage"

export default function CreatePayment() {
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("")
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [qrData, setQrData] = useState<string | null>(null)
  const [transactionId, setTransactionId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    if (!receiver || receiver.length <= 5) {
        setError("Please enter a receiver address")
        return
    }

    setLoading(true)
    setError(null)

    try {
      // In a real implementation, this would use the INTMAX SDK
      const transaction = await createTransaction(receiver, Number.parseFloat(amount), comment)

      // Save transaction to local storage for offline access
      await saveTransaction(transaction)

      setQrData('https://shadow-pay-chi.vercel.app/pay/' + transaction.id)
      setTransactionId(transaction.id)
    } catch (err) {
      setError("Failed to create transaction. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyQR = () => {
    if (qrData) {
      navigator.clipboard.writeText(qrData)
    }
  }

  const handleDownloadQR = () => {
    if (!qrData) return

    const canvas = document.getElementById("payment-qr") as HTMLCanvasElement
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.href = pngUrl
      downloadLink.download = `shadowpay-${transactionId}.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <main className="container mx-auto px-4 py-8 w-fit">
        <h1 className="text-2xl font-bold mb-6">Create Payment</h1>

        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-500/20 border-red-500/40">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!qrData ? (
          <Card className="bg-gray-9500 border min-w-120 max-w-180">
            <CardHeader>
              <CardTitle className="text-white">Payment Details</CardTitle>
              <CardDescription className="text-gray-400">Enter the payment amount and optional comment</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white" htmlFor="receiver">Receiver address</Label>
                  <Input
                    id="receiver"
                    placeholder="0xd8a10c4babb5374a9c3a037cb7c3912f8f2a6aae"
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white" htmlFor="amount">Amount (ETH)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.000001"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white" htmlFor="comment">Comment (Optional)</Label>
                  <Textarea
                    id="comment"
                    placeholder="What's this payment for?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </CardContent>
              <CardFooter className="mt-4">
                <Button type="submit" className="w-full bg-white text-black hover:bg-gray-100 cursor-pointer" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating QR Code...
                    </>
                  ) : (
                    "Generate QR Code"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <div className="flex flex-col items-center">
            <Card className="bg-gray-900 border-gray-800 w-full max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-white">Payment QR Code</CardTitle>
                <CardDescription className="text-gray-400">Have the recipient scan this code</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-lg mb-4">
                  <QRCode id="payment-qr" value={qrData} size={240} level="H" includeMargin={true} />
                </div>

                <div className="w-full space-y-2 mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white">{amount} ETH</span>
                  </div>
                  {comment && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Comment:</span>
                      <span className="text-right text-white">{comment}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Transaction ID:</span>
                    <span className="text-xs truncate max-w-[200px] text-white">{transactionId}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1 border-black cursor-pointer" onClick={handleCopyQR}>
                  <Copy className="mr-2 h-4 w-4 text-black" />
                  Copy Link
                </Button>
                <Button className="flex-1 bg-black cursor-pointer" onClick={handleDownloadQR}>
                  <Download className="mr-2 h-4 w-4" />
                  Download QR
                </Button>
              </CardFooter>
            </Card>

            <Button
              variant="link"
              className="mt-4 text-purple-400 cursor-pointer"
              onClick={() => {
                setQrData(null)
                setTransactionId(null)
              }}
            >
              Create Another Payment
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
