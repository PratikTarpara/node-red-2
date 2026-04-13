// =============================================================================
// Flow Execution Models — HTTP request/response shapes
// =============================================================================

export interface FlowRunNodePayload {
  id: string;
  type: string;
  data: Record<string, unknown>;
}

export interface FlowRunEdgePayload {
  id: string;
  source: string;
  target: string;
}

export interface FlowRunRequest {
  nodes: FlowRunNodePayload[];
  edges: FlowRunEdgePayload[];
}

export interface FlowRunResultItem {
  nodeId: string;
  nodeLabel: string;
  status: 'success' | 'error';
  output?: unknown;
}

export interface FlowRunLogItem {
  id: string;
  nodeId: string;
  nodeLabel: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  timestamp: string;
  data?: unknown;
}

export interface FlowRunResponse {
  success: boolean;
  results: FlowRunResultItem[];
  logs: FlowRunLogItem[];
}

export interface SaveFlowRequest {
  id: string;
  nodes: Array<{
    id: string;
    type: string;
    data: Record<string, unknown>;
    position: { x: number; y: number };
  }>;
  edges: Array<{ id: string; source: string; target: string }>;
}

export interface SaveFlowResponse {
  success: boolean;
  id: string;
}

export interface FlowListItem {
  id: string;
  savedAt?: string;
  nodeCount?: number;
}

export interface LoadFlowResponse {
  id: string;
  nodes: Array<{
    id: string;
    type: string;
    data: Record<string, unknown>;
    position: { x: number; y: number };
  }>;
  edges: Array<{ id: string; source: string; target: string }>;
}
