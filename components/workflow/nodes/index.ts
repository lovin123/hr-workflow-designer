// Node type registry for React Flow

import { StartNode } from "./start-node"
import { TaskNode } from "./task-node"
import { ApprovalNode } from "./approval-node"
import { AutomatedNode } from "./automated-node"
import { EndNode } from "./end-node"

export const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
}

export { StartNode, TaskNode, ApprovalNode, AutomatedNode, EndNode }
