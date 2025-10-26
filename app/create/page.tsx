"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AllocationBuilder } from "@/components/allocation-builder"
import { useWeb3 } from "@/lib/web3"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import type { FundAllocation } from "@/lib/types"
import { ArrowLeft, Info } from "lucide-react"
import Link from "next/link"
import { useAccount, useReadContract, useWriteContract } from "wagmi"
import { HedgeManagerAbi } from "../../config/hedge-manager"
import { sepolia } from "viem/chains"
import {
  type ExecuteParams,
  type ExecuteResult,
  type ExecuteSimulation,
  type BridgeAndExecuteParams,
  type BridgeAndExecuteResult,
  type BridgeAndExecuteSimulationResult,
  type SUPPORTED_TOKENS,
  type SUPPORTED_CHAINS_IDS,
  TOKEN_METADATA,
  TOKEN_CONTRACT_ADDRESSES,
  parseUnits,
} from '@avail-project/nexus-core';
import { sdk } from "@/lib/nexus"
import { API_URL } from "@/lib/constants"
 
export default function CreateFundPage() {
  const router = useRouter()
  const { isConnected, address } = useAccount()
  const { toast } = useToast()

  const [fundName, setFundName] = useState("")
  const [description, setDescription] = useState("")
  const [commissionRate, setCommissionRate] = useState("10")
  const [allocations, setAllocations] = useState<FundAllocation[]>([])
  const [isCreating, setIsCreating] = useState(false)

  const totalAllocation = allocations.reduce((sum, alloc) => sum + alloc.percentage, 0)
  const isValid = fundName && description && allocations.length > 0 && totalAllocation === 100
  const contractAddress = process.env.NEXT_PUBLIC_MANAGER_CONTRACT_ADDRESS as `0x${string}`
  const { data } = useReadContract({
    address: contractAddress,
    abi: HedgeManagerAbi,
    functionName: "BPS_DENOM",
    chainId: sepolia.id, 
    query: { enabled: true },
  });
  console.log(data)

const generateParams = async (fundCreationParams: (string | number | number[] | string[])[]) => {
const params = { 
  toChainId: sepolia.id,
  contractAddress: contractAddress, // Compound V3 USDC Market
  contractAbi: HedgeManagerAbi,
  functionName: 'createFund',
  buildFunctionParams: (
  ) => {
    return {
      functionParams: fundCreationParams,
    };
  },
  waitForReceipt: true,
  requiredConfirmations: 3,
} as ExecuteParams;
return params;
  }


  const {
    data: createFundHash,
    writeContract: createFund,
    isPending: isCreatingFund,
    error: createError,
    
  } = useWriteContract();

  const handleCreateFund = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a fund",
        variant: "destructive",
      })
      return
    }

    if (!isValid) {
      toast({
        title: "Invalid fund configuration",
        description: "Please ensure all fields are filled and allocations total 100%",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)

    try {
      // Simulate fund creation (in production, this would interact with smart contracts)
      // await new Promise((resolve) => setTimeout(resolve, 2000))
      const tokens = allocations.map(v  => v.asset.address)
      const shares = allocations.map(v  => v.percentage*100)
const assets = allocations.map(v => ({
  address: v.asset.address,
  share: v.percentage
}));
      console.log("[v0] Creating fund:", {
        name: fundName,
        description,
        commissionRate: Number.parseFloat(commissionRate),
        allocations,
        assets,
        tokens,
        shares
      })

      const createApiResponse = await fetch(API_URL+'/funds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fundName,
          description,
          manager: address,
          commission: Number.parseFloat(commissionRate),
          assets,
        }),
      });

      const resJson = await createApiResponse.json();
      console.log("Fund created with ID:", resJson);
      const uuid = resJson._id;
      const fundCreationParams =  [uuid, Number.parseFloat(commissionRate)*100,tokens ,shares]
      const params = await generateParams(fundCreationParams) // Example amount
      const simulation: ExecuteSimulation = await sdk.simulateExecute(params);

      console.log("Simulation result:", simulation);

      if(simulation.success) {
        console.log("Simulation successful, proceeding to create fund...");
    toast({
        title: "Transaction sent for confirmation!",
        description: `Please confirm transaction in your wallet to create ${fundName} Fund`,         
      })
      const executeResult: ExecuteResult = await sdk.execute(params);
      console.log("Fund creation transaction hash:", executeResult.receipt);
          toast({
        title: "Fund created successfully!",
        description: `${fundName} is now live and ready for investments`,
      })
  setTimeout(() => {
        router.push("/explore")
      }, 1500)
      }
      else{
          toast({
        title: "Transaction Simulation Failed!",
          description: "Please try again later",
        variant: "destructive",
      })

      }
      
      //  createFund({
      //   address: contractAddress as `0x${string}`,
      //   abi: HedgeAbi,
      //   chainId: sepolia.id,
      //   functionName: 'createFund',
      //   args: ["dsdfdsfsd", Number.parseFloat(commissionRate)*100,tokens ,shares],
      // })

    
      // Redirect to explore page after creation
    
    } catch (error) {
      console.error("[v0] Error creating fund:", error)
      toast({
        title: "Failed to create fund",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  useEffect(() => {
        console.log("CreateFundPage allocations:", createError)

    if(createError){

    console.log("CreateFundPage allocations:", createError)
      toast({
        title: "Failed to create fund",
        description: "Please try again later",
        variant: "destructive",
      })
    }

  },[createError])


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Toaster />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-text transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-text">Create Your Hedge Fund</h1>
          <p className="text-text-muted text-lg">
            Design a custom fund with your own asset allocation strategy and commission structure
          </p>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-text">Fund Details</CardTitle>
              <CardDescription className="text-text-muted">
                Provide basic information about your hedge fund
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fund-name" className="text-text">
                  Fund Name
                </Label>
                <Input
                  id="fund-name"
                  placeholder="e.g., Crypto Growth Fund"
                  value={fundName}
                  onChange={(e) => setFundName(e.target.value)}
                  className="bg-background border-border text-text"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-text">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your fund's investment strategy and goals..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="bg-background border-border text-text"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commission" className="text-text">
                  Performance Commission (%)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="commission"
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    className="bg-background border-border text-text"
                  />
                  <div className="flex items-center gap-1 text-text-muted text-sm">
                    <Info className="h-4 w-4" />
                    <span>Earned only on profits</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Asset Allocation */}
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-text">Asset Allocation</CardTitle>
              <CardDescription className="text-text-muted">
                Define how investments will be distributed across assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AllocationBuilder allocations={allocations} onChange={setAllocations} />

              <div className="mt-4 p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Total Allocation:</span>
                  <span
                    className={`text-lg font-semibold ${
                      totalAllocation === 100 ? "text-success" : totalAllocation > 100 ? "text-error" : "text-warning"
                    }`}
                  >
                    {totalAllocation}%
                  </span>
                </div>
                {totalAllocation !== 100 && (
                  <p className="text-sm text-text-muted mt-2">
                    {totalAllocation < 100
                      ? `Add ${100 - totalAllocation}% more to reach 100%`
                      : `Reduce by ${totalAllocation - 100}% to reach 100%`}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Create Button */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="bg-surface border-border text-text hover:bg-surface-elevated"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFund}
              disabled={!isValid || isCreating}
              className="bg-primary hover:bg-primary-dark text-background"
            >
              {isCreating ? "Creating Fund..." : "Create Fund"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
