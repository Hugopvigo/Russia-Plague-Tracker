/* map.js — Leaflet interactive map (single Irkutsk marker, Siberia region view) */

function flagImg(c) {
  if (!c.code) {
    return '<span style="font-size:1.1em">📍</span>';
  }
  return `<img src="https://flagcdn.com/20x15/${c.code}.png"
               srcset="https://flagcdn.com/40x30/${c.code}.png 2x"
               width="20" height="15"
               alt="${c.name}"
               style="vertical-align:middle;border-radius:2px;margin-right:2px">`;
}

function initMap(data) {
  const container = document.getElementById('map');
  if (!container) return;

  if (window._dashMap) {
    window._dashMap.remove();
    window._dashMap = null;
  }

  const map = L.map('map', {
    zoomControl: true,
    scrollWheelZoom: false,
    attributionControl: true,
    minZoom: 2,
    maxZoom: 10
  }).setView([57, 102], 4);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // Location markers
  const markerClass = { high: 'marker-red', med: 'marker-amber', low: 'marker-blue', none: 'marker-gray' };
  const statusColor  = { high: '#ff4444',    med: '#ffaa00',       low: '#4488ff',    none: 'rgba(255,255,255,0.3)' };

  (data.countries || []).forEach(c => {
    const cls = markerClass[c.status] || 'marker-gray';
    const col = statusColor[c.status] || statusColor.none;

    const icon = L.divIcon({
      className: 'map-icon-wrapper',
      html: `<span class="map-dot ${cls}"></span>`,
      iconSize:   [14, 14],
      iconAnchor: [7, 7],
      popupAnchor: [0, -10]
    });

    const content = `
      <div class="popup-title">${flagImg(c)} ${c.name}</div>
      <div class="popup-status" style="color:${col}">${c.statusText}</div>
      <div class="popup-row">
        <span class="popup-label">Fallecidos</span>
        <span style="color:#ff4444;font-family:'IBM Plex Mono',monospace;font-weight:600">${c.deaths}</span>
      </div>
      <div class="popup-row">
        <span class="popup-label">Confirmados</span>
        <span style="color:#ffaa00;font-family:'IBM Plex Mono',monospace;font-weight:600">${c.confirmed}</span>
      </div>
      <div class="popup-row">
        <span class="popup-label">Sospechosos</span>
        <span style="font-family:'IBM Plex Mono',monospace">${c.suspected}</span>
      </div>
      <div class="popup-notes">${c.notes}</div>
    `;

    L.marker([c.lat, c.lng], { icon })
      .bindPopup(content, { className: 'dash-popup', maxWidth: 260 })
      .addTo(map);
  });

  window._dashMap = map;
}
