"use client"

import Link from "next/link"
import { WalletButton } from "./wallet-button"
import { TrendingUp } from "lucide-react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import { getUnifiedBalances, initializeWithProvider, isInitialized } from "@/lib/nexus"
import { useCallback, useEffect, useState } from "react"
import BalancesModal from "./BalancesModal"


export function Header() {


  const { connector,address } = useAccount();
    const [balances, setBalances] = useState<any>(null);
    const [balance, setBalance] = useState<any>(null);
    const [showModal,setShowModal] = useState<any>(null)

  const init = async () => {
    try {
      // Get the provider from the connected wallet
      const provider = await connector?.getProvider();
      if (!provider) throw new Error('No provider found');
      
      // We're calling our wrapper function from the lib/nexus.ts file here.
      await initializeWithProvider(provider);
      setBalanceFunc?.();
      
      // alert('Nexus initialized');
    } catch (e: any) {
      alert(e?.message ?? 'Init failed');
    }
  };

  const initialized= isInitialized()


  const setBalanceFunc = async() => {
     const _b = await getUnifiedBalances()
      // console.log("balances",_b)
      const sum = _b.reduce((sum, item) => sum + item.balanceInFiat, 0)
      setBalance(sum)
      setBalances(_b)
  }


  useEffect(() => {
    if(initialized){
       setBalanceFunc()
    }     
  },[initialized])

  useEffect(() => {
    if(address && !initialized){ 
        init()
    }
  },[address,initialized])


  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MetaFund
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
            {/* <Link
              href="/portfolio"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Portfolio
            </Link> */}
          </nav>
       {/* {balances && (
          <pre className="whitespace-pre-wrap">${JSON.stringify(balances, null, 2)}</pre>
        )} */}
              {/* <ConnectButton /> */}
              <WalletButton onBalanceClick={() => setShowModal(true)} balance={balance} />
              <BalancesModal open={showModal} onOpenChange={setShowModal} assets={balances} totalUsd={balance} />
        </div>
      </div>
    </header>
  )
}
