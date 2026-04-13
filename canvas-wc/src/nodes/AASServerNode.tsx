import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { AASServerData } from '../types';

const statusColor = (s: string): string => {
  if (s === 'running') return '#3b82f6';
  if (s === 'success') return '#10b981';
  if (s === 'error') return '#ef4444';
  return '#475569';
};

function AASServerNode({ data, selected }: NodeProps) {
  const d = data as unknown as AASServerData;

  return (
    <div
      className={`aas-node${selected ? ' selected' : ''}`}
      style={{
        borderColor: selected ? '#3b82f6' : '#1e2d45',
        boxShadow: selected ? '0 0 0 2px rgba(59,130,246,0.4)' : undefined,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#3b82f6', borderColor: '#1e3a6e' }} />
      <div className="aas-node-header" style={{ background: 'linear-gradient(135deg, #1e3a6e 0%, #152d5a 100%)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
          <rect x="2" y="3" width="20" height="7" rx="1"></rect>
          <rect x="2" y="14" width="20" height="7" rx="1"></rect>
          <circle cx="6" cy="6.5" r="1" fill="#60a5fa"></circle>
          <circle cx="6" cy="17.5" r="1" fill="#60a5fa"></circle>
        </svg>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#93c5fd' }}>AAS Server</span>
        <div className={`aas-node-status status-${d.status ?? 'idle'}`} style={{ background: statusColor(d.status ?? 'idle') }} />
      </div>
      <div className="aas-node-body">
        <div style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: 4, fontSize: 13 }}>{d.label ?? 'AAS Server'}</div>
        <div style={{ color: '#60a5fa', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', wordBreak: 'break-all' }}>
          {d.endpoint ?? 'http://localhost:4000'}
        </div>
        <div style={{ marginTop: 4, color: '#475569', fontSize: 11 }}>Auth: {d.authType ?? 'none'}</div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#3b82f6', borderColor: '#1e3a6e' }} />
    </div>
  );
}

export default memo(AASServerNode);
