// =============================================================================
// Shared types for the canvas web component
// Mirrors angular-app/src/app/models/flow-node.model.ts
// =============================================================================

export type NodeStatus = 'idle' | 'running' | 'success' | 'error';

export interface AASServerData {
  kind: 'aasServer';
  label: string;
  endpoint: string;
  authType: 'none' | 'basic' | 'bearer';
  username?: string;
  password?: string;
  token?: string;
  status: NodeStatus;
}

export interface SubmodelData {
  kind: 'submodel';
  label: string;
  semanticId: string;
  submodelIdShort: string;
  schemaType: 'DPP' | 'TechnicalData' | 'ContactInformation' | 'Custom';
  status: NodeStatus;
}

export interface ConverterData {
  kind: 'converter';
  label: string;
  inputFormat: string;
  outputFormat: string;
  mapping: string;
  status: NodeStatus;
}

export interface ActionData {
  kind: 'action';
  label: string;
  actionType: 'read' | 'write' | 'validate' | 'transform';
  target: string;
  parameters: string;
  status: NodeStatus;
}

export type FlowNodeData = AASServerData | SubmodelData | ConverterData | ActionData;

export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: FlowNodeData;
  selected?: boolean;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}
