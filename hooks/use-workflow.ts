"use client"

// Custom hook for workflow state management

import { useState, useCallback, useRef } from "react"
import { useNodesState, useEdgesState, addEdge, type Connection, type Edge, type Node } from "@xyflow/react"
import type { WorkflowNode, WorkflowEdge, WorkflowNodeData, NodeType, ValidationError } from "@/types/workflow"
import { validateWorkflow } from "@/lib/api/mock-data"

// Default node data factories
export function createNodeData(type: NodeType, label: string): WorkflowNodeData {
  switch (type) {
    case "start":
      return { type: "start", label, title: label, metadata: {} }
    case "task":
      return { type: "task", label, title: label, description: "", assignee: "", dueDate: "", customFields: {} }
    case "approval":
      return { type: "approval", label, title: label, approverRole: "Manager", autoApproveThreshold: 0 }
    case "automated":
      return { type: "automated", label, title: label, actionId: "", actionParams: {} }
    case "end":
      return { type: "end", label, endMessage: "Workflow completed", showSummary: true }
    default:
      throw new Error(`Unknown node type: ${type}`)
  }
}

// History management for undo/redo
interface HistoryState {
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
}

export function useWorkflow(initialNodes: Node<WorkflowNodeData>[] = [], initialEdges: Edge[] = []) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node<WorkflowNodeData> | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])

  // History for undo/redo
  const historyRef = useRef<HistoryState[]>([])
  const historyIndexRef = useRef(-1)

  const saveToHistory = useCallback(() => {
    const newState = { nodes: [...nodes], edges: [...edges] }
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1)
    newHistory.push(newState)
    historyRef.current = newHistory.slice(-50) // Keep last 50 states
    historyIndexRef.current = historyRef.current.length - 1
  }, [nodes, edges])

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--
      const prevState = historyRef.current[historyIndexRef.current]
      setNodes(prevState.nodes)
      setEdges(prevState.edges)
    }
  }, [setNodes, setEdges])

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++
      const nextState = historyRef.current[historyIndexRef.current]
      setNodes(nextState.nodes)
      setEdges(nextState.edges)
    }
  }, [setNodes, setEdges])

  // Handle edge connections
  const onConnect = useCallback(
    (connection: Connection) => {
      saveToHistory()
      setEdges((eds) => addEdge({ ...connection, id: `e-${Date.now()}` }, eds))
    },
    [setEdges, saveToHistory],
  )

  // Add a new node
  const addNode = useCallback(
    (type: NodeType, position: { x: number; y: number }) => {
      saveToHistory()
      const id = `${type}-${Date.now()}`
      const label = getDefaultLabel(type)
      const newNode: Node<WorkflowNodeData> = {
        id,
        type,
        position,
        data: createNodeData(type, label),
      }
      setNodes((nds) => [...nds, newNode])
      return newNode
    },
    [setNodes, saveToHistory],
  )

  // Update node data
  const updateNodeData = useCallback(
    (nodeId: string, data: Partial<WorkflowNodeData>) => {
      saveToHistory()
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: { ...node.data, ...data, label: (data as { title?: string }).title || node.data.label } as WorkflowNodeData,
            }
          }
          return node
        }),
      )
      // Update selected node reference
      if (selectedNode?.id === nodeId) {
        setSelectedNode((prev) => (prev ? { ...prev, data: { ...prev.data, ...data } as WorkflowNodeData } : null))
      }
    },
    [setNodes, selectedNode, saveToHistory],
  )

  // Delete selected nodes/edges
  const deleteSelected = useCallback(() => {
    saveToHistory()
    const selectedNodeIds = nodes.filter((n) => n.selected).map((n) => n.id)
    setNodes((nds) => nds.filter((n) => !n.selected))
    setEdges((eds) =>
      eds.filter((e) => !e.selected && !selectedNodeIds.includes(e.source) && !selectedNodeIds.includes(e.target)),
    )
    setSelectedNode(null)
  }, [nodes, setNodes, setEdges, saveToHistory])

  // Validate workflow
  const validate = useCallback(() => {
    const workflowNodes = nodes.map((n) => ({
      id: n.id,
      type: n.type as NodeType,
      position: n.position,
      data: n.data,
    })) as WorkflowNode[]

    const workflowEdges = edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
    })) as WorkflowEdge[]

    const errors = validateWorkflow(workflowNodes, workflowEdges)
    setValidationErrors(errors)
    return errors
  }, [nodes, edges])

  // Clear canvas
  const clearCanvas = useCallback(() => {
    saveToHistory()
    setNodes([])
    setEdges([])
    setSelectedNode(null)
    setValidationErrors([])
  }, [setNodes, setEdges, saveToHistory])

  // Load workflow from template or JSON
  const loadWorkflow = useCallback(
    (workflowNodes: WorkflowNode[], workflowEdges: WorkflowEdge[]) => {
      saveToHistory()
      const nodes = workflowNodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: n.data,
      })) as Node<WorkflowNodeData>[]

      const edges = workflowEdges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
      })) as Edge[]

      setNodes(nodes)
      setEdges(edges)
      setSelectedNode(null)
      setValidationErrors([])
    },
    [setNodes, setEdges, saveToHistory],
  )

  return {
    nodes,
    edges,
    selectedNode,
    validationErrors,
    setSelectedNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNodeData,
    deleteSelected,
    validate,
    clearCanvas,
    loadWorkflow,
    undo,
    redo,
    canUndo: historyIndexRef.current > 0,
    canRedo: historyIndexRef.current < historyRef.current.length - 1,
  }
}

function getDefaultLabel(type: NodeType): string {
  switch (type) {
    case "start":
      return "Start"
    case "task":
      return "New Task"
    case "approval":
      return "Approval"
    case "automated":
      return "Automated Step"
    case "end":
      return "End"
    default:
      return "Node"
  }
}
