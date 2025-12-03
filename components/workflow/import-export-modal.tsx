"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Copy, Check, AlertCircle } from "lucide-react"
import { importWorkflow, exportWorkflow } from "@/lib/api/workflow-api"
import type { Workflow, WorkflowNode, WorkflowEdge } from "@/types/workflow"

interface ImportExportModalProps {
  isOpen: boolean
  mode: "import" | "export"
  onClose: () => void
  workflowData?: { nodes: WorkflowNode[]; edges: WorkflowEdge[]; name?: string }
  onImport?: (workflow: Workflow) => void
}

export function ImportExportModal({ isOpen, mode, onClose, workflowData, onImport }: ImportExportModalProps) {
  const [jsonContent, setJsonContent] = useState("")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const exportJson = workflowData
    ? exportWorkflow({
        id: `workflow-${Date.now()}`,
        name: workflowData.name || "Untitled Workflow",
        description: "Exported workflow",
        nodes: workflowData.nodes,
        edges: workflowData.edges,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    : ""

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exportJson)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleImport = () => {
    setError(null)
    const workflow = importWorkflow(jsonContent)
    if (workflow && onImport) {
      onImport(workflow)
      onClose()
    } else {
      setError("Invalid workflow JSON. Please check the format and try again.")
    }
  }

  const handleDownload = () => {
    const blob = new Blob([exportJson], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `workflow-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "export" ? "Export Workflow" : "Import Workflow"}</DialogTitle>
          <DialogDescription>
            {mode === "export" ? "Copy or download your workflow as JSON" : "Paste a workflow JSON to import"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {mode === "export" ? (
            <>
              <div className="space-y-2">
                <Label>Workflow JSON</Label>
                <Textarea value={exportJson} readOnly className="font-mono text-xs h-64" />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCopy} variant="outline" className="flex-1 bg-transparent">
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
                <Button onClick={handleDownload} className="flex-1">
                  Download JSON
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Paste Workflow JSON</Label>
                <Textarea
                  value={jsonContent}
                  onChange={(e) => setJsonContent(e.target.value)}
                  placeholder="Paste your workflow JSON here..."
                  className="font-mono text-xs h-64"
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              <Button onClick={handleImport} className="w-full" disabled={!jsonContent.trim()}>
                Import Workflow
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
