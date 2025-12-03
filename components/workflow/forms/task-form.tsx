"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import type { TaskNodeData } from "@/types/workflow"

interface TaskFormProps {
  data: TaskNodeData
  onChange: (data: Partial<TaskNodeData>) => void
}

export function TaskForm({ data, onChange }: TaskFormProps) {
  const [newKey, setNewKey] = useState("")
  const [newValue, setNewValue] = useState("")

  const handleAddField = () => {
    if (newKey.trim()) {
      onChange({
        customFields: { ...data.customFields, [newKey.trim()]: newValue },
      })
      setNewKey("")
      setNewValue("")
    }
  }

  const handleRemoveField = (key: string) => {
    const newFields = { ...data.customFields }
    delete newFields[key]
    onChange({ customFields: newFields })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Enter task title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Describe the task"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignee">Assignee</Label>
        <Input
          id="assignee"
          value={data.assignee}
          onChange={(e) => onChange({ assignee: e.target.value })}
          placeholder="Assign to..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input id="dueDate" type="date" value={data.dueDate} onChange={(e) => onChange({ dueDate: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label>Custom Fields</Label>
        <div className="space-y-2">
          {Object.entries(data.customFields).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 rounded-md bg-secondary p-2">
              <span className="text-sm font-medium text-foreground">{key}:</span>
              <span className="text-sm text-muted-foreground">{value}</span>
              <Button variant="ghost" size="icon" className="ml-auto h-6 w-6" onClick={() => handleRemoveField(key)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Field name"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" size="icon" onClick={handleAddField}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
