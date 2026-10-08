/**
 * AnomIQ — Modern AI SaaS Platform Controller
 * "Detect. Diagnose. Recover."
 * Handles Navigation, Real-time Telemetry, Topology Graph,
 * Pods Matrix, and Autonomous Recovery Execution.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const AppState = {
    activePage: 'page-overview',
    soundEnabled: false,
    clusterFilter: 'all',
    incidentActive: true,
    healthScore: 94.2
  };

  // Web Audio Synthesizer (Sleek, subtle tactile feedback)
  class SoundSynth {
    constructor() {
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playPip(freq = 840, duration = 0.04) {
      if (!AppState.soundEnabled) return;
      try {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) { /* ignore */ }
    }

    playSuccess() {
      if (!AppState.soundEnabled) return;
      try {
        this.init();
        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.08, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.22);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.22);
        });
      } catch (e) { /* ignore */ }
    }
  }

  const synth = new SoundSynth();

  // Toast Notification System
  function showToast(title, message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'saas-toast';
    toast.innerHTML = `
      <div>
        <strong>${title}</strong>
        <span>${message}</span>
      </div>
    `;
    container.appendChild(toast);
    synth.playPip(1100, 0.06);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4200);
  }

  // Page Routing & Navigation
  const navTabs = document.querySelectorAll('.nav-item');
  const pageViews = document.querySelectorAll('.page-container');

  function switchPage(targetPageId) {
    if (AppState.activePage === targetPageId) return;

    navTabs.forEach(tab => {
      const isTarget = tab.getAttribute('data-page') === targetPageId;
      tab.classList.toggle('active', isTarget);
    });

    pageViews.forEach(page => {
      const isTarget = page.id === targetPageId;
      if (isTarget) {
        page.classList.add('active');
        if (targetPageId === 'page-overview' && window.holoGlobe) {
          window.holoGlobe.resize();
        }
      } else {
        page.classList.remove('active');
      }
    });

    AppState.activePage = targetPageId;
    synth.playPip(720, 0.03);
  }

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const pageId = tab.getAttribute('data-page');
      switchPage(pageId);
    });
  });

  const brandBtn = document.getElementById('brandBtn');
  if (brandBtn) brandBtn.addEventListener('click', () => switchPage('page-overview'));

  const btnGoToRca = document.getElementById('btnGoToRca');
  if (btnGoToRca) btnGoToRca.addEventListener('click', () => switchPage('page-rca'));

  // Audio Toggle
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      AppState.soundEnabled = !AppState.soundEnabled;
      const onIcon = audioToggleBtn.querySelector('.audio-on-icon');
      const offIcon = audioToggleBtn.querySelector('.audio-off-icon');

      if (AppState.soundEnabled) {
        synth.init();
        synth.playPip(880, 0.08);
        onIcon.classList.remove('hidden');
        offIcon.classList.add('hidden');
        audioToggleBtn.classList.add('active');
        showToast('Audio Feedback Active', 'Subtle UI audio cues enabled');
      } else {
        onIcon.classList.add('hidden');
        offIcon.classList.remove('hidden');
        audioToggleBtn.classList.remove('active');
        showToast('Audio Muted', 'Audio feedback disabled');
      }
    });
  }

  // Cluster Selector Dropdown
  const clusterBtn = document.getElementById('clusterBtn');
  const clusterDropdown = document.getElementById('clusterDropdown');
  const currentClusterLabel = document.getElementById('currentClusterLabel');

  if (clusterBtn && clusterDropdown) {
    clusterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      clusterDropdown.classList.toggle('open');
      synth.playPip(900, 0.03);
    });

    document.querySelectorAll('.cluster-menu-item').forEach(item => {
      item.addEventListener('click', () => {
        const title = item.querySelector('strong').textContent.split('(')[0].trim();
        currentClusterLabel.textContent = title;
        document.querySelectorAll('.cluster-menu-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        clusterDropdown.classList.remove('open');
        showToast('Cluster Scope Switched', `Active view filtered to ${title}`);
      });
    });

    document.addEventListener('click', () => {
      clusterDropdown.classList.remove('open');
    });
  }

  // Region Quick Cards click
  const cardUsEast = document.getElementById('cardUsEast');
  if (cardUsEast) {
    cardUsEast.addEventListener('click', () => {
      switchPage('page-rca');
      showToast('Investigating us-east-1 Anomaly', 'Loaded Root Cause Analysis workspace for INC-8921');
    });
  }

  const cardEuCentral = document.getElementById('cardEuCentral');
  if (cardEuCentral) {
    cardEuCentral.addEventListener('click', () => {
      switchPage('page-monitoring');
    });
  }

  const cardApEast = document.getElementById('cardApEast');
  if (cardApEast) {
    cardApEast.addEventListener('click', () => {
      switchPage('page-monitoring');
    });
  }

  // Initialize 3D Globe
  if (window.HoloGlobeEngine) {
    window.holoGlobe = new window.HoloGlobeEngine('holoGlobeCanvas');
  }

  // =========================================================================
  // Real-time Smooth Waveform Telemetry Charts
  // =========================================================================
  class SmoothChart {
    constructor(canvasId, options = {}) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.color = options.color || '#38bdf8';
      this.fillColor = options.fillColor || 'rgba(56, 189, 248, 0.15)';
      this.pointsCount = options.pointsCount || 50;
      this.minVal = options.minVal || 20;
      this.maxVal = options.maxVal || 100;
      this.currentVal = options.initialVal || 50;
      this.trend = options.trend || 0;
      this.history = [];

      for (let i = 0; i < this.pointsCount; i++) {
        this.history.push(this.currentVal + (Math.random() - 0.5) * 6);
      }

      this.tick = this.tick.bind(this);
      setInterval(this.tick, 1000);
      this.draw();
    }

    tick() {
      let delta = (Math.random() - 0.48) * 5 + this.trend;
      this.currentVal = Math.max(this.minVal, Math.min(this.maxVal, this.currentVal + delta));
      this.history.push(this.currentVal);
      if (this.history.length > this.pointsCount) {
        this.history.shift();
      }
      this.draw();
    }

    draw() {
      const ctx = this.ctx;
      if (!ctx) return;
      const w = this.canvas.width;
      const h = this.canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Smooth Bezier or line path
      ctx.beginPath();
      const stepX = w / (this.pointsCount - 1);

      this.history.forEach((val, i) => {
        const x = i * stepX;
        const normalizedY = (val - this.minVal) / (this.maxVal - this.minVal);
        const y = h - (normalizedY * (h - 12) + 6);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      // Line Stroke
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
      ctx.stroke();

      // Fill
      const lastX = (this.history.length - 1) * stepX;
      ctx.lineTo(lastX, h);
      ctx.lineTo(0, h);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, this.fillColor);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.shadowBlur = 0;
      ctx.fill();

      // Glowing dot at tip
      const latestVal = this.history[this.history.length - 1];
      const headY = h - (((latestVal - this.minVal) / (this.maxVal - this.minVal)) * (h - 12) + 6);
      ctx.beginPath();
      ctx.arc(lastX, headY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      ctx.fill();
    }
  }

  const cpuChart = new SmoothChart('chartCpuCanvas', {
    color: '#38bdf8',
    fillColor: 'rgba(56, 189, 248, 0.16)',
    minVal: 20,
    maxVal: 100,
    initialVal: 68
  });

  const memChart = new SmoothChart('chartMemCanvas', {
    color: '#fb7185',
    fillColor: 'rgba(244, 63, 94, 0.16)',
    minVal: 35,
    maxVal: 100,
    initialVal: 83,
    trend: 0.12
  });

  const clusterStream = new SmoothChart('clusterStreamCanvas', {
    color: '#06b6d4',
    fillColor: 'rgba(6, 182, 212, 0.14)',
    minVal: 80,
    maxVal: 200,
    initialVal: 142
  });

  // Live value updates & timer
  let elapsedSeconds = 312;
  setInterval(() => {
    const cpuEl = document.getElementById('valLiveCpu');
    const memEl = document.getElementById('valLiveMem');
    if (cpuEl && cpuChart) cpuEl.textContent = `${cpuChart.currentVal.toFixed(1)}%`;
    if (memEl && memChart) memEl.textContent = `${memChart.currentVal.toFixed(1)}%`;

    if (AppState.incidentActive) {
      elapsedSeconds++;
      const m = Math.floor(elapsedSeconds / 60);
      const s = elapsedSeconds % 60;
      const rcaTimer = document.getElementById('rcaElapsedTimer');
      if (rcaTimer) rcaTimer.textContent = `Detected ${m}m ${s < 10 ? '0' + s : s}s ago`;
    }
  }, 1000);

  // =========================================================================
  // Microservice Dependency Graph on Page 3 (RCA)
  // =========================================================================
  function renderTopologyGraph() {
    const canvas = document.getElementById('topoGraphCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    const nodes = [
      { name: 'API Gateway', x: 80, y: 130, status: 'healthy', latency: '12ms' },
      { name: 'Auth Svc', x: 240, y: 60, status: 'healthy', latency: '6ms' },
      { name: 'Checkout Svc', x: 240, y: 190, status: 'warning', latency: '820ms' },
      { name: 'Payment Worker', x: 450, y: 190, status: 'critical', latency: '4,280ms' },
      { name: 'Stripe API', x: 620, y: 130, status: 'healthy', latency: '184ms' },
      { name: 'Postgres RDS', x: 620, y: 220, status: 'healthy', latency: '4ms' }
    ];

    const edges = [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 2, to: 3, alert: true },
      { from: 3, to: 4 },
      { from: 3, to: 5 }
    ];

    let pulse = 0;

    function draw() {
      ctx.clearRect(0, 0, w, h);
      pulse = (pulse + 0.03) % (Math.PI * 2);

      // Edges
      edges.forEach((edge, i) => {
        const n1 = nodes[edge.from];
        const n2 = nodes[edge.to];
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.strokeStyle = edge.alert ? 'rgba(244, 63, 94, 0.6)' : 'rgba(56, 189, 248, 0.2)';
        ctx.lineWidth = edge.alert ? 2.2 : 1.4;
        if (edge.alert) ctx.setLineDash([4, 4]);
        else ctx.setLineDash([]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated traveling light packet
        const t = ((Date.now() / (edge.alert ? 900 : 1800)) + i * 0.2) % 1;
        const px = n1.x + (n2.x - n1.x) * t;
        const py = n1.y + (n2.y - n1.y) * t;
        ctx.beginPath();
        ctx.arc(px, py, edge.alert ? 3.5 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = edge.alert ? '#fb7185' : '#38bdf8';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Nodes
      nodes.forEach(node => {
        const isCrit = node.status === 'critical';
        const isWarn = node.status === 'warning';
        const col = isCrit ? '#f43f5e' : (isWarn ? '#f59e0b' : '#38bdf8');

        if (isCrit) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 18 + Math.sin(pulse) * 4, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#0c101b';
        ctx.fill();
        ctx.strokeStyle = col;
        ctx.lineWidth = 2;
        ctx.shadowColor = col;
        ctx.shadowBlur = isCrit ? 14 : 6;
        ctx.stroke();

        ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 0;
        ctx.textAlign = 'center';
        ctx.fillText(node.name, node.x, node.y - 20);

        ctx.font = '500 10px "JetBrains Mono", monospace';
        ctx.fillStyle = col;
        ctx.fillText(node.latency, node.x, node.y + 26);
      });

      requestAnimationFrame(draw);
    }
    draw();
  }
  renderTopologyGraph();

  // Populate Clean Correlated Log Stream
  const logTerminalStream = document.getElementById('logTerminalStream');
  if (logTerminalStream) {
    const logs = [
      { level: 'info', text: '16:21:42 [main] INFO io.netty.bootstrap.ServerBootstrap - Server binding to :8080' },
      { level: 'info', text: '16:22:01 [nioEventLoop-1] INFO c.a.PaymentRouter - Processing batch #89104' },
      { level: 'warn', text: '16:22:08 [nioEventLoop-1] WARN c.a.ChunkFilter - High pending allocation in ByteBufPool: 3,921MB' },
      { level: 'culprit', text: '16:22:11 [AI ROOT CAUSE] java.lang.OutOfMemoryError: Java heap space [NettyEpollWorker-4-8]' },
      { level: 'error', text: '16:22:14 [kubelet] ERROR k8s.io - Container checkout-gateway failed liveness probe (HTTP 504)' },
      { level: 'culprit', text: '16:22:15 [CORRELATION MATCH] Commit 9f4a12c (v2.14.0 Netty chunk parser leak detected)' }
    ];

    logs.forEach(l => {
      const line = document.createElement('div');
      line.className = `clean-log-line ${l.level}`;
      line.textContent = l.text;
      logTerminalStream.appendChild(line);
    });
  }

  // =========================================================================
  // Pods Data Table & Node Heatmap
  // =========================================================================
  const podsData = [
    { name: 'checkout-gateway-svc-78f94-xk8p', ns: 'payments', node: 'node-us-east-worker-08', status: 'CrashLoopBackOff', restarts: 6, cpu: 92, mem: 99.5, age: '18m' },
    { name: 'checkout-gateway-svc-78f94-lm21', ns: 'payments', node: 'node-us-east-worker-08', status: 'CrashLoopBackOff', restarts: 5, cpu: 88, mem: 98.2, age: '18m' },
    { name: 'checkout-gateway-svc-78f94-pq90', ns: 'payments', node: 'node-us-east-worker-04', status: 'CrashLoopBackOff', restarts: 4, cpu: 84, mem: 97.4, age: '18m' },
    { name: 'payment-router-v2-55c91-ab22', ns: 'payments', node: 'node-us-east-worker-03', status: 'Running', restarts: 0, cpu: 34, mem: 48.0, age: '4d' },
    { name: 'auth-validator-99f12-zz04', ns: 'core', node: 'node-us-east-worker-01', status: 'Running', restarts: 0, cpu: 18, mem: 32.1, age: '12d' },
    { name: 'envoy-ingress-mesh-12a88-ck10', ns: 'ingress', node: 'node-us-east-ingress-01', status: 'Running', restarts: 0, cpu: 42, mem: 56.4, age: '30d' },
    { name: 'kafka-broker-shard-01-9k3', ns: 'streaming', node: 'node-us-east-worker-02', status: 'Running', restarts: 0, cpu: 62, mem: 71.0, age: '14d' },
    { name: 'redis-cache-tier-04-88j', ns: 'cache', node: 'node-us-east-worker-05', status: 'Running', restarts: 1, cpu: 28, mem: 44.2, age: '8d' },
    { name: 'user-profile-svc-44b2-001', ns: 'default', node: 'node-us-east-worker-06', status: 'Running', restarts: 0, cpu: 14, mem: 29.8, age: '22d' },
    { name: 'order-dispatch-svc-11m-89f', ns: 'payments', node: 'node-us-east-worker-07', status: 'Pending', restarts: 0, cpu: 0, mem: 0, age: '42s' },
    { name: 'catalog-search-v3-90d', ns: 'default', node: 'node-us-east-worker-09', status: 'Running', restarts: 0, cpu: 38, mem: 52.1, age: '19d' },
    { name: 'telemetry-collector-ebpf-01', ns: 'kube-system', node: 'node-us-east-worker-08', status: 'Running', restarts: 0, cpu: 12, mem: 16.0, age: '45d' }
  ];

  function renderPodsTable(filter = 'all', search = '') {
    const tbody = document.getElementById('podsTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const q = search.toLowerCase();

    podsData.forEach(pod => {
      if (filter === 'running' && pod.status !== 'Running') return;
      if (filter === 'crashloop' && pod.status !== 'CrashLoopBackOff') return;
      if (filter === 'pending' && pod.status !== 'Pending') return;
      if (q && !pod.name.toLowerCase().includes(q) && !pod.ns.toLowerCase().includes(q)) return;

      const tr = document.createElement('tr');
      const isCrash = pod.status === 'CrashLoopBackOff';
      const isPending = pod.status === 'Pending';
      const statusClass = isCrash ? 'pill-rose' : (isPending ? 'pill-cyan' : 'pill-emerald');

      tr.innerHTML = `
        <td>
          <div class="pod-name-bold">
            <span class="status-beacon-dot ${isCrash ? 'beacon-rose' : 'beacon-cyan'}"></span>
            ${pod.name}
          </div>
        </td>
        <td><span class="kpi-pill-badge pill-cyan">${pod.ns}</span></td>
        <td><code>${pod.node}</code></td>
        <td><span class="kpi-pill-badge ${statusClass}">${pod.status}</span></td>
        <td><span class="${pod.restarts > 0 ? 'val-rose' : ''}">${pod.restarts}</span></td>
        <td>
          <div>${pod.cpu}%</div>
          <div class="mini-bar-track"><div class="mini-bar-fill" style="width: ${pod.cpu}%; background: ${pod.cpu > 80 ? 'var(--status-rose)' : 'var(--accent-cyan-bright)'};"></div></div>
        </td>
        <td>
          <div class="${pod.mem > 90 ? 'val-rose' : ''}">${pod.mem}%</div>
          <div class="mini-bar-track"><div class="mini-bar-fill" style="width: ${pod.mem}%; background: ${pod.mem > 90 ? 'var(--status-rose)' : 'var(--status-emerald)'};"></div></div>
        </td>
        <td>${pod.age}</td>
        <td>
          <button class="btn-table-action inspect-pod" data-pod="${pod.name}">Inspect</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    document.querySelectorAll('.inspect-pod').forEach(btn => {
      btn.addEventListener('click', () => {
        openPodModal(btn.getAttribute('data-pod'));
      });
    });
  }
  renderPodsTable();

  // Search input
  const podSearchInput = document.getElementById('podSearchInput');
  if (podSearchInput) {
    podSearchInput.addEventListener('input', (e) => {
      const activeFilter = document.querySelector('.filter-btn-pill.active')?.getAttribute('data-filter') || 'all';
      renderPodsTable(activeFilter, e.target.value);
    });
  }

  // Filter buttons
  document.querySelectorAll('.filter-btn-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPodsTable(btn.getAttribute('data-filter'), podSearchInput?.value || '');
      synth.playPip(700, 0.03);
    });
  });

  // 16-Node Heatmap Matrix
  const nodeMatrixGrid = document.getElementById('nodeMatrixGrid');
  const nodeSelectedInfo = document.getElementById('nodeSelectedInfo');
  if (nodeMatrixGrid) {
    for (let i = 1; i <= 16; i++) {
      const chip = document.createElement('div');
      chip.className = 'node-chip-box';
      const isFaulty = (i === 8);
      const isBusy = (i === 4 || i === 12);
      const cpu = isFaulty ? 94 : (isBusy ? 76 : (25 + (i * 3) % 40));
      const mem = isFaulty ? 98 : (isBusy ? 72 : (30 + (i * 4) % 35));

      chip.style.backgroundColor = isFaulty
        ? 'rgba(244, 63, 94, 0.2)'
        : (isBusy ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.08)');
      chip.style.borderColor = isFaulty ? 'rgba(244, 63, 94, 0.6)' : 'rgba(255,255,255,0.06)';

      chip.innerHTML = `
        <span class="node-chip-name">#${i < 10 ? '0' + i : i}</span>
        <span class="node-chip-load ${isFaulty ? 'val-rose' : ''}">${cpu}%</span>
      `;

      chip.addEventListener('mouseenter', () => {
        if (nodeSelectedInfo) {
          nodeSelectedInfo.innerHTML = `
            <span>Node: <strong>node-us-east-worker-${i < 10 ? '0' + i : i}</strong></span>
            <span>Load: CPU ${cpu}% · MEM ${mem}%</span>
            <span class="${isFaulty ? 'val-rose' : 'val-emerald'}">Status: ${isFaulty ? 'MemoryPressure' : 'Healthy'}</span>
          `;
        }
      });

      nodeMatrixGrid.appendChild(chip);
    }
  }

  // =========================================================================
  // Autonomous Remediation Execution Flow
  // =========================================================================
  const btnExecuteRemediation = document.getElementById('btnExecuteRemediation');
  const remediationModal = document.getElementById('remediationModal');
  const closeRemModal = document.getElementById('closeRemModal');
  const btnStartExecution = document.getElementById('btnStartExecution');
  const remTerminalOutput = document.getElementById('remTerminalOutput');

  function openRemediationModal() {
    if (!remediationModal) return;
    remediationModal.classList.add('open');
    synth.playPip(850, 0.06);
  }

  function closeRemediationModal() {
    if (!remediationModal) return;
    remediationModal.classList.remove('open');
  }

  if (btnExecuteRemediation) btnExecuteRemediation.addEventListener('click', openRemediationModal);
  if (closeRemModal) closeRemModal.addEventListener('click', closeRemediationModal);

  if (btnStartExecution) {
    btnStartExecution.addEventListener('click', () => {
      btnStartExecution.disabled = true;
      btnStartExecution.innerHTML = `<span>Executing Playbook...</span>`;

      const steps = [
        { text: '→ Cordoning node-us-east-worker-08 (marking unschedulable)...', class: 'term-line-run', delay: 700 },
        { text: '→ Diverting ingress traffic to healthy cluster zone B via Envoy...', class: 'term-line-dim', delay: 1100 },
        { text: '→ Triggering Helm rollback to revision 48 (v2.13.9 stable container image)...', class: 'term-line-run', delay: 1300 },
        { text: '→ Terminated 8 degraded Netty pods. Spun up 8 healthy pods.', class: 'term-line-dim', delay: 1000 },
        { text: '✓ Synthetic probe validation passed: p99 latency dropped to 31.8ms.', class: 'term-line-ok', delay: 900 },
        { text: '✓ [RECOVERY COMPLETE] Incident INC-8921 sealed and marked as AUTO-RESOLVED.', class: 'term-line-ok', delay: 600 }
      ];

      remTerminalOutput.innerHTML = '';
      let stepIdx = 0;

      function runNextStep() {
        if (stepIdx >= steps.length) {
          btnStartExecution.disabled = false;
          btnStartExecution.innerHTML = `<span>Completed · Close</span>`;
          btnStartExecution.onclick = () => {
            closeRemediationModal();
            triggerRecoveryState();
          };
          synth.playSuccess();
          return;
        }

        const step = steps[stepIdx];
        const line = document.createElement('div');
        line.className = step.class;
        line.textContent = step.text;
        remTerminalOutput.appendChild(line);
        remTerminalOutput.scrollTop = remTerminalOutput.scrollHeight;
        synth.playPip(1000, 0.02);

        stepIdx++;
        setTimeout(runNextStep, step.delay);
      }

      runNextStep();
    });
  }

  // Trigger Recovery State across the entire dashboard
  function triggerRecoveryState() {
    AppState.incidentActive = false;

    // Hero Badge & Texts
    const heroBadge = document.getElementById('heroStatusBadge');
    const heroBeacon = document.getElementById('heroBeacon');
    const heroTitle = document.getElementById('heroStatusTitle');
    if (heroBadge && heroBeacon && heroTitle) {
      heroBadge.classList.add('nominal');
      heroBeacon.className = 'status-beacon-dot beacon-cyan';
      heroTitle.textContent = 'System Healthy';
    }

    // KPI Cards
    const kpiIncidentCount = document.getElementById('kpiIncidentCount');
    const kpiIncidentBadge = document.getElementById('kpiIncidentBadge');
    const kpiIncidentMeta = document.getElementById('kpiIncidentMeta');
    if (kpiIncidentCount && kpiIncidentBadge) {
      kpiIncidentCount.textContent = '0';
      kpiIncidentBadge.textContent = 'All Resolved';
      kpiIncidentBadge.className = 'kpi-pill-badge pill-emerald';
      if (kpiIncidentMeta) kpiIncidentMeta.textContent = 'All services healthy';
    }

    // Nav Badge
    const rcaBadge = document.getElementById('rcaNavBadge');
    if (rcaBadge) {
      rcaBadge.textContent = '0 Incidents';
      rcaBadge.classList.add('resolved');
    }

    // Health Score
    const scoreNum = document.getElementById('healthScoreNumber');
    const radialBar = document.getElementById('scoreRadialBar');
    const riskText = document.getElementById('riskText');
    if (scoreNum) scoreNum.textContent = '99.8';
    if (radialBar) {
      radialBar.style.strokeDashoffset = '2.5';
      radialBar.style.stroke = 'var(--status-emerald)';
    }
    if (riskText) {
      riskText.textContent = 'Nominal (0 Risk)';
      riskText.className = 'val-emerald';
    }

    // Pods Distribution Track
    const faultingPodsLabel = document.getElementById('faultingPodsLabel');
    const trackHealthySeg = document.getElementById('trackHealthySeg');
    const trackFaultySeg = document.getElementById('trackFaultySeg');
    if (faultingPodsLabel) {
      faultingPodsLabel.textContent = '0 CrashLoop';
      faultingPodsLabel.className = 'val-emerald';
    }
    if (trackHealthySeg) trackHealthySeg.style.width = '100%';
    if (trackFaultySeg) trackFaultySeg.style.width = '0%';

    // Service Status on Page 2
    const svcBeaconCheckout = document.getElementById('svcBeaconCheckout');
    const svcLatencyCheckout = document.getElementById('svcLatencyCheckout');
    if (svcBeaconCheckout && svcLatencyCheckout) {
      svcBeaconCheckout.className = 'status-beacon-dot beacon-cyan';
      svcLatencyCheckout.textContent = '28ms · Nominal';
      svcLatencyCheckout.className = 'svc-latency';
    }

    // Update Globe cluster
    if (window.holoGlobe) {
      window.holoGlobe.clusters[0].status = 'healthy';
      window.holoGlobe.clusters[0].latency = '28ms';
      window.holoGlobe.clusters[0].color = '#10b981';
      window.holoGlobe.clusters[0].issue = 'Recovered by Canary Rollback';
    }

    // Pods table
    podsData[0].status = 'Running';
    podsData[0].cpu = 32;
    podsData[0].mem = 42;
    podsData[0].restarts = 0;
    podsData[1].status = 'Running';
    podsData[2].status = 'Running';
    renderPodsTable();

    // Memory chart flat
    memChart.trend = -0.12;
    memChart.currentVal = 46;

    // Demo button label
    const chaosLabel = document.getElementById('chaosBtnLabel');
    const simBtn = document.getElementById('simIncidentBtn');
    if (chaosLabel && simBtn) {
      chaosLabel.textContent = 'Re-trigger Anomaly';
      simBtn.classList.add('nominal');
    }

    showToast('Autonomous Recovery Sealed', 'Canary v2.13.9 deployed. 100% services restored to nominal health.');
  }

  // Chaos Simulation Button Toggle
  const simIncidentBtn = document.getElementById('simIncidentBtn');
  if (simIncidentBtn) {
    simIncidentBtn.addEventListener('click', () => {
      if (!AppState.incidentActive) {
        // Re-inject
        AppState.incidentActive = true;
        memChart.trend = 0.12;
        memChart.currentVal = 82;

        const heroBadge = document.getElementById('heroStatusBadge');
        const heroBeacon = document.getElementById('heroBeacon');
        const heroTitle = document.getElementById('heroStatusTitle');
        if (heroBadge && heroBeacon && heroTitle) {
          heroBadge.classList.remove('nominal');
          heroBeacon.className = 'status-beacon-dot beacon-rose';
          heroTitle.textContent = 'System Anomaly Detected';
        }

        const kpiIncidentCount = document.getElementById('kpiIncidentCount');
        const kpiIncidentBadge = document.getElementById('kpiIncidentBadge');
        const kpiIncidentMeta = document.getElementById('kpiIncidentMeta');
        if (kpiIncidentCount && kpiIncidentBadge) {
          kpiIncidentCount.textContent = '1';
          kpiIncidentBadge.textContent = 'P1 Critical';
          kpiIncidentBadge.className = 'kpi-pill-badge pill-rose';
          if (kpiIncidentMeta) kpiIncidentMeta.textContent = 'checkout-gateway-svc';
        }

        const rcaBadge = document.getElementById('rcaNavBadge');
        if (rcaBadge) {
          rcaBadge.textContent = '1 Incident';
          rcaBadge.classList.remove('resolved');
        }

        const scoreNum = document.getElementById('healthScoreNumber');
        const radialBar = document.getElementById('scoreRadialBar');
        const riskText = document.getElementById('riskText');
        if (scoreNum) scoreNum.textContent = '94.2';
        if (radialBar) {
          radialBar.style.strokeDashoffset = '14.5';
          radialBar.style.stroke = 'var(--accent-cyan-bright)';
        }
        if (riskText) {
          riskText.textContent = 'Elevated (1 Service)';
          riskText.className = 'val-rose';
        }

        if (window.holoGlobe) {
          window.holoGlobe.clusters[0].status = 'critical';
          window.holoGlobe.clusters[0].latency = '428ms';
          window.holoGlobe.clusters[0].color = '#f43f5e';
          window.holoGlobe.clusters[0].issue = 'P1 Memory Leak';
        }

        podsData[0].status = 'CrashLoopBackOff';
        podsData[0].cpu = 92;
        podsData[0].mem = 99.5;
        renderPodsTable();

        const chaosLabel = document.getElementById('chaosBtnLabel');
        if (chaosLabel) chaosLabel.textContent = 'Simulate Incident';
        simIncidentBtn.classList.remove('nominal');

        showToast('Chaos Injection Active', 'Simulated ByteBuf memory leak injected into checkout-gateway:v2.14.0');
      } else {
        triggerRecoveryState();
      }
    });
  }

  // Pod Inspection Modal
  const podDetailsModal = document.getElementById('podDetailsModal');
  const closePodModal = document.getElementById('closePodModal');
  const modalJumpRcaBtn = document.getElementById('modalJumpRcaBtn');
  const modalRestartPodBtn = document.getElementById('modalRestartPodBtn');

  function openPodModal(podName) {
    if (!podDetailsModal) return;
    const pod = podsData.find(p => p.name === podName) || podsData[0];
    document.getElementById('modalPodTitle').textContent = pod.name;
    document.getElementById('modalPodMeta').textContent = `Namespace: ${pod.ns} · Node: ${pod.node}`;
    document.getElementById('modalPodStatus').textContent = pod.status;
    document.getElementById('modalPodRestarts').textContent = `${pod.restarts}`;
    document.getElementById('modalPodCpu').textContent = `${pod.cpu}%`;
    document.getElementById('modalPodMem').textContent = `${pod.mem}%`;

    podDetailsModal.classList.add('open');
    synth.playPip(800, 0.04);
  }

  function closePodModalFn() {
    if (podDetailsModal) podDetailsModal.classList.remove('open');
  }

  if (closePodModal) closePodModal.addEventListener('click', closePodModalFn);
  if (modalJumpRcaBtn) {
    modalJumpRcaBtn.addEventListener('click', () => {
      closePodModalFn();
      switchPage('page-rca');
    });
  }
  if (modalRestartPodBtn) {
    modalRestartPodBtn.addEventListener('click', () => {
      showToast('Pod Restart Dispatched', 'Sent kubectl delete pod to cluster API');
      closePodModalFn();
    });
  }

  // Command Palette (Ctrl+K)
  const cmdModal = document.getElementById('cmdModal');
  const cmdTriggerBtn = document.getElementById('cmdTriggerBtn');
  const cmdSearchInput = document.getElementById('cmdSearchInput');

  function openCmd() {
    if (!cmdModal) return;
    cmdModal.classList.add('open');
    if (cmdSearchInput) {
      cmdSearchInput.value = '';
      cmdSearchInput.focus();
    }
  }

  function closeCmd() {
    if (cmdModal) cmdModal.classList.remove('open');
  }

  if (cmdTriggerBtn) cmdTriggerBtn.addEventListener('click', openCmd);

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (cmdModal?.classList.contains('open')) closeCmd();
      else openCmd();
    } else if (e.key === 'Escape') {
      closeCmd();
      closeRemediationModal();
      closePodModalFn();
    }
  });

  if (cmdModal) {
    cmdModal.addEventListener('click', (e) => {
      if (e.target === cmdModal) closeCmd();
    });
  }

  document.querySelectorAll('.cmd-single-item').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.getAttribute('data-action');
      closeCmd();
      switch (action) {
        case 'nav-overview': switchPage('page-overview'); break;
        case 'nav-monitoring': switchPage('page-monitoring'); break;
        case 'nav-rca': switchPage('page-rca'); break;
        case 'execute-remediation': openRemediationModal(); break;
        case 'trigger-chaos': simIncidentBtn?.click(); break;
      }
    });
  });

  // Welcome Toast
  setTimeout(() => {
    showToast('AnomIQ Connected', 'Autonomous AIOps active. Monitoring 1,482 pods across 4 clusters.');
  }, 600);
});
