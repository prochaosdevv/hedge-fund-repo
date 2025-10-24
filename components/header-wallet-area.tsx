"use client";

import * as React from "react";
import BalancesModal, { Asset } from "@/components/BalancesModal";
import { WalletButton } from "@/components/wallet-button";

export default function HeaderWalletArea() {
  const [balancesOpen, setBalancesOpen] = React.useState(false);

  const assets: Asset[] = [
    {
      symbol: "ETH",
      usd: "$0.39",
      amount: "0.000097",
      breakdown: [
        { chain: "Ethereum Mainnet", amount: "0.000097", usd: "$0.39" },
      ],
    },
  ];

  return (
    <>
      <div className="flex items-center gap-2">
        {/* $ inside WalletButton will open the Balances modal */}
        <WalletButton
          balance={0.39}
          onBalanceClick={() => setBalancesOpen(true)}
        />
      </div>

      <BalancesModal
        open={balancesOpen}
        onOpenChange={setBalancesOpen}
        totalUsd="$0.39"
        assets={assets}
      />
    </>
  );
}
