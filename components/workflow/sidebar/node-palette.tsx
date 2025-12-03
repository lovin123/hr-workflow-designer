"use client"

import type React from "react"

import { Play, ClipboardList, UserCheck, Zap, Flag } from "lucide-react"
import type { NodeType, DragItem } from "@/types/workflow"

const nodeItems: (DragItem & { color: string })[] = [
  { type: "start", label: "Start Node", icon: Play, color: "var(--node-start)" },
  { type: "task", label: "Task Node", icon: ClipboardList, color: "var(--node-task)" },
  { type: "approval", label: "Approval Node", icon: UserCheck, color: "var(--node-approval)" },
  { type: "automated", label: "Automated Step", icon: Zap, color: "var(--node-automated)" },
  { type: "end", label: "End Node", icon: Flag, color: "var(--node-end)" },
]

interface NodePaletteProps {
  onDragStart: (event: React.DragEvent, nodeType: NodeType) => void
}

export function NodePalette({ onDragStart }: NodePaletteProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Drag Nodes</h3>
      {nodeItems.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.type}
            draggable
            onDragStart={(e) => onDragStart(e, item.type)}
            className="flex cursor-grab items-center gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary hover:bg-secondary active:cursor-grabbing"
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-md"
              style={{ backgroundColor: item.color }}
            >
              <Icon className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground">{item.label}</span>
          </div>
        )
      })}
    </div>
  )
}
