"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import type { StartNodeData } from "@/types/workflow"

interface StartFormProps {
  data: StartNodeData
  onChange: (data: Partial<StartNodeData>) => void
}

export function StartForm({ data, onChange }: StartFormProps) {
  const [newKey, setNewKey] = useState("")
  const [newValue, setNewValue] = useState("")

  const handleAddMetadata = () => {
    if (newKey.trim()) {
      onChange({
        metadata: { ...data.metadata, [newKey.trim()]: newValue },
      })
      setNewKey("")
      setNewValue("")
    }
  }

  const handleRemoveMetadata = (key: string) => {
    const newMetadata = { ...data.metadata }
    delete newMetadata[key]
    onChange({ metadata: newMetadata })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Start Title</Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Enter workflow title"
        />
      </div>

      <div className="space-y-2">
        <Label>Metadata (Key-Value Pairs)</Label>
        <div className="space-y-2">
          {Object.entries(data.metadata).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 rounded-md bg-secondary p-2">
              <span className="text-sm font-medium text-foreground">{key}:</span>
              <span className="text-sm text-muted-foreground">{value}</span>
              <Button variant="ghost" size="icon" className="ml-auto h-6 w-6" onClick={() => handleRemoveMetadata(key)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input placeholder="Key" value={newKey} onChange={(e) => setNewKey(e.target.value)} className="flex-1" />
          <Input
            placeholder="Value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" size="icon" onClick={handleAddMetadata}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
