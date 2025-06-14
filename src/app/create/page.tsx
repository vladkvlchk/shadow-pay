"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Download, Copy, CheckCircle2, Sparkles, Lock, Eye, EyeOff, Shield } from "lucide-react"
import { QRCodeSVG as QRCode } from "qrcode.react"
import { createPayment, subscribeToPaymentUpdates } from "@/lib/payments-db"
import { type Payment } from "@/lib/supabase";

export default function CreatePayment() {
  const [amount, setAmount] = useState("")
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [payment, setPayment] = useState<Payment | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<"creating" | "pending" | "paid" | "auto-generating">("creating")
  const [token, setToken] = useState<"ETH" | "USDC">("ETH")
  const [showFullScreenSuccess, setShowFullScreenSuccess] = useState(false)
  const [countdown, setCountdown] = useState(10)

  // Kiosk mode states
  const [isKioskMode, setIsKioskMode] = useState(false)
  const [kioskPassword, setKioskPassword] = useState("")
  const [unlockPassword, setUnlockPassword] = useState("")
  const [showPasswordInput, setShowPasswordInput] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [unlockAttempts, setUnlockAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)

  // Subscribe to payment updates when payment is created
  useEffect(() => {
    if (!payment) return

    const subscription = subscribeToPaymentUpdates(payment.id, (updatedPayment) => {
      setPayment(updatedPayment)
      if (updatedPayment.status === "paid") {
        setPaymentStatus("paid")
        setShowFullScreenSuccess(true)
        setCountdown(10)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [payment])

  // Handle full screen success countdown and auto-generation
  useEffect(() => {
    if (!showFullScreenSuccess) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleAutoGenerate()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [showFullScreenSuccess])

  // Prevent back navigation and refresh in kiosk mode
  useEffect(() => {
    if (!isKioskMode) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable common shortcuts that could exit kiosk mode
      if (
        e.key === "F5" ||
        (e.ctrlKey && (e.key === "r" || e.key === "R")) ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i")) ||
        (e.ctrlKey && (e.key === "u" || e.key === "U")) ||
        e.key === "F12" ||
        (e.altKey && e.key === "F4")
      ) {
        e.preventDefault()
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isKioskMode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const newPayment = await createPayment(Number.parseFloat(amount), token, comment)
      setPayment(newPayment)
      setPaymentStatus("pending")
    } catch (err) {
      setError("Failed to create payment. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAutoGenerate = async () => {
    setPaymentStatus("auto-generating")
    setShowFullScreenSuccess(false)

    try {
      const newPayment = await createPayment(Number.parseFloat(amount), token, comment)
      setPayment(newPayment)
      setPaymentStatus("pending")
    } catch (err) {
      setError("Failed to generate new payment. Please try again.")
      console.error(err)
      setPaymentStatus("creating")
    }
  }

  const handleEnterKioskMode = () => {
    if (!kioskPassword.trim()) {
      setError("Please set a password to enable kiosk mode")
      return
    }

    if (kioskPassword.length < 4) {
      setError("Password must be at least 4 characters long")
      return
    }

    setIsKioskMode(true)
    setIsLocked(true)
    setError(null)

    // Request fullscreen if supported
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(console.error)
    }
  }

  const handleUnlockAttempt = () => {
    if (unlockPassword === kioskPassword) {
      setIsKioskMode(false)
      setIsLocked(false)
      setUnlockPassword("")
      setShowPasswordInput(false)
      setUnlockAttempts(0)

      // Exit fullscreen
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(console.error)
      }
    } else {
      setUnlockAttempts((prev) => prev + 1)
      setUnlockPassword("")

      // Lock for 30 seconds after 3 failed attempts
      if (unlockAttempts >= 2) {
        setIsLocked(true)
        setTimeout(() => {
          setUnlockAttempts(0)
        }, 30000)
      }
    }
  }

  const handleCopyQR = () => {
    if (payment) {
      const paymentUrl = `${window.location.origin}/pay/${payment.id}`
      navigator.clipboard.writeText(paymentUrl)
    }
  }

  const handleDownloadQR = () => {
    if (!payment) return

    const canvas = document.getElementById("payment-qr") as HTMLCanvasElement
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.href = pngUrl
      downloadLink.download = `ghostpay-${payment.id}.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  }

  const handleCreateAnother = () => {
    setPayment(null)
    setPaymentStatus("creating")
    setError(null)
  }

  const getPaymentUrl = () => {
    if (!payment) return ""
    return `${window.location.origin}/pay/${payment.id}`
  }

  // Kiosk mode locked screen
  if (isKioskMode && isLocked && !showFullScreenSuccess) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Header with unlock button */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
            onClick={() => setShowPasswordInput(!showPasswordInput)}
          >
            <Lock className="h-4 w-4 mr-2" />
            Unlock
          </Button>
        </div>

        {/* Password input overlay */}
        {showPasswordInput && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-20">
            <Card className="bg-gray-900 border-gray-800 w-full max-w-sm mx-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-400" />
                  Enter Password
                </CardTitle>
                <CardDescription>
                  {unlockAttempts >= 3
                    ? "Too many failed attempts. Try again in 30 seconds."
                    : "Enter the password to exit kiosk mode"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={unlockPassword}
                    onChange={(e) => setUnlockPassword(e.target.value)}
                    className="bg-gray-800 border-gray-700 pr-10"
                    disabled={unlockAttempts >= 3}
                    onKeyDown={(e) => e.key === "Enter" && handleUnlockAttempt()}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                </div>
                {unlockAttempts > 0 && unlockAttempts < 3 && (
                  <p className="text-red-400 text-sm">Incorrect password. {3 - unlockAttempts} attempts remaining.</p>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowPasswordInput(false)}>
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  onClick={handleUnlockAttempt}
                  disabled={unlockAttempts >= 3 || !unlockPassword}
                >
                  Unlock
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Full screen QR code display */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Scan to Pay</h1>
            <div className="flex items-center justify-center gap-2 text-purple-400 mb-2">
              <Shield className="h-5 w-5" />
              <span className="text-lg">Kiosk Mode Active</span>
            </div>
          </div>

          {payment && (
            <>
              {/* Large QR Code */}
              <div className="bg-white p-8 rounded-2xl mb-8 shadow-2xl">
                <QRCode value={getPaymentUrl()} size={320} level="H" includeMargin={true} />
              </div>

              {/* Payment Details */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 max-w-md w-full border border-gray-800">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      {payment.amount} {payment.token}
                    </div>
                    <div className="text-gray-400">Amount to Pay</div>
                  </div>

                  {payment.comment && (
                    <div className="text-center border-t border-gray-800 pt-4">
                      <div className="text-gray-400 text-sm mb-1">Payment For</div>
                      <div className="text-white">{payment.comment}</div>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm border-t border-gray-800 pt-4">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-yellow-400 flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Waiting for payment
                    </span>
                  </div>

                  <div className="text-center text-xs text-gray-500 border-t border-gray-800 pt-4">
                    <p>Powered by GhostPay</p>
                    <p className="mt-1">ID: {String(payment.id).slice(0, 8)}...</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // Full screen success overlay (same as before)
  if (showFullScreenSuccess) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-center space-y-8 max-w-md mx-auto px-4">
          <div className="relative">
            <div className="w-32 h-32 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="w-4 h-4 text-yellow-800" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white">Payment Received!</h1>
            <p className="text-xl text-gray-300">
              {payment?.amount} {payment?.token} successfully paid
            </p>
            {payment?.comment && <p className="text-gray-400 italic">"{payment.comment}"</p>}
          </div>

          <div className="space-y-2">
            <p className="text-gray-400">Generating new QR code in</p>
            <div className="text-6xl font-bold text-purple-400">{countdown}</div>
            <p className="text-sm text-gray-500">seconds</p>
          </div>

          <Button
            variant="outline"
            className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
            onClick={handleAutoGenerate}
          >
            Generate Now
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Create Payment</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {paymentStatus === "creating" ? (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription className="text-gray-400">Enter the payment amount and optional comment</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.000001"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="token">Token</Label>
                  <select
                    id="token"
                    value={token}
                    onChange={(e) => setToken(e.target.value as "ETH" | "USDC")}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                  >
                    <option value="ETH">ETH</option>
                    <option value="USDC">USDC</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Comment (Optional)</Label>
                  <Textarea
                    id="comment"
                    placeholder="What's this payment for?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Payment...
                    </>
                  ) : (
                    "Create Payment Request"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : paymentStatus === "auto-generating" ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Card className="bg-gray-900 border-gray-800 w-full max-w-md mx-auto">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Generating New QR Code</h3>
                <p className="text-gray-400 text-center">Creating a new payment request with the same details...</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Card className="bg-gray-900 border-gray-800 w-full max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Payment QR Code</CardTitle>
                <CardDescription className="text-gray-400">
                  Waiting for payment... Share this QR code or link
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-lg mb-4">
                  <QRCode id="payment-qr" value={getPaymentUrl()} size={240} level="H" includeMargin={true} />
                </div>

                <div className="w-full space-y-2 mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Amount:</span>
                    <span>
                      {payment?.amount} {payment?.token}
                    </span>
                  </div>
                  {payment?.comment && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Comment:</span>
                      <span className="text-right">{payment.comment}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-yellow-400 flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Waiting for payment
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Payment ID:</span>
                    <span className="text-xs truncate max-w-[200px]">{payment?.id}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1 border-purple-700 text-purple-400" onClick={handleCopyQR}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </Button>
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={handleDownloadQR}>
                  <Download className="mr-2 h-4 w-4" />
                  Download QR
                </Button>
              </CardFooter>
            </Card>

            {/* Kiosk Mode Setup */}
            <Card className="bg-gray-800 border-gray-700 w-full max-w-md mx-auto mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-purple-400" />
                  Kiosk Mode
                </CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  Lock the screen for unattended use. Perfect for leaving at a door or counter.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="kiosk-password" className="text-sm">
                    Set Unlock Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="kiosk-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password (min 4 chars)"
                      value={kioskPassword}
                      onChange={(e) => setKioskPassword(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-sm pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-sm"
                  onClick={handleEnterKioskMode}
                  disabled={!kioskPassword || kioskPassword.length < 4}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Enable Kiosk Mode
                </Button>
              </CardFooter>
            </Card>

            <Button variant="link" className="mt-4 text-purple-400" onClick={handleCreateAnother}>
              Create Another Payment
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
