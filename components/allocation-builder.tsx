"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WHITELISTED_ASSETS } from "@/lib/constants"
import type { FundAllocation, Asset } from "@/lib/types"
import { Plus, Trash2 } from "lucide-react"

interface AllocationBuilderProps {
  allocations: FundAllocation[]
  onChange: (allocations: FundAllocation[]) => void
}

export function AllocationBuilder({ allocations, onChange }: AllocationBuilderProps) {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [percentage, setPercentage] = useState("")

  const usedAssets = new Set(allocations.map((a) => a.asset.symbol))
  const availableAssets = WHITELISTED_ASSETS.filter((asset) => !usedAssets.has(asset.symbol))

  const handleAddAllocation = () => {
    if (selectedAsset && percentage && Number.parseFloat(percentage) > 0) {
      onChange([
        ...allocations,
        {
          asset: selectedAsset,
          percentage: Number.parseFloat(percentage),
        },
      ])
      setSelectedAsset(null)
      setPercentage("")
    }
  }

  const handleRemoveAllocation = (index: number) => {
    onChange(allocations.filter((_, i) => i !== index))
  }

  const handleUpdatePercentage = (index: number, newPercentage: string) => {
    const updated = [...allocations]
    updated[index].percentage = Number.parseFloat(newPercentage) || 0
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      {/* Existing Allocations */}
      {allocations.length > 0 && (
        <div className="space-y-2">
          {allocations.map((allocation, index) => (
            <div
              key={allocation.asset.symbol}
              className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border"
            >
              <div className="flex items-center gap-2 flex-1">
                <span className="text-2xl">{allocation.asset.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-text">{allocation.asset.symbol}</div>
                  <div className="text-sm text-text-muted">{allocation.asset.name}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={allocation.percentage}
                  onChange={(e) => handleUpdatePercentage(index, e.target.value)}
                  className="w-24 bg-surface border-border text-text text-right"
                />
                <span className="text-text-muted">%</span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveAllocation(index)}
                className="text-error hover:text-error hover:bg-error/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Allocation */}
      {availableAssets.length > 0 && (
        <div className="p-4 rounded-lg bg-background border border-border space-y-3">
          <Label className="text-text">Add Asset</Label>
          <div className="flex items-end gap-3">
            <div className="flex-1 space-y-2">
              <Select
                value={selectedAsset?.symbol || ""}
                onValueChange={(symbol) => {
                  const asset = WHITELISTED_ASSETS.find((a) => a.symbol === symbol)
                  setSelectedAsset(asset || null)
                }}
              >
                <SelectTrigger className="bg-surface border-border text-text">
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  {availableAssets.map((asset) => (
                    <SelectItem key={asset.symbol} value={asset.symbol}>
                      <div className="flex items-center gap-2">
                        <span>{asset.icon}</span>
                        <span>{asset.symbol}</span>
                        <span className="text-text-muted text-sm">- {asset.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-32 space-y-2">
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="0"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                className="bg-surface border-border text-text text-right"
              />
            </div>

            <Button
              onClick={handleAddAllocation}
              disabled={!selectedAsset || !percentage || Number.parseFloat(percentage) <= 0}
              className="bg-primary hover:bg-primary-dark text-background"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      )}

      {allocations.length === 0 && (
        <div className="text-center py-8 text-text-muted">
          <p>No assets added yet. Start building your fund allocation above.</p>
        </div>
      )}
    </div>
  )
}
