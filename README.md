
# UrbanFlow AI

Plataforma inteligente de movilidad urbana, exploracion contextual y recomendaciones dinamicas en tiempo real.

## Stack Tecnico

- **Frontend**: React 19 + Vite 8 + Tailwind CSS v4
- **Routing**: React Router DOM v7
- **Mapas**: Leaflet + React-Leaflet
- **Graficas**: Recharts
- **Backend**: Firebase (Firestore, Auth, Storage, Hosting)
- **Iconos**: Lucide React
- **Notificaciones**: React Hot Toast

## Instalacion Rapida

```bash
cd urbanflow-ai
npm install
npm run dev
```

La app estara disponible en `http://localhost:5173`

## Configuracion Firebase

Edita `src/firebase/config.js` con tus credenciales reales del proyecto Firebase.

## Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
├── pages/            # 11 paginas completas
├── utils/            # Logica de negocio (Dijkstra, IA, busqueda)
├── context/          # Estado global AppContext
├── data/             # Datos mock de la ciudad
├── firebase/         # Configuracion Firebase
├── layouts/          # Layout principal con sidebar
└── routes/           # Routing completo
```

## Paginas

| Pagina | Ruta | Descripcion |
|--------|------|-------------|
| Home | `/` | Dashboard principal con KPIs y recomendaciones |
| Explore | `/explore` | Busqueda avanzada con filtros y mapa |
| Map | `/map` | Mapa interactivo con capas dinamicas |
| SmartFlow | `/routes` | Optimizador Dijkstra de rutas |
| Dashboard | `/dashboard` | Analytics con graficas Recharts |
| IA Recomenda | `/recommendations` | Motor IA + generador de planes |
| Events | `/events` | Eventos urbanos con impacto en trafico |
| Favorites | `/favorites` | Lugares guardados del usuario |
| Emergency | `/emergency` | Servicios de emergencia y protocolos |
| Profile | `/profile` | Perfil y preferencias personales |
| Admin | `/admin` | Panel administrativo completo |

## Deploy

```bash
npm run build
firebase deploy --only hosting
```
