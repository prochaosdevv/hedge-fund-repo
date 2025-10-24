"use client";

import { useWeb3 } from "@/lib/web3";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useConnectModal, useAccountModal, useChainModal } from "@rainbow-me/rainbowkit";

type WalletButtonProps = {
  balance: number;
  onBalanceClick?: () => void;
};

export function WalletButton({ balance, onBalanceClick }: WalletButtonProps) {
  const { account, isConnected, connect } = useWeb3();

  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();

  const formatAddress = (address?: string) =>
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  const displayBalance =
    typeof balance === "number" && Number.isFinite(balance)
      ? balance.toLocaleString(undefined, { maximumFractionDigits: 6 })
      : String(balance ?? "");

  if (isConnected && account) {
    return (
      <div className="flex items-center justify-between gap-2">
        {/* $ button -> opens your custom Balances modal if provided */}
        <Button
          variant="outline"
          onClick={() => onBalanceClick?.()}
          className="gap-2 bg-surface border-border mr-2 hover:bg-surface-elevated hover:text-black text-text"
          title="View balances"
          aria-label="Open balances modal"
        >
          ${displayBalance}
        </Button>

        {/* Address button -> RainbowKit Account Modal */}
        <Button
          variant="outline"
          onClick={() => openAccountModal?.()}
          className="gap-2 bg-surface border-border hover:bg-surface-elevated hover:text-black text-text"
          aria-label="Open account modal"
        >
          <Wallet className="h-4 w-4" />
          {formatAddress(account)}
        </Button>

        {/* Network switcher -> RainbowKit Chain Modal */}
        <Button
          variant="outline"
          onClick={() => openChainModal?.()}
          className="gap-2 bg-surface border-border hover:bg-surface-elevated hover:text-black text-text"
          title="Switch Network"
          aria-label="Open network switcher"
        >
          Network
        </Button>
      </div>
    );
  }

  // Disconnected: prefer RainbowKit connect modal; fallback to your connect()
  return (
    <Button
      onClick={() => (openConnectModal ? openConnectModal() : connect())}
      className="gap-2 bg-primary hover:bg-primary-dark text-background"
      aria-label="Connect wallet"
    >
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  );
}
