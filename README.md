# CommuteSync: Corporate Logistics & Route Optimization Engine

**CommuteSync** is a smart transport management system designed to optimize corporate employee logistics. By visualizing complex graph algorithms, it solves real-world commuting challenges—minimizing travel costs and fuel consumption for company shuttles and employee carpools.

## 🚀 Overview

Optimizing daily commutes is critical for reducing corporate carbon footprints and operational costs. CommuteSync addresses two key logistical challenges:

1.  **Shuttle Route Optimization (Routing)**: Solves the **Traveling Salesman Problem (TSP)** to find the most efficient route for a company bus to pick up employees at various stops and return to the office.
2.  **Carpool Consolidation Protocol (Logistics)**: Uses **Fuel Minimization Algorithms on Trees** to calculate the most efficient way for employees to carpool to a central hub, minimizing the total number of vehicles and fuel used.

## 🎯 Key Features

### 🚌 Shuttle Route Optimizer (TSP)
*   **Problem**: A company shuttle needs to visit $N$ employee pickup locations and return to the office using the shortest possible path.
*   **Solution**: Implements **Floyd-Warshall** for all-pairs shortest paths and **Bitmask Dynamic Programming** to solve the NP-Hard Traveling Salesman Problem.
*   **Result**: Displays the optimal Hamiltonian Cycle, ensuring minimum travel distance and time.

### 🚗 Carpool Consolidation System (Fuel Calc)
*   **Problem**: Employees scattered across different residential zones need to reach the office. How can they carpool to minimize total fuel consumption given a vehicle capacity (seats per car)?
*   **Solution**: Models the residential layout as a tree structure. Uses **Depth-First Search (DFS)** to greedily consolidate passengers at each node (stop) into the fewest number of cars required for the next leg of the journey.
*   **Result**: A step-by-step visualization of car usage and passenger flow from leaf nodes (homes) to the root (office).

---

## 🛠️ Technology Stack

*   **Frontend**: Vanilla JavaScript, HTML5 Canvas (for real-time graph rendering), CSS3
*   **Backend**: Node.js, Express.js (REST API for data persistence)
*   **Algorithms**:
    *   Graph Theory (Floyd-Warshall, DFS, MST context)
    *   Dynamic Programming (Bitmasking)
*   **Data Structures**: Adjacency Matrices, Trees, Priority Queues

---

## 🚀 Quick Start

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/CommuteSync.git
    cd CommuteSync
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Run the Application
Start the local development server:
```bash
npm start
```
Open your browser and navigate to: **http://localhost:3000**

---

## � Usage Guide

### Mode 1: Shuttle Routing (TSP)
*Determine the optimal pickup loop for a single vehicle.*

1.  **Define Stops**: Enter the number of Pickup Locations (Nodes).
2.  **Map Connections**: Add routes (Edges) between locations with their respective distances (Weights).
    *   *Example: Stop 0 to Stop 1 is 10km.*
3.  **Simulate**: Click **Run Simulation**. The engine will calculate the shortest Hamiltonian cycle.

### Mode 2: Carpool Logistics (Fuel/Tree)
*Minimize the fleet size required to transport all employees.*

1.  **Build Network**: Connect employee homes (child nodes) to major hubs or the office (parent nodes) to form a tree structure.
2.  **Set Capacity**: Define **Seats per Car** (e.g., 4 passengers per vehicle).
3.  **Calculate**: Click **Calculate Fuel**.
4.  **Visualize**: Use the "Next" buttons to watch how employees consolidate into fewer cars as they move closer to the office (Root Node 0).

---

## ⚠️ Troubleshooting

*   **"No Hamiltonian cycle exists"**: Ensure your shuttle route graph is fully connected (every stop can reach every other stop, directly or indirectly).
*   **"Tree must be acyclic"**: For the Carpool mode, ensure there are no loops. It must be a strict hierarchy (Tree structure).

## 📄 License
This project is open-source and available under the MIT License.
