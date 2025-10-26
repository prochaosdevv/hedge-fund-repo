"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { InvestmentDialog } from "@/components/investment-dialog"
import type { HedgeFund } from "@/lib/types"
import { TrendingUp, TrendingDown, Users, DollarSign, Clock } from "lucide-react"
import { WHITELISTED_ASSETS } from "@/lib/constants"
 

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
    <div>
      <Card className="bg-surface border-border hover:border-primary/50 transition-colors">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <CardTitle className="text-text text-xl">{fund.name}</CardTitle>
            * <Badge
              variant={fund.managerPerfommace?.ai.riskScore || 0 > 0 ? "default" : "destructive"}
              className={fund.managerPerfommace?.ai.riskScore || 0 > 0 ? "bg-success text-background" : ""}
            >
              {fund.managerPerfommace?.ai.riskScore || 0 > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {fund.managerPerfommace?.ai.riskScore || 0 > 0 ? "+" : ""}
              {fund.managerPerfommace?.ai.riskScore || 0 }%
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
                <div className={`text-sm font-semibold ${formatPerformance(fund.performance?.oneHour || 0).color}`}>
                  
                  {formatPerformance(fund.performance?.oneHour || 0 ).value}
                </div>
              </div>
              <div className="bg-background border border-border rounded-lg p-2">
                <div className="text-xs text-text-muted mb-1">6H</div>
                <div className={`text-sm font-semibold ${formatPerformance(fund.performance?.sixHours || 0).color}`}>
                  {formatPerformance(fund.performance?.sixHours || 0 ).value}
                  
                </div>
              </div>
              <div className="bg-background border border-border rounded-lg p-2">
                <div className="text-xs text-text-muted mb-1">24H</div>
                <div
                  className={`text-sm font-semibold ${formatPerformance(fund.performance?.twentyFourHours || 0).color}`}
                > 
                                   {formatPerformance(fund.performance?.twentyFourHours || 0 ).value}

                </div>
              </div>
              <div className="bg-background border border-border rounded-lg p-2">
                <div className="text-xs text-text-muted mb-1">48H</div>
                <div
                  className={`text-sm font-semibold ${formatPerformance(fund.performance?.fortyEightHours || 0).color}`}
                > 
                     {formatPerformance(fund.performance?.fortyEightHours || 0 ).value}
                </div>
              </div>
            </div>
          </div>

          {/* Allocations */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-text">Asset Allocation</div>
            <div className="flex flex-wrap gap-2">
              {fund.assets.map((alloc) => (
                <div
                  key={alloc._id}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-background border border-border"
                >
                  <span className="text-sm">{WHITELISTED_ASSETS.find((v) => v.address == alloc.address )?.symbol}</span>
                  {/* <span className="text-sm text-text">{alloc.asset.symbol}</span> */}
                  <span className="text-sm text-text-muted">{alloc.share}%</span>
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
              <div className="text-text font-semibold">{formatCurrency(fund.tvl || 0)}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-text-muted text-xs">
                <Users className="h-3 w-3" />
                Investors
              </div>
              <div className="text-text font-semibold">{fund.inverstors || 0}</div>
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
      </div>
    </>
  )
}
