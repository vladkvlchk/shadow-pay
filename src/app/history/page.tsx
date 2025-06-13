"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, RefreshCw, WifiOff, Check, AlertCircle } from "lucide-react"
import { getTransactions, syncPendingTransactions } from "@/lib/storage"
import { useNetworkStatus } from "@/hooks/use-network-status"

type Transaction = {
  id: string
  amount: number
  comment?: string
  timestamp: number
  type: "sent" | "received"
  status: "pending" | "completed" | "failed"
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [syncing, setSyncing] = useState(false)
  const { isOnline } = useNetworkStatus()

  useEffect(() => {
    loadTransactions()
  }, [activeTab])

  const loadTransactions = async () => {
    try {
      const allTransactions = await getTransactions()

      // Filter based on active tab
      let filtered = allTransactions
      if (activeTab === "sent") {
        filtered = allTransactions.filter((tx) => tx.type === "sent")
      } else if (activeTab === "received") {
        filtered = allTransactions.filter((tx) => tx.type === "received")
      } else if (activeTab === "pending") {
        filtered = allTransactions.filter((tx) => tx.status === "pending")
      }

      // Sort by timestamp (newest first)
      filtered.sort((a, b) => b.timestamp - a.timestamp)

      setTransactions(filtered)
    } catch (err) {
      console.error("Error loading transactions:", err)
    }
  }

  const handleSync = async () => {
    if (!isOnline) return

    setSyncing(true)
    try {
      await syncPendingTransactions()
      await loadTransactions()
    } catch (err) {
      console.error("Error syncing transactions:", err)
    } finally {
      setSyncing(false)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Transaction History</h1>

          <Button
            variant="outline"
            size="sm"
            className="border-purple-700 text-purple-400"
            onClick={handleSync}
            disabled={syncing || !isOnline}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
            Sync
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="received">Received</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {transactions.length === 0 ? (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="pt-6 pb-6 text-center text-gray-400">No transactions found</CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <Card key={tx.id} className="bg-gray-900 border-gray-800">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {tx.type === "sent" ? (
                            <div className="bg-red-900/30 p-2 rounded-full">
                              <ArrowUpRight className="h-4 w-4 text-red-400" />
                            </div>
                          ) : (
                            <div className="bg-green-900/30 p-2 rounded-full">
                              <ArrowDownLeft className="h-4 w-4 text-green-400" />
                            </div>
                          )}
                          <div>
                            <CardTitle className="text-base">{tx.type === "sent" ? "Sent" : "Received"}</CardTitle>
                            <CardDescription className="text-xs text-gray-400">
                              {formatDate(tx.timestamp)}
                            </CardDescription>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${tx.type === "sent" ? "text-red-400" : "text-green-400"}`}>
                            {tx.type === "sent" ? "-" : "+"}
                            {tx.amount} INTMAX
                          </span>

                          <Badge
                            variant="outline"
                            className={`
                              ${
                                tx.status === "completed"
                                  ? "border-green-800 text-green-400"
                                  : tx.status === "pending"
                                    ? "border-yellow-800 text-yellow-400"
                                    : "border-red-800 text-red-400"
                              }
                            `}
                          >
                            {tx.status === "completed" ? (
                              <Check className="h-3 w-3 mr-1" />
                            ) : tx.status === "pending" ? (
                              <WifiOff className="h-3 w-3 mr-1" />
                            ) : (
                              <AlertCircle className="h-3 w-3 mr-1" />
                            )}
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {tx.comment && <p className="text-sm text-gray-300 mt-2">{tx.comment}</p>}
                      <p className="text-xs text-gray-500 mt-1 truncate">ID: {tx.id}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
