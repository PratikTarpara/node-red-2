import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { ConverterData } from '../types';

const statusColor = (s: string): string => {
  if (s === 'running') return '#3b82f6';
  if (s === 'success') return '#10b981';
  if (s === 'error') return '#ef4444';
  return '#475569';
};

function ConverterNode({ data, selected }: NodeProps) {
  const d = data as unknown as ConverterData;

  return (
    <div
      className={`aas-node${selected ? ' selected' : ''}`}
      style={{
        borderColor: selected ? '#f59e0b' : '#1e2d45',
        boxShadow: selected ? '0 0 0 2px rgba(245,158,11,0.35)' : undefined,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#f59e0b', borderColor: '#78350f' }} />
      <div className="aas-node-header" style={{ background: 'linear-gradient(135deg, #78350f 0%, #92400e 100%)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
          <path d="M21 16H3M21 16l-4-4m4 4-4 4M3 8h18M3 8l4-4M3 8l4 4"></path>
        </svg>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#fde68a' }}>Converter</span>
        <div className={`aas-node-status status-${d.status ?? 'idle'}`} style={{ background: statusColor(d.status ?? 'idle') }} />
      </div>
      <div className="aas-node-body">
        <div style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: 4, fontSize: 13 }}>{d.label ?? 'Converter'}</div>
        <div style={{ color: '#fbbf24', fontSize: 11 }}>
          {d.inputFormat ?? 'AAS JSON'} → {d.outputFormat ?? 'DPP JSON'}
        </div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#f59e0b', borderColor: '#78350f' }} />
    </div>
  );
}

export default memo(ConverterNode);
