const fs = require("fs");
const path = require("path");

const TSP_DATA_FILE = path.join(__dirname, "tsp-data.json");

function loadTSPData() {
  try {
    const data = fs.readFileSync(TSP_DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { roads: [], n: 0 };
  }
}

function saveTSPData(data) {
  fs.writeFileSync(TSP_DATA_FILE, JSON.stringify(data, null, 2));
}

/**
 * Solve TSP using Floyd–Warshall + DP + Bitmask, full path reconstruction
 */
function tsp(roads, n) {
  const INF = 1e9;

  // Validate input
  if (n < 2) {
    return {
      cost: "Need at least 2 nodes",
      path: []
    };
  }

  // Validate that all nodes in roads are within range [0, n-1]
  for (const [u, v, w] of roads) {
    if (u < 0 || u >= n || v < 0 || v >= n) {
      return {
        cost: `Invalid node: nodes must be between 0 and ${n-1}`,
        path: []
      };
    }
  }

  // Initialize distance and predecessor matrices
  const dist = Array.from({ length: n }, () => Array(n).fill(INF));
  const pred = Array.from({ length: n }, () => Array(n).fill(-1));

  for (let i = 0; i < n; i++) {
    dist[i][i] = 0;
    for (let j = 0; j < n; j++) pred[i][j] = j;
  }

  for (const [u, v, w] of roads) {
    dist[u][v] = Math.min(dist[u][v], w);
    dist[v][u] = Math.min(dist[v][u], w);
    pred[u][v] = v;
    pred[v][u] = u;
  }

  // Floyd–Warshall
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][j] > dist[i][k] + dist[k][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          pred[i][j] = pred[i][k]; // update path
        }
      }
    }
  }

  // DP + Bitmask
  const FULL_MASK = (1 << n) - 1;
  const dp = Array.from({ length: n }, () => Array(1 << n).fill(-1));
  const nextNode = Array.from({ length: n }, () => Array(1 << n).fill(-1));

  function dfs(node, mask) {
    if (mask === FULL_MASK) return dist[node][0]; // return to start
    if (dp[node][mask] !== -1) return dp[node][mask];

    let ans = INF, bestNext = -1;
    for (let nxt = 0; nxt < n; nxt++) {
      if (!(mask & (1 << nxt))) {
        const newCost = dist[node][nxt] + dfs(nxt, mask | (1 << nxt));
        if (newCost < ans) {
          ans = newCost;
          bestNext = nxt;
        }
      }
    }
    dp[node][mask] = ans;
    nextNode[node][mask] = bestNext;
    return ans;
  }

  const minCost = dfs(0, 1);

  // Helper: expand shortest path using pred
  function getFullPath(u, v) {
    const path = [u];
    while (u !== v) {
      u = pred[u][v];
      path.push(u);
    }
    return path;
  }

  // Reconstruct full path
  let path = [0];
  let curr = 0, mask = 1;
  while (true) {
    const nxt = nextNode[curr][mask];
    if (nxt === -1) break;
    const segment = getFullPath(curr, nxt);
    segment.shift(); // avoid repeating current node
    path.push(...segment);
    mask |= 1 << nxt;
    curr = nxt;
  }
  path.push(0); // return to start

  return {
    cost: minCost >= INF ? "No Hamiltonian cycle exists" : minCost,
    path,
  };
}

module.exports = { tsp, loadTSPData, saveTSPData };
