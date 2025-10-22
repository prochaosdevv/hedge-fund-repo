"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useWeb3 } from "@/lib/web3"
import { TrendingUp, TrendingDown, DollarSign, PieChart, AlertCircle, ExternalLink, Clock } from "lucide-react"
import type { Investment, HedgeFund } from "@/lib/types"

// Mock data for demonstration
const MOCK_INVESTMENTS: Investment[] = [
  {
    fundId: "1",
    investor: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    amount: 5000,
    stopLoss: 10,
    takeProfit: 25,
    entryPrice: 5000,
    currentValue: 6175,
    timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  {
    fundId: "3",
    investor: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    amount: 10000,
    stopLoss: 15,
    takeProfit: 30,
    entryPrice: 10000,
    currentValue: 11570,
    timestamp: Date.now() - 45 * 24 * 60 * 60 * 1000,
  },
  {
    fundId: "2",
    investor: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    amount: 3000,
    stopLoss: 8,
    takeProfit: 20,
    entryPrice: 3000,
    currentValue: 3246,
    timestamp: Date.now() - 15 * 24 * 60 * 60 * 1000,
  },
]

const MOCK_FUNDS_MAP: Record<string, HedgeFund> = {
  "1": {
    id: "1",
    name: "Crypto Growth Fund",
    manager: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    description: "Aggressive growth strategy",
    allocations: [],
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
    createdAt: Date.now(),
  },
  "2": {
    id: "2",
    name: "Stable Yield Fund",
    manager: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    description: "Conservative strategy",
    allocations: [],
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
    createdAt: Date.now(),
  },
  "3": {
    id: "3",
    name: "Balanced Portfolio",
    manager: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
    description: "Diversified approach",
    allocations: [],
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
    createdAt: Date.now(),
  },
}

// Mock data for funds created by the user
const MOCK_CREATED_FUNDS: HedgeFund[] = [
  {
    id: "4",
    name: "Tech Innovation Fund",
    manager: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    description: "Focus on emerging blockchain technologies and DeFi protocols",
    allocations: [
      { asset: { symbol: "ETH", name: "Ethereum", address: "0x0", icon: "⟠" }, percentage: 40 },
      { asset: { symbol: "WBTC", name: "Wrapped Bitcoin", address: "0x0", icon: "₿" }, percentage: 30 },
      { asset: { symbol: "SOL", name: "Solana", address: "0x0", icon: "◎" }, percentage: 20 },
      { asset: { symbol: "AVAX", name: "Avalanche", address: "0x0", icon: "▲" }, percentage: 10 },
    ],
    commissionRate: 12,
    totalValue: 875000,
    investorCount: 34,
    performance: 28.4,
    performanceMetrics: {
      oneHour: 1.1,
      sixHours: 3.2,
      twentyFourHours: 6.8,
      fortyEightHours: 11.5,
    },
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
  },
  {
    id: "5",
    name: "DeFi Yield Optimizer",
    manager: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    description: "Automated yield farming across multiple protocols",
    allocations: [
      { asset: { symbol: "USDC", name: "USD Coin", address: "0x0", icon: "$" }, percentage: 50 },
      { asset: { symbol: "DAI", name: "Dai Stablecoin", address: "0x0", icon: "◈" }, percentage: 30 },
      { asset: { symbol: "USDT", name: "Tether", address: "0x0", icon: "₮" }, percentage: 20 },
    ],
    commissionRate: 8,
    totalValue: 1420000,
    investorCount: 67,
    performance: 12.8,
    performanceMetrics: {
      oneHour: 0.2,
      sixHours: 0.6,
      twentyFourHours: 1.5,
      fortyEightHours: 2.8,
    },
    createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
  },
]

export default function PortfolioPage() {
  const { isConnected, account } = useWeb3()
  const [activeTab, setActiveTab] = useState("investments")

  const totalInvested = MOCK_INVESTMENTS.reduce((sum, inv) => sum + inv.amount, 0)
  const totalCurrentValue = MOCK_INVESTMENTS.reduce((sum, inv) => sum + inv.currentValue, 0)
  const totalProfitLoss = totalCurrentValue - totalInvested
  const totalProfitLossPercent = ((totalProfitLoss / totalInvested) * 100).toFixed(2)

  const totalFundsValue = MOCK_CREATED_FUNDS.reduce((sum, fund) => sum + fund.totalValue, 0)
  const totalInvestors = MOCK_CREATED_FUNDS.reduce((sum, fund) => sum + fund.investorCount, 0)
  const totalCommissionEarned = MOCK_CREATED_FUNDS.reduce((sum, fund) => {
    const profit = fund.totalValue * (fund.performance / 100)
    return sum + profit * (fund.commissionRate / 100)
  }, 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatPerformance = (value: number) => {
    const isPositive = value > 0
    return {
      value: `${isPositive ? "+" : ""}${value.toFixed(2)}%`,
      color: isPositive ? "text-success" : "text-destructive",
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <AlertCircle className="h-16 w-16 text-text-muted mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-text">Connect Your Wallet</h2>
            <p className="text-text-muted mb-6">Please connect your wallet to view your portfolio</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-text">Portfolio Dashboard</h1>
          <p className="text-text-muted text-lg">Track your investments and performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-surface border-border">
            <CardHeader className="pb-3">
              <CardDescription className="text-text-muted">Total Invested</CardDescription>
              <CardTitle className="text-3xl text-text">{formatCurrency(totalInvested)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <DollarSign className="h-4 w-4" />
                <span>Across {MOCK_INVESTMENTS.length} funds</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border">
            <CardHeader className="pb-3">
              <CardDescription className="text-text-muted">Current Value</CardDescription>
              <CardTitle className="text-3xl text-text">{formatCurrency(totalCurrentValue)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <PieChart className="h-4 w-4" />
                <span>Live portfolio value</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border">
            <CardHeader className="pb-3">
              <CardDescription className="text-text-muted">Total Profit/Loss</CardDescription>
              <CardTitle className={`text-3xl ${totalProfitLoss >= 0 ? "text-success" : "text-error"}`}>
                {totalProfitLoss >= 0 ? "+" : ""}
                {formatCurrency(totalProfitLoss)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                {totalProfitLoss >= 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-success">+{totalProfitLossPercent}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-error" />
                    <span className="text-error">{totalProfitLossPercent}%</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-surface border border-border">
            <TabsTrigger
              value="investments"
              className="data-[state=active]:bg-primary data-[state=active]:text-background"
            >
              Active Investments
            </TabsTrigger>
            <TabsTrigger
              value="my-funds"
              className="data-[state=active]:bg-primary data-[state=active]:text-background"
            >
              My Funds
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-background">
              Transaction History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="investments" className="mt-6">
            <div className="space-y-4">
              {MOCK_INVESTMENTS.map((investment) => {
                const fund = MOCK_FUNDS_MAP[investment.fundId]
                const profitLoss = investment.currentValue - investment.amount
                const profitLossPercent = ((profitLoss / investment.amount) * 100).toFixed(2)
                const stopLossValue = investment.amount * (1 - investment.stopLoss / 100)
                const takeProfitValue = investment.amount * (1 + investment.takeProfit / 100)
                const progressToTakeProfit =
                  ((investment.currentValue - investment.amount) / (takeProfitValue - investment.amount)) * 100

                return (
                  <Card key={`${investment.fundId}-${investment.timestamp}`} className="bg-surface border-border">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-text text-xl">{fund.name}</CardTitle>
                          <CardDescription className="text-text-muted">
                            Invested on {formatDate(investment.timestamp)}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={profitLoss >= 0 ? "default" : "destructive"}
                          className={profitLoss >= 0 ? "bg-success text-background" : ""}
                        >
                          {profitLoss >= 0 ? "+" : ""}
                          {profitLossPercent}%
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-text">
                          <Clock className="h-4 w-4" />
                          Fund Performance
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <div className="bg-background border border-border rounded-lg p-2">
                            <div className="text-xs text-text-muted mb-1">1H</div>
                            <div
                              className={`text-sm font-semibold ${formatPerformance(fund.performanceMetrics.oneHour).color}`}
                            >
                              {formatPerformance(fund.performanceMetrics.oneHour).value}
                            </div>
                          </div>
                          <div className="bg-background border border-border rounded-lg p-2">
                            <div className="text-xs text-text-muted mb-1">6H</div>
                            <div
                              className={`text-sm font-semibold ${formatPerformance(fund.performanceMetrics.sixHours).color}`}
                            >
                              {formatPerformance(fund.performanceMetrics.sixHours).value}
                            </div>
                          </div>
                          <div className="bg-background border border-border rounded-lg p-2">
                            <div className="text-xs text-text-muted mb-1">24H</div>
                            <div
                              className={`text-sm font-semibold ${formatPerformance(fund.performanceMetrics.twentyFourHours).color}`}
                            >
                              {formatPerformance(fund.performanceMetrics.twentyFourHours).value}
                            </div>
                          </div>
                          <div className="bg-background border border-border rounded-lg p-2">
                            <div className="text-xs text-text-muted mb-1">48H</div>
                            <div
                              className={`text-sm font-semibold ${formatPerformance(fund.performanceMetrics.fortyEightHours).color}`}
                            >
                              {formatPerformance(fund.performanceMetrics.fortyEightHours).value}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <div className="text-text-muted text-sm mb-1">Invested</div>
                          <div className="text-text font-semibold">{formatCurrency(investment.amount)}</div>
                        </div>
                        <div>
                          <div className="text-text-muted text-sm mb-1">Current Value</div>
                          <div className="text-text font-semibold">{formatCurrency(investment.currentValue)}</div>
                        </div>
                        <div>
                          <div className="text-text-muted text-sm mb-1">Profit/Loss</div>
                          <div className={`font-semibold ${profitLoss >= 0 ? "text-success" : "text-error"}`}>
                            {profitLoss >= 0 ? "+" : ""}
                            {formatCurrency(profitLoss)}
                          </div>
                        </div>
                        <div>
                          <div className="text-text-muted text-sm mb-1">Commission Rate</div>
                          <div className="text-text font-semibold">{fund.commissionRate}%</div>
                        </div>
                      </div>

                      {/* Risk Management Progress */}
                      <div className="space-y-3 pt-3 border-t border-border">
                        <div className="text-sm font-medium text-text">Risk Management</div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-text-muted">Progress to Take Profit</span>
                            <span className="text-text font-medium">
                              {formatCurrency(investment.currentValue)} / {formatCurrency(takeProfitValue)}
                            </span>
                          </div>
                          <Progress
                            value={Math.min(Math.max(progressToTakeProfit, 0), 100)}
                            className="h-2 bg-background"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="p-2 rounded bg-background border border-border">
                            <div className="text-text-muted mb-1">Stop Loss</div>
                            <div className="text-error font-semibold">
                              -{investment.stopLoss}% ({formatCurrency(stopLossValue)})
                            </div>
                          </div>
                          <div className="p-2 rounded bg-background border border-border">
                            <div className="text-text-muted mb-1">Take Profit</div>
                            <div className="text-success font-semibold">
                              +{investment.takeProfit}% ({formatCurrency(takeProfitValue)})
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-background border-border text-text hover:bg-surface"
                        >
                          Withdraw
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-background border-border text-text hover:bg-surface"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="my-funds" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="bg-surface border-border">
                <CardHeader className="pb-3">
                  <CardDescription className="text-text-muted">Total Funds Value</CardDescription>
                  <CardTitle className="text-2xl text-text">{formatCurrency(totalFundsValue)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-text-muted text-sm">
                    <PieChart className="h-4 w-4" />
                    <span>{MOCK_CREATED_FUNDS.length} active funds</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-surface border-border">
                <CardHeader className="pb-3">
                  <CardDescription className="text-text-muted">Total Investors</CardDescription>
                  <CardTitle className="text-2xl text-text">{totalInvestors}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-text-muted text-sm">
                    <DollarSign className="h-4 w-4" />
                    <span>Across all funds</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-surface border-border">
                <CardHeader className="pb-3">
                  <CardDescription className="text-text-muted">Commission Earned</CardDescription>
                  <CardTitle className="text-2xl text-success">{formatCurrency(totalCommissionEarned)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-success">From performance fees</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Created Funds List */}
            <div className="space-y-4">
              {MOCK_CREATED_FUNDS.map((fund) => {
                const commissionEarned = (fund.totalValue * (fund.performance / 100) * fund.commissionRate) / 100

                return (
                  <Card key={fund.id} className="bg-surface border-border">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-text text-xl">{fund.name}</CardTitle>
                          <CardDescription className="text-text-muted">
                            Created on {formatDate(fund.createdAt)}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={fund.performance >= 0 ? "default" : "destructive"}
                          className={fund.performance >= 0 ? "bg-success text-background" : ""}
                        >
                          {fund.performance >= 0 ? "+" : ""}
                          {fund.performance.toFixed(1)}%
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-text-muted text-sm">{fund.description}</p>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-text">
                          <Clock className="h-4 w-4" />
                          Performance
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <div className="bg-background border border-border rounded-lg p-2">
                            <div className="text-xs text-text-muted mb-1">1H</div>
                            <div
                              className={`text-sm font-semibold ${formatPerformance(fund.performanceMetrics.oneHour).color}`}
                            >
                              {formatPerformance(fund.performanceMetrics.oneHour).value}
                            </div>
                          </div>
                          <div className="bg-background border border-border rounded-lg p-2">
                            <div className="text-xs text-text-muted mb-1">6H</div>
                            <div
                              className={`text-sm font-semibold ${formatPerformance(fund.performanceMetrics.sixHours).color}`}
                            >
                              {formatPerformance(fund.performanceMetrics.sixHours).value}
                            </div>
                          </div>
                          <div className="bg-background border border-border rounded-lg p-2">
                            <div className="text-xs text-text-muted mb-1">24H</div>
                            <div
                              className={`text-sm font-semibold ${formatPerformance(fund.performanceMetrics.twentyFourHours).color}`}
                            >
                              {formatPerformance(fund.performanceMetrics.twentyFourHours).value}
                            </div>
                          </div>
                          <div className="bg-background border border-border rounded-lg p-2">
                            <div className="text-xs text-text-muted mb-1">48H</div>
                            <div
                              className={`text-sm font-semibold ${formatPerformance(fund.performanceMetrics.fortyEightHours).color}`}
                            >
                              {formatPerformance(fund.performanceMetrics.fortyEightHours).value}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <div className="text-text-muted text-sm mb-1">Total Value</div>
                          <div className="text-text font-semibold">{formatCurrency(fund.totalValue)}</div>
                        </div>
                        <div>
                          <div className="text-text-muted text-sm mb-1">Investors</div>
                          <div className="text-text font-semibold">{fund.investorCount}</div>
                        </div>
                        <div>
                          <div className="text-text-muted text-sm mb-1">Commission Rate</div>
                          <div className="text-text font-semibold">{fund.commissionRate}%</div>
                        </div>
                        <div>
                          <div className="text-text-muted text-sm mb-1">Commission Earned</div>
                          <div className="text-success font-semibold">{formatCurrency(commissionEarned)}</div>
                        </div>
                      </div>

                      {/* Asset Allocation */}
                      <div className="space-y-3 pt-3 border-t border-border">
                        <div className="text-sm font-medium text-text">Asset Allocation</div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {fund.allocations.map((allocation) => (
                            <div
                              key={allocation.asset.symbol}
                              className="p-2 rounded bg-background border border-border"
                            >
                              <div className="flex items-center gap-1 justify-center mb-1">
                                <span className="text-sm">{allocation.asset.icon}</span>
                                <span className="text-text font-semibold text-sm">{allocation.asset.symbol}</span>
                              </div>
                              <div className="text-text-muted text-sm text-center">{allocation.percentage}%</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-background border-border text-text hover:bg-surface"
                        >
                          Edit Fund
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-background border-border text-text hover:bg-surface"
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-background border-border text-text hover:bg-surface"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle className="text-text">Transaction History</CardTitle>
                <CardDescription className="text-text-muted">All your investment transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {MOCK_INVESTMENTS.map((investment) => {
                    const fund = MOCK_FUNDS_MAP[investment.fundId]
                    return (
                      <div
                        key={`${investment.fundId}-${investment.timestamp}`}
                        className="flex items-center justify-between p-3 rounded-lg bg-background border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-text">{fund.name}</div>
                            <div className="text-sm text-text-muted">{formatDate(investment.timestamp)}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-text">{formatCurrency(investment.amount)}</div>
                          <div className="text-sm text-text-muted">Investment</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
