"use client"

import { useState, useEffect } from "react"
import Image from "next/image";
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Check, WifiOff, Scan, Sparkles } from "lucide-react"
import { Html5Qrcode } from "html5-qrcode"
import { useNetworkStatus } from "@/hooks/use-network-status"

export default function ScanPayment() {
  const router = useRouter()
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [paymentData, setPaymentData] = useState<any>(null)
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

      // Check if it's a ShadowPay payment URL
      if (decodedText.includes("/pay/")) {
        // Extract payment ID from URL
        const urlParts = decodedText.split("/pay/")
        if (urlParts.length === 2) {
          const paymentId = urlParts[1]

          // Set success state with payment data
          setPaymentData({
            id: paymentId,
            url: decodedText,
            type: "ShadowPay_payment",
          })
          setSuccess(true)

          // Auto-redirect after 2 seconds
          setTimeout(() => {
            router.push(`/pay/${paymentId}`)
          }, 2000)

          return
        }
      }

      // Try to parse as JSON (legacy format or other data)
      try {
        const parsedData = JSON.parse(decodedText)
        setPaymentData({
          ...parsedData,
          type: "json_data",
        })
        setSuccess(true)
      } catch {
        // If not JSON, treat as plain text/URL
        setPaymentData({
          data: decodedText,
          type: "text_data",
        })
        setSuccess(true)
      }
    } catch (err) {
      console.error("Error processing QR code:", err)
      setError("Failed to process QR code. Please try again.")
      setScanning(false)
    }
  }

  const onScanFailure = (error: string) => {
    // This is called frequently when no QR is detected, so we don't want to set error state here
    console.debug("QR scan failure:", error)
  }

  const resetScan = () => {
    setSuccess(false)
    setPaymentData(null)
    setError(null)
  }

  const handleProceedToPayment = () => {
    if (paymentData?.type === "ShadowPay_payment") {
      const paymentId = paymentData.id
      router.push(`/pay/${paymentId}`)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <h1 className="text-2xl font-bold text-center">Scan Payment</h1>
          {/* <Image src="/logo.png" alt="logo" width="120" height="40" /> */}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!success ? (
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Scan className="h-5 w-5 text-purple-400" />
                Scan QR Code
              </CardTitle>
              <CardDescription className="text-neutral-400">
                Point your camera at a ShadowPay payment QR code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square max-w-md mx-auto relative">
                <div id="qr-reader" className="w-full h-full bg-neutral-800 rounded-lg overflow-hidden" />

                {!scanning && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
                    <div className="text-center">
                      <Scan className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                      <Button onClick={startScanning} className="bg-purple-600 hover:bg-purple-700 cursor-pointer">
                        Start Camera
                      </Button>
                    </div>
                  </div>
                )}

                {scanning && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-4 border-2 border-purple-400 rounded-lg">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-purple-400 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-purple-400 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-purple-400 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-purple-400 rounded-br-lg"></div>
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 px-3 py-1 rounded-full">
                      <span className="text-sm text-purple-400">Scanning...</span>
                    </div>
                  </div>
                )}
              </div>

              {!isOnline && (
                <Alert className="mt-4 bg-yellow-900/20 border-yellow-900">
                  <WifiOff className="h-4 w-4" />
                  <AlertDescription className="text-yellow-400">
                    You're offline. Payments will be processed when connection is restored.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            {scanning && (
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full border-red-700 text-red-400 hover:text-red-300 bg-red-700/20 hover:bg-red-400/20 cursor-pointer"
                  onClick={stopScanning}
                >
                  Cancel Scanning
                </Button>
              </CardFooter>
            )}
          </Card>
        ) : (
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader className="bg-green-900/20 border-b border-green-900">
              <div className="flex items-center gap-2">
                <div className="bg-green-900 rounded-full p-1">
                  <Check className="h-4 w-4 text-green-300" />
                </div>
                <CardTitle>QR Code Scanned Successfully</CardTitle>
              </div>
              <CardDescription className="text-neutral-400">
                {paymentData?.type === "ShadowPay_payment"
                  ? "ShadowPay payment detected - redirecting to payment page..."
                  : "QR code data captured successfully"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {paymentData?.type === "ShadowPay_payment" ? (
                  <>
                    <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-purple-400" />
                        <span className="font-medium text-purple-400">ShadowPay Payment</span>
                      </div>
                      <div className="text-sm text-neutral-300">
                        <p>Payment ID: {paymentData.id}</p>
                        <p className="mt-1 text-xs text-neutral-400">Redirecting in 2 seconds...</p>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-neutral-400">Status:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-green-400">Ready to Pay</span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-neutral-400">Network:</span>
                      <div className="flex items-center gap-1">
                        {isOnline ? (
                          <span className="text-green-400">Online</span>
                        ) : (
                          <>
                            <WifiOff className="h-3 w-3 text-yellow-500" />
                            <span className="text-yellow-400">Offline</span>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                ) : paymentData?.type === "json_data" ? (
                  <>
                    <div className="bg-neutral-800 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">JSON Data Detected</h4>
                      <pre className="text-xs text-neutral-300 overflow-auto">{JSON.stringify(paymentData, null, 2)}</pre>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-neutral-800 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Text Data</h4>
                      <p className="text-sm text-neutral-300 break-all">{paymentData?.data}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              {paymentData?.type === "ShadowPay_payment" ? (
                <>
                  <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={handleProceedToPayment}>
                    Proceed to Payment
                  </Button>
                  <Button variant="outline" className="flex-1 border-neutral-700" onClick={resetScan}>
                    Scan Another
                  </Button>
                </>
              ) : (
                <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={resetScan}>
                  Scan Another QR Code
                </Button>
              )}
            </CardFooter>
          </Card>
        )}
      </main>
    </div>
  )
}
