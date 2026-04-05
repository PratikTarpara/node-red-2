export type NodeStatus = 'idle' | 'running' | 'success' | 'error';

export interface AASServerData {
  label: string;
  endpoint: string;
  authType: 'none' | 'basic' | 'bearer';
  username?: string;
  password?: string;
  token?: string;
  status: NodeStatus;
}

export interface SubmodelData {
  label: string;
  semanticId: string;
  submodelIdShort: string;
  schemaType: 'DPP' | 'TechnicalData' | 'ContactInformation' | 'Custom';
  status: NodeStatus;
}

export interface ConverterData {
  label: string;
  inputFormat: string;
  outputFormat: string;
  mapping: string; // JSON string mapping rules
  status: NodeStatus;
}

export interface ActionData {
  label: string;
  actionType: 'read' | 'write' | 'validate' | 'transform';
  target: string;
  parameters: string; // JSON string
  status: NodeStatus;
}

export type FlowNodeData = AASServerData | SubmodelData | ConverterData | ActionData;

export interface LogEntry {
  id: string;
  nodeId: string;
  nodeLabel: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  timestamp: string;
  data?: unknown;
}

export interface FlowNodeType {
  type: string;
  label: string;
  description: string;
  color: string;
  icon: string;
  defaultData: FlowNodeData;
}
