// ============== TAB SWITCHING ==============
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const targetTab = button.getAttribute('data-tab');
    
    // Remove active class from all buttons and contents
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to clicked button and corresponding content
    button.classList.add('active');
    document.getElementById(`${targetTab}-section`).classList.add('active');
  });
});

// ============== TSP SECTION ==============
let tspEdges = [];
let tspN = 0;
let tspNodePositions = [];

const tspCanvas = document.getElementById("tsp-canvas");
const tspCtx = tspCanvas.getContext("2d");
const tspRadius = 20;

// Randomly place nodes on canvas
function generateTSPNodePositions() {
  tspNodePositions = [];
  for (let i = 0; i < tspN; i++) {
    const x = 50 + Math.random() * (tspCanvas.width - 100);
    const y = 50 + Math.random() * (tspCanvas.height - 100);
    tspNodePositions.push({ x, y });
  }
}

// Draw TSP graph
function drawTSPGraph(highlightPath = []) {
  tspCtx.clearRect(0, 0, tspCanvas.width, tspCanvas.height);

  if (tspNodePositions.length === 0) return;

  // Draw edges
  for (const [u, v, w] of tspEdges) {
    // Check if nodes exist
    if (!tspNodePositions[u] || !tspNodePositions[v]) continue;
    
    tspCtx.beginPath();
    tspCtx.moveTo(tspNodePositions[u].x, tspNodePositions[u].y);
    tspCtx.lineTo(tspNodePositions[v].x, tspNodePositions[v].y);
    tspCtx.strokeStyle = "#475569";
    tspCtx.lineWidth = 2;
    tspCtx.stroke();

    // Draw weight in middle with background
    const midX = (tspNodePositions[u].x + tspNodePositions[v].x) / 2;
    const midY = (tspNodePositions[u].y + tspNodePositions[v].y) / 2;
    
    tspCtx.fillStyle = "#1e293b";
    tspCtx.fillRect(midX - 15, midY - 10, 30, 20);
    
    tspCtx.fillStyle = "#94a3b8";
    tspCtx.font = "bold 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    tspCtx.textAlign = "center";
    tspCtx.textBaseline = "middle";
    tspCtx.fillText(w, midX, midY);
  }

  // Highlight path if provided
  if (highlightPath.length > 1) {
    for (let i = 0; i < highlightPath.length - 1; i++) {
      const u = highlightPath[i];
      const v = highlightPath[i + 1];
      // Check if nodes exist
      if (!tspNodePositions[u] || !tspNodePositions[v]) continue;
      
      tspCtx.beginPath();
      tspCtx.moveTo(tspNodePositions[u].x, tspNodePositions[u].y);
      tspCtx.lineTo(tspNodePositions[v].x, tspNodePositions[v].y);
      tspCtx.strokeStyle = "#f59e0b";
      tspCtx.lineWidth = 4;
      tspCtx.stroke();
      
      // Add glow effect
      tspCtx.shadowBlur = 10;
      tspCtx.shadowColor = "#f59e0b";
      tspCtx.stroke();
      tspCtx.shadowBlur = 0;
    }
  }

  // Draw nodes
  for (let i = 0; i < tspN; i++) {
    // Outer glow
    tspCtx.beginPath();
    tspCtx.arc(tspNodePositions[i].x, tspNodePositions[i].y, tspRadius + 2, 0, 2 * Math.PI);
    tspCtx.fillStyle = "rgba(59, 130, 246, 0.2)";
    tspCtx.fill();
    
    // Main node
    tspCtx.beginPath();
    tspCtx.arc(tspNodePositions[i].x, tspNodePositions[i].y, tspRadius, 0, 2 * Math.PI);
    tspCtx.fillStyle = "#1e293b";
    tspCtx.fill();
    tspCtx.strokeStyle = "#3b82f6";
    tspCtx.lineWidth = 3;
    tspCtx.stroke();

    // Node label
    tspCtx.fillStyle = "#e2e8f0";
    tspCtx.font = "bold 15px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    tspCtx.textAlign = "center";
    tspCtx.textBaseline = "middle";
    tspCtx.fillText(i, tspNodePositions[i].x, tspNodePositions[i].y);
  }
}

// Animate TSP path step by step
async function animateTSPPath(path) {
  for (let i = 1; i < path.length; i++) {
    drawTSPGraph(path.slice(0, i + 1));
    await new Promise(resolve => setTimeout(resolve, 800));
  }
}

// Load TSP data on page load
window.addEventListener('load', async function () {
  try {
    const res = await fetch("/tsp/data");
    const data = await res.json();
    tspEdges = data.roads || [];
    tspN = data.n || 0;
    document.getElementById("tsp-nodesCount").value = tspN;
    if (tspN > 0) {
      generateTSPNodePositions();
      drawTSPGraph();
    }
    renderTSPEdges();
  } catch (err) {
    console.error("Error loading TSP data:", err);
  }

  // Load fuel calculator edges
  loadFuelEdges();
});

// Add TSP edge
document.getElementById("tsp-addEdgeBtn").addEventListener("click", () => {
  const u = parseInt(document.getElementById("tsp-nodeU").value);
  const v = parseInt(document.getElementById("tsp-nodeV").value);
  const w = parseInt(document.getElementById("tsp-weight").value);
  if (isNaN(u) || isNaN(v) || isNaN(w)) {
    alert("Enter valid numbers for all fields.");
    return;
  }
  if (w <= 0) {
    alert("Weight must be positive.");
    return;
  }
  // Validate nodes are within range if n is set
  if (tspN > 0 && (u >= tspN || v >= tspN || u < 0 || v < 0)) {
    alert(`Nodes must be between 0 and ${tspN - 1}. Please set the correct number of nodes first.`);
    return;
  }
  if (u === v) {
    alert("Cannot add self-loop (u and v must be different).");
    return;
  }
  tspEdges.push([u, v, w]);
  renderTSPEdges();
  if (tspN > 0) {
    drawTSPGraph();
  }
  document.getElementById("tsp-nodeU").value = "";
  document.getElementById("tsp-nodeV").value = "";
  document.getElementById("tsp-weight").value = "";
});

// Save TSP data
document.getElementById("tsp-saveBtn").addEventListener("click", async () => {
  const nVal = parseInt(document.getElementById("tsp-nodesCount").value) || 0;
  tspN = nVal;
  try {
    const res = await fetch("/tsp/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roads: tspEdges, n: nVal }),
    });
    const msg = await res.json();
    alert(msg.message || "Saved!");
    generateTSPNodePositions();
    drawTSPGraph();
  } catch (err) {
    console.error("Error saving TSP data:", err);
  }
});

// Simulate TSP
document.getElementById("tsp-simulateBtn").addEventListener("click", async () => {
  const nVal = parseInt(document.getElementById("tsp-nodesCount").value) || 0;
  if (nVal === 0) {
    alert("Please set the number of nodes first!");
    return;
  }
  if (nVal < 2) {
    alert("Need at least 2 nodes for TSP!");
    return;
  }
  if (tspEdges.length === 0) {
    alert("Please add at least one edge!");
    return;
  }
  try {
    const res = await fetch("/tsp/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roads: tspEdges, n: nVal }),
    });
    const data = await res.json();
    
    if (typeof data.cost === 'string' && data.path.length === 0) {
      // Error case
      document.getElementById("tsp-resultDisplay").innerHTML = `
        <p style="color: red;">❌ Error: <b>${data.cost}</b></p>
      `;
      return;
    }
    
    document.getElementById("tsp-resultDisplay").innerHTML = `
      <p>🧮 Minimum Cost Cycle: <b>${data.cost}</b></p>
      <p>🔁 Path: ${data.path.join(" → ")}</p>
    `;
    generateTSPNodePositions();
    await animateTSPPath(data.path);
  } catch (err) {
    console.error("Error running TSP simulation:", err);
    alert("Error running simulation. Check console for details.");
  }
});

// Render TSP edge table
function renderTSPEdges() {
  const tbody = document.getElementById("tsp-edgesBody");
  tbody.innerHTML = "";
  tspEdges.forEach(([u, v, w]) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${u}</td><td>${v}</td><td>${w}</td>`;
    tbody.appendChild(row);
  });
}

// ============== FUEL CALCULATOR SECTION ==============
let fuelEdges = [];
const fuelCanvas = document.getElementById("fuel-canvas");
const fuelCtx = fuelCanvas.getContext("2d");

let fuelNodesPos = {};
let fuelEdgesData = [];
let fuelNodeLabels = {};
let fuelSteps = [];
let fuelCurrentStep = 0;

// Load fuel edges
async function loadFuelEdges() {
  try {
    const res = await fetch("/fuel/edges");
    fuelEdges = await res.json();
    renderFuelEdges();
  } catch (err) {
    console.error("Error loading fuel edges:", err);
  }
}

// Add fuel edge
document.getElementById("fuel-addEdgeBtn").addEventListener("click", async () => {
  const from = parseInt(document.getElementById("fuel-from").value);
  const to = parseInt(document.getElementById("fuel-to").value);
  const weight = parseInt(document.getElementById("fuel-weight").value);
  
  if (isNaN(from) || isNaN(to) || isNaN(weight)) {
    alert("Enter valid numbers for all fields.");
    return;
  }
  
  if (weight <= 0) {
    alert("Weight must be positive.");
    return;
  }
  
  if (from < 0 || to < 0) {
    alert("Node numbers must be non-negative.");
    return;
  }
  
  if (from === to) {
    alert("Cannot add self-loop (from and to must be different).");
    return;
  }

  try {
    await fetch("/fuel/addEdge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, weight }),
    });
    fuelEdges.push([from, to, weight]);
    renderFuelEdges();
    document.getElementById("fuel-from").value = "";
    document.getElementById("fuel-to").value = "";
    document.getElementById("fuel-weight").value = "";
  } catch (err) {
    console.error("Error adding fuel edge:", err);
    alert("Error adding edge. Check console for details.");
  }
});

// Save fuel edges
document.getElementById("fuel-saveBtn").addEventListener("click", async () => {
  try {
    await fetch("/fuel/saveEdges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    alert("Fuel edges saved successfully!");
  } catch (err) {
    console.error("Error saving fuel edges:", err);
  }
});

// Calculate fuel
document.getElementById("fuel-calculateBtn").addEventListener("click", async () => {
  const seats = parseInt(document.getElementById("fuel-seats").value);
  if (isNaN(seats) || seats < 1) {
    alert("Seats must be >= 1");
    return;
  }
  
  if (fuelEdges.length === 0) {
    alert("Please add at least one edge!");
    return;
  }

  try {
    const res = await fetch("/fuel/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seats }),
    });
    const data = await res.json();
    
    if (data.error) {
      alert("Error: " + data.error);
      return;
    }

    fuelEdgesData = data.paths;
    document.getElementById("fuel-result").textContent = `Minimum Fuel: ${data.minFuel}`;

    const pathsList = document.getElementById("fuel-pathsList");
    pathsList.innerHTML = "";
    if (fuelEdgesData.length === 0) {
      pathsList.innerHTML = "<li>No paths calculated (empty graph or single node)</li>";
    } else {
      fuelEdgesData.forEach(p => {
        const li = document.createElement("li");
        li.textContent = `${p[0]} → ${p[1]} (Cars: ${p[2]}, Weight: ${p[3]})`;
        pathsList.appendChild(li);
      });
    }

    if (fuelEdgesData.length > 0) {
      initializeFuelSimulation();
    }
  } catch (err) {
    console.error("Error calculating fuel:", err);
    alert("Error calculating fuel. Check console for details.");
  }
});

// Render fuel edge table
function renderFuelEdges() {
  const tbody = document.getElementById("fuel-edgesBody");
  tbody.innerHTML = "";
  fuelEdges.forEach(([from, to, weight]) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${from}</td><td>${to}</td><td>${weight}</td>`;
    tbody.appendChild(row);
  });
}

// Initialize fuel simulation
function initializeFuelSimulation() {
  if (fuelEdgesData.length === 0) return;
  
  generateFuelNodePositions();

  // Initialize node labels
  fuelNodeLabels = {};
  const allNodes = [...new Set(fuelEdgesData.flatMap(e => [e[0], e[1]]))];
  allNodes.forEach(n => fuelNodeLabels[n] = n.toString());

  // Precompute steps
  fuelSteps = [];
  let currentLabels = { ...fuelNodeLabels };
  let currentEdges = [...fuelEdgesData];
  
  fuelEdgesData.forEach(([from, to]) => {
    const newLabels = { ...currentLabels };
    newLabels[to] = `${newLabels[to]},${newLabels[from]}`;
    delete newLabels[from];
    const newEdges = currentEdges.filter(([f, t]) => f !== from && t !== from);
    
    fuelSteps.push({
      labels: newLabels,
      edges: newEdges
    });
    
    currentLabels = newLabels;
    currentEdges = newEdges;
  });

  fuelCurrentStep = 0;
  drawFuelStep(fuelCurrentStep);

  document.getElementById("fuel-totalSteps").textContent = fuelSteps.length;
  document.getElementById("fuel-stepNum").textContent = "1";
}

// Generate circular positions for fuel nodes
function generateFuelNodePositions() {
  fuelNodesPos = {};
  const keys = [...new Set(fuelEdgesData.flatMap(e => [e[0], e[1]]))];
  const total = keys.length;
  const radius = 200;
  keys.forEach((node, i) => {
    const angle = (i / total) * 2 * Math.PI;
    fuelNodesPos[node] = {
      x: fuelCanvas.width / 2 + radius * Math.cos(angle),
      y: fuelCanvas.height / 2 + radius * Math.sin(angle)
    };
  });
}

// Draw fuel step
function drawFuelStep(stepIndex) {
  fuelCtx.clearRect(0, 0, fuelCanvas.width, fuelCanvas.height);
  if (fuelSteps.length === 0) return;

  const { labels, edges } = fuelSteps[stepIndex];

  // Draw edges
  edges.forEach(([from, to]) => {
    if (!labels[from] || !labels[to]) return;
    const a = fuelNodesPos[from];
    const b = fuelNodesPos[to];
    fuelCtx.strokeStyle = "#475569";
    fuelCtx.lineWidth = 3;
    fuelCtx.beginPath();
    fuelCtx.moveTo(a.x, a.y);
    fuelCtx.lineTo(b.x, b.y);
    fuelCtx.stroke();
  });

  // Draw nodes
  for (const [node, label] of Object.entries(labels)) {
    const pos = fuelNodesPos[node];
    const radius = 25;
    
    // Outer glow
    fuelCtx.beginPath();
    fuelCtx.arc(pos.x, pos.y, radius + 3, 0, 2 * Math.PI);
    fuelCtx.fillStyle = "rgba(16, 185, 129, 0.2)";
    fuelCtx.fill();
    
    // Main node
    fuelCtx.beginPath();
    fuelCtx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
    fuelCtx.fillStyle = "#1e293b";
    fuelCtx.fill();
    fuelCtx.strokeStyle = "#10b981";
    fuelCtx.lineWidth = 3;
    fuelCtx.stroke();
    
    // Node label
    fuelCtx.fillStyle = "#6ee7b7";
    fuelCtx.font = "bold 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    fuelCtx.textAlign = "center";
    fuelCtx.textBaseline = "middle";
    fuelCtx.fillText(label, pos.x, pos.y);
  }

  document.getElementById("fuel-stepNum").textContent = stepIndex + 1;
}

// Next / Back buttons for fuel simulation
document.getElementById("fuel-nextStep").addEventListener("click", () => {
  if (fuelCurrentStep < fuelSteps.length - 1) {
    fuelCurrentStep++;
    drawFuelStep(fuelCurrentStep);
  }
});

document.getElementById("fuel-prevStep").addEventListener("click", () => {
  if (fuelCurrentStep > 0) {
    fuelCurrentStep--;
    drawFuelStep(fuelCurrentStep);
  }
});
