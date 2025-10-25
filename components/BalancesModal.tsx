"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils"; // if you have it; otherwise remove cn and className joins
import { ChevronUp } from "lucide-react";
import Image from "next/image";

type ChainBreakdown = {
  chain: string;          // e.g., "Ethereum Mainnet"
  amount: string;         // e.g., "0.000097"
  usd: string;            // e.g., "$0.39"
  icon?: React.ReactNode; // optional icon
};

export type Asset = {
  symbol: string;         // e.g., "ETH"
  usd: string;            // e.g., "$0.39"s
  amount: string;         // e.g., "0.000097"
  icon?: React.ReactNode; // optional icon
  breakdown?: ChainBreakdown[];
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  totalUsd: string;       // e.g., "$0.39"
  assets: Asset[];
};

export default function BalancesModal({ open, onOpenChange, totalUsd, assets }: Props) {
  // console.log("BalancesModal assets:", assets);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-xl w-[92vw] p-0 overflow-hidden bg-white"
        aria-describedby={undefined}
      >
        <DialogHeader className="px-6 pt-5 pb-3">
          <DialogTitle className="text-[18px] leading-none">
            <span className="text-teal-900 font-semibold">Total Balance:</span>{" "}
            <span className="text-teal-900 font-extrabold">${totalUsd}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 pb-4">
          <div className="rounded-2xl border-[2px] border-black/80 shadow-sm">
            {/* <ScrollArea className="max-h-[340px] p-4"> */}
              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-2">
                {assets && assets.map((a, idx) => 
                (                    
                          <AssetCard key={idx} asset={a} />
                    )
          )}
              </div>
            {/* </ScrollArea> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AssetCard({ asset }: { asset: Asset }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="rounded-xl border border-black/20 p-4">
      <div className="flex items-start gap-3">
        {/* icon */}
        <div className="h-8 w-8 shrink-0 grid place-items-center rounded-full bg-white">
          {/* {asset.icon ?? <EthIcon />} */}
          <Image src={asset.icon as string} alt={asset.symbol} width={32} height={32} className="h-6 w-6" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-extrabold tracking-tight text-teal-900">{asset.symbol}</div>
              <div className="text-[14px] text-teal-900/80">${asset.balanceInFiat}</div>
            </div>

            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 text-teal-900"
              aria-label="toggle breakdown"
            >
              <span className="tabular-nums">{parseFloat(asset.balance).toFixed(3)}</span>
              <ChevronUp
                className={cn(
                  "h-4 w-4 transition-transform",
                  open ? "rotate-0" : "rotate-180"
                )}
              />
            </button>
          </div>

          {open && asset.breakdown?.length ? (
            <div className="mt-6 pl-1 space-y-4">
              {asset.breakdown.map((b, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-6 w-6 shrink-0 grid place-items-center rounded-full bg-white">
                    <Image src={b.chain.logo as string} alt={asset.symbol} width={32} height={32} className="h-6 w-6" />
                  </div>

                  <div className="flex-1">
                    <div className="text-[15px] text-teal-900/90">{b.chain?.name}</div>
                    <div className="text-[13px] text-teal-900/70">${b.balanceInFiat}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-[14px] tabular-nums text-teal-900/90">{b.balance}</div>
                    <div className="text-[12px] text-teal-900/70">${b.balanceInFiat}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function EthIcon() {
  // simple placeholder; swap with your SVG if you have one
  return (
    <svg viewBox="0 0 256 417" className="h-5 w-5">
      <path fill="#343434" d="M127.9 0l-2.8 9.5v275.9l2.8 2.8 127.9-75.7z" />
      <path fill="#8C8C8C" d="M127.9 0L0 212.5l127.9 75.7V0z" />
      <path fill="#3C3C3B" d="M127.9 325.3l-1.6 2v89.9l1.6 4.6 128-180.4z" />
      <path fill="#8C8C8C" d="M127.9 421.8v-96.5L0 241.4z" />
      <path fill="#141414" d="M127.9 288.2l127.9-75.7-127.9-58.1z" />
      <path fill="#393939" d="M0 212.5l127.9 75.7v-133.8z" />
    </svg>
  );
}
