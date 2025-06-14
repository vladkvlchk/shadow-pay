"use client"

import type { ReactNode } from "react"
// import { ThemeProvider } from "@/components/theme-provider"
import { MockWalletProvider } from "@/hooks/use-mock-wallet"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MockWalletProvider>
      {/* <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange> */}
        {children}
      {/* </ThemeProvider> */}
    </MockWalletProvider>
  )
}
