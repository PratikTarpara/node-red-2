import { Server, Layers, ArrowLeftRight, Zap } from 'lucide-react';

const NODE_TYPES = [
  {
    type: 'aasServer',
    label: 'AAS Server',
    description: 'Connect to an AAS server endpoint',
    icon: Server,
    color: '#3b82f6',
    bg: 'linear-gradient(135deg, #1e3a6e, #152d5a)',
    defaultData: {
      label: 'AAS Server',
      endpoint: 'http://localhost:4000',
      authType: 'none',
      status: 'idle',
    },
  },
  {
    type: 'submodel',
    label: 'Submodel',
    description: 'AAS Submodel (e.g. DPP)',
    icon: Layers,
    color: '#10b981',
    bg: 'linear-gradient(135deg, #064e3b, #065f46)',
    defaultData: {
      label: 'DPP Submodel',
      semanticId: '0173-1#01-AHF578#001',
      submodelIdShort: 'DigitalProductPassport',
      schemaType: 'DPP',
      status: 'idle',
    },
  },
  {
    type: 'converter',
    label: 'Converter',
    description: 'Transform data between formats',
    icon: ArrowLeftRight,
    color: '#f59e0b',
    bg: 'linear-gradient(135deg, #78350f, #92400e)',
    defaultData: {
      label: 'AAS → DPP',
      inputFormat: 'AAS JSON',
      outputFormat: 'DPP JSON',
      mapping: '{}',
      status: 'idle',
    },
  },
  {
    type: 'action',
    label: 'Action',
    description: 'Read / Write / Validate / Transform',
    icon: Zap,
    color: '#8b5cf6',
    bg: 'linear-gradient(135deg, #3b0764, #4c1d95)',
    defaultData: {
      label: 'Read Action',
      actionType: 'read',
      target: '',
      parameters: '{}',
      status: 'idle',
    },
  },
];

let nodeCounter = 1;

export default function Sidebar() {
  const onDragStart = (e: React.DragEvent, nodeType: typeof NODE_TYPES[0]) => {
    e.dataTransfer.setData('application/reactflow-type', nodeType.type);
    e.dataTransfer.setData('application/reactflow-data', JSON.stringify(nodeType.defaultData));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside style={{
      width: 220,
      background: 'var(--bg-panel)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 16px 12px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>
          Node Palette
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Drag nodes to canvas</div>
      </div>

      {/* Node list */}
      <div style={{ padding: '12px 10px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {NODE_TYPES.map((nt) => {
          const Icon = nt.icon;
          return (
            <div
              key={nt.type}
              draggable
              onDragStart={(e) => onDragStart(e, nt)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '10px 12px',
                cursor: 'grab',
                transition: 'all 0.2s',
                userSelect: 'none',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = nt.color;
                (e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hover)';
                (e.currentTarget as HTMLElement).style.transform = 'translateX(2px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
                (e.currentTarget as HTMLElement).style.transform = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: nt.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={14} color={nt.color} />
                </div>
                <span style={{ fontWeight: 600, fontSize: 12, color: 'var(--text-primary)' }}>{nt.label}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', paddingLeft: 36 }}>{nt.description}</div>
            </div>
          );
        })}
      </div>

      {/* Footer tip */}
      <div style={{
        padding: '10px 14px',
        borderTop: '1px solid var(--border)',
        fontSize: 11,
        color: 'var(--text-muted)',
        lineHeight: 1.5,
      }}>
        💡 Connect nodes by dragging from a right port to a left port.
      </div>
    </aside>
  );
}

export { NODE_TYPES, nodeCounter as _nodeCounter };
let _nc = nodeCounter;
export const getNextNodeId = () => `node-${_nc++}`;
