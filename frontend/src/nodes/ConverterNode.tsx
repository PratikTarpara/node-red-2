import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ArrowLeftRight } from 'lucide-react';
import type { ConverterData } from '../types/NodeTypes';
import { useFlowStore } from '../store/flowStore';

const statusColor = (s: string) => {
  if (s === 'running') return '#3b82f6';
  if (s === 'success') return '#10b981';
  if (s === 'error') return '#ef4444';
  return '#475569';
};

function ConverterNode({ id, data, selected }: NodeProps) {
  const d = data as unknown as ConverterData;
  const selectNode = useFlowStore(s => s.selectNode);

  return (
    <div
      className={`aas-node${selected ? ' selected' : ''}`}
      style={{ borderColor: selected ? '#f59e0b' : '#1e2d45', boxShadow: selected ? '0 0 0 2px rgba(245,158,11,0.35)' : undefined }}
      onClick={() => selectNode(id)}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#f59e0b', borderColor: '#78350f' }} />
      <div className="aas-node-header" style={{ background: 'linear-gradient(135deg, #78350f 0%, #92400e 100%)' }}>
        <ArrowLeftRight size={16} color="#fbbf24" />
        <span style={{ fontSize: 13, fontWeight: 600, color: '#fde68a' }}>Converter</span>
        <div className={`aas-node-status`} style={{ background: statusColor(d.status || 'idle') }} />
      </div>
      <div className="aas-node-body">
        <div style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: 6, fontSize: 13 }}>{d.label || 'Converter'}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
          <span style={{ background: '#1e293b', color: '#fbbf24', padding: '2px 8px', borderRadius: 4, fontFamily: 'JetBrains Mono, monospace' }}>
            {d.inputFormat || 'AAS'}
          </span>
          <ArrowLeftRight size={12} color="#475569" />
          <span style={{ background: '#1e293b', color: '#fbbf24', padding: '2px 8px', borderRadius: 4, fontFamily: 'JetBrains Mono, monospace' }}>
            {d.outputFormat || 'DPP JSON'}
          </span>
        </div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#f59e0b', borderColor: '#78350f' }} />
    </div>
  );
}

export default memo(ConverterNode);
