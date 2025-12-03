"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Zap, Cog } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AutomatedNodeData } from "@/types/workflow"

interface AutomatedNodeProps extends NodeProps {
  data: AutomatedNodeData
}

function AutomatedNodeComponent({ data, selected }: AutomatedNodeProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-lg border-2 bg-card px-4 py-3 shadow-lg transition-all",
        "min-w-[180px]",
        selected
          ? "border-[var(--node-automated)] ring-2 ring-[var(--node-automated)]/30"
          : "border-[var(--node-automated)]/50 hover:border-[var(--node-automated)]",
      )}
    >
      <Handle type="target" position={Position.Left} className="!bg-[var(--node-automated)] !border-background" />
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--node-automated)]">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{data.label}</span>
          <span className="text-xs text-muted-foreground">Automated Step</span>
        </div>
      </div>
      {data.actionId && (
        <div className="mt-2 flex items-center gap-2 border-t border-border pt-2">
          <Cog className="h-3 w-3 text-[var(--node-automated)]" />
          <span className="text-xs text-muted-foreground capitalize">{data.actionId.replace(/_/g, " ")}</span>
        </div>
      )}
      <Handle type="source" position={Position.Right} className="!bg-[var(--node-automated)] !border-background" />
    </div>
  )
}

export const AutomatedNode = memo(AutomatedNodeComponent)
