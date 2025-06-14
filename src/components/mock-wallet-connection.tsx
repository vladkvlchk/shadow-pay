"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, Loader2, AlertCircle, LogOut, Copy, Eye, EyeOff } from "lucide-react"
import { useMockWallet } from "@/hooks/use-mock-wallet"
import { formatAddress } from "@/lib/utils"
import { useState } from "react"

export function MockWalletConnection() {
  const { wallet, isConnecting, error, connect, disconnect, clearError } = useMockWallet()
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyAddress = async () => {
    if (wallet?.address) {
      await navigator.clipboard.writeText(wallet.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (wallet?.isConnected) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Wallet className="h-4 w-4 text-purple-400" />
            INTMAX Wallet Connected
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Address:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs">{formatAddress(wallet.address)}</span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleCopyAddress}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            {copied && <span className="text-xs text-green-400">Copied!</span>}
          </div>

          <div className="text-sm">
            <span className="text-gray-400">Balance: </span>
            <span className="font-medium">{wallet.balance.toFixed(4)} INTMAX</span>
          </div>

          <div className="text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Private Key:</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setShowPrivateKey(!showPrivateKey)}
              >
                {showPrivateKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
            </div>
            {showPrivateKey && (
              <div className="font-mono text-xs text-gray-300 break-all mt-1">{wallet.privateKey}</div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full border-red-700 text-red-400 hover:text-red-300"
            onClick={disconnect}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            {error}
            <Button variant="ghost" size="sm" onClick={clearError}>
              ×
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Button
        className="w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
        onClick={connect}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting to INTMAX...
          </>
        ) : (
          <>
            <Wallet className="h-5 w-5" />
            Connect INTMAX Wallet
          </>
        )}
      </Button>

      <div className="text-center text-xs text-gray-400 space-y-1">
        <p>Your wallet will be created automatically if you don't have one</p>
        <p className="text-purple-400">✨ This is a demo - no real transactions</p>
      </div>
    </div>
  )
}
