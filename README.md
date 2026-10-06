# Russia Plague Tracker — Irkutsk

> **Seguimiento sobrio de un caso sin confirmar en Irkutsk (Siberia) · octubre 2026**

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-green?style=for-the-badge)](https://hugopvigo.github.io/Russia-Plague-Tracker/)
[![Status](https://img.shields.io/badge/Estado-BAJO-green?style=flat-square)](https://hugopvigo.github.io/Russia-Plague-Tracker/)

---

## Sobre el caso

A principios de octubre de 2026 fallece en Irkutsk **Daria Shipilova, de 28 años**, empleada del Instituto Anti-Peste de Siberia y Extremo Oriente, con una neumonía grave.

Hay **dos versiones enfrentadas**:

- **Medios locales** (Lyudi Baikala): la empleada habría roto un tubo de ensayo con *Yersinia pestis* viva.
- **Rospotrebnadzor**: causa «neumonía de etiología desconocida»; sin accidente registrado con patógenos; peste **no confirmada**; situación estable en Irkutsk y Shelejov.

Unas **189 personas** (contactos de la fallecida) están en observación médica, sin síntomas reseñables. Los análisis de contactos detectaron 2 COVID-19 y 2 rinovirus, ninguna otra infección (Interfax, 5 oct 2026). La OMS ha solicitado la causa de la muerte.

**Tono de este dashboard: sobrio. Cada afirmación lleva su fuente y su estado. La peste no está confirmada.**

---

## Dashboard — Funcionalidades

### Banner de dos versiones
Medios frente a Rospotrebnadzor, más nivel de riesgo (BAJO) con la frase «peste no confirmada».

### Métricas del caso
| Indicador | Valor actual |
|-----------|-------------|
| Fallecidos | **1** (en investigación) |
| Confirmados | **0** (peste no confirmada) |
| Sospechosos | **1** en evaluación |
| Contactos vigilados | **~189** en observación |

### Mapa interactivo
- Tiles oscuros **CartoDB Dark** con Leaflet.js
- Un solo marcador: **Irkutsk (52.29, 104.30)**, vista de región de Siberia

### Cronología del caso
Cada entrada lleva fecha, texto y **fuente**.

### Información médica
- Formas de la peste: bubónica, neumónica y septicémica
- Tratamiento con antibióticos (eficaz si temprano)
- Focos naturales en Siberia y Mongolia (marmotas; Altái, Tuvá, Buriatia)
- Fuentes: OMS, CDC, Rospotrebnadzor, ECDC

### Noticias
Feeds vía rss2json de **Reuters, TASS, Interfax y Meduza**, más **Google News** por consulta. Si el caso aislado genera pocas noticias, el feed puede salir casi vacío: es lo esperado, no un fallo.

---

## Tecnología

```
100% Vanilla — sin frameworks, sin build tools, sin npm
```

| Librería | Versión | Uso |
|----------|---------|-----|
| [Leaflet.js](https://leafletjs.com) | 1.9.4 | Mapa interactivo |
| [CartoDB Dark](https://carto.com/basemaps/) | — | Tiles del mapa |
| [IBM Plex Mono/Sans](https://fonts.google.com/specimen/IBM+Plex+Mono) | — | Tipografía |

### Estructura de archivos
```
📁 Russia-Plague-Tracker/
├── 📄 index.html          ← shell principal
├── 📄 admin.html          ← editor web (token de grano fino, solo este repo)
├── 📄 data.json           ← fuente única de datos (editable)
├── 🖼️  logo.jpg
├── 📁 css/
│   └── style.css
└── 📁 js/
    ├── map.js             ← Leaflet, un marcador
    ├── news.js            ← RSS vía rss2json
    └── main.js            ← boot, nav, contadores, cronología
```

---

## Actualizar datos

Todos los datos viven en **`data.json`** (o vía `admin.html`):

```jsonc
// data.json — campos principales
{
  "meta":      { "alertLevel": "BAJO", ... },  // incluye "peste no confirmada"
  "totals":    { "deaths": 1, "confirmed": 0, "suspected": 1, "quarantine": 189 },
  "facts":     [ { "label": ..., "value": ..., "source": ... } ],
  "countries": [ { "name": "Irkutsk", "lat": 52.29, "lng": 104.30, ... } ],
  "timeline":  [ { "date": ..., "text": ..., "source": ... } ]
}
```

> ⚠️ `admin.html` guarda un token de GitHub en localStorage. Usa un **token de grano fino limitado a este repo** (permiso de contenidos), nunca el token general.

---

## Despliegue en GitHub Pages

```bash
git clone git@github.com:Hugopvigo/Russia-Plague-Tracker.git
cd Russia-Plague-Tracker
python3 -m http.server 8000
# → http://localhost:8000
```

**Para GitHub Pages:** Settings → Pages → Branch: `main` / Folder: `/ (root)` → Save

URL pública: **https://hugopvigo.github.io/Russia-Plague-Tracker/**

---

## Fuentes oficiales

- [Rospotrebnadzor](https://www.rospotrebnadzor.ru)
- [OMS — Peste](https://www.who.int/news-room/fact-sheets/detail/plague)
- [ECDC — Peste](https://www.ecdc.europa.eu/en/plague)
- Agencias citadas en la cronología: Reuters, TASS, Interfax, Meduza

---

## Licencia

**CC BY-NC-SA 4.0** — Compartir con atribución, sin uso comercial. Consulta [LICENSE](LICENSE) para más detalles.

---

<div align="center">

**Desarrollado por [Hugo Perez-Vigo](https://hugopvigo.es)** · [@hugopvigo](https://x.com/hugopvigo)

</div>
