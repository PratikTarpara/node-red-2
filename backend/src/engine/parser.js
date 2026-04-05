/**
 * Parse flow JSON into an adjacency graph.
 * Returns: { nodeMap, adjacency (id -> [children ids]), inDegree }
 */
function parseFlow(nodes, edges) {
  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  const adjacency = {}; // source -> [targets]
  const inDegree = {};

  nodes.forEach(n => {
    adjacency[n.id] = [];
    inDegree[n.id] = 0;
  });

  edges.forEach(e => {
    if (adjacency[e.source] && inDegree[e.target] !== undefined) {
      adjacency[e.source].push(e.target);
      inDegree[e.target]++;
    }
  });

  return { nodeMap, adjacency, inDegree };
}

module.exports = { parseFlow };
