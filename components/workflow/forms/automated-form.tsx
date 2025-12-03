"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useAutomations } from "@/hooks/use-automations"
import type { AutomatedNodeData } from "@/types/workflow"

interface AutomatedFormProps {
  data: AutomatedNodeData
  onChange: (data: Partial<AutomatedNodeData>) => void
}

export function AutomatedForm({ data, onChange }: AutomatedFormProps) {
  const { automations, isLoading } = useAutomations()

  const selectedAction = automations.find((a) => a.id === data.actionId)

  const handleActionChange = (actionId: string) => {
    onChange({
      actionId,
      actionParams: {}, // Reset params when action changes
    })
  }

  const handleParamChange = (param: string, value: string) => {
    onChange({
      actionParams: { ...data.actionParams, [param]: value },
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Enter step title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="action">Action</Label>
        <Select value={data.actionId} onValueChange={handleActionChange}>
          <SelectTrigger id="action">
            <SelectValue placeholder="Select an action" />
          </SelectTrigger>
          <SelectContent>
            {automations.map((action) => (
              <SelectItem key={action.id} value={action.id}>
                <div className="flex flex-col">
                  <span>{action.label}</span>
                  {action.description && <span className="text-xs text-muted-foreground">{action.description}</span>}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedAction && selectedAction.params.length > 0 && (
        <div className="space-y-3 rounded-lg border border-border bg-secondary/50 p-4">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Action Parameters</Label>
          {selectedAction.params.map((param) => (
            <div key={param} className="space-y-1">
              <Label htmlFor={param} className="text-sm capitalize">
                {param.replace(/_/g, " ")}
              </Label>
              <Input
                id={param}
                value={data.actionParams[param] || ""}
                onChange={(e) => handleParamChange(param, e.target.value)}
                placeholder={`Enter ${param.replace(/_/g, " ")}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
