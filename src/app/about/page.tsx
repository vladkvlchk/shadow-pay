import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shield, Zap, Lock, WifiOff } from "lucide-react"

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <h1 className="text-3xl font-bold">About ShadowPay</h1>
          <p className="text-gray-400 mt-2">Private, offline crypto payments powered by INTMAX</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <WifiOff className="h-5 w-5 text-purple-500" />
                Offline First
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                ShadowPay enables crypto payments without requiring an internet connection at the time of transaction.
                This makes it perfect for events in areas with poor connectivity, remote locations, or during network
                outages.
              </p>
              <p className="text-gray-300 mt-4">
                Transactions are stored locally and automatically synchronized with the INTMAX network once internet
                connectivity is restored.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-500" />
                Privacy Focused
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                ShadowPay leverages INTMAX's privacy features to ensure your financial transactions remain confidential.
                No personal data is exposed in the payment process, and transactions are protected with advanced
                cryptography.
              </p>
              <p className="text-gray-300 mt-4">
                The stateless nature of INTMAX means there's no central authority tracking your payment history.
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-4">How It Works</h2>

        <div className="space-y-6 mb-12">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl">1. Creating a Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                When you create a payment, ShadowPay generates a signed transaction using the INTMAX SDK. This
                transaction contains all the necessary information for processing, including the amount, recipient
                address, and cryptographic signatures.
              </p>
              <p className="text-gray-300 mt-4">
                The transaction data is encoded into a QR code that can be scanned by the recipient.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl">2. Scanning a Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                The recipient scans the QR code using the ShadowPay app. The app decodes the transaction data and
                verifies its integrity and authenticity using cryptographic methods.
              </p>
              <p className="text-gray-300 mt-4">
                The transaction is stored locally on the recipient's device, ready to be synchronized with the INTMAX
                network.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl">3. Synchronizing with INTMAX</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                When internet connectivity is available, ShadowPay automatically submits pending transactions to the
                INTMAX network. The network processes the transactions, updating balances and confirming the transfers.
              </p>
              <p className="text-gray-300 mt-4">
                Thanks to INTMAX's near-zero fee structure, transactions are processed efficiently and economically.
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-4">Technical Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-purple-500" />
                Cryptographic Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                All transactions are cryptographically signed and verified, ensuring that only authorized parties can
                create and process payments.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-500" />
                Stateless Architecture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                INTMAX's stateless design means there's no need for account creation or registration, making payments
                simple and accessible.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <WifiOff className="h-5 w-5 text-purple-500" />
                Offline Capability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                ShadowPay uses local storage and PWA technology to enable full functionality even when offline, with
                seamless synchronization when connectivity returns.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center py-8 border-t border-gray-800">
          <p className="text-gray-400">ShadowPay is powered by INTMAX technology</p>
          <p className="text-sm text-gray-500 mt-2">© {new Date().getFullYear()} ShadowPay</p>
        </div>
      </main>
    </div>
  )
}
