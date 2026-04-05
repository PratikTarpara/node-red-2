import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
} from '@xyflow/react';
import type { LogEntry } from '../types/NodeTypes';

export type AppNode = Node;

interface FlowStore {
  nodes: AppNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  logs: LogEntry[];
  isRunning: boolean;
  consoleOpen: boolean;

  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  selectNode: (id: string | null) => void;
  updateNodeData: (id: string, data: Record<string, unknown>) => void;
  updateNodeStatus: (id: string, status: string) => void;
  addLog: (log: LogEntry) => void;
  clearLogs: () => void;
  setIsRunning: (v: boolean) => void;
  toggleConsole: () => void;
  clearFlow: () => void;
}

let edgeIdCounter = 0;

export const useFlowStore = create<FlowStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  logs: [],
  isRunning: false,
  consoleOpen: true,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),

  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),

  onConnect: (connection) =>
    set({
      edges: addEdge(
        { ...connection, id: `e-${++edgeIdCounter}`, animated: true, style: { stroke: '#3b82f6' } },
        get().edges
      ),
    }),

  selectNode: (id) => set({ selectedNodeId: id }),

  updateNodeData: (id, data) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
    }),

  updateNodeStatus: (id, status) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, status } } : n
      ),
    }),

  addLog: (log) =>
    set({ logs: [...get().logs.slice(-499), log] }),

  clearLogs: () => set({ logs: [] }),
  setIsRunning: (v) => set({ isRunning: v }),
  toggleConsole: () => set({ consoleOpen: !get().consoleOpen }),
  clearFlow: () => set({ nodes: [], edges: [], selectedNodeId: null, logs: [] }),
}));
