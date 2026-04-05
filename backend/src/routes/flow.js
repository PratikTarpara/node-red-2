const express = require('express');
const router = express.Router();
const { runFlow } = require('../engine/runner');
const fs = require('fs');
const path = require('path');

const FLOWS_DIR = path.join(__dirname, '../../flows');
if (!fs.existsSync(FLOWS_DIR)) fs.mkdirSync(FLOWS_DIR, { recursive: true });

// POST /api/flow/run
router.post('/run', async (req, res) => {
  const { nodes, edges } = req.body;
  if (!nodes || !Array.isArray(nodes)) {
    return res.status(400).json({ error: 'Invalid flow: nodes array required' });
  }
  try {
    const result = await runFlow(nodes, edges || []);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/flow/save
router.post('/save', async (req, res) => {
  const { id, nodes, edges } = req.body;
  if (!id) return res.status(400).json({ error: 'Flow id required' });
  const filePath = path.join(FLOWS_DIR, `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify({ id, nodes, edges, savedAt: new Date().toISOString() }, null, 2));
  res.json({ success: true, id, path: filePath });
});

// GET /api/flow/load/:id
router.get('/load/:id', (req, res) => {
  const filePath = path.join(FLOWS_DIR, `${req.params.id}.json`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Flow not found' });
  const flow = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  res.json(flow);
});

// GET /api/flow/list
router.get('/list', (req, res) => {
  const files = fs.readdirSync(FLOWS_DIR).filter(f => f.endsWith('.json'));
  const flows = files.map(f => {
    try {
      const d = JSON.parse(fs.readFileSync(path.join(FLOWS_DIR, f), 'utf-8'));
      return { id: d.id, savedAt: d.savedAt, nodeCount: d.nodes?.length || 0 };
    } catch { return { id: f.replace('.json', '') }; }
  });
  res.json(flows);
});

module.exports = router;
