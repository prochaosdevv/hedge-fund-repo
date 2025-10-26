import type { Asset } from "./types"

export const API_URL = process.env.NEXT_PUBLIC_API
export const WHITELISTED_ASSETS: Asset[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    address: "0x8278Ce69eB4E3859924D8c63287ae70e73FE0Ec8",
    icon: "⟠",
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
    icon: "₿",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x08210F9170F89Ab7658F0B5E3fF39b0E03C594D4",
    icon: "$",
  },
   
]
