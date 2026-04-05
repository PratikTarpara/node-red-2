import { useCallback } from 'react';
import axios from 'axios';
import { Play, Save, FolderOpen, Trash2, Terminal } from 'lucide-react';
import { useFlowStore } from '../store/flowStore';

let flowIdCounter = Date.now();

export default function Toolbar() {
  const nodes = useFlowStore(s => s.nodes);
  const edges = useFlowStore(s => s.edges);
  const isRunning = useFlowStore(s => s.isRunning);
  const setIsRunning = useFlowStore(s => s.setIsRunning);
  const setNodes = useFlowStore(s => s.setNodes);
  const setEdges = useFlowStore(s => s.setEdges);
  const clearLogs = useFlowStore(s => s.clearLogs);
  const addLog = useFlowStore(s => s.addLog);
  const clearFlow = useFlowStore(s => s.clearFlow);
  const toggleConsole = useFlowStore(s => s.toggleConsole);
  const updateNodeStatus = useFlowStore(s => s.updateNodeStatus);

  const handleRun = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    clearLogs();

    nodes.forEach(n => updateNodeStatus(n.id, 'idle'));

    addLog({
      id: `${Date.now()}`,
      nodeId: '__system__',
      nodeLabel: 'System',
      level: 'info',
      message: `Starting flow execution with ${nodes.length} nodes and ${edges.length} edges...`,
      timestamp: new Date().toISOString(),
    });

    try {
      const response = await axios.post('/api/flow/run', {
        nodes: nodes.map(n => ({ id: n.id, type: n.type, data: n.data })),
        edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target })),
      });

      const { results, logs } = response.data;
      results?.forEach((r: { nodeId: string; status: string }) => {
        updateNodeStatus(r.nodeId, r.status);
      });
      logs?.forEach((log: { id: string; nodeId: string; nodeLabel: string; level: string; message: string; timestamp: string }) => {
        addLog({ ...log, level: log.level as 'info' | 'warn' | 'error' | 'success' });
      });
      addLog({
        id: `${Date.now()}-done`,
        nodeId: '__system__',
        nodeLabel: 'System',
        level: 'success',
        message: '✅ Flow execution completed successfully.',
        timestamp: new Date().toISOString(),
      });
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error || (err as { message?: string })?.message || 'Unknown error';
      addLog({
        id: `${Date.now()}-err`,
        nodeId: '__system__',
        nodeLabel: 'System',
        level: 'error',
        message: `❌ Flow execution failed: ${message}`,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsRunning(false);
    }
  }, [nodes, edges, isRunning, setIsRunning, clearLogs, addLog, updateNodeStatus]);

  const handleSave = useCallback(async () => {
    const id = `flow-${flowIdCounter++}`;
    try {
      await axios.post('/api/flow/save', {
        id,
        nodes: nodes.map(n => ({ id: n.id, type: n.type, data: n.data, position: n.position })),
        edges,
      });
      addLog({
        id: `${Date.now()}`,
        nodeId: '__system__',
        nodeLabel: 'System',
        level: 'success',
        message: `💾 Flow saved as "${id}"`,
        timestamp: new Date().toISOString(),
      });
    } catch {
      const blob = new Blob([JSON.stringify({ id, nodes, edges }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [nodes, edges, addLog]);

  const handleLoad = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement)?.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const flow = JSON.parse(ev.target?.result as string);
          if (flow.nodes) setNodes(flow.nodes);
          if (flow.edges) setEdges(flow.edges);
          addLog({
            id: `${Date.now()}`,
            nodeId: '__system__',
            nodeLabel: 'System',
            level: 'info',
            message: `📂 Flow loaded: ${file.name}`,
            timestamp: new Date().toISOString(),
          });
        } catch {
          alert('Invalid flow JSON file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [setNodes, setEdges, addLog]);

  const btnBase: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '7px 14px',
    borderRadius: 8,
    border: '1px solid var(--border)',
    background: 'var(--bg-card)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 500,
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  };

  return (
    <header style={{
      height: 54,
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 8,
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 16 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #1e3a6e, #3b0764)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 12px rgba(59,130,246,0.3)',
        }}>
          <span style={{ fontSize: 16 }}>⬡</span>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>AAS FlowBuilder</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>INDUSTRY 4.0 PLATFORM</div>
        </div>
      </div>

      <div style={{ width: 1, height: 30, background: 'var(--border)', margin: '0 8px' }} />

      <button id="run-flow-btn" onClick={handleRun} disabled={isRunning || nodes.length === 0}
        style={{ ...btnBase, background: isRunning ? '#164e2e' : 'linear-gradient(135deg, #065f46, #047857)', border: '1px solid #10b981', color: '#6ee7b7', opacity: (isRunning || nodes.length === 0) ? 0.5 : 1, cursor: (isRunning || nodes.length === 0) ? 'not-allowed' : 'pointer' }}>
        <Play size={14} fill={isRunning ? 'currentColor' : 'none'} />
        {isRunning ? 'Running...' : 'Run Flow'}
      </button>

      <button id="save-flow-btn" onClick={handleSave} style={btnBase}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#3b82f6'; (e.currentTarget as HTMLElement).style.color = '#93c5fd'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}>
        <Save size={14} /> Save
      </button>

      <button id="load-flow-btn" onClick={handleLoad} style={btnBase}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#3b82f6'; (e.currentTarget as HTMLElement).style.color = '#93c5fd'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}>
        <FolderOpen size={14} /> Load
      </button>

      <button id="clear-flow-btn" onClick={clearFlow} style={btnBase}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#ef4444'; (e.currentTarget as HTMLElement).style.color = '#fca5a5'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}>
        <Trash2 size={14} /> Clear
      </button>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'var(--text-muted)' }}>
        <span><strong style={{ color: 'var(--text-secondary)' }}>{nodes.length}</strong> nodes</span>
        <span><strong style={{ color: 'var(--text-secondary)' }}>{edges.length}</strong> edges</span>
      </div>

      <div style={{ width: 1, height: 30, background: 'var(--border)', margin: '0 8px' }} />

      <button id="toggle-console-btn" onClick={toggleConsole} style={btnBase} title="Toggle Debug Console">
        <Terminal size={14} /> Console
      </button>
    </header>
  );
}
