"use client"

import { Badge } from "@/components/ui/badge"
import { useChainId } from "wagmi"
import { intmaxChain } from "@/lib/wagmi"

export function ChainIndicator() {
  const chainId = useChainId()

  // Check if connected to INTMAX chain
  const isIntmaxChain = chainId === intmaxChain.id

  if (!chainId) {
    return null
  }

  return (
    <Badge
      variant="outline"
      className={isIntmaxChain ? "border-purple-800 text-purple-400" : "border-red-800 text-red-400"}
    >
      {isIntmaxChain ? "INTMAX" : "Wrong Network"}
    </Badge>
  )
}
