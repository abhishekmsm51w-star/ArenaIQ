import { initialIncidents, initialVolunteers } from './mockData.js';
import { updateCrowdHeatmap } from './map.js';

let incidents = [...initialIncidents];
let volunteers = [...initialVolunteers];
let selectedIncidentId = null;

export function initOpsPortal() {
  renderIncidents();
  renderVolunteers();
  setupOpsListeners();
  
  // Sync the initial crowd heat map
  syncHeatmapFromIncidents();
}

// ------------------------------
// Incident List Management
// ------------------------------
export function renderIncidents() {
  const container = document.getElementById('ops-incident-list');
  const countBadge = document.getElementById('incident-sub-count');
  
  if (!container) return;

  if (incidents.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>No active incidents reported. Stadium operations running smoothly.</p>
      </div>
    `;
    if (countBadge) countBadge.textContent = "0 active alerts";
    return;
  }

  if (countBadge) countBadge.textContent = `${incidents.length} active alerts`;

  container.innerHTML = incidents.map(inc => {
    const isActive = inc.id === selectedIncidentId ? 'active' : '';
    const priorityClass = `priority-${inc.priority}`;
    
    return `
      <div class="incident-card ${isActive} ${priorityClass}" data-id="${inc.id}">
        <div class="incident-header">
          <span class="incident-title">${inc.title}</span>
          <span class="incident-level">${inc.priority}</span>
        </div>
        <p class="incident-desc">${inc.desc}</p>
        <div class="incident-meta">
          <span class="incident-loc">
            <svg xmlns="http://www.w3.org/2000/svg" style="width:12px; height:12px; color: var(--primary);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            ${inc.location}
          </span>
          <span>${inc.reportedAt}</span>
        </div>
      </div>
    `;
  }).join('');

  // Register clicks on incident cards
  container.querySelectorAll('.incident-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      selectIncident(id);
    });
  });
}

function selectIncident(id) {
  selectedIncidentId = id;
  renderIncidents();
  
  const inc = incidents.find(i => i.id === id);
  if (!inc) return;

  // Highlight on Map
  highlightIncidentLocation(inc.location);

  // Render GenAI Dispatch support
  renderDispatchConsole(inc);
}

function highlightIncidentLocation(loc) {
  const svg = document.getElementById('ops-stadium-svg');
  if (!svg) return;

  // Clear previous pulses
  svg.querySelectorAll('.ops-incident-pulse').forEach(el => el.remove());

  // Find target node in Ops Map
  const cleanName = loc.toLowerCase().replace(' ', '-');
  const el = svg.getElementById(cleanName) || svg.querySelector(`[data-node="${loc}"]`);
  
  if (el) {
    // Determine center coordinates of the node to draw a pulsing ring
    let cx = 0, cy = 0;
    if (el.tagName === 'circle') {
      cx = parseFloat(el.getAttribute('cx'));
      cy = parseFloat(el.getAttribute('cy'));
    } else if (el.tagName === 'path') {
      // Simple bounding box fallback
      const bbox = el.getBBox();
      cx = bbox.x + bbox.width / 2;
      cy = bbox.y + bbox.height / 2;
    } else {
      const bbox = el.getBBox();
      cx = bbox.x + bbox.width / 2;
      cy = bbox.y + bbox.height / 2;
    }

    // Append a glowing pulse ring
    const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    ring.setAttribute('cx', cx);
    ring.setAttribute('cy', cy);
    ring.setAttribute('r', '15');
    ring.setAttribute('class', 'ops-incident-pulse');
    ring.style.fill = 'none';
    ring.style.stroke = 'var(--danger)';
    ring.style.strokeWidth = '2px';
    ring.style.animation = 'pulse-danger-ring 1.5s infinite';
    
    // Inject animation style if not already present
    if (!document.getElementById('pulse-ring-animation-style')) {
      const style = document.createElement('style');
      style.id = 'pulse-ring-animation-style';
      style.textContent = `
        @keyframes pulse-danger-ring {
          0% { r: 5px; opacity: 1; stroke-width: 3px; }
          100% { r: 25px; opacity: 0; stroke-width: 1px; }
        }
      `;
      document.head.appendChild(style);
    }

    svg.appendChild(ring);
  }
}

// ------------------------------
// GenAI Dispatch Console
// ------------------------------
function renderDispatchConsole(inc) {
  const panel = document.getElementById('ops-dispatch-panel');
  if (!panel) return;

  panel.innerHTML = `
    <div class="selected-incident-panel">
      <div style="font-weight: 700; font-size: 14px; margin-bottom: 2px;">${inc.title}</div>
      <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 10px;">Location: ${inc.location}</div>
      
      <div class="ai-recommendation-card">
        <p class="ai-rec-text">${inc.aiRecommendation}</p>
        <div class="ai-rec-actions">
          <button class="btn btn-primary" id="btn-execute-resolve" data-id="${inc.id}">Deploy & Resolve</button>
          <button class="btn btn-secondary" id="btn-ops-ignore" data-id="${inc.id}">Defer Incident</button>
        </div>
      </div>
    </div>
  `;

  // Attach buttons
  document.getElementById('btn-execute-resolve')?.addEventListener('click', () => {
    executeIncidentResolution(inc);
  });

  document.getElementById('btn-ops-ignore')?.addEventListener('click', () => {
    deferIncident(inc.id);
  });
}

function executeIncidentResolution(inc) {
  // 1. Dispatch staff matching incident details
  let matchedVol = null;
  if (inc.id === "INC-901") {
    matchedVol = volunteers.find(v => v.id === "VOL-01"); // Unit 1
  } else if (inc.id === "INC-902") {
    matchedVol = volunteers.find(v => v.id === "VOL-03"); // Medical Team 2
  } else if (inc.id === "INC-903") {
    matchedVol = volunteers.find(v => v.id === "VOL-05"); // Sustainability Team 1
  } else if (inc.id === "INC-904") {
    matchedVol = volunteers.find(v => v.id === "VOL-04"); // Cleanup Crew 1
  }

  if (matchedVol) {
    matchedVol.status = "busy";
    matchedVol.assignment = `Deploy: ${inc.title}`;
    renderVolunteers();
  }

  // Show visual loader on button
  const resolveBtn = document.getElementById('btn-execute-resolve');
  if (resolveBtn) {
    resolveBtn.textContent = "Dispatching...";
    resolveBtn.disabled = true;
    resolveBtn.style.opacity = '0.7';
  }

  // Resolve after 2.5s delay
  setTimeout(() => {
    // 2. Remove incident from active list
    incidents = incidents.filter(i => i.id !== inc.id);
    selectedIncidentId = null;
    
    // Clear details panel
    resetDispatchConsole();
    
    // 3. Clear heatmap overlay on maps for the incident's target areas
    resolveMapDensityHeat(inc);

    // 4. Return staff back to standby after deployment is completed
    if (matchedVol) {
      setTimeout(() => {
        matchedVol.status = "standby";
        matchedVol.assignment = "None";
        renderVolunteers();
      }, 5000); // return to standby after 5 secs
    }

    renderIncidents();
  }, 2000);
}

function deferIncident(id) {
  // Simply remove selected active state
  selectedIncidentId = null;
  resetDispatchConsole();
  renderIncidents();
}

function resetDispatchConsole() {
  const panel = document.getElementById('ops-dispatch-panel');
  if (panel) {
    panel.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
        <p>Select an active incident from the list to analyze with Generative AI support recommendations.</p>
      </div>
    `;
  }
}

// ------------------------------
// Staff & Volunteers Matrix
// ------------------------------
export function renderVolunteers() {
  const container = document.getElementById('ops-volunteer-grid');
  if (!container) return;

  container.innerHTML = volunteers.map(v => {
    let statusClass = '';
    if (v.status === 'standby') statusClass = 'standby';
    else if (v.status === 'active') statusClass = 'active';
    else if (v.status === 'busy') statusClass = 'busy';

    return `
      <div class="volunteer-card">
        <div class="vol-name">${v.name}</div>
        <div class="vol-status ${statusClass}">${v.status}</div>
        <div class="vol-assignment">Job: ${v.assignment}</div>
      </div>
    `;
  }).join('');
}

// Sync the initial map heat levels
function syncHeatmapFromIncidents() {
  const heatState = {};
  incidents.forEach(inc => {
    if (inc.impactMapUpdates) {
      Object.entries(inc.impactMapUpdates).forEach(([nodeName, heatLevel]) => {
        heatState[nodeName] = heatLevel;
      });
    }
  });

  updateCrowdHeatmap(heatState);
}

// When incident is resolved, reset its impacted sections back to low density
function resolveMapDensityHeat(inc) {
  const resetState = {};
  if (inc.impactMapUpdates) {
    Object.keys(inc.impactMapUpdates).forEach(nodeName => {
      resetState[nodeName] = "heat-low";
    });
  }
  updateCrowdHeatmap(resetState);

  // Remove glowing pulse circle from Ops map
  const svg = document.getElementById('ops-stadium-svg');
  if (svg) {
    svg.querySelectorAll('.ops-incident-pulse').forEach(el => el.remove());
  }
}

function setupOpsListeners() {
  // Listen for navigation routes inside Fan companion to dynamically show Ops notifications (optional hook)
}
