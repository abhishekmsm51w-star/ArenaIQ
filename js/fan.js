import { getAIResponse, transitSchedules } from './mockData.js';

let fanPoints = 60;
const pointsTarget = 100;
let selectedLanguage = 'en';

export function initFanPortal() {
  selectedLanguage = document.getElementById('app-language-select')?.value || 'en';
  
  // Render initial components
  renderTransitSchedules();
  renderEcoProgress();
  setupChatListeners();
  setupEcoListeners();
  
  // Send initial welcome message
  sendBotWelcomeMessage();

  // Listen for custom simulator events from the map
  window.addEventListener('sim-chat-message', (e) => {
    const { sender, text } = e.detail;
    appendChatBubble(sender, text);
  });
}

// ------------------------------
// GenAI Chat Assistant
// ------------------------------
function setupChatListeners() {
  const sendBtn = document.getElementById('fan-chat-send');
  const chatInput = document.getElementById('fan-chat-input');
  const languageSelect = document.getElementById('app-language-select');
  const quickPrompts = document.getElementById('chat-quick-prompts');

  // Submit on button click
  sendBtn?.addEventListener('click', handleUserMessageSubmit);

  // Submit on Enter key
  chatInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleUserMessageSubmit();
    }
  });

  // Handle language change
  languageSelect?.addEventListener('change', (e) => {
    selectedLanguage = e.target.value;
    clearChatHistory();
    sendBotWelcomeMessage();
    // Update labels inside the chat header
    updateChatLabels();
  });

  // Quick Prompt tags
  quickPrompts?.querySelectorAll('.prompt-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const text = tag.getAttribute('data-prompt');
      if (text) {
        submitMessage(text);
      }
    });
  });
}

function handleUserMessageSubmit() {
  const chatInput = document.getElementById('fan-chat-input');
  const query = chatInput?.value.trim();
  if (!query) return;

  submitMessage(query);
  chatInput.value = '';
}

function submitMessage(queryText) {
  // Append user bubble
  appendChatBubble('user', queryText);

  // Generate bot AI response
  setTimeout(() => {
    const aiResult = getAIResponse(queryText, selectedLanguage);
    appendChatBubble('bot', aiResult.text);

    // If it was a navigation intent, make sure maps triggers highlight
    if (aiResult.intent === 'navigation' && aiResult.data) {
      const mapEvent = new CustomEvent('sim-map-route', { detail: aiResult.data });
      window.dispatchEvent(mapEvent);
    }
  }, 600);
}

function sendBotWelcomeMessage() {
  const welcome = getAIResponse('', selectedLanguage);
  appendChatBubble('bot', welcome.text);
}

function clearChatHistory() {
  const historyContainer = document.getElementById('fan-chat-history');
  if (historyContainer) {
    historyContainer.innerHTML = '';
  }
}

function appendChatBubble(sender, text) {
  const historyContainer = document.getElementById('fan-chat-history');
  if (!historyContainer) return;

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;

  // Process markdown-like formatting (bold: **, linebreaks: \n)
  let formattedText = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');

  bubble.innerHTML = formattedText;

  // Add metadata time
  const meta = document.createElement('div');
  meta.className = 'chat-bubble-meta';
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  meta.innerHTML = `<span>${sender === 'bot' ? 'FIFA AI' : 'You'}</span> <span>${timeStr}</span>`;
  bubble.appendChild(meta);

  historyContainer.appendChild(bubble);
  historyContainer.scrollTop = historyContainer.scrollHeight;
}

function updateChatLabels() {
  const title = document.getElementById('chat-title');
  const input = document.getElementById('fan-chat-input');
  
  const translations = {
    en: { title: "AI CupGuide Assistant", placeholder: "Ask CupGuide something..." },
    es: { title: "Asistente AI CupGuide", placeholder: "Pregunte algo a CupGuide..." },
    fr: { title: "Assistant AI CupGuide", placeholder: "Demandez quelque chose..." },
    pt: { title: "Assistente AI CupGuide", placeholder: "Pergunte ao CupGuide..." },
    ar: { title: "مساعد CupGuide الذكي", placeholder: "اسأل المساعد الذكي عن أي شيء..." }
  };

  const trans = translations[selectedLanguage] || translations['en'];
  if (title) title.textContent = trans.title;
  if (input) input.placeholder = trans.placeholder;
}

// ------------------------------
// Green Fan Challenge
// ------------------------------
function setupEcoListeners() {
  const actionCards = document.querySelectorAll('.green-action-card');
  actionCards.forEach(card => {
    card.addEventListener('click', () => {
      const isChecked = card.classList.toggle('checked');
      const pts = parseInt(card.getAttribute('data-pts') || '0');

      if (isChecked) {
        fanPoints += pts;
        triggerPointsConfetti();
      } else {
        fanPoints -= pts;
      }

      renderEcoProgress();
    });
  });
}

function renderEcoProgress() {
  const display = document.getElementById('eco-points-display');
  const fill = document.getElementById('eco-progress-fill');
  
  if (display) display.textContent = fanPoints;

  // Limit bounds [0, 100] for percentage
  const pct = Math.min(100, Math.max(0, (fanPoints / pointsTarget) * 100));
  if (fill) fill.style.width = `${pct}%`;

  // Badges unlocking thresholds:
  // Level 1: Green Starter (unlocked by default, >0 points)
  // Level 2: Transit Hero (requires 75+ points)
  // Level 3: Eco Elite (requires 95+ points)
  const badge2 = document.getElementById('badge-2');
  const badge3 = document.getElementById('badge-3');

  if (fanPoints >= 75) {
    badge2?.classList.add('unlocked');
    badge2?.classList.remove('locked');
  } else {
    badge2?.classList.remove('unlocked');
    badge2?.classList.add('locked');
  }

  if (fanPoints >= 95) {
    badge3?.classList.add('unlocked');
    badge3?.classList.remove('locked');
  } else {
    badge3?.classList.remove('unlocked');
    badge3?.classList.add('locked');
  }
}

function triggerPointsConfetti() {
  // Simple micro-animation indicating success by pulsing the points score
  const display = document.getElementById('eco-points-display');
  if (display) {
    display.style.transform = 'scale(1.2)';
    display.style.color = '#00e676';
    display.style.textShadow = '0 0 15px rgba(0, 230, 118, 0.6)';
    display.style.transition = 'transform 0.15s ease, color 0.15s ease';
    
    setTimeout(() => {
      display.style.transform = 'scale(1)';
      display.style.color = 'var(--secondary)';
      display.style.textShadow = '';
    }, 300);
  }
}

// ------------------------------
// Live Transit Schedules
// ------------------------------
export function renderTransitSchedules() {
  const container = document.getElementById('transit-list-container');
  if (!container) return;

  container.innerHTML = transitSchedules.map(t => {
    const iconLetter = t.line;
    let badgeClass = '';
    if (t.type === 'train') badgeClass = 'train';
    else if (t.type === 'shuttle') badgeClass = 'shuttle';
    else if (t.type === 'rideshare') badgeClass = 'rideshare';

    return `
      <div class="transit-item">
        <div class="transit-left">
          <div class="transit-line-badge ${badgeClass}">${iconLetter}</div>
          <div class="transit-details">
            <span class="transit-name">${t.name}</span>
            <span class="transit-status">${t.status}</span>
          </div>
        </div>
        <div class="transit-time">
          <div class="time-val">${t.time}</div>
          <div class="time-label">NEXT DEP</div>
        </div>
      </div>
    `;
  }).join('');
}
