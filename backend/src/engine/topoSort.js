/**
 * Topological sort using Kahn's algorithm.
 * Returns sorted list of node IDs or throws on cycle.
 */
function topoSort(nodeMap, adjacency, inDegree) {
  const queue = [];
  const deg = { ...inDegree };

  Object.keys(deg).forEach(id => {
    if (deg[id] === 0) queue.push(id);
  });

  const order = [];
  while (queue.length > 0) {
    const id = queue.shift();
    order.push(id);
    (adjacency[id] || []).forEach(child => {
      deg[child]--;
      if (deg[child] === 0) queue.push(child);
    });
  }

  if (order.length !== Object.keys(nodeMap).length) {
    throw new Error('Flow contains a cycle — cannot execute.');
  }

  return order;
}

module.exports = { topoSort };
