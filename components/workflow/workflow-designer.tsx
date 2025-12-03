"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { ReactFlowProvider, useReactFlow } from "@xyflow/react"
import { WorkflowCanvas } from "./canvas/workflow-canvas"
import { WorkflowSidebar } from "./sidebar/workflow-sidebar"
import { NodeFormPanel } from "./forms/node-form-panel"
import { SimulationPanel } from "./sandbox/simulation-panel"
import { ImportExportModal } from "./import-export-modal"
import { useWorkflow } from "@/hooks/use-workflow"
import type { NodeType, Workflow, WorkflowNode, WorkflowEdge } from "@/types/workflow"
import type { Node } from "@xyflow/react"
import type { WorkflowNodeData } from "@/types/workflow"

function WorkflowDesignerInner() {
  const {
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
    canUndo,
    canRedo,
  } = useWorkflow()

  const [sandboxOpen, setSandboxOpen] = useState(false)
  const [modalState, setModalState] = useState<{ isOpen: boolean; mode: "import" | "export" }>({
    isOpen: false,
    mode: "export",
  })

  const reactFlowInstance = useReactFlow()

  const handleDragStart = useCallback((event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData("application/reactflow") as NodeType
      if (!type) return

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      addNode(type, position)
    },
    [reactFlowInstance, addNode],
  )

  const handleLoadTemplate = useCallback(
    (workflow: Workflow) => {
      loadWorkflow(workflow.nodes, workflow.edges)
    },
    [loadWorkflow],
  )

  const handleExport = useCallback(() => {
    setModalState({ isOpen: true, mode: "export" })
  }, [])

  const handleImport = useCallback(() => {
    setModalState({ isOpen: true, mode: "import" })
  }, [])

  const handleImportWorkflow = useCallback(
    (workflow: Workflow) => {
      loadWorkflow(workflow.nodes, workflow.edges)
    },
    [loadWorkflow],
  )

  const handleNodeSelect = useCallback(
    (node: Node<WorkflowNodeData> | null) => {
      setSelectedNode(node)
    },
    [setSelectedNode],
  )

  const handleDeleteNode = useCallback(() => {
    deleteSelected()
    setSelectedNode(null)
  }, [deleteSelected, setSelectedNode])

  const handleClosePanel = useCallback(() => {
    setSelectedNode(null)
  }, [setSelectedNode])

  // Convert nodes/edges for export
  const workflowData = {
    nodes: nodes.map((n) => ({
      id: n.id,
      type: n.type as NodeType,
      position: n.position,
      data: n.data,
    })) as WorkflowNode[],
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
    })) as WorkflowEdge[],
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <WorkflowSidebar
        onDragStart={handleDragStart}
        onLoadTemplate={handleLoadTemplate}
        onExport={handleExport}
        onImport={handleImport}
        onClear={clearCanvas}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      <div className="relative flex flex-1">
        <WorkflowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeSelect={handleNodeSelect}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          validationErrors={validationErrors}
          onValidate={validate}
          onToggleSandbox={() => setSandboxOpen(!sandboxOpen)}
          sandboxOpen={sandboxOpen}
        />

        <SimulationPanel nodes={nodes} edges={edges} isOpen={sandboxOpen} onClose={() => setSandboxOpen(false)} />

        {selectedNode && (
          <NodeFormPanel
            node={selectedNode}
            onUpdate={updateNodeData}
            onClose={handleClosePanel}
            onDelete={handleDeleteNode}
          />
        )}
      </div>

      <ImportExportModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        workflowData={workflowData}
        onImport={handleImportWorkflow}
      />
    </div>
  )
}

export function WorkflowDesigner() {
  return (
    <ReactFlowProvider>
      <WorkflowDesignerInner />
    </ReactFlowProvider>
  )
}
