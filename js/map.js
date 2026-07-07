import { stadiumNodes } from './mockData.js';

let activeRouteSource = null;
let activeRouteTarget = null;
let onNodeSelectedCallback = null;

// Initialize maps
export function initMaps(onNodeSelected) {
  onNodeSelectedCallback = onNodeSelected;
  
  // Render Fan Map
  const fanSvg = document.getElementById('stadium-svg');
  if (fanSvg) {
    setupSvgInteractions(fanSvg, 'fan');
  }

  // Render Ops Map
  const opsSvg = document.getElementById('ops-stadium-svg');
  if (opsSvg) {
    // Clone inside contents of Fan SVG to Ops SVG for exact styling consistency
    opsSvg.innerHTML = fanSvg.innerHTML;
    // Tweak elements for Ops view (e.g. remove route elements if any, modify controls)
    setupSvgInteractions(opsSvg, 'ops');
  }
}

// Register click handlers and hover animations
function setupSvgInteractions(svg, mode) {
  // Query all sections, gates, and markers
  const sections = svg.querySelectorAll('.stadium-section');
  const gates = svg.querySelectorAll('.stadium-gate');
  const markers = svg.querySelectorAll('.map-icon-marker');

  const allInteractive = [...sections, ...gates, ...markers];

  allInteractive.forEach(el => {
    const nodeName = el.getAttribute('data-node') || el.id;
    if (!nodeName) return;

    // Set title attribute for tooltip hover
    const nodeInfo = stadiumNodes[nodeName];
    if (nodeInfo) {
      el.setAttribute('title', nodeInfo.label);
    }

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      handleNodeClick(nodeName, mode);
    });
  });

  // Clicking empty space clears current selections
  svg.addEventListener('click', () => {
    clearSelection(svg);
  });
}

// Handle Node Selection & Route Calculation
function handleNodeClick(nodeName, mode) {
  const node = stadiumNodes[nodeName];
  if (!node) return;

  if (mode === 'fan') {
    const routeLine = document.getElementById('route-line');
    
    if (node.type === 'gate') {
      activeRouteSource = nodeName;
      // Alert user
      triggerLocalMessage('user', `Entered via ${node.label}.`);
      triggerLocalMessage('bot', `I've set your entrance to **${nodeName}**. Where is your seat section? Click a section on the map to calculate the route.`);
      highlightNode('stadium-svg', nodeName, 'source');
    } else if (node.type === 'section') {
      activeRouteTarget = nodeName;
      highlightNode('stadium-svg', nodeName, 'target');
      
      if (activeRouteSource) {
        // Draw route
        const pathData = calculateStadiumRoute(activeRouteSource, activeRouteTarget);
        if (routeLine) {
          routeLine.setAttribute('d', pathData);
          routeLine.classList.remove('hide');
        }
        triggerLocalMessage('user', `Show route to ${node.label}`);
        const walkTime = Math.max(2, Math.round(Math.abs(getAngle(activeRouteSource) - getAngle(activeRouteTarget)) * 4) + 1);
        triggerLocalMessage('bot', `🗺️ **Wayfinding Routing Active:**\nHere is your route from **${activeRouteSource}** to **${activeRouteTarget}**.\n- Walk along the inner concourse ring.\n- Estimated Walk Time: **${walkTime} minutes**.\n- Accessibility Status: **Step-free / Wheelchair Accessible**.`);
      } else {
        triggerLocalMessage('bot', `I've highlighted **${nodeName}**. To see a route, select your starting Gate (Gates A, B, C, or D) on the map first.`);
      }
    } else {
      // General POI click
      triggerLocalMessage('user', `Inspect ${node.label}`);
      if (node.type === 'green') {
        triggerLocalMessage('bot', `🌱 **${node.label}:** Smart Recycling Station. Scan your cup QR here to claim your eco points.`);
      } else if (node.type === 'concession') {
        triggerLocalMessage('bot', `🍔 **${node.label}:** Offers mobile ordering. *Current queue wait:* 5 minutes.`);
      } else if (node.type === 'medical') {
        triggerLocalMessage('bot', `🚨 **${node.label}:** Fully staffed medical station. If you need assistance, please speak to a volunteer or tap the Alert button.`);
      }
    }
  }

  // Trigger global callbacks (e.g. notify ops controller or app controller)
  if (onNodeSelectedCallback) {
    onNodeSelectedCallback(nodeName, mode);
  }
}

// Utility to dispatch local messages in the chat history
function triggerLocalMessage(sender, text) {
  const chatInput = document.getElementById('fan-chat-input');
  if (chatInput) {
    const event = new CustomEvent('sim-chat-message', { detail: { sender, text } });
    window.dispatchEvent(event);
  }
}

// Highlight node visuals
function highlightNode(svgId, nodeName, role) {
  const svg = document.getElementById(svgId);
  if (!svg) return;

  // Clear previous matching roles
  if (role === 'source') {
    svg.querySelectorAll('.gate-source').forEach(el => el.classList.remove('gate-source'));
  } else if (role === 'target') {
    svg.querySelectorAll('.section-target').forEach(el => el.classList.remove('section-target'));
  }

  // Find target node elements
  const cleanName = nodeName.toLowerCase().replace(' ', '-');
  const el = svg.getElementById(cleanName) || svg.querySelector(`[data-node="${nodeName}"]`);
  if (el) {
    if (role === 'source') {
      el.style.stroke = 'var(--primary)';
      el.style.strokeWidth = '3px';
      el.style.fill = 'rgba(0, 240, 255, 0.2)';
    } else {
      el.style.stroke = 'var(--secondary)';
      el.style.strokeWidth = '3px';
      el.style.fill = 'rgba(0, 230, 118, 0.2)';
    }
  }
}

// Clear active wayfinding paths
export function clearSelection(svg) {
  activeRouteSource = null;
  activeRouteTarget = null;
  
  const routeLine = svg.querySelector('.wayfinding-path');
  if (routeLine) {
    routeLine.setAttribute('d', '');
    routeLine.classList.add('hide');
  }

  // Clear styles
  svg.querySelectorAll('.stadium-gate').forEach(el => {
    el.style.stroke = '';
    el.style.strokeWidth = '';
    el.style.fill = '';
  });
  svg.querySelectorAll('.stadium-section').forEach(el => {
    el.style.stroke = '';
    el.style.strokeWidth = '';
    el.style.fill = '';
  });
}

// Calculate routing arc on the concourse circle
// Center (200, 200), Concourse Radius = 130
function calculateStadiumRoute(startName, endName) {
  const start = stadiumNodes[startName];
  const end = stadiumNodes[endName];
  if (!start || !end) return '';

  const cx = 200;
  const cy = 200;
  const r = 130; // concourse ring radius

  // Calculate angles relative to center
  const angleStart = Math.atan2(start.y - cy, start.x - cx);
  const angleEnd = Math.atan2(end.y - cy, end.x - cx);

  // Concourse entrance point (start)
  const entX = cx + r * Math.cos(angleStart);
  const entY = cy + r * Math.sin(angleStart);

  // Concourse exit point (end)
  const extX = cx + r * Math.cos(angleEnd);
  const extY = cy + r * Math.sin(angleEnd);

  // Determine direction of travel (shortest arc)
  let diff = angleEnd - angleStart;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  while (diff > Math.PI) diff -= 2 * Math.PI;

  const sweepFlag = diff >= 0 ? 1 : 0;
  const largeArcFlag = Math.abs(diff) > Math.PI ? 1 : 0;

  // Path commands:
  // Move to Gate -> Line to Concourse Entrance -> Arc along concourse -> Line to Section
  return `M ${start.x} ${start.y} 
          L ${entX.toFixed(1)} ${entY.toFixed(1)} 
          A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${extX.toFixed(1)} ${extY.toFixed(1)} 
          L ${end.x} ${end.y}`;
}

// Get node angle in radians
function getAngle(nodeName) {
  const node = stadiumNodes[nodeName];
  if (!node) return 0;
  return Math.atan2(node.y - 200, node.x - 200);
}

// Live crowd status updater for both maps
export function updateCrowdHeatmap(heatmapData) {
  const updateSvg = (svgId) => {
    const svg = document.getElementById(svgId);
    if (!svg) return;

    Object.entries(heatmapData).forEach(([nodeName, heatLevel]) => {
      const cleanName = nodeName.toLowerCase().replace(' ', '-');
      const el = svg.getElementById(cleanName) || svg.querySelector(`[data-node="${nodeName}"]`);
      if (el) {
        // Remove existing heat classes
        el.classList.remove('heat-low', 'heat-medium', 'heat-high');
        el.classList.add(heatLevel);
      }
    });
  };

  updateSvg('stadium-svg');
  updateSvg('ops-stadium-svg');
}
