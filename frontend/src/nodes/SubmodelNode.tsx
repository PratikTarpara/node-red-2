import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Layers } from 'lucide-react';
import type { SubmodelData } from '../types/NodeTypes';
import { useFlowStore } from '../store/flowStore';

const statusColor = (s: string) => {
  if (s === 'running') return '#3b82f6';
  if (s === 'success') return '#10b981';
  if (s === 'error') return '#ef4444';
  return '#475569';
};

function SubmodelNode({ id, data, selected }: NodeProps) {
  const d = data as unknown as SubmodelData;
  const selectNode = useFlowStore(s => s.selectNode);

  return (
    <div
      className={`aas-node${selected ? ' selected' : ''}`}
      style={{ borderColor: selected ? '#10b981' : '#1e2d45', boxShadow: selected ? '0 0 0 2px rgba(16,185,129,0.35)' : undefined }}
      onClick={() => selectNode(id)}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#10b981', borderColor: '#064e3b' }} />
      <div className="aas-node-header" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)' }}>
        <Layers size={16} color="#34d399" />
        <span style={{ fontSize: 13, fontWeight: 600, color: '#6ee7b7' }}>Submodel</span>
        <div className={`aas-node-status`} style={{ background: statusColor(d.status || 'idle') }} />
      </div>
      <div className="aas-node-body">
        <div style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: 4, fontSize: 13 }}>{d.label || 'Submodel'}</div>
        <div style={{ color: '#34d399', fontSize: 11, marginBottom: 2 }}>
          {d.schemaType || 'DPP'}
        </div>
        <div style={{ color: '#475569', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', wordBreak: 'break-all' }}>
          {d.semanticId || '0173-1#01-AHF578#001'}
        </div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#10b981', borderColor: '#064e3b' }} />
    </div>
  );
}

export default memo(SubmodelNode);
