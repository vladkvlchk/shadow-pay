import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Ghost, Wifi, WifiOff, ArrowRight, Shield } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
            {/* <Ghost className="h-8 w-8 text-purple-500" /> */}
            <Image src="/logo.png" alt="logo"  width="70" height={40} />
            <h1 className="text-2xl font-bold">ShadowPay</h1>
          </div>
          <nav>
            <Button variant="ghost" asChild>
              <Link href="/about">About</Link>
            </Button>
          </nav>
        </header>

        <section className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Private Offline Crypto Payments</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Send and receive crypto payments without an internet connection. Your transactions sync to INTMAX when
            you're back online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="">
              <Link href="/create">Create Payment</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-black text-black"
            >
              <Link href="/scan">Scan Payment</Link>
            </Button>
          </div>
        </section>

        {/* <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <WifiOff className="h-8 w-8 text-purple-500 mb-2" />
              <CardTitle>Offline First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Generate and scan payment QR codes without an internet connection. Perfect for events, remote areas, or
                when networks are down.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Shield className="h-8 w-8 text-purple-500 mb-2" />
              <CardTitle>Completely Private</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Leveraging INTMAX's privacy features, your transactions remain confidential. No personal data is exposed
                in the payment process.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Wifi className="h-8 w-8 text-purple-500 mb-2" />
              <CardTitle>Auto-Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Transactions are automatically synchronized with the INTMAX network once internet connectivity is
                restored.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-purple-900 rounded-full p-2 text-purple-300">1</div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Create a Payment</h3>
                  <p className="text-gray-300">
                    Enter amount and generate a QR code containing the signed transaction data.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-purple-900 rounded-full p-2 text-purple-300">2</div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Scan the Code</h3>
                  <p className="text-gray-300">The recipient scans the QR code using the ShadowPay app.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-purple-900 rounded-full p-2 text-purple-300">3</div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Auto-Sync When Online</h3>
                  <p className="text-gray-300">
                    The transaction is stored locally and automatically submitted to INTMAX when internet is available.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="link" className="text-purple-400">
                <Link href="/about" className="flex items-center">
                  Learn more about the technology <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </section> */}

        <footer className="text-center text-gray-400 py-8">
          <p>ShadowPay - Powered by INTMAX</p>
          <p className="text-sm mt-2">Private, Stateless, Near-Zero Fee Transactions</p>
        </footer>
      </div>
    </main>
  )
}
