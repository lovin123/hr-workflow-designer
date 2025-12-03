"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, FileJson, FolderOpen, Trash2, RotateCcw, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { NodePalette } from "./node-palette"
import { workflowTemplates } from "@/lib/api/workflow-api"
import type { NodeType, Workflow } from "@/types/workflow"

interface WorkflowSidebarProps {
  onDragStart: (event: React.DragEvent, nodeType: NodeType) => void
  onLoadTemplate: (workflow: Workflow) => void
  onExport: () => void
  onImport: () => void
  onClear: () => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
}

export function WorkflowSidebar({
  onDragStart,
  onLoadTemplate,
  onExport,
  onImport,
  onClear,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: WorkflowSidebarProps) {
  const [templatesOpen, setTemplatesOpen] = useState(false)

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-sidebar">
      <div className="border-b border-sidebar-border p-4">
        <h2 className="text-lg font-semibold text-sidebar-foreground">Workflow Designer</h2>
        <p className="text-xs text-muted-foreground">Drag nodes onto the canvas</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <NodePalette onDragStart={onDragStart} />

        <Separator className="my-4" />

        <Collapsible open={templatesOpen} onOpenChange={setTemplatesOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-secondary">
            Templates
            <ChevronDown className={`h-4 w-4 transition-transform ${templatesOpen ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {workflowTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => onLoadTemplate(template)}
                className="w-full rounded-lg border border-border bg-card p-3 text-left transition-all hover:border-primary hover:bg-secondary"
              >
                <span className="text-sm font-medium text-foreground">{template.name}</span>
                <p className="text-xs text-muted-foreground">{template.description}</p>
              </button>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="border-t border-sidebar-border p-4 space-y-2">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={onUndo} disabled={!canUndo} title="Undo">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onRedo} disabled={!canRedo} title="Redo">
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent" onClick={onExport}>
            <FileJson className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={onImport}>
            <FolderOpen className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="destructive" size="icon" onClick={onClear} title="Clear Canvas">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
