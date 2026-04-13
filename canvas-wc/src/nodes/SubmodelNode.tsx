import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { SubmodelData } from '../types';

const statusColor = (s: string): string => {
  if (s === 'running') return '#3b82f6';
  if (s === 'success') return '#10b981';
  if (s === 'error') return '#ef4444';
  return '#475569';
};

function SubmodelNode({ data, selected }: NodeProps) {
  const d = data as unknown as SubmodelData;

  return (
    <div
      className={`aas-node${selected ? ' selected' : ''}`}
      style={{
        borderColor: selected ? '#10b981' : '#1e2d45',
        boxShadow: selected ? '0 0 0 2px rgba(16,185,129,0.35)' : undefined,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#10b981', borderColor: '#064e3b' }} />
      <div className="aas-node-header" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#6ee7b7' }}>Submodel</span>
        <div className={`aas-node-status status-${d.status ?? 'idle'}`} style={{ background: statusColor(d.status ?? 'idle') }} />
      </div>
      <div className="aas-node-body">
        <div style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: 4, fontSize: 13 }}>{d.label ?? 'Submodel'}</div>
        <div style={{ color: '#34d399', fontSize: 11, marginBottom: 2 }}>{d.schemaType ?? 'DPP'}</div>
        <div style={{ color: '#475569', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>{d.submodelIdShort ?? ''}</div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#10b981', borderColor: '#064e3b' }} />
    </div>
  );
}

export default memo(SubmodelNode);
