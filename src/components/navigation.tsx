"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Ghost, QrCode, Scan, History } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const pathname = usePathname()

  return (
    <header className="border-b border-gray-800 bg-black">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {/* <Ghost className="h-6 w-6 text-purple-500" /> */}
            <Image src="/logo.png" alt="logo"  width="70" height={40} />
            <span className="font-bold text-xl">ShadowPay</span>
          </Link>

          <nav className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={cn("text-gray-400 hover:text-black", pathname === "/create" && "text-purple-400 bg-gray-900")}
            >
              <Link href="/create" className="flex items-center gap-1">
                <QrCode className="h-4 w-4" />
                <span>Create</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className={cn("text-gray-400 hover:text-black", pathname === "/scan" && "text-purple-400 bg-gray-900")}
            >
              <Link href="/scan" className="flex items-center gap-1">
                <Scan className="h-4 w-4" />
                <span>Scan</span>
              </Link>
            </Button>

            {/* <Button
              variant="ghost"
              size="sm"
              asChild
              className={cn("text-gray-400 hover:text-white", pathname === "/history" && "text-purple-400 bg-gray-900")}
            >
              <Link href="/history" className="flex items-center gap-1">
                <History className="h-4 w-4" />
                <span>History</span>
              </Link>
            </Button> */}
          </nav>
        </div>
      </div>
    </header>
  )
}
