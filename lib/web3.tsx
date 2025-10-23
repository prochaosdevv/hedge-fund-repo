"use client";

import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  getDefaultConfig,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider, useAccount, useDisconnect, useChainId } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import React, { createContext, useContext, type ReactNode, useMemo } from "react";

type Web3ContextType = {
  account: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  chainId: number | null;
};

const WagmiBackedWeb3Context = createContext<Web3ContextType>({
  account: null,
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
  chainId: null,
});

// ---- Wagmi + RainbowKit root providers ----
const wagmiConfig = getDefaultConfig({
  appName: "DeFi Hedge Fund Platform",
  projectId: "3b6a68297fa9e10b720a9fb6e1bf3ec8", // get from https://cloud.walletconnect.com
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true, // Next.js SSR
});

const queryClient = new QueryClient();

// This component adapts Wagmi/RainbowKit into your old context shape
function Web3Bridge({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();

  const value = useMemo<Web3ContextType>(
    () => ({
      account: address ?? null,
      isConnected,
      chainId: chainId ?? null,
      disconnect: () => disconnect(),
      connect: async () => {
        // Open RainbowKit modal (WalletConnect, MetaMask, etc.)
        if (openConnectModal) openConnectModal();
      },
    }),
    [address, isConnected, chainId, disconnect, openConnectModal]
  );

  return (
    <WagmiBackedWeb3Context.Provider value={value}>
      {children}
    </WagmiBackedWeb3Context.Provider>
  );
}

// ---- Exported API matching your existing usage ----
export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Web3Bridge>{children}</Web3Bridge>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export const useWeb3 = () => useContext(WagmiBackedWeb3Context);
