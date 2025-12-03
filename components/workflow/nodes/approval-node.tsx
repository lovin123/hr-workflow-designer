"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { UserCheck, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ApprovalNodeData } from "@/types/workflow"

interface ApprovalNodeProps extends NodeProps {
  data: ApprovalNodeData
}

function ApprovalNodeComponent({ data, selected }: ApprovalNodeProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-lg border-2 bg-card px-4 py-3 shadow-lg transition-all",
        "min-w-[180px]",
        selected
          ? "border-[var(--node-approval)] ring-2 ring-[var(--node-approval)]/30"
          : "border-[var(--node-approval)]/50 hover:border-[var(--node-approval)]",
      )}
    >
      <Handle type="target" position={Position.Left} className="!bg-[var(--node-approval)] !border-background" />
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--node-approval)]">
          <UserCheck className="h-4 w-4 text-background" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{data.label}</span>
          <span className="text-xs text-muted-foreground">Approval Step</span>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 border-t border-border pt-2">
        <Shield className="h-3 w-3 text-[var(--node-approval)]" />
        <span className="text-xs text-muted-foreground">
          {data.approverRole}
          {data.autoApproveThreshold > 0 && ` (Auto: ≤${data.autoApproveThreshold} days)`}
        </span>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-[var(--node-approval)] !border-background" />
    </div>
  )
}

export const ApprovalNode = memo(ApprovalNodeComponent)
