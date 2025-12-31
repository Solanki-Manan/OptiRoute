const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const { tsp, loadTSPData, saveTSPData } = require('./tsp');
const { calculateFuel, addEdge, loadFuelData, saveFuelData } = require('./fuelCalculator');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ============== TSP ENDPOINTS ==============

// GET current TSP data
app.get('/tsp/data', (req, res) => {
  const data = loadTSPData();
  res.json(data);
});

// POST save updated TSP data
app.post('/tsp/save', (req, res) => {
  saveTSPData(req.body);
  res.json({ message: 'TSP data saved successfully!' });
});

// POST simulate TSP
app.post('/tsp/simulate', (req, res) => {
  const { roads, n } = req.body;
  const result = tsp(roads, n);
  res.json(result);
});

// ============== FUEL CALCULATOR ENDPOINTS ==============

// Add weighted edge for fuel calculator
app.post('/fuel/addEdge', (req, res) => {
  const { from, to, weight } = req.body;
  if (from === undefined || to === undefined || weight === undefined) {
    return res.status(400).json({ error: "Missing 'from', 'to' or 'weight'" });
  }
  addEdge(from, to, weight);
  res.json({ success: true });
});

// Get fuel calculator edges
app.get('/fuel/edges', (req, res) => {
  res.json(loadFuelData());
});

// Save fuel calculator edges
app.post('/fuel/saveEdges', (req, res) => {
  saveFuelData();
  res.json({ success: true });
});

// Calculate fuel
app.post('/fuel/calculate', (req, res) => {
  const { seats } = req.body;
  if (!seats || seats < 1) return res.status(400).json({ error: "Invalid seats value" });
  try {
    const result = calculateFuel(seats);
    res.json(result);
  } catch (err) {
    console.error("Error calculating fuel:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
