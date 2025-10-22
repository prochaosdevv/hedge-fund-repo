"use client"

import { useState } from "react"
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWeb3 } from "@/lib/web3"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import type { HedgeFund } from "@/lib/types"
import { Info, AlertTriangle } from "lucide-react"

interface InvestmentDialogProps {
  fund: HedgeFund
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InvestmentDialog({ fund, open, onOpenChange }: InvestmentDialogProps) {
  const { isConnected } = useWeb3()
  const { toast } = useToast()

  const [amount, setAmount] = useState("")
  const [stopLoss, setStopLoss] = useState("10")
  const [takeProfit, setTakeProfit] = useState("25")
  const [isInvesting, setIsInvesting] = useState(false)

  const handleInvest = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to invest",
        variant: "destructive",
      })
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid investment amount",
        variant: "destructive",
      })
      return
    }

    setIsInvesting(true)

    try {
      // Simulate investment (in production, this would interact with smart contracts)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("[v0] Investment details:", {
        fundId: fund.id,
        amount: Number.parseFloat(amount),
        stopLoss: Number.parseFloat(stopLoss),
        takeProfit: Number.parseFloat(takeProfit),
      })

      toast({
        title: "Investment successful!",
        description: `You've invested $${amount} in ${fund.name}`,
      })

      onOpenChange(false)
      setAmount("")
      setStopLoss("10")
      setTakeProfit("25")
    } catch (error) {
      console.error("[v0] Error investing:", error)
      toast({
        title: "Investment failed",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsInvesting(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {/* Overlay (optional if your Dialog already provides one) */}
        <DialogOverlay className="fixed inset-0 bg-black/50 z-40" />

        {/* Modal content */}
        <DialogContent className="bg-white border-border text-text max-w-md rounded-2xl p-6 shadow-2xl z-50">
          <DialogHeader>
            <DialogTitle className="text-text">Invest in {fund.name}</DialogTitle>
            <DialogDescription className="text-text-muted">
              Set your investment amount and risk management parameters
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Investment Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-text">
                Investment Amount (USD)
              </Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-background border-border text-text"
              />
            </div>

            {/* Stop Loss */}
            <div className="space-y-2">
              <Label htmlFor="stop-loss" className="text-text">
                Stop Loss (%)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="stop-loss"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  className="bg-background border-border text-text"
                />
                <div className="flex items-center gap-1 text-text-muted text-sm whitespace-nowrap">
                  <AlertTriangle className="h-4 w-4 text-error" />
                  <span>Auto-exit at -{stopLoss}%</span>
                </div>
              </div>
            </div>

            {/* Take Profit */}
            <div className="space-y-2">
              <Label htmlFor="take-profit" className="text-text">
                Take Profit (%)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="take-profit"
                  type="number"
                  min="0"
                  max="1000"
                  step="0.1"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  className="bg-background border-border text-text"
                />
                <div className="flex items-center gap-1 text-text-muted text-sm whitespace-nowrap">
                  <Info className="h-4 w-4 text-success" />
                  <span>Auto-exit at +{takeProfit}%</span>
                </div>
              </div>
            </div>

            {/* Manager Commission */}
            <div className="p-3 rounded-lg bg-background border border-border">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-primary mt-0.5" />
                <div className="text-sm text-text-muted">
                  <p className="font-medium text-text mb-1">Manager Commission</p>
                  <p>
                    The fund manager charges a {fund.commissionRate}% commission on profits only. You keep 100% of your
                    principal.
                  </p>
                </div>
              </div>
            </div>

            {/* Platform Commission */}
            <div className="p-3 rounded-lg bg-background border border-border">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-primary mt-0.5" />
                <div className="text-sm text-text-muted">
                  <p className="font-medium text-text mb-1">Platform Commission</p>
                  <p>We charge 1% of your investment amount as our platform fee.</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-background border-border text-text hover:bg-surface"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInvest}
              disabled={!amount || Number.parseFloat(amount) <= 0 || isInvesting}
              className="bg-primary hover:bg-primary-dark text-background"
            >
              {isInvesting ? "Processing..." : "Confirm Investment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </>
  )
}
