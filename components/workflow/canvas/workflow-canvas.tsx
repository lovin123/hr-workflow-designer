"use client"

import type React from "react"

import { useCallback, useRef } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { nodeTypes } from "../nodes"
import { AlertTriangle, XCircle, Beaker } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { WorkflowNodeData, ValidationError } from "@/types/workflow"

interface WorkflowCanvasProps {
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
  onNodesChange: OnNodesChange<Node<WorkflowNodeData>>
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  onNodeSelect: (node: Node<WorkflowNodeData> | null) => void
  onDrop: (event: React.DragEvent) => void
  onDragOver: (event: React.DragEvent) => void
  validationErrors: ValidationError[]
  onValidate: () => void
  onToggleSandbox: () => void
  sandboxOpen: boolean
}

export function WorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeSelect,
  onDrop,
  onDragOver,
  validationErrors,
  onValidate,
  onToggleSandbox,
  sandboxOpen,
}: WorkflowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  const handleSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: Node[] }) => {
      if (selectedNodes.length === 1) {
        onNodeSelect(selectedNodes[0] as Node<WorkflowNodeData>)
      } else {
        onNodeSelect(null)
      }
    },
    [onNodeSelect],
  )

  const errorCount = validationErrors.filter((e) => e.type === "error").length
  const warningCount = validationErrors.filter((e) => e.type === "warning").length

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={handleSelectionChange}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode={["Backspace", "Delete"]}
        multiSelectionKeyCode="Shift"
        proOptions={{ hideAttribution: true }}
        className="bg-background"
      >
        <Background color="var(--border)" gap={20} />
        <Controls className="!bg-card !border-border !rounded-lg" />
        <MiniMap
          nodeColor={(node) => {
            const colors: Record<string, string> = {
              start: "var(--node-start)",
              task: "var(--node-task)",
              approval: "var(--node-approval)",
              automated: "var(--node-automated)",
              end: "var(--node-end)",
            }
            return colors[node.type as string] || "var(--muted)"
          }}
          maskColor="var(--background)"
          className="!bg-card !border-border !rounded-lg"
        />

        {/* Top Panel - Actions */}
        <Panel position="top-right" className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onValidate}>
            Validate
          </Button>
          <Button variant={sandboxOpen ? "default" : "outline"} size="sm" onClick={onToggleSandbox}>
            <Beaker className="mr-2 h-4 w-4" />
            Sandbox
          </Button>
        </Panel>

        {/* Validation Status */}
        {validationErrors.length > 0 && (
          <Panel position="top-left" className="flex items-center gap-2">
            {errorCount > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                {errorCount} error{errorCount !== 1 ? "s" : ""}
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 border-[var(--node-approval)] text-[var(--node-approval)]"
              >
                <AlertTriangle className="h-3 w-3" />
                {warningCount} warning{warningCount !== 1 ? "s" : ""}
              </Badge>
            )}
          </Panel>
        )}

        {/* Empty State */}
        {nodes.length === 0 && (
          <Panel position="top-center" className="mt-32">
            <div className="text-center">
              <p className="text-muted-foreground">Drag nodes from the sidebar to start building your workflow</p>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  )
}
