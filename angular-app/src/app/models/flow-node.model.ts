// =============================================================================
// Flow Node Models — strict TypeScript interfaces
// Replaces React's types/NodeTypes.ts
// =============================================================================

export type NodeStatus = 'idle' | 'running' | 'success' | 'error';

export type AuthType = 'none' | 'basic' | 'bearer';

export type SchemaType = 'DPP' | 'TechnicalData' | 'ContactInformation' | 'Custom';

export type ActionType = 'read' | 'write' | 'validate' | 'transform';

// ── Per-node data shapes ──────────────────────────────────────────────────────

export interface AASServerData {
  readonly kind: 'aasServer';
  label: string;
  endpoint: string;
  authType: AuthType;
  username?: string;
  password?: string;
  token?: string;
  status: NodeStatus;
}

export interface SubmodelData {
  readonly kind: 'submodel';
  label: string;
  semanticId: string;
  submodelIdShort: string;
  schemaType: SchemaType;
  status: NodeStatus;
}

export interface ConverterData {
  readonly kind: 'converter';
  label: string;
  inputFormat: string;
  outputFormat: string;
  /** JSON string mapping rules */
  mapping: string;
  status: NodeStatus;
}

export interface ActionData {
  readonly kind: 'action';
  label: string;
  actionType: ActionType;
  target: string;
  /** JSON string of action parameters */
  parameters: string;
  status: NodeStatus;
}

/** Discriminated union of all node data types */
export type FlowNodeData = AASServerData | SubmodelData | ConverterData | ActionData;

// ── Graph primitives ──────────────────────────────────────────────────────────

export interface FlowNodePosition {
  x: number;
  y: number;
}

export interface FlowNode {
  id: string;
  type: string;
  position: FlowNodePosition;
  data: FlowNodeData;
  selected?: boolean;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

// ── Log entries ───────────────────────────────────────────────────────────────

export type LogLevel = 'info' | 'warn' | 'error' | 'success';

export interface LogEntry {
  id: string;
  nodeId: string;
  nodeLabel: string;
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
}
