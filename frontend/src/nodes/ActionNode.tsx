import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Zap } from 'lucide-react';
import type { ActionData } from '../types/NodeTypes';
import { useFlowStore } from '../store/flowStore';

const statusColor = (s: string) => {
  if (s === 'running') return '#3b82f6';
  if (s === 'success') return '#10b981';
  if (s === 'error') return '#ef4444';
  return '#475569';
};

const actionColors: Record<string, string> = {
  read: '#a78bfa',
  write: '#c084fc',
  validate: '#e879f9',
  transform: '#7c3aed',
};

function ActionNode({ id, data, selected }: NodeProps) {
  const d = data as unknown as ActionData;
  const selectNode = useFlowStore(s => s.selectNode);
  const actionColor = actionColors[d.actionType || 'read'];

  return (
    <div
      className={`aas-node${selected ? ' selected' : ''}`}
      style={{ borderColor: selected ? '#8b5cf6' : '#1e2d45', boxShadow: selected ? '0 0 0 2px rgba(139,92,246,0.35)' : undefined }}
      onClick={() => selectNode(id)}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#8b5cf6', borderColor: '#3b0764' }} />
      <div className="aas-node-header" style={{ background: 'linear-gradient(135deg, #3b0764 0%, #4c1d95 100%)' }}>
        <Zap size={16} color="#a78bfa" />
        <span style={{ fontSize: 13, fontWeight: 600, color: '#c4b5fd' }}>Action</span>
        <div className={`aas-node-status`} style={{ background: statusColor(d.status || 'idle') }} />
      </div>
      <div className="aas-node-body">
        <div style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: 4, fontSize: 13 }}>{d.label || 'Action'}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            background: actionColor + '22',
            color: actionColor,
            padding: '2px 10px',
            borderRadius: 12,
            fontSize: 11,
            fontWeight: 600,
            border: `1px solid ${actionColor}44`,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {d.actionType || 'read'}
          </span>
        </div>
        {d.target && (
          <div style={{ color: '#475569', fontSize: 11, marginTop: 4, fontFamily: 'JetBrains Mono, monospace', wordBreak: 'break-all' }}>
            {d.target}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#8b5cf6', borderColor: '#3b0764' }} />
    </div>
  );
}

export default memo(ActionNode);
