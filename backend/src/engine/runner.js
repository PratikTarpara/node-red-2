const { parseFlow } = require('./parser');
const { topoSort } = require('./topoSort');
const aasServerHandler = require('../handlers/aasServer');
const submodelHandler = require('../handlers/submodel');
const converterHandler = require('../handlers/converter');
const actionHandler = require('../handlers/action');
const { v4: uuidv4 } = require('uuid');

const handlers = {
  aasServer: aasServerHandler,
  submodel: submodelHandler,
  converter: converterHandler,
  action: actionHandler,
};

async function runFlow(nodes, edges) {
  const logs = [];
  const results = [];
  const outputMap = {}; // nodeId -> output data

  const log = (nodeId, nodeLabel, level, message, data) => {
    const entry = { id: uuidv4(), nodeId, nodeLabel, level, message, timestamp: new Date().toISOString(), data };
    logs.push(entry);
    return entry;
  };

  if (!nodes || nodes.length === 0) {
    throw new Error('No nodes in flow');
  }

  const { nodeMap, adjacency, inDegree } = parseFlow(nodes, edges || []);
  log('__system__', 'System', 'info', `Parsed flow: ${nodes.length} nodes, ${(edges||[]).length} edges`);

  let order;
  try {
    order = topoSort(nodeMap, adjacency, inDegree);
  } catch (err) {
    throw new Error(err.message);
  }

  log('__system__', 'System', 'info', `Execution order: ${order.join(' → ')}`);

  for (const nodeId of order) {
    const node = nodeMap[nodeId];
    const nodeLabel = node.data?.label || node.type || nodeId;
    const handler = handlers[node.type];

    log(nodeId, nodeLabel, 'info', `Starting node [${node.type}]...`);

    // Collect inputs from upstream nodes
    const inputs = [];
    Object.entries(adjacency).forEach(([srcId, targets]) => {
      if (targets.includes(nodeId) && outputMap[srcId] !== undefined) {
        inputs.push(outputMap[srcId]);
      }
    });

    let status = 'success';
    let output = null;

    try {
      if (!handler) {
        throw new Error(`No handler registered for node type: ${node.type}`);
      }
      output = await handler.execute(node.data, inputs, (level, message, data) => log(nodeId, nodeLabel, level, message, data));
      outputMap[nodeId] = output;
      log(nodeId, nodeLabel, 'success', `Node completed successfully.`);
    } catch (err) {
      status = 'error';
      log(nodeId, nodeLabel, 'error', `Node failed: ${err.message}`);
    }

    results.push({ nodeId, nodeLabel, status, output });
  }

  log('__system__', 'System', 'info', `Flow execution finished. ${results.filter(r => r.status === 'success').length}/${results.length} nodes succeeded.`);

  return { results, logs };
}

module.exports = { runFlow };
