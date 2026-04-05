import './index.css';
import { ReactFlowProvider } from '@xyflow/react';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import ConfigPanel from './components/ConfigPanel';
import FlowCanvas from './components/FlowCanvas';
import Console from './components/Console';

export default function App() {
  return (
    <ReactFlowProvider>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <Toolbar />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Sidebar />
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <FlowCanvas />
            <Console />
          </div>
          <ConfigPanel />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
