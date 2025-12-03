"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Flag, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import type { EndNodeData } from "@/types/workflow"

interface EndNodeProps extends NodeProps {
  data: EndNodeData
}

function EndNodeComponent({ data, selected }: EndNodeProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-lg border-2 bg-card px-4 py-3 shadow-lg transition-all",
        "min-w-[160px]",
        selected
          ? "border-[var(--node-end)] ring-2 ring-[var(--node-end)]/30"
          : "border-[var(--node-end)]/50 hover:border-[var(--node-end)]",
      )}
    >
      <Handle type="target" position={Position.Left} className="!bg-[var(--node-end)] !border-background" />
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--node-end)]">
          <Flag className="h-4 w-4 text-destructive-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{data.label}</span>
          <span className="text-xs text-muted-foreground">Workflow End</span>
        </div>
      </div>
      {data.showSummary && (
        <div className="mt-2 flex items-center gap-2 border-t border-border pt-2">
          <FileText className="h-3 w-3 text-[var(--node-end)]" />
          <span className="text-xs text-muted-foreground">Summary enabled</span>
        </div>
      )}
    </div>
  )
}

export const EndNode = memo(EndNodeComponent)
