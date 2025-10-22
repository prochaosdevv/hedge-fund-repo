export interface Asset {
  symbol: string
  name: string
  address: string
  icon: string
}

export interface FundAllocation {
  asset: Asset
  percentage: number
}

export interface PerformanceMetrics {
  oneHour: number
  sixHours: number
  twentyFourHours: number
  fortyEightHours: number
}

export interface HedgeFund {
  id: string
  name: string
  manager: string
  description: string
  allocations: FundAllocation[]
  commissionRate: number
  totalValue: number
  investorCount: number
  performance: number
  performanceMetrics: PerformanceMetrics
  createdAt: number
}

export interface Investment {
  fundId: string
  investor: string
  amount: number
  stopLoss: number
  takeProfit: number
  entryPrice: number
  currentValue: number
  timestamp: number
}
