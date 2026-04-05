import { useFlowStore } from '../store/flowStore';
import type { AASServerData, SubmodelData, ConverterData, ActionData } from '../types/NodeTypes';
import { X, Settings } from 'lucide-react';

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--text-muted)',
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  marginBottom: 4,
};
const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg-primary)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  color: 'var(--text-primary)',
  fontSize: 12,
  padding: '6px 10px',
  outline: 'none',
  fontFamily: 'inherit',
};
const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer' };
const fieldStyle: React.CSSProperties = { marginBottom: 14 };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={fieldStyle}>
      <div style={labelStyle}>{label}</div>
      {children}
    </div>
  );
}

function AASServerPanel({ id, data }: { id: string; data: AASServerData }) {
  const update = useFlowStore(s => s.updateNodeData);
  return (
    <>
      <Field label="Label">
        <input style={inputStyle} value={data.label} onChange={e => update(id, { label: e.target.value })} />
      </Field>
      <Field label="Endpoint URL">
        <input style={{ ...inputStyle, fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }} value={data.endpoint} onChange={e => update(id, { endpoint: e.target.value })} placeholder="http://localhost:4000" />
      </Field>
      <Field label="Authentication">
        <select style={selectStyle} value={data.authType} onChange={e => update(id, { authType: e.target.value })}>
          <option value="none">None</option>
          <option value="basic">Basic Auth</option>
          <option value="bearer">Bearer Token</option>
        </select>
      </Field>
      {data.authType === 'basic' && (
        <>
          <Field label="Username"><input style={inputStyle} value={data.username || ''} onChange={e => update(id, { username: e.target.value })} /></Field>
          <Field label="Password"><input style={inputStyle} type="password" value={data.password || ''} onChange={e => update(id, { password: e.target.value })} /></Field>
        </>
      )}
      {data.authType === 'bearer' && (
        <Field label="Token"><input style={inputStyle} value={data.token || ''} onChange={e => update(id, { token: e.target.value })} placeholder="Bearer token" /></Field>
      )}
    </>
  );
}

function SubmodelPanel({ id, data }: { id: string; data: SubmodelData }) {
  const update = useFlowStore(s => s.updateNodeData);
  return (
    <>
      <Field label="Label"><input style={inputStyle} value={data.label} onChange={e => update(id, { label: e.target.value })} /></Field>
      <Field label="Schema Type">
        <select style={selectStyle} value={data.schemaType} onChange={e => update(id, { schemaType: e.target.value })}>
          <option value="DPP">Digital Product Passport</option>
          <option value="TechnicalData">Technical Data</option>
          <option value="ContactInformation">Contact Information</option>
          <option value="Custom">Custom</option>
        </select>
      </Field>
      <Field label="Submodel ID Short"><input style={inputStyle} value={data.submodelIdShort} onChange={e => update(id, { submodelIdShort: e.target.value })} /></Field>
      <Field label="Semantic ID">
        <input style={{ ...inputStyle, fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }} value={data.semanticId} onChange={e => update(id, { semanticId: e.target.value })} placeholder="0173-1#01-AHF578#001" />
      </Field>
    </>
  );
}

function ConverterPanel({ id, data }: { id: string; data: ConverterData }) {
  const update = useFlowStore(s => s.updateNodeData);
  return (
    <>
      <Field label="Label"><input style={inputStyle} value={data.label} onChange={e => update(id, { label: e.target.value })} /></Field>
      <Field label="Input Format"><input style={inputStyle} value={data.inputFormat} onChange={e => update(id, { inputFormat: e.target.value })} /></Field>
      <Field label="Output Format"><input style={inputStyle} value={data.outputFormat} onChange={e => update(id, { outputFormat: e.target.value })} /></Field>
      <Field label="Mapping Rules (JSON)">
        <textarea
          style={{ ...inputStyle, minHeight: 100, resize: 'vertical', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, lineHeight: 1.5 }}
          value={data.mapping}
          onChange={e => update(id, { mapping: e.target.value })}
          placeholder='{"sourceField": "targetField"}'
        />
      </Field>
    </>
  );
}

function ActionPanel({ id, data }: { id: string; data: ActionData }) {
  const update = useFlowStore(s => s.updateNodeData);
  return (
    <>
      <Field label="Label"><input style={inputStyle} value={data.label} onChange={e => update(id, { label: e.target.value })} /></Field>
      <Field label="Action Type">
        <select style={selectStyle} value={data.actionType} onChange={e => update(id, { actionType: e.target.value })}>
          <option value="read">Read</option>
          <option value="write">Write</option>
          <option value="validate">Validate</option>
          <option value="transform">Transform</option>
        </select>
      </Field>
      <Field label="Target Path / ID"><input style={inputStyle} value={data.target} onChange={e => update(id, { target: e.target.value })} placeholder="e.g. submodels/DPP/value" /></Field>
      <Field label="Parameters (JSON)">
        <textarea
          style={{ ...inputStyle, minHeight: 80, resize: 'vertical', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, lineHeight: 1.5 }}
          value={data.parameters}
          onChange={e => update(id, { parameters: e.target.value })}
          placeholder="{}"
        />
      </Field>
    </>
  );
}

export default function ConfigPanel() {
  const nodes = useFlowStore(s => s.nodes);
  const selectedNodeId = useFlowStore(s => s.selectedNodeId);
  const selectNode = useFlowStore(s => s.selectNode);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  if (!selectedNodeId || !selectedNode) {
    return (
      <aside style={{
        width: 260,
        background: 'var(--bg-panel)',
        borderLeft: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 12,
        flexShrink: 0,
      }}>
        <Settings size={32} color="var(--text-muted)" />
        <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '0 24px', lineHeight: 1.6 }}>
          Select a node to configure its properties
        </div>
      </aside>
    );
  }

  const typeLabel: Record<string, string> = {
    aasServer: 'AAS Server',
    submodel: 'Submodel',
    converter: 'Converter',
    action: 'Action',
  };
  const typeColor: Record<string, string> = {
    aasServer: '#3b82f6',
    submodel: '#10b981',
    converter: '#f59e0b',
    action: '#8b5cf6',
  };

  const nodeType = selectedNode.type || 'aasServer';
  const data = selectedNode.data as Record<string, unknown>;

  return (
    <aside style={{
      width: 260,
      background: 'var(--bg-panel)',
      borderLeft: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Node Config
          </div>
          <div style={{ fontWeight: 700, fontSize: 14, color: typeColor[nodeType] || 'var(--text-primary)', marginTop: 1 }}>
            {typeLabel[nodeType] || nodeType}
          </div>
        </div>
        <button
          onClick={() => selectNode(null)}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, borderRadius: 4 }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Form */}
      <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
        {nodeType === 'aasServer' && <AASServerPanel id={selectedNode.id} data={data as unknown as AASServerData} />}
        {nodeType === 'submodel' && <SubmodelPanel id={selectedNode.id} data={data as unknown as SubmodelData} />}
        {nodeType === 'converter' && <ConverterPanel id={selectedNode.id} data={data as unknown as ConverterData} />}
        {nodeType === 'action' && <ActionPanel id={selectedNode.id} data={data as unknown as ActionData} />}
      </div>
      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--text-muted)' }}>
        Node ID: <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{selectedNode.id}</span>
      </div>
    </aside>
  );
}
