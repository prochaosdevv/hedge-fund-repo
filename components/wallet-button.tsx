"use client"

import { useWeb3 } from "@/lib/web3"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react"

export function WalletButton() {
  const { account, isConnected, connect, disconnect } = useWeb3()

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (isConnected && account) {
    return (
      <Button
        variant="outline"
        onClick={disconnect}
        className="gap-2 bg-surface border-border hover:bg-surface-elevated text-text"
      >
        <Wallet className="h-4 w-4" />
        {formatAddress(account)}
        <LogOut className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button onClick={connect} className="gap-2 bg-primary hover:bg-primary-dark text-background">
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  )
}
