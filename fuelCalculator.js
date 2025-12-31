const fs = require("fs");
const path = require("path");

const FUEL_DATA_FILE = path.join(__dirname, "fuel-data.json");
let edges = []; // [from, to, weight]

function addEdge(from, to, weight = 1) {
  edges.push([from, to, weight]);
}

function loadFuelData() {
  try {
    if (!fs.existsSync(FUEL_DATA_FILE)) {
      fs.writeFileSync(FUEL_DATA_FILE, JSON.stringify([]));
    }
    const raw = fs.readFileSync(FUEL_DATA_FILE, "utf-8");
    edges = raw.trim() ? JSON.parse(raw) : [];
    return edges;
  } catch (err) {
    console.error("Error loading fuel data:", err);
    edges = [];
    return [];
  }
}

function saveFuelData() {
  try {
    fs.writeFileSync(FUEL_DATA_FILE, JSON.stringify(edges, null, 2));
    console.log("✅ Fuel edges saved successfully!");
  } catch (err) {
    console.error("Error saving fuel edges:", err);
  }
}

function calculateFuel(seats) {
  if (edges.length === 0) return { minFuel: 0, paths: [] };

  const maxNode = Math.max(...edges.flat()) + 1;
  const graph = Array.from({ length: maxNode }, () => []);

  for (const [a, b, w] of edges) {
    graph[a].push([b, w]);
    graph[b].push([a, w]);
  }

  let fuel = 0;
  const visited = new Set();
  const paths = [];

  function dfs(node, parent = -1) {
    visited.add(node);
    let representatives = 1;

    for (const [neighbor, w] of graph[node]) {
      if (neighbor !== parent && !visited.has(neighbor)) {
        const people = dfs(neighbor, node);
        const cars = Math.ceil(people / seats);
        fuel += cars * w;
        paths.push([neighbor, node, cars, w]);
        representatives += people;
      }
    }
    return representatives;
  }

  dfs(0);
  return { minFuel: fuel, paths };
}

module.exports = { calculateFuel, addEdge, loadFuelData, saveFuelData };
