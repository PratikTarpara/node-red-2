import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type OnInit,
  type ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useFlowStore } from '../store/flowStore';
import AASServerNode from '../nodes/AASServerNode';
import SubmodelNode from '../nodes/SubmodelNode';
import ConverterNode from '../nodes/ConverterNode';
import ActionNode from '../nodes/ActionNode';

const nodeTypes = {
  aasServer: AASServerNode,
  submodel: SubmodelNode,
  converter: ConverterNode,
  action: ActionNode,
};

let nodeIdCounter = 1;
const getId = () => `node-${nodeIdCounter++}`;

export default function FlowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);

  const nodes = useFlowStore(s => s.nodes);
  const edges = useFlowStore(s => s.edges);
  const onNodesChange = useFlowStore(s => s.onNodesChange);
  const onEdgesChange = useFlowStore(s => s.onEdgesChange);
  const onConnect = useFlowStore(s => s.onConnect);
  const selectNode = useFlowStore(s => s.selectNode);
  const setNodes = useFlowStore(s => s.setNodes);

  const onInit: OnInit = useCallback((instance) => {
    reactFlowInstanceRef.current = instance;
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/reactflow-type');
    const dataStr = e.dataTransfer.getData('application/reactflow-data');
    if (!type || !reactFlowInstanceRef.current || !reactFlowWrapper.current) return;

    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = reactFlowInstanceRef.current.screenToFlowPosition({
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    });

    let data = {};
    try { data = JSON.parse(dataStr); } catch { /* ignore */ }

    const newNode = {
      id: getId(),
      type,
      position,
      data,
    };

    const currentNodes = useFlowStore.getState().nodes;
    setNodes([...currentNodes, newNode]);
  }, [setNodes]);

  return (
    <div
      ref={reactFlowWrapper}
      style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        onPaneClick={() => selectNode(null)}
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{ animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } }}
        style={{ background: 'var(--bg-primary)' }}
        deleteKeyCode="Delete"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1e2d45" />
        <Controls style={{ bottom: 16, right: 16, top: 'auto', left: 'auto' }} />
        <MiniMap
          nodeColor={(n) => {
            if (n.type === 'aasServer') return '#3b82f6';
            if (n.type === 'submodel') return '#10b981';
            if (n.type === 'converter') return '#f59e0b';
            if (n.type === 'action') return '#8b5cf6';
            return '#475569';
          }}
          maskColor="rgba(10,15,30,0.6)"
          style={{ bottom: 16, left: 16, top: 'auto' }}
        />

        {/* Empty state */}
        {nodes.length === 0 && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            gap: 12,
          }}>
            <div style={{ fontSize: 48, opacity: 0.15 }}>⬡</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-muted)', opacity: 0.5 }}>
              Drag nodes from the sidebar to get started
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', opacity: 0.35 }}>
              Build your AAS workflow by connecting nodes
            </div>
          </div>
        )}
      </ReactFlow>
    </div>
  );
}
