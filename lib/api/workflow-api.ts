// Mock API layer for workflow operations

import type { AutomationAction, SimulationResult, WorkflowNode, WorkflowEdge, Workflow } from "@/types/workflow"
import { mockAutomations, simulateWorkflow, validateWorkflow } from "./mock-data"

// Simulated network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// GET /automations - Returns available automated actions
export async function getAutomations(): Promise<AutomationAction[]> {
  await delay(300)
  return mockAutomations
}

// POST /simulate - Simulates workflow execution
export async function postSimulate(nodes: WorkflowNode[], edges: WorkflowEdge[]): Promise<SimulationResult> {
  await delay(800)
  return simulateWorkflow(nodes, edges)
}

// POST /validate - Validates workflow structure
export async function postValidate(nodes: WorkflowNode[], edges: WorkflowEdge[]) {
  await delay(200)
  return validateWorkflow(nodes, edges)
}

// Export workflow as JSON
export function exportWorkflow(workflow: Workflow): string {
  return JSON.stringify(workflow, null, 2)
}

// Import workflow from JSON
export function importWorkflow(json: string): Workflow | null {
  try {
    const workflow = JSON.parse(json) as Workflow
    // Basic validation
    if (!workflow.nodes || !workflow.edges || !workflow.id) {
      throw new Error("Invalid workflow structure")
    }
    return workflow
  } catch {
    return null
  }
}

// Workflow templates
export const workflowTemplates: Workflow[] = [
  {
    id: "template-onboarding",
    name: "Employee Onboarding",
    description: "Standard onboarding workflow for new employees",
    nodes: [
      {
        id: "start-1",
        type: "start",
        position: { x: 100, y: 200 },
        data: {
          type: "start",
          label: "Start Onboarding",
          title: "New Employee Onboarding",
          metadata: { department: "HR" },
        },
      },
      {
        id: "task-1",
        type: "task",
        position: { x: 300, y: 200 },
        data: {
          type: "task",
          label: "Collect Documents",
          title: "Collect Documents",
          description: "Gather required documentation",
          assignee: "HR Admin",
          dueDate: "",
          customFields: {},
        },
      },
      {
        id: "approval-1",
        type: "approval",
        position: { x: 500, y: 200 },
        data: {
          type: "approval",
          label: "Manager Approval",
          title: "Manager Approval",
          approverRole: "Manager",
          autoApproveThreshold: 0,
        },
      },
      {
        id: "automated-1",
        type: "automated",
        position: { x: 700, y: 200 },
        data: {
          type: "automated",
          label: "Provision Access",
          title: "Provision Access",
          actionId: "provision_access",
          actionParams: { system: "All", role: "Employee" },
        },
      },
      {
        id: "end-1",
        type: "end",
        position: { x: 900, y: 200 },
        data: { type: "end", label: "Onboarding Complete", endMessage: "Welcome to the team!", showSummary: true },
      },
    ],
    edges: [
      { id: "e1", source: "start-1", target: "task-1" },
      { id: "e2", source: "task-1", target: "approval-1" },
      { id: "e3", source: "approval-1", target: "automated-1" },
      { id: "e4", source: "automated-1", target: "end-1" },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "template-leave",
    name: "Leave Request",
    description: "Standard leave approval workflow",
    nodes: [
      {
        id: "start-1",
        type: "start",
        position: { x: 100, y: 200 },
        data: { type: "start", label: "Leave Request", title: "Leave Request", metadata: {} },
      },
      {
        id: "approval-1",
        type: "approval",
        position: { x: 350, y: 200 },
        data: {
          type: "approval",
          label: "Manager Approval",
          title: "Manager Approval",
          approverRole: "Manager",
          autoApproveThreshold: 2,
        },
      },
      {
        id: "automated-1",
        type: "automated",
        position: { x: 600, y: 200 },
        data: {
          type: "automated",
          label: "Update HRIS",
          title: "Update HRIS",
          actionId: "update_hris",
          actionParams: { field: "leave_balance" },
        },
      },
      {
        id: "end-1",
        type: "end",
        position: { x: 850, y: 200 },
        data: { type: "end", label: "Leave Approved", endMessage: "Your leave has been approved", showSummary: true },
      },
    ],
    edges: [
      { id: "e1", source: "start-1", target: "approval-1" },
      { id: "e2", source: "approval-1", target: "automated-1" },
      { id: "e3", source: "automated-1", target: "end-1" },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]
