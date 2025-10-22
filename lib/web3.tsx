"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Web3ContextType {
  account: string | null
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
  chainId: number | null
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
  chainId: null,
})

export const useWeb3 = () => useContext(Web3Context)

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)

  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        setAccount(accounts[0])

        const chain = await window.ethereum.request({ method: "eth_chainId" })
        setChainId(Number.parseInt(chain, 16))
      } catch (error) {
        console.error("[v0] Error connecting wallet:", error)
      }
    } else {
      alert("Please install MetaMask or another Web3 wallet")
    }
  }

  const disconnect = () => {
    setAccount(null)
    setChainId(null)
  }

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setAccount(accounts[0] || null)
      })

      window.ethereum.on("chainChanged", (chain: string) => {
        setChainId(Number.parseInt(chain, 16))
      })
    }
  }, [])

  return (
    <Web3Context.Provider
      value={{
        account,
        isConnected: !!account,
        connect,
        disconnect,
        chainId,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

declare global {
  interface Window {
    ethereum?: any
  }
}
