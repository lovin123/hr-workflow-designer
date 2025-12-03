"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { ClipboardList, User, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TaskNodeData } from "@/types/workflow"

interface TaskNodeProps extends NodeProps {
  data: TaskNodeData
}

function TaskNodeComponent({ data, selected }: TaskNodeProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-lg border-2 bg-card px-4 py-3 shadow-lg transition-all",
        "min-w-[200px]",
        selected
          ? "border-[var(--node-task)] ring-2 ring-[var(--node-task)]/30"
          : "border-[var(--node-task)]/50 hover:border-[var(--node-task)]",
      )}
    >
      <Handle type="target" position={Position.Left} className="!bg-[var(--node-task)] !border-background" />
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--node-task)]">
          <ClipboardList className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{data.label}</span>
          <span className="text-xs text-muted-foreground">Human Task</span>
        </div>
      </div>
      {(data.assignee || data.dueDate) && (
        <div className="mt-2 flex flex-wrap gap-2 border-t border-border pt-2">
          {data.assignee && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span>{data.assignee}</span>
            </div>
          )}
          {data.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{data.dueDate}</span>
            </div>
          )}
        </div>
      )}
      <Handle type="source" position={Position.Right} className="!bg-[var(--node-task)] !border-background" />
    </div>
  )
}

export const TaskNode = memo(TaskNodeComponent)
