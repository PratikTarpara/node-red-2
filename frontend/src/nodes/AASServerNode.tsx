import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Server } from 'lucide-react';
import type { AASServerData } from '../types/NodeTypes';
import { useFlowStore } from '../store/flowStore';

const statusColor = (s: string) => {
  if (s === 'running') return '#3b82f6';
  if (s === 'success') return '#10b981';
  if (s === 'error') return '#ef4444';
  return '#475569';
};

function AASServerNode({ id, data, selected }: NodeProps) {
  const d = data as unknown as AASServerData;
  const selectNode = useFlowStore(s => s.selectNode);

  return (
    <div
      className={`aas-node${selected ? ' selected' : ''}`}
      style={{ borderColor: selected ? '#3b82f6' : '#1e2d45', boxShadow: selected ? '0 0 0 2px rgba(59,130,246,0.4)' : undefined }}
      onClick={() => selectNode(id)}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#3b82f6', borderColor: '#1e3a6e' }} />
      <div className="aas-node-header" style={{ background: 'linear-gradient(135deg, #1e3a6e 0%, #152d5a 100%)' }}>
        <Server size={16} color="#60a5fa" />
        <span style={{ fontSize: 13, fontWeight: 600, color: '#93c5fd' }}>AAS Server</span>
        <div className={`aas-node-status status-${d.status || 'idle'}`} style={{ background: statusColor(d.status || 'idle') }} />
      </div>
      <div className="aas-node-body">
        <div style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: 4, fontSize: 13 }}>{d.label || 'AAS Server'}</div>
        <div style={{ color: '#60a5fa', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', wordBreak: 'break-all' }}>
          {d.endpoint || 'http://localhost:4000'}
        </div>
        <div style={{ marginTop: 4, color: '#475569', fontSize: 11 }}>
          Auth: {d.authType || 'none'}
        </div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#3b82f6', borderColor: '#1e3a6e' }} />
    </div>
  );
}

export default memo(AASServerNode);
