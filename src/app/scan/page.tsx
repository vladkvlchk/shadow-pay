"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Check, WifiOff } from "lucide-react"
import { Html5Qrcode } from "html5-qrcode"
import { saveTransaction } from "@/lib/storage"
import { processTransaction } from "@/lib/intmax"
import { useNetworkStatus } from "@/hooks/use-network-status"

export default function ScanPayment() {
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [transactionData, setTransactionData] = useState<any>(null)
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null)
  const { isOnline } = useNetworkStatus()

  useEffect(() => {
    // Initialize QR scanner
    if (typeof window !== "undefined" && !html5QrCode) {
      const scanner = new Html5Qrcode("qr-reader")
      setHtml5QrCode(scanner)
    }

    // Cleanup on unmount
    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error)
      }
    }
  }, [html5QrCode])

  const startScanning = async () => {
    if (!html5QrCode) return

    setScanning(true)
    setError(null)

    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onScanSuccess,
        onScanFailure,
      )
    } catch (err) {
      console.error("Error starting scanner:", err)
      setError("Failed to access camera. Please check permissions.")
      setScanning(false)
    }
  }

  const stopScanning = async () => {
    if (html5QrCode && html5QrCode.isScanning) {
      await html5QrCode.stop()
      setScanning(false)
    }
  }

  const onScanSuccess = async (decodedText: string) => {
    try {
      await stopScanning()

      // Parse the QR data
      const transaction = JSON.parse(decodedText)
      setTransactionData(transaction)

      // Save transaction to local storage
      await saveTransaction(transaction)

      // If online, process the transaction immediately
      if (isOnline) {
        await processTransaction(transaction)
      }

      setSuccess(true)
    } catch (err) {
      console.error("Error processing QR code:", err)
      setError("Invalid QR code. Please try again.")
      setScanning(false)
    }
  }

  const onScanFailure = (error: string) => {
    // This is called frequently when no QR is detected, so we don't want to set error state here
    console.debug("QR scan failure:", error)
  }

  const resetScan = () => {
    setSuccess(false)
    setTransactionData(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Scan Payment</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!success ? (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Scan QR Code</CardTitle>
              <CardDescription className="text-gray-400">Point your camera at the payment QR code</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square max-w-md mx-auto relative">
                <div id="qr-reader" className="w-full h-full bg-gray-800 rounded-lg overflow-hidden" />

                {!scanning && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                    <Button onClick={startScanning} className="bg-purple-600 hover:bg-purple-700">
                      Start Camera
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            {scanning && (
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full border-red-700 text-red-400 hover:text-red-300"
                  onClick={stopScanning}
                >
                  Cancel Scanning
                </Button>
              </CardFooter>
            )}
          </Card>
        ) : (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="bg-green-900/20 border-b border-green-900">
              <div className="flex items-center gap-2">
                <div className="bg-green-900 rounded-full p-1">
                  <Check className="h-4 w-4 text-green-300" />
                </div>
                <CardTitle>Payment Received</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                {isOnline
                  ? "Transaction has been processed successfully"
                  : "Transaction saved and will sync when online"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="font-medium">{transactionData?.amount} INTMAX</span>
                </div>

                {transactionData?.comment && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Comment:</span>
                    <span>{transactionData.comment}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-400">Transaction ID:</span>
                  <span className="text-xs truncate max-w-[200px]">{transactionData?.id}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <div className="flex items-center gap-1">
                    {isOnline ? (
                      <span className="text-green-400">Processed</span>
                    ) : (
                      <>
                        <WifiOff className="h-3 w-3 text-yellow-500" />
                        <span className="text-yellow-400">Pending (Offline)</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={resetScan}>
                Scan Another Payment
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>
    </div>
  )
}
