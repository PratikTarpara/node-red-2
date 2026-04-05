import { useFlowStore } from '../store/flowStore';
import { Trash2, ChevronDown } from 'lucide-react';
import type { LogEntry } from '../types/NodeTypes';

const levelColor: Record<string, string> = {
  info: '#60a5fa',
  warn: '#fbbf24',
  error: '#ef4444',
  success: '#34d399',
};
const levelBg: Record<string, string> = {
  info: 'rgba(59,130,246,0.08)',
  warn: 'rgba(251,191,36,0.08)',
  error: 'rgba(239,68,68,0.08)',
  success: 'rgba(52,211,153,0.08)',
};

function LogLine({ log }: { log: LogEntry }) {
  const ts = new Date(log.timestamp).toLocaleTimeString();
  return (
    <div style={{
      display: 'flex',
      gap: 8,
      padding: '5px 12px',
      borderBottom: '1px solid var(--border-subtle)',
      background: levelBg[log.level] || 'transparent',
      alignItems: 'flex-start',
    }}>
      <span style={{ color: 'var(--text-muted)', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', flexShrink: 0, paddingTop: 1 }}>{ts}</span>
      <span style={{
        fontSize: 10,
        fontWeight: 700,
        color: levelColor[log.level] || '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        flexShrink: 0,
        paddingTop: 1,
        minWidth: 52,
      }}>
        [{log.level}]
      </span>
      <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 600, flexShrink: 0, paddingTop: 1, minWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {log.nodeLabel}
      </span>
      <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', wordBreak: 'break-all' }}>
        {log.message}
      </span>
    </div>
  );
}

export default function Console() {
  const logs = useFlowStore(s => s.logs);
  const clearLogs = useFlowStore(s => s.clearLogs);
  const consoleOpen = useFlowStore(s => s.consoleOpen);
  const toggleConsole = useFlowStore(s => s.toggleConsole);

  return (
    <div style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-secondary)',
      display: 'flex',
      flexDirection: 'column',
      height: consoleOpen ? 200 : 34,
      flexShrink: 0,
      transition: 'height 0.25s ease',
      overflow: 'hidden',
    }}>
      {/* Console header */}
      <div
        onClick={toggleConsole}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '7px 14px',
          cursor: 'pointer',
          userSelect: 'none',
          flexShrink: 0,
          borderBottom: consoleOpen ? '1px solid var(--border)' : 'none',
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: logs.some(l => l.level === 'error') ? '#ef4444' : logs.some(l => l.level === 'success') ? '#10b981' : '#475569' }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Debug Console
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-card)', padding: '1px 7px', borderRadius: 10, border: '1px solid var(--border)' }}>
          {logs.length}
        </span>
        <div style={{ flex: 1 }} />
        <button
          onClick={e => { e.stopPropagation(); clearLogs(); }}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 2 }}
          title="Clear logs"
        >
          <Trash2 size={13} />
        </button>
        <ChevronDown
          size={14}
          color="var(--text-muted)"
          style={{ transition: 'transform 0.25s', transform: consoleOpen ? 'rotate(0)' : 'rotate(-90deg)' }}
        />
      </div>

      {/* Log entries */}
      {consoleOpen && (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {logs.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
              No logs yet. Run a flow to see execution output.
            </div>
          ) : (
            [...logs].reverse().map(log => <LogLine key={log.id} log={log} />)
          )}
        </div>
      )}
    </div>
  );
}
