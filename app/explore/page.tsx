"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { FundCard } from "@/components/fund-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, TrendingUp } from "lucide-react"
import type { HedgeFund } from "@/lib/types"

const MOCK_FUNDS: HedgeFund[] = [
  {
    id: "1",
    name: "Crypto Growth Fund",
    manager: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    description: "Aggressive growth strategy focused on high-cap cryptocurrencies with strong fundamentals",
    allocations: [
      { asset: { symbol: "ETH", name: "Ethereum", address: "0x0", icon: "⟠" }, percentage: 40 },
      { asset: { symbol: "WBTC", name: "Wrapped Bitcoin", address: "0x0", icon: "₿" }, percentage: 35 },
      { asset: { symbol: "LINK", name: "Chainlink", address: "0x0", icon: "⬡" }, percentage: 25 },
    ],
    commissionRate: 10,
    totalValue: 1250000,
    investorCount: 47,
    performance: 23.5,
    performanceMetrics: {
      oneHour: 0.8,
      sixHours: 2.3,
      twentyFourHours: 5.7,
      fortyEightHours: 8.9,
    },
    createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
  },
  {
    id: "2",
    name: "Stable Yield Fund",
    manager: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    description: "Conservative strategy with focus on stablecoins and low-volatility assets",
    allocations: [
      { asset: { symbol: "USDC", name: "USD Coin", address: "0x0", icon: "$" }, percentage: 50 },
      { asset: { symbol: "DAI", name: "Dai Stablecoin", address: "0x0", icon: "◈" }, percentage: 30 },
      { asset: { symbol: "USDT", name: "Tether", address: "0x0", icon: "₮" }, percentage: 20 },
    ],
    commissionRate: 5,
    totalValue: 850000,
    investorCount: 123,
    performance: 8.2,
    performanceMetrics: {
      oneHour: 0.1,
      sixHours: 0.3,
      twentyFourHours: 0.8,
      fortyEightHours: 1.2,
    },
    createdAt: Date.now() - 180 * 24 * 60 * 60 * 1000,
  },
  {
    id: "3",
    name: "Balanced Portfolio",
    manager: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
    description: "Diversified approach balancing growth potential with stability",
    allocations: [
      { asset: { symbol: "ETH", name: "Ethereum", address: "0x0", icon: "⟠" }, percentage: 30 },
      { asset: { symbol: "WBTC", name: "Wrapped Bitcoin", address: "0x0", icon: "₿" }, percentage: 25 },
      { asset: { symbol: "USDC", name: "USD Coin", address: "0x0", icon: "$" }, percentage: 25 },
      { asset: { symbol: "LINK", name: "Chainlink", address: "0x0", icon: "⬡" }, percentage: 20 },
    ],
    commissionRate: 8,
    totalValue: 2100000,
    investorCount: 89,
    performance: 15.7,
    performanceMetrics: {
      oneHour: 0.5,
      sixHours: 1.4,
      twentyFourHours: 3.2,
      fortyEightHours: 5.1,
    },
    createdAt: Date.now() - 120 * 24 * 60 * 60 * 1000,
  },
  {
    id: "4",
    name: "DeFi Alpha Fund",
    manager: "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359",
    description: "High-risk, high-reward strategy targeting emerging DeFi opportunities",
    allocations: [
      { asset: { symbol: "ETH", name: "Ethereum", address: "0x0", icon: "⟠" }, percentage: 50 },
      { asset: { symbol: "LINK", name: "Chainlink", address: "0x0", icon: "⬡" }, percentage: 30 },
      { asset: { symbol: "DAI", name: "Dai Stablecoin", address: "0x0", icon: "◈" }, percentage: 20 },
    ],
    commissionRate: 15,
    totalValue: 680000,
    investorCount: 34,
    performance: 31.2,
    performanceMetrics: {
      oneHour: 1.2,
      sixHours: 3.8,
      twentyFourHours: 7.5,
      fortyEightHours: 12.3,
    },
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
  },
]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("performance")
  const [funds, setFunds] = useState([])

  const getFunds = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API + '/funds');
      const data = await response.json();
      setFunds(data.data);
    } catch (error) {
      console.error("Error fetching funds:", error);
    } 
  }

  useEffect(() => {
    getFunds();
  }, []);

  // const filteredFunds = MOCK_FUNDS.filter(
  //   (fund) =>
  //     fund.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     fund.description.toLowerCase().includes(searchQuery.toLowerCase()),
  // )

  // const sortedFunds = [...filteredFunds].sort((a, b) => {
  //   switch (sortBy) {
  //     case "performance":
  //       return b.performance - a.performance
  //     case "totalValue":
  //       return b.totalValue - a.totalValue
  //     case "investors":
  //       return b.investorCount - a.investorCount
  //     default:
  //       return 0
  //   }
  // })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-text">Explore Hedge Funds</h1>
          <p className="text-text-muted text-lg">Discover and invest in top-performing decentralized funds</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              placeholder="Search funds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-surface border-border text-text"
            />
          </div>

          {/* <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48 bg-surface border-border text-text">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="performance">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Performance
                </div>
              </SelectItem>
              <SelectItem value="totalValue">Total Value</SelectItem>
              <SelectItem value="investors">Investor Count</SelectItem>
            </SelectContent>
          </Select> */}
        </div>

        {funds.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {funds.map((fund) => (
              <FundCard key={fund._id} fund={fund} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-muted text-lg">No funds found matching your search</p>
          </div>
        )}
      </main>
    </div>
  )
}
