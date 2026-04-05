const express = require('express');
const cors = require('cors');
const http = require('http');
const { WebSocketServer } = require('ws');
const flowRouter = require('./routes/flow');
const nodesRouter = require('./routes/nodes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Routes
app.use('/api/flow', flowRouter);
app.use('/api/nodes', nodesRouter);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Create HTTP + WebSocket server
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('[WS] Client connected');
  ws.send(JSON.stringify({ type: 'connected', message: 'AAS FlowBuilder WebSocket ready' }));
  ws.on('close', () => console.log('[WS] Client disconnected'));
});

// Expose broadcast for future use
app.locals.broadcast = (data) => {
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(JSON.stringify(data));
  });
};

server.listen(PORT, () => {
  console.log(`\n🚀 AAS FlowBuilder Backend running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket ready at ws://localhost:${PORT}/ws`);
  console.log(`📋 Available routes:`);
  console.log(`   POST /api/flow/run`);
  console.log(`   POST /api/flow/save`);
  console.log(`   GET  /api/flow/load/:id`);
  console.log(`   GET  /api/flow/list`);
  console.log(`   GET  /api/nodes/types`);
  console.log(`   GET  /api/health\n`);
});
