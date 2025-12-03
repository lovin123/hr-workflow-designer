"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ApprovalNodeData } from "@/types/workflow"

interface ApprovalFormProps {
  data: ApprovalNodeData
  onChange: (data: Partial<ApprovalNodeData>) => void
}

const approverRoles = ["Manager", "HRBP", "Director", "VP", "Custom"] as const

export function ApprovalForm({ data, onChange }: ApprovalFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Enter approval title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="approverRole">Approver Role</Label>
        <Select
          value={data.approverRole}
          onValueChange={(value) => onChange({ approverRole: value as ApprovalNodeData["approverRole"] })}
        >
          <SelectTrigger id="approverRole">
            <SelectValue placeholder="Select approver role" />
          </SelectTrigger>
          <SelectContent>
            {approverRoles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {data.approverRole === "Custom" && (
        <div className="space-y-2">
          <Label htmlFor="customApprover">Custom Approver</Label>
          <Input
            id="customApprover"
            value={data.customApprover || ""}
            onChange={(e) => onChange({ customApprover: e.target.value })}
            placeholder="Enter custom approver name"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="autoApproveThreshold">Auto-Approve Threshold (days)</Label>
        <Input
          id="autoApproveThreshold"
          type="number"
          min="0"
          value={data.autoApproveThreshold}
          onChange={(e) => onChange({ autoApproveThreshold: Number.parseInt(e.target.value) || 0 })}
          placeholder="0 = disabled"
        />
        <p className="text-xs text-muted-foreground">
          Set to 0 to disable auto-approval. Requests within this threshold will be auto-approved.
        </p>
      </div>
    </div>
  )
}
