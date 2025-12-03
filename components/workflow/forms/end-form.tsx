"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { EndNodeData } from "@/types/workflow"

interface EndFormProps {
  data: EndNodeData
  onChange: (data: Partial<EndNodeData>) => void
}

export function EndForm({ data, onChange }: EndFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="endMessage">End Message</Label>
        <Input
          id="endMessage"
          value={data.endMessage}
          onChange={(e) => onChange({ endMessage: e.target.value })}
          placeholder="Enter completion message"
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4">
        <div className="space-y-0.5">
          <Label htmlFor="showSummary">Show Summary</Label>
          <p className="text-xs text-muted-foreground">Display a summary of the completed workflow steps</p>
        </div>
        <Switch
          id="showSummary"
          checked={data.showSummary}
          onCheckedChange={(checked) => onChange({ showSummary: checked })}
        />
      </div>
    </div>
  )
}
