"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { StartForm } from "./start-form"
import { TaskForm } from "./task-form"
import { ApprovalForm } from "./approval-form"
import { AutomatedForm } from "./automated-form"
import { EndForm } from "./end-form"
import type { Node } from "@xyflow/react"
import type {
  WorkflowNodeData,
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
} from "@/types/workflow"

interface NodeFormPanelProps {
  node: Node<WorkflowNodeData>
  onUpdate: (nodeId: string, data: Partial<WorkflowNodeData>) => void
  onClose: () => void
  onDelete: () => void
}

const nodeTypeLabels = {
  start: "Start Node",
  task: "Task Node",
  approval: "Approval Node",
  automated: "Automated Step",
  end: "End Node",
}

const nodeTypeColors = {
  start: "bg-[var(--node-start)]",
  task: "bg-[var(--node-task)]",
  approval: "bg-[var(--node-approval)]",
  automated: "bg-[var(--node-automated)]",
  end: "bg-[var(--node-end)]",
}

export function NodeFormPanel({ node, onUpdate, onClose, onDelete }: NodeFormPanelProps) {
  const handleChange = (data: Partial<WorkflowNodeData>) => {
    onUpdate(node.id, data)
  }

  const renderForm = () => {
    switch (node.data.type) {
      case "start":
        return <StartForm data={node.data as StartNodeData} onChange={handleChange} />
      case "task":
        return <TaskForm data={node.data as TaskNodeData} onChange={handleChange} />
      case "approval":
        return <ApprovalForm data={node.data as ApprovalNodeData} onChange={handleChange} />
      case "automated":
        return <AutomatedForm data={node.data as AutomatedNodeData} onChange={handleChange} />
      case "end":
        return <EndForm data={node.data as EndNodeData} onChange={handleChange} />
      default:
        return <div>Unknown node type</div>
    }
  }

  return (
    <div className="flex h-full w-80 flex-col border-l border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${nodeTypeColors[node.data.type]}`} />
          <h3 className="text-sm font-semibold text-foreground">{nodeTypeLabels[node.data.type]}</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">{renderForm()}</ScrollArea>

      <Separator />

      <div className="p-4">
        <Button variant="destructive" className="w-full" onClick={onDelete}>
          Delete Node
        </Button>
      </div>
    </div>
  )
}
