"use client"

import { useState } from "react"
import { Play, CheckCircle2, XCircle, AlertTriangle, Clock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { postSimulate } from "@/lib/api/workflow-api"
import type { SimulationResult, SimulationStep, ValidationError, WorkflowNode, WorkflowEdge } from "@/types/workflow"
import type { Node, Edge } from "@xyflow/react"
import type { WorkflowNodeData } from "@/types/workflow"

interface SimulationPanelProps {
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
  isOpen: boolean
  onClose: () => void
}

const stepStatusIcons = {
  completed: CheckCircle2,
  pending: Clock,
  failed: XCircle,
  skipped: AlertTriangle,
}

const stepStatusColors = {
  completed: "text-[var(--node-start)]",
  pending: "text-[var(--node-task)]",
  failed: "text-[var(--node-end)]",
  skipped: "text-muted-foreground",
}

const nodeTypeColors = {
  start: "bg-[var(--node-start)]",
  task: "bg-[var(--node-task)]",
  approval: "bg-[var(--node-approval)]",
  automated: "bg-[var(--node-automated)]",
  end: "bg-[var(--node-end)]",
}

export function SimulationPanel({ nodes, edges, isOpen, onClose }: SimulationPanelProps) {
  const [isSimulating, setIsSimulating] = useState(false)
  const [result, setResult] = useState<SimulationResult | null>(null)

  const handleSimulate = async () => {
    setIsSimulating(true)
    setResult(null)

    try {
      const workflowNodes = nodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: n.data,
      })) as WorkflowNode[]

      const workflowEdges = edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
      })) as WorkflowEdge[]

      const simulationResult = await postSimulate(workflowNodes, workflowEdges)
      setResult(simulationResult)
    } catch (error) {
      console.error("[v0] Simulation failed:", error)
    } finally {
      setIsSimulating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="absolute bottom-4 right-4 z-10 w-96 rounded-lg border border-border bg-card shadow-xl">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">Workflow Sandbox</h3>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleSimulate} disabled={isSimulating || nodes.length === 0}>
            {isSimulating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
            {isSimulating ? "Simulating..." : "Run Simulation"}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      <ScrollArea className="h-80">
        <div className="p-4">
          {!result && !isSimulating && (
            <div className="text-center text-sm text-muted-foreground py-8">
              Click "Run Simulation" to test your workflow
            </div>
          )}

          {isSimulating && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Running simulation...</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Status Banner */}
              <div className={`rounded-lg p-3 ${result.success ? "bg-[var(--node-start)]/10" : "bg-destructive/10"}`}>
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle2 className="h-5 w-5 text-[var(--node-start)]" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  <span className={`font-medium ${result.success ? "text-[var(--node-start)]" : "text-destructive"}`}>
                    {result.success ? "Simulation Completed" : "Simulation Failed"}
                  </span>
                </div>
                {result.success && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Total duration: {result.totalDuration.toFixed(1)}s
                  </p>
                )}
              </div>

              {/* Validation Errors */}
              {result.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Validation Issues
                  </h4>
                  {result.errors.map((error, index) => (
                    <ValidationErrorItem key={index} error={error} />
                  ))}
                </div>
              )}

              {/* Execution Steps */}
              {result.steps.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Execution Steps
                  </h4>
                  <div className="relative space-y-0">
                    {result.steps.map((step, index) => (
                      <StepItem key={step.nodeId} step={step} isLast={index === result.steps.length - 1} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

function ValidationErrorItem({ error }: { error: ValidationError }) {
  return (
    <div
      className={`flex items-start gap-2 rounded-md p-2 ${
        error.type === "error" ? "bg-destructive/10" : "bg-[var(--node-approval)]/10"
      }`}
    >
      {error.type === "error" ? (
        <XCircle className="h-4 w-4 mt-0.5 text-destructive" />
      ) : (
        <AlertTriangle className="h-4 w-4 mt-0.5 text-[var(--node-approval)]" />
      )}
      <span className={`text-sm ${error.type === "error" ? "text-destructive" : "text-[var(--node-approval)]"}`}>
        {error.message}
      </span>
    </div>
  )
}

function StepItem({ step, isLast }: { step: SimulationStep; isLast: boolean }) {
  const StatusIcon = stepStatusIcons[step.status]
  const statusColor = stepStatusColors[step.status]
  const nodeColor = nodeTypeColors[step.nodeType]

  return (
    <div className="relative flex gap-3 pb-4">
      {/* Timeline connector */}
      {!isLast && <div className="absolute left-[11px] top-6 h-full w-0.5 bg-border" />}

      {/* Status icon */}
      <div
        className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-card border-2 border-border`}
      >
        <StatusIcon className={`h-3 w-3 ${statusColor}`} />
      </div>

      {/* Step content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`${nodeColor} text-primary-foreground border-0 text-xs`}>
            {step.nodeType}
          </Badge>
          <span className="text-sm font-medium text-foreground truncate">{step.nodeName}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{step.message}</p>
        {step.duration && <p className="text-xs text-muted-foreground mt-0.5">Duration: {step.duration.toFixed(1)}s</p>}
      </div>
    </div>
  )
}
