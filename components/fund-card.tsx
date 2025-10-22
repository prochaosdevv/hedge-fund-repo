"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { InvestmentDialog } from "@/components/investment-dialog"
import type { HedgeFund } from "@/lib/types"
import { TrendingUp, TrendingDown, Users, DollarSign, Clock } from "lucide-react"

interface FundCardProps {
  fund: HedgeFund
}

export function FundCard({ fund }: FundCardProps) {
  const [showInvestDialog, setShowInvestDialog] = useState(false)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatPerformance = (value: number) => {
    const isPositive = value > 0
    return {
      value: `${isPositive ? "+" : ""}${value.toFixed(2)}%`,
      color: isPositive ? "text-success" : "text-destructive",
    }
  }

  return (
    <>
      <Card className="bg-surface border-border hover:border-primary/50 transition-colors">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <CardTitle className="text-text text-xl">{fund.name}</CardTitle>
            <Badge
              variant={fund.performance > 0 ? "default" : "destructive"}
              className={fund.performance > 0 ? "bg-success text-background" : ""}
            >
              {fund.performance > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {fund.performance > 0 ? "+" : ""}
              {fund.performance}%
            </Badge>
          </div>
          <CardDescription className="text-text-muted text-sm">Manager: {formatAddress(fund.manager)}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-text-muted text-sm line-clamp-2">{fund.description}</p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-text">
              <Clock className="h-4 w-4" />
              Performance
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-background border border-border rounded-lg p-2">
                <div className="text-xs text-text-muted mb-1">1H</div>
                <div className={`text-sm font-semibold ${formatPerformance(fund.performanceMetrics.oneHour).color}`}>
                  {formatPerformance(fund.performanceMetrics.oneHour).value}
                </div>
              </div>
              <div className="bg-background border border-border rounded-lg p-2">
                <div className="text-xs text-text-muted mb-1">6H</div>
                <div className={`text-sm font-semibold ${formatPerformance(fund.performanceMetrics.sixHours).color}`}>
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

          {/* Allocations */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-text">Asset Allocation</div>
            <div className="flex flex-wrap gap-2">
              {fund.allocations.map((alloc) => (
                <div
                  key={alloc.asset.symbol}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-background border border-border"
                >
                  <span className="text-sm">{alloc.asset.icon}</span>
                  <span className="text-sm text-text">{alloc.asset.symbol}</span>
                  <span className="text-sm text-text-muted">{alloc.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-text-muted text-xs">
                <DollarSign className="h-3 w-3" />
                Total Value
              </div>
              <div className="text-text font-semibold">{formatCurrency(fund.totalValue)}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-text-muted text-xs">
                <Users className="h-3 w-3" />
                Investors
              </div>
              <div className="text-text font-semibold">{fund.investorCount}</div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={() => setShowInvestDialog(true)}
              className="w-full bg-primary hover:bg-primary-dark text-background"
            >
              Invest Now
            </Button>
          </div>
        </CardContent>
      </Card>

      <InvestmentDialog fund={fund} open={showInvestDialog} onOpenChange={setShowInvestDialog} />
    </>
  )
}
