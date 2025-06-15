import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Ghost, Wifi, WifiOff, ArrowRight, Shield } from "lucide-react"
import { QrCode, Scan } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Hero Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-30"
          style={{ filter: "brightness(1)" }}
        >
          <source src="/hero-animation.mp4" type="video/mp4" />
          {/* Fallback gradient if video fails to load */}
          <div className="w-full h-full bg-gradient-to-b from-black via-gray-900 to-black" />
        </video>
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          <header className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="logo"  width="70" height={40} />
              <span className="font-bold text-xl">ShadowPay</span>
            </div>
            <nav>
              <Button variant="ghost" asChild>
                <Link href="/about">About</Link>
              </Button>
            </nav>
          </header>

          <section className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Private Offline Crypto Payments</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8 drop-shadow-md">
              Send and receive crypto payments without an internet connection. Your transactions sync to INTMAX when
              you're back online.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <Link href="/create" className="group">
                <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700 hover:bg-gray-750/80 hover:border-purple-600 transition-all duration-300 h-full">
                  <CardContent className="p-8 flex flex-col items-center text-center">
                    <div className="bg-purple-900/30 p-4 rounded-full mb-4 group-hover:bg-purple-900/50 transition-colors">
                      <QrCode className="h-12 w-12 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Create Payment</h3>
                    <p className="text-gray-400">Generate a QR code for someone to scan and pay you</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/scan" className="group">
                <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700 hover:bg-gray-750/80 hover:border-purple-600 transition-all duration-300 h-full">
                  <CardContent className="p-8 flex flex-col items-center text-center">
                    <div className="bg-purple-900/30 p-4 rounded-full mb-4 group-hover:bg-purple-900/50 transition-colors">
                      <Scan className="h-12 w-12 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Scan Payment</h3>
                    <p className="text-gray-400">Scan a QR code to receive a payment</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>

          {/* <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <WifiOff className="h-8 w-8 text-purple-500 mb-2" />
                <CardTitle>Offline First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Generate and scan payment QR codes without an internet connection. Perfect for events, remote areas,
                  or when networks are down.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <Shield className="h-8 w-8 text-purple-500 mb-2" />
                <CardTitle>Completely Private</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Leveraging INTMAX's privacy features, your transactions remain confidential. No personal data is
                  exposed in the payment process.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700">
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
            <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-900 rounded-full p-2 text-purple-300 flex-shrink-0">1</div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Create a Payment</h3>
                    <p className="text-gray-300">
                      Enter amount and generate a QR code containing the signed transaction data.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-purple-900 rounded-full p-2 text-purple-300 flex-shrink-0">2</div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Scan the Code</h3>
                    <p className="text-gray-300">The recipient scans the QR code using the Shadow app.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-purple-900 rounded-full p-2 text-purple-300 flex-shrink-0">3</div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Auto-Sync When Online</h3>
                    <p className="text-gray-300">
                      The transaction is stored locally and automatically submitted to INTMAX when internet is
                      available.
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
      </div>
    </main>
  )
}
