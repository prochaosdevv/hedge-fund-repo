"use client"

import Link from "next/link"
import { WalletButton } from "./wallet-button"
import { TrendingUp } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              DeFund
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/explore"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Explore Funds
            </Link>
            <Link
              href="/create"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Create Fund
            </Link>
            <Link
              href="/portfolio"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Portfolio
            </Link>
          </nav>

          <WalletButton />
        </div>
      </div>
    </header>
  )
}
