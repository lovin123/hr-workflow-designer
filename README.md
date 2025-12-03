# HR Workflow Designer Module

A React + React Flow based visual workflow designer for HR processes like onboarding, leave approval, and document verification.

## Architecture Overview

### Folder Structure

├── app/
│   ├── page.tsx              # Main entry point
│   ├── layout.tsx            # Root layout with metadata
│   └── globals.css           # Theme and styling
├── components/
│   └── workflow/
│       ├── canvas/           # React Flow canvas component
│       ├── forms/            # Node configuration forms
│       ├── nodes/            # Custom node components
│       ├── sandbox/          # Simulation panel
│       ├── sidebar/          # Node palette & controls
│       └── workflow-designer.tsx  # Main orchestrating component
├── hooks/
│   ├── use-workflow.ts       # Workflow state management
│   └── use-automations.ts    # API data fetching
├── lib/
│   └── api/
│       ├── mock-data.ts      # Mock automations & validation
│       └── workflow-api.ts   # API layer
└── types/
    └── workflow.ts           # TypeScript definitions

### Design Choices

1. **Separation of Concerns**
   - Canvas logic isolated in `canvas/`
   - Node components in `nodes/` with type registry
   - Forms in `forms/` with dynamic rendering
   - API layer abstracted in `lib/api/`

2. **Custom Hooks**
   - `useWorkflow`: Manages all workflow state including nodes, edges, selection, validation, and undo/redo history
   - `useAutomations`: SWR-based fetching for automation actions

3. **Type Safety**
   - Comprehensive TypeScript interfaces for all node types
   - Union types for workflow node data
   - Strict typing for API responses

4. **Scalability**
   - Node types registered in a single registry (`nodes/index.ts`)
   - Form components dynamically rendered based on node type
   - New node types can be added by:
     1. Adding type to `types/workflow.ts`
     2. Creating node component in `nodes/`
     3. Creating form component in `forms/`
     4. Registering in `nodes/index.ts`
     5. Adding to node palette

5. **State Management**
   - React Flow's built-in state hooks for nodes/edges
   - Local state for UI concerns (panels, modals)
   - History stack for undo/redo

### Node Types

| Type | Purpose | Configuration |
|------|---------|---------------|
| **Start** | Workflow entry point | Title, metadata key-values |
| **Task** | Human task (e.g., collect docs) | Title, description, assignee, due date, custom fields |
| **Approval** | Manager/HR approval step | Title, approver role, auto-approve threshold |
| **Automated** | System-triggered actions | Title, action selection, dynamic parameters |
| **End** | Workflow completion | End message, summary toggle |

### Mock API

- `GET /automations`: Returns available automated actions with parameters
- `POST /simulate`: Accepts workflow JSON, returns step-by-step execution
- `POST /validate`: Validates workflow structure (cycles, connections, etc.)

### Validation Rules

1. Workflow must have exactly one Start node
2. Workflow must have at least one End node
3. Start node cannot have incoming connections
4. End nodes cannot have outgoing connections
5. All nodes should be connected
6. No cycles allowed

### Features

- **Drag-and-drop** nodes from sidebar
- **Node configuration** forms with type-specific fields
- **Dynamic forms** for automated actions based on API
- **Workflow validation** with visual error/warning badges
- **Sandbox simulation** with step-by-step execution log
- **Export/Import** workflows as JSON
- **Undo/Redo** support
- **Workflow templates** for quick start
- **Mini-map** and **zoom controls**

### Assumptions

1. Single-user, client-side only (no persistence)
2. No authentication required
3. Mock API simulates network delays
4. Approval nodes support auto-approve for simple cases
5. Automated actions have predictable parameter sets

### Technologies

- **Next.js 15** with App Router
- **React Flow** for canvas
- **Tailwind CSS v4** for styling
- **shadcn/ui** components
- **SWR** for data fetching
- **TypeScript** for type safety
