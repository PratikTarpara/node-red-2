import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  applyNodeChanges,
  applyEdgeChanges,
  type OnInit,
  type ReactFlowInstance,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import AASServerNode from './nodes/AASServerNode';
import SubmodelNode from './nodes/SubmodelNode';
import ConverterNode from './nodes/ConverterNode';
import ActionNode from './nodes/ActionNode';
import type { FlowNode, FlowEdge } from './types';

const nodeTypes = {
  aasServer: AASServerNode,
  submodel: SubmodelNode,
  converter: ConverterNode,
  action: ActionNode,
};

let nodeIdCounter = 1;
const getNewId = (): string => `node-${nodeIdCounter++}`;

interface Props {
  nodes: FlowNode[];
  edges: FlowEdge[];
  dispatch: (type: string, detail: unknown) => void;
}

export function FlowCanvasWC({ nodes, edges, dispatch }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rfInstanceRef = useRef<ReactFlowInstance | null>(null);

  const onInit: OnInit = useCallback((instance) => {
    rfInstanceRef.current = instance;
  }, []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updated = applyNodeChanges(changes, nodes as unknown as Node[]);
      dispatch('nodeschanged', { nodes: updated });
    },
    [nodes, dispatch],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const updated = applyEdgeChanges(changes, edges as unknown as Edge[]);
      dispatch('edgeschanged', { edges: updated });
    },
    [edges, dispatch],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      // Dispatch BOTH events so Angular receives the new edge and can update its state.
      // The edge will appear on next render when Angular pushes the updated edges attribute back.
      dispatch('connect', { source: connection.source, target: connection.target });
    },
    [dispatch],
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      dispatch('nodeselected', { nodeId: node.id });
    },
    [dispatch],
  );

  const onPaneClick = useCallback(() => {
    dispatch('nodeselected', { nodeId: null });
  }, [dispatch]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData('application/reactflow-type');
      const dataStr = e.dataTransfer.getData('application/reactflow-data');

      if (!type || !rfInstanceRef.current || !wrapperRef.current) return;

      const bounds = wrapperRef.current.getBoundingClientRect();
      const position = rfInstanceRef.current.screenToFlowPosition({
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      });

      let nodeData: Record<string, unknown> = {};
      try {
        nodeData = JSON.parse(dataStr) as Record<string, unknown>;
      } catch {
        /* ignore */
      }

      const newNode: FlowNode = {
        id: getNewId(),
        type,
        position,
        data: nodeData as unknown as FlowNode['data'],
      };

      dispatch('nodedropped', { node: newNode });
    },
    [dispatch],
  );

  return (
    // Explicit height is required — ReactFlow uses ResizeObserver but needs
    // the container to have a concrete pixel height on first render.
    <div
      ref={wrapperRef}
      style={{ width: '100%', height: '100%', minHeight: 0, position: 'relative' }}
    >
      <ReactFlow
        nodes={nodes as unknown as Node[]}
        edges={edges as unknown as Edge[]}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 2 },
        }}
        style={{ background: '#0a0f1e', width: '100%', height: '100%' }}
        deleteKeyCode="Delete"
        panOnScroll={false}
        zoomOnScroll={true}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#1e293b"
        />
        <Controls
          showInteractive={false}
          style={{ bottom: 16, right: 16, top: 'auto', left: 'auto' }}
        />
        <MiniMap
          nodeColor={(n) => {
            if (n.type === 'aasServer') return '#3b82f6';
            if (n.type === 'submodel') return '#10b981';
            if (n.type === 'converter') return '#f59e0b';
            if (n.type === 'action') return '#8b5cf6';
            return '#475569';
          }}
          maskColor="rgba(10,15,30,0.7)"
          pannable
          zoomable
          style={{ bottom: 16, left: 16, top: 'auto', background: '#0f172a' }}
        />
      </ReactFlow>
    </div>
  );
}
