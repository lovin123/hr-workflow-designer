// Core workflow type definitions

import type React from "react"

export type NodeType = "start" | "task" | "approval" | "automated" | "end"

// Base node data interface
export interface BaseNodeData {
  label: string
  type: NodeType
  [key: string]: unknown // Index signature for React Flow compatibility
}

// Start Node configuration
export interface StartNodeData extends BaseNodeData {
  type: "start"
  title: string
  metadata: Record<string, string>
}

// Task Node configuration
export interface TaskNodeData extends BaseNodeData {
  type: "task"
  title: string
  description: string
  assignee: string
  dueDate: string
  customFields: Record<string, string>
}

// Approval Node configuration
export interface ApprovalNodeData extends BaseNodeData {
  type: "approval"
  title: string
  approverRole: "Manager" | "HRBP" | "Director" | "VP" | "Custom"
  customApprover?: string
  autoApproveThreshold: number
}

// Automated Step Node configuration
export interface AutomatedNodeData extends BaseNodeData {
  type: "automated"
  title: string
  actionId: string
  actionParams: Record<string, string>
}

// End Node configuration
export interface EndNodeData extends BaseNodeData {
  type: "end"
  endMessage: string
  showSummary: boolean
}

// Union type for all node data
export type WorkflowNodeData = StartNodeData | TaskNodeData | ApprovalNodeData | AutomatedNodeData | EndNodeData

// Workflow node with position
export interface WorkflowNode {
  id: string
  type: NodeType
  position: { x: number; y: number }
  data: WorkflowNodeData
}

// Workflow edge
export interface WorkflowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}

// Complete workflow definition
export interface Workflow {
  id: string
  name: string
  description: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  createdAt: string
  updatedAt: string
}

// Automation action from API
export interface AutomationAction {
  id: string
  label: string
  params: string[]
  description?: string
}

// Simulation step result
export interface SimulationStep {
  nodeId: string
  nodeName: string
  nodeType: NodeType
  status: "completed" | "pending" | "failed" | "skipped"
  message: string
  timestamp: string
  duration?: number
}

// Simulation result from API
export interface SimulationResult {
  success: boolean
  steps: SimulationStep[]
  errors: ValidationError[]
  totalDuration: number
}

// Validation error
export interface ValidationError {
  nodeId?: string
  type: "error" | "warning"
  message: string
}

// Drag item type for sidebar
export interface DragItem {
  type: NodeType
  label: string
  icon: React.ElementType
}

