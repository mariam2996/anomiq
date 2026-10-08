# AnomIQ — Autonomous AIOps SaaS Platform
> **Detect · Diagnose · Recover**

AnomIQ is a modern, premium AI SaaS observability and autonomous self-healing platform for cloud-native Kubernetes infrastructure.

---

## 🌟 Visual & Architectural Direction

### Modern AI SaaS Aesthetic
- **Color Palette**: Deep black and navy foundations (`#05070d`, `#0c101b`, `#111726`) accented with luminous cyan (`#06b6d4`, `#38bdf8`) and electric blue (`#3b82f6`). Subtle violet accents are used strictly for AI intelligence elements.
- **Glassmorphic Minimalism**: Generous card radiuses (20px), subtle translucent borders (`rgba(255, 255, 255, 0.08)`), spacious breathing room, and soft ambient light halos.
- **Modern Typography**: High-contrast, clean sans-serif hierarchy with bold metric numbers and legible descriptions.
- **Smooth Living Motion**:
  - Slowly rotating 3D infrastructure holographic globe in Canvas.
  - Traveling light packets along Bezier flight arcs.
  - Soft breathing status beacons.
  - 60fps real-time resource waveform charts.
  - Seamless page transitions.

---

## 🖥️ Simplified Core Pages

### 1. Overview Dashboard
- **Balanced Two-Column Hero**:
  - **Left (Hero Visual)**: Interactive 3D glowing globe representing global Kubernetes infrastructure (US East, EU Central, AP East), system status indicator (*"System Healthy / AnomIQ is monitoring all services in real time"*), and region latency badges.
  - **Right (3 Clean KPI Cards)**:
    1. **Active Incidents**: Card with prominent count `1` (or `0`), severity tag, and direct 1-click link to RCA.
    2. **Detected Anomalies**: Card with 24-hour total `3`, neural confidence `98.4%`, and auto-mitigated count.
    3. **System Uptime**: Card displaying `99.994%` rolling SLA and remaining error budget.
- **Secondary Insights Row**:
  - **AI Health Score**: Radial progress gauge with MTTD (420ms) and stability risk analysis.
  - **Resource Telemetry**: Dual glowing waveforms tracking live CPU utilization and memory allocation.
  - **Cluster Workloads**: 128 nodes, 1,482 pods capacity progress track, and recent anomalies list.

### 2. Monitoring (Cluster Fleet)
- Clean infrastructure overview tracking clusters, nodes, pods, and container runtimes.
- **16-Node Compute Pressure Matrix**: Visual hardware grid with hover inspector for CPU and memory pressure.
- **Live Ingress Throughput**: Real-time streaming chart with predictive baseline envelopes.
- **Service Health Grid**: Status cards for API Gateway, Auth, Checkout, Kafka, Redis, and Postgres.
- **Workload Fleet Table**: Filterable pods table (Running, CrashLoopBackOff, Pending) with search and container inspect modal.

### 3. Root Cause Analysis (RCA)
- **Connected AI Intelligence Pipeline**:
  $$\text{Anomaly} \longrightarrow \text{Evidence} \longrightarrow \text{Root Cause} \longrightarrow \text{Recommended Action}$$
  - **Step 1: Detected Anomaly**: Latency spike to 4,280ms and cgroup memory exhaustion.
  - **Step 2: Correlated Evidence**: +4.2MB/s allocation slope, 14 kernel OOM kills, Netty buffer leak.
  - **Step 3: Probable Root Cause**: Commit `9f4a12c` in v2.14.0 Netty chunk parser leak.
  - **Step 4: AI Recommendation**: Autonomous canary rollback to v2.13.9 with zero downtime.
- **Service Dependency Graph**: Interactive call graph displaying cascading backpressure propagation.
- **Correlated Logs**: Clean terminal showing correlated log culprit lines.
- **Autonomous Recovery Execution**: Click *"Execute Autonomous Recovery"* to watch automated recovery in real time, sealing the incident and returning all dashboard indicators to nominal green.

---

## 🚀 Live Demo & Presentation Controls

- **Simulate Incident / Restore Toggle**: The header button toggles between the P1 active incident state and the healthy resolved state for live demos.
- **Command Palette**: Press `Ctrl+K` (or `Cmd+K`) to search pages and trigger actions.
- **Audio Feedback**: Click the sound icon in the header to toggle subtle UI audio clicks.
- **Zero Dependencies**: Simply open `index.html` in any browser. No build steps or servers required.
