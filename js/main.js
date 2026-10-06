/* main.js — boot, nav, counters, facts, timeline */

let appData = null;

// ── Data fetching ─────────────────────────────────────────────────────────────

async function loadData() {
  const res = await fetch('data.json?_=' + Date.now());
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

// ── Boot ──────────────────────────────────────────────────────────────────────

async function boot() {
  try {
    appData = await loadData();
  } catch (e) {
    console.error('[Dashboard] Could not load data.json:', e);
    return;
  }

  applyMeta(appData.meta);
  buildFacts(appData.facts);
  buildTimeline(appData);
  animateCounters(appData.totals);
  updateClock();
  initNav();

  // Leaflet needs a rendered container with pixel dimensions
  setTimeout(() => initMap(appData), 60);

  // News loads in background — ready when user clicks the tab
  initNews(appData);

  // Auto-refresh all data every 5 minutes
  setInterval(refreshData, 5 * 60 * 1000);
}

// ── Refresh (re-fetches data.json + re-renders everything) ────────────────────

async function refreshData() {
  const btn = document.getElementById('news-refresh-btn');
  if (btn) { btn.disabled = true; btn.textContent = '↺ Cargando…'; }

  try {
    appData = await loadData();
  } catch (e) {
    console.error('[Dashboard] Refresh failed:', e);
    if (btn) { btn.disabled = false; btn.textContent = '↺ Actualizar'; }
    return;
  }

  applyMeta(appData.meta);
  buildFacts(appData.facts);
  buildTimeline(appData);
  animateCounters(appData.totals);
  updateClock();

  // Re-init map (handles its own cleanup internally)
  setTimeout(() => initMap(appData), 60);

  // Reset and reload news
  newsLoaded = false;
  allArticles = [];
  initNews(appData);

  if (btn) { btn.disabled = false; btn.textContent = '↺ Actualizar'; }
}

// ── Meta / banner (medios frente a Rospotrebnadzor) ───────────────────────────

function applyMeta(meta) {
  const banner = document.getElementById('risk-banner');
  if (!banner || !meta) return;
  banner.className = `risk-banner ${meta.alertColor || 'green'}`;
  const icon = document.getElementById('risk-icon');
  const media = document.getElementById('banner-media');
  const official = document.getElementById('banner-official');
  const alert = document.getElementById('banner-alert');
  if (icon) icon.textContent = meta.alertLevel || '';
  if (media) media.textContent = meta.mediaClaim || '';
  if (official) official.textContent = meta.officialClaim || '';
  if (alert) alert.innerHTML = `<strong>Riesgo para población general: ${escHtml(meta.alertLevel || '')}</strong><br>${escHtml(meta.alertText || '')}`;
}

// ── Animated counters ─────────────────────────────────────────────────────────

function animateCounters(totals) {
  if (!totals) return;
  const plain = {
    'm-deaths': totals.deaths,
    'm-confirmed': totals.confirmed,
    'm-suspected': totals.suspected,
    'm-quarantine': totals.quarantine,
  };
  const duration = 1300;

  Object.entries(plain).forEach(([id, target]) => {
    const el = document.getElementById(id);
    if (!el) return;
    const goal = Number(target) || 0;
    const start = performance.now();
    (function tick(now) {
      const t      = Math.min((now - start) / duration, 1);
      const eased  = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * goal);
      if (t < 1) requestAnimationFrame(tick);
    })(performance.now());
  });
}

// ── Key facts panel (with source) ─────────────────────────────────────────────

function buildFacts(facts) {
  const container = document.getElementById('facts-panel');
  if (!container) return;
  container.innerHTML = '';
  const colorMap = { amber: 'var(--amber)', red: 'var(--red)', blue: 'var(--blue)', green: 'var(--green)' };
  (facts || []).forEach(f => {
    const valColor = f.color ? `style="color:${colorMap[f.color] || f.color}"` : '';
    const wrap = document.createElement('div');
    wrap.className = 'fact-wrap';
    wrap.innerHTML = `<div class="fact-row"><span class="fact-label">${escHtml(f.label || '')}</span>` +
      `<span class="fact-value" ${valColor}>${escHtml(f.value || '')}</span></div>` +
      (f.source ? `<div class="fact-source">Fuente: ${escHtml(f.source)}</div>` : '');
    container.appendChild(wrap);
  });
}

// ── Timeline (with source) ────────────────────────────────────────────────────

function buildTimeline(data) {
  const list = document.getElementById('timeline-list');
  if (!list) return;
  list.innerHTML = '';
  (data.timeline || []).forEach(item => {
    const el = document.createElement('div');
    el.className = 'tl-item';
    el.innerHTML = `
      <div class="tl-date">${escHtml(item.date || '')}</div>
      <div class="tl-dot ${escHtml(item.dot || 'gray')}"></div>
      <div class="tl-body">
        <div class="tl-text">${item.text || ''}</div>
        ${item.source ? `<div class="tl-source">Fuente: ${escHtml(item.source)}</div>` : ''}
      </div>
    `;
    list.appendChild(el);
  });
}

// ── Navigation ────────────────────────────────────────────────────────────────

function initNav() {
  const refreshBtn = document.getElementById('news-refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', refreshData);
  }

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('view-' + btn.dataset.view).classList.add('active');

      if (btn.dataset.view === 'overview' && window._dashMap) {
        setTimeout(() => window._dashMap.invalidateSize(), 50);
      }
    });
  });
}

// ── Clock ─────────────────────────────────────────────────────────────────────

function updateClock() {
  const now = new Date();
  const el  = document.getElementById('last-update');
  if (el) el.textContent = `Comprobado: ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', boot);
setInterval(updateClock, 60000);
window.addEventListener('resize', () => { if (window._dashMap) window._dashMap.invalidateSize(); });
