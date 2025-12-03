// Mock data for the workflow designer

import type {
  AutomationAction,
  SimulationResult,
  SimulationStep,
  ValidationError,
  WorkflowNode,
  WorkflowEdge,
} from "@/types/workflow"

export const mockAutomations: AutomationAction[] = [
  {
    id: "send_email",
    label: "Send Email",
    params: ["to", "subject", "template"],
    description: "Sends an automated email notification",
  },
  {
    id: "generate_doc",
    label: "Generate Document",
    params: ["template", "recipient", "format"],
    description: "Generates a document from a template",
  },
  {
    id: "create_ticket",
    label: "Create IT Ticket",
    params: ["title", "priority", "assignee"],
    description: "Creates a support ticket in the IT system",
  },
  {
    id: "provision_access",
    label: "Provision System Access",
    params: ["system", "role", "expiry"],
    description: "Grants access to internal systems",
  },
  {
    id: "send_slack",
    label: "Send Slack Notification",
    params: ["channel", "message"],
    description: "Sends a message to a Slack channel",
  },
  {
    id: "update_hris",
    label: "Update HRIS Record",
    params: ["field", "value"],
    description: "Updates employee record in HRIS",
  },
  {
    id: "schedule_meeting",
    label: "Schedule Meeting",
    params: ["title", "attendees", "duration"],
    description: "Schedules a calendar meeting",
  },
  {
    id: "assign_training",
    label: "Assign Training Module",
    params: ["module", "deadline"],
    description: "Assigns a training course to the employee",
  },
]

// Validate workflow structure
export function validateWorkflow(nodes: WorkflowNode[], edges: WorkflowEdge[]): ValidationError[] {
  const errors: ValidationError[] = []

  // Check for start node
  const startNodes = nodes.filter((n) => n.type === "start")
  if (startNodes.length === 0) {
    errors.push({ type: "error", message: "Workflow must have a Start node" })
  } else if (startNodes.length > 1) {
    errors.push({ type: "error", message: "Workflow can only have one Start node" })
  }

  // Check for end node
  const endNodes = nodes.filter((n) => n.type === "end")
  if (endNodes.length === 0) {
    errors.push({ type: "error", message: "Workflow must have an End node" })
  }

  // Check start node has no incoming edges
  if (startNodes.length > 0) {
    const startNode = startNodes[0]
    const incomingToStart = edges.filter((e) => e.target === startNode.id)
    if (incomingToStart.length > 0) {
      errors.push({
        type: "error",
        nodeId: startNode.id,
        message: "Start node cannot have incoming connections",
      })
    }
  }

  // Check end nodes have no outgoing edges
  endNodes.forEach((endNode) => {
    const outgoingFromEnd = edges.filter((e) => e.source === endNode.id)
    if (outgoingFromEnd.length > 0) {
      errors.push({
        type: "error",
        nodeId: endNode.id,
        message: "End node cannot have outgoing connections",
      })
    }
  })

  // Check for disconnected nodes (except start if it's the only node)
  nodes.forEach((node) => {
    if (node.type === "start") {
      const hasOutgoing = edges.some((e) => e.source === node.id)
      if (!hasOutgoing && nodes.length > 1) {
        errors.push({
          type: "warning",
          nodeId: node.id,
          message: `${node.data.label} has no outgoing connections`,
        })
      }
    } else if (node.type === "end") {
      const hasIncoming = edges.some((e) => e.target === node.id)
      if (!hasIncoming) {
        errors.push({
          type: "warning",
          nodeId: node.id,
          message: `${node.data.label} has no incoming connections`,
        })
      }
    } else {
      const hasIncoming = edges.some((e) => e.target === node.id)
      const hasOutgoing = edges.some((e) => e.source === node.id)
      if (!hasIncoming || !hasOutgoing) {
        errors.push({
          type: "warning",
          nodeId: node.id,
          message: `${node.data.label} is not fully connected`,
        })
      }
    }
  })

  // Check for cycles using DFS
  const hasCycle = detectCycle(nodes, edges)
  if (hasCycle) {
    errors.push({ type: "error", message: "Workflow contains a cycle" })
  }

  return errors
}

function detectCycle(nodes: WorkflowNode[], edges: WorkflowEdge[]): boolean {
  const adjacencyList = new Map<string, string[]>()
  nodes.forEach((node) => adjacencyList.set(node.id, []))
  edges.forEach((edge) => {
    const neighbors = adjacencyList.get(edge.source) || []
    neighbors.push(edge.target)
    adjacencyList.set(edge.source, neighbors)
  })

  const visited = new Set<string>()
  const recursionStack = new Set<string>()

  function dfs(nodeId: string): boolean {
    visited.add(nodeId)
    recursionStack.add(nodeId)

    const neighbors = adjacencyList.get(nodeId) || []
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true
      } else if (recursionStack.has(neighbor)) {
        return true
      }
    }

    recursionStack.delete(nodeId)
    return false
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true
    }
  }

  return false
}

// Simulate workflow execution
export function simulateWorkflow(nodes: WorkflowNode[], edges: WorkflowEdge[]): SimulationResult {
  const validationErrors = validateWorkflow(nodes, edges)
  const criticalErrors = validationErrors.filter((e) => e.type === "error")

  if (criticalErrors.length > 0) {
    return {
      success: false,
      steps: [],
      errors: validationErrors,
      totalDuration: 0,
    }
  }

  // Build execution order using topological sort
  const executionOrder = topologicalSort(nodes, edges)
  const steps: SimulationStep[] = []
  let totalDuration = 0

  executionOrder.forEach((node, index) => {
    const duration = getSimulatedDuration(node.type)
    totalDuration += duration

    steps.push({
      nodeId: node.id,
      nodeName: node.data.label,
      nodeType: node.type,
      status: "completed",
      message: getStepMessage(node),
      timestamp: new Date(Date.now() + totalDuration * 1000).toISOString(),
      duration,
    })
  })

  return {
    success: true,
    steps,
    errors: validationErrors,
    totalDuration,
  }
}

function topologicalSort(nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowNode[] {
  const inDegree = new Map<string, number>()
  const adjacencyList = new Map<string, string[]>()

  nodes.forEach((node) => {
    inDegree.set(node.id, 0)
    adjacencyList.set(node.id, [])
  })

  edges.forEach((edge) => {
    const neighbors = adjacencyList.get(edge.source) || []
    neighbors.push(edge.target)
    adjacencyList.set(edge.source, neighbors)
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1)
  })

  const queue: string[] = []
  inDegree.forEach((degree, nodeId) => {
    if (degree === 0) queue.push(nodeId)
  })

  const result: WorkflowNode[] = []
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))

  while (queue.length > 0) {
    const nodeId = queue.shift()!
    const node = nodeMap.get(nodeId)
    if (node) result.push(node)

    const neighbors = adjacencyList.get(nodeId) || []
    neighbors.forEach((neighbor) => {
      inDegree.set(neighbor, (inDegree.get(neighbor) || 0) - 1)
      if (inDegree.get(neighbor) === 0) queue.push(neighbor)
    })
  }

  return result
}

function getSimulatedDuration(nodeType: string): number {
  switch (nodeType) {
    case "start":
      return 0.5
    case "end":
      return 0.5
    case "task":
      return Math.random() * 3 + 2
    case "approval":
      return Math.random() * 5 + 3
    case "automated":
      return Math.random() * 2 + 1
    default:
      return 1
  }
}

function getStepMessage(node: WorkflowNode): string {
  switch (node.type) {
    case "start":
      return `Workflow initiated: ${node.data.label}`
    case "task":
      const taskData = node.data as { assignee?: string }
      return `Task "${node.data.label}" assigned to ${taskData.assignee || "unassigned"}`
    case "approval":
      const approvalData = node.data as { approverRole?: string }
      return `Approval obtained from ${approvalData.approverRole || "approver"}`
    case "automated":
      const autoData = node.data as { actionId?: string }
      const action = mockAutomations.find((a) => a.id === autoData.actionId)
      return `Executed: ${action?.label || "automated action"}`
    case "end":
      return `Workflow completed: ${node.data.label}`
    default:
      return `Step completed: ${node.data.label}`
  }
}
