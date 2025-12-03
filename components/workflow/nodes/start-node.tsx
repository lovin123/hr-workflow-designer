"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"
import type { StartNodeData } from "@/types/workflow"

interface StartNodeProps extends NodeProps {
  data: StartNodeData
}

function StartNodeComponent({ data, selected }: StartNodeProps) {
  return (
    <div
      className={cn(
        "relative flex items-center gap-3 rounded-lg border-2 bg-card px-4 py-3 shadow-lg transition-all",
        "min-w-[160px]",
        selected
          ? "border-[var(--node-start)] ring-2 ring-[var(--node-start)]/30"
          : "border-[var(--node-start)]/50 hover:border-[var(--node-start)]",
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--node-start)]">
        <Play className="h-4 w-4 text-background" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">{data.label}</span>
        <span className="text-xs text-muted-foreground">Workflow Start</span>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-[var(--node-start)] !border-background" />
    </div>
  )
}

export const StartNode = memo(StartNodeComponent)
