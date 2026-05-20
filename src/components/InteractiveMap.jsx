import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Heart } from 'lucide-react';
import { CITY_CENTER, routes } from '../data/mockData';
import { useApp } from '../context/AppContext';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const categoryIcons = {
  cafes: '☕', restaurants: '🍽️', bars: '🍸', parks: '🌳',
  culture: '🏛️', sports: '⚽', emergency: '🚨', shopping: '🛍️', desserts: '🍦',
};
const categoryColors = {
  cafes: '#f59e0b', restaurants: '#3b82f6', bars: '#8b5cf6', parks: '#22c55e',
  culture: '#f97316', sports: '#06b6d4', emergency: '#ef4444', shopping: '#ec4899', desserts: '#a78bfa',
};
const trafficColors = { low: '#22c55e', medium: '#f59e0b', high: '#f97316', critical: '#ef4444' };

// Puntos visibles segun nivel de zoom
const ZOOM_LIMITS = [
  { minZoom: 0,  maxPlaces: 30  },
  { minZoom: 13, maxPlaces: 80  },
  { minZoom: 14, maxPlaces: 200 },
  { minZoom: 15, maxPlaces: 500 },
  { minZoom: 16, maxPlaces: Infinity },
];

function placesLimit(zoom) {
  let limit = 30;
  for (const rule of ZOOM_LIMITS) {
    if (zoom >= rule.minZoom) limit = rule.maxPlaces;
  }
  return limit;
}

// Score de importancia para ordenar
function importanceScore(p) {
  const r = (p.rating || 4) / 5;
  const v = Math.log10((p.visits || 100) + 1) / 4;
  const trend = p.trend === 'up' ? 0.1 : 0;
  return r * 0.6 + v * 0.3 + trend;
}

function createIcon(category, isEmergency) {
  const emoji = categoryIcons[category] || '📍';
  const color = isEmergency ? '#ef4444' : (categoryColors[category] || '#334155');
  return L.divIcon({
    html: `<div style="background:#0f172a;border:2px solid ${color};border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:13px;box-shadow:0 2px 8px rgba(0,0,0,0.6);">${emoji}</div>`,
    iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -17], className: '',
  });
}

function createUserIcon() {
  return L.divIcon({
    html: `
      <div style="position:relative;width:20px;height:20px;">
        <div style="position:absolute;inset:0;background:rgba(59,130,246,0.25);border-radius:50%;animation:up 2s infinite;transform:scale(2.5);"></div>
        <div style="position:relative;background:linear-gradient(135deg,#2563eb,#06b6d4);border:3px solid white;border-radius:50%;width:20px;height:20px;box-shadow:0 0 20px rgba(59,130,246,0.8);z-index:1;"></div>
      </div>
      <style>@keyframes up{0%,100%{opacity:0.6;transform:scale(2.5)}50%{opacity:0;transform:scale(3.5)}}</style>
    `,
    iconSize: [20, 20], iconAnchor: [10, 10], className: '',
  });
}

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom || 14, { duration: 1.5 });
  }, [center, map, zoom]);
  return null;
}

// Hook que escucha el zoom del mapa y lo expone
function ZoomWatcher({ onZoomChange }) {
  useMapEvents({
    zoomend: (e) => onZoomChange(e.target.getZoom()),
  });
  return null;
}

const CALI_BOUNDS = [[3.25, -76.68], [3.62, -76.40]];

export default function InteractiveMap({
  height = '500px', showTraffic = true, showPlaces = true,
  showRoutes = false, selectedPlace = null, focusCoords = null,
  filterCategory = 'all',
}) {
  const {
    mapLayer, userCoords, geoLoading, geoError,
    liveTrafficZones, weatherLive, weatherLastUpdate,
    places, favorites, addToFavorites, user,
  } = useApp();

  const [zoom, setZoom] = useState(13);

  const center = userCoords || CITY_CENTER;

  // Todos los lugares validos dentro de Cali, ordenados por importancia
  const sortedPlaces = useMemo(() => {
    return places
      .filter(p => {
        if (!p.lat || !p.lng) return false;
        if (filterCategory !== 'all' && p.category !== filterCategory) return false;
        return p.lat >= 3.25 && p.lat <= 3.62 && p.lng >= -76.68 && p.lng <= -76.40;
      })
      .sort((a, b) => importanceScore(b) - importanceScore(a));
  }, [places, filterCategory]);

  // Cuantos mostrar segun zoom actual
  const visiblePlaces = useMemo(() => {
    const limit = placesLimit(zoom);
    return limit === Infinity ? sortedPlaces : sortedPlaces.slice(0, limit);
  }, [sortedPlaces, zoom]);

  const tileLayers = {
    standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  };

  return (
    <div style={{ height, borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
      {/* Estado GPS */}
      <div style={{
        position: 'absolute', top: 10, left: 10, zIndex: 1000,
        background: geoLoading ? 'rgba(245,158,11,0.9)' : geoError ? 'rgba(100,116,139,0.9)' : 'rgba(34,197,94,0.9)',
        color: 'white', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
        backdropFilter: 'blur(10px)',
      }}>
        {geoLoading ? '📡 Obteniendo ubicación...' : geoError ? '📍 Cali, Colombia' : '📍 Tu ubicación real'}
      </div>

      {/* Datos en vivo */}
      <div style={{
        position: 'absolute', top: 42, left: 10, zIndex: 1000,
        background: weatherLive ? 'rgba(16,185,129,0.9)' : 'rgba(100,116,139,0.85)',
        color: 'white', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
        backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: 5,
      }}>
        <span style={{
          display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
          background: weatherLive ? '#fff' : '#94a3b8',
          animation: weatherLive ? 'lp 1.5s infinite' : 'none',
        }} />
        {weatherLive ? `EN VIVO · ${weatherLastUpdate}` : 'Conectando...'}
        <style>{`@keyframes lp{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
      </div>

      {/* Contador de lugares */}
      {showPlaces && (
        <div style={{
          position: 'absolute', top: 74, left: 10, zIndex: 1000,
          background: 'rgba(37,99,235,0.88)', color: 'white',
          padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
          backdropFilter: 'blur(10px)',
        }}>
          📌 {visiblePlaces.length} / {sortedPlaces.length} lugares · zoom {zoom}
        </div>
      )}

      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        maxBounds={CALI_BOUNDS}
        maxBoundsViscosity={0.7}
      >
        <TileLayer
          url={tileLayers[mapLayer] || tileLayers.standard}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        <ZoomWatcher onZoomChange={setZoom} />
        {userCoords && <MapController center={userCoords} zoom={15} />}
        {focusCoords && <MapController center={focusCoords} zoom={16} />}
        {selectedPlace && <MapController center={[selectedPlace.lat, selectedPlace.lng]} zoom={16} />}

        {/* Tu ubicacion */}
        <Marker position={center} icon={createUserIcon()}>
          <Popup>
            <div style={{ background: '#1e293b', borderRadius: 8, padding: 10, color: 'white', minWidth: 160 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>📍 Tu ubicación</div>
              <small style={{ color: geoError ? '#f87171' : '#94a3b8' }}>
                {geoError ? geoError : `${center[0].toFixed(5)}, ${center[1].toFixed(5)}`}
              </small>
            </div>
          </Popup>
        </Marker>

        {/* Lugares con clustering + zoom progresivo */}
        {showPlaces && (
          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={55}
            showCoverageOnHover={false}
            iconCreateFunction={(cluster) => {
              const count = cluster.getChildCount();
              const size = count < 10 ? 34 : count < 50 ? 40 : 48;
              return L.divIcon({
                html: `<div style="background:linear-gradient(135deg,#1d4ed8,#7c3aed);border:2px solid rgba(255,255,255,0.25);border-radius:50%;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:${count<100?12:10}px;box-shadow:0 3px 10px rgba(37,99,235,0.5);">${count}</div>`,
                iconSize: [size, size], iconAnchor: [size/2, size/2], className: '',
              });
            }}
          >
            {visiblePlaces.map(place => {
              const isFav = favorites.includes(place.id);
              return (
                <Marker
                  key={place.id}
                  position={[place.lat, place.lng]}
                  icon={createIcon(place.category, place.isEmergency)}
                >
                  <Popup maxWidth={250}>
                    <div style={{ background: '#1e293b', borderRadius: 10, padding: 12, minWidth: 210, fontFamily: 'sans-serif' }}>
                      {place.image && (
                        <div style={{ position: 'relative', marginBottom: 8 }}>
                          <img
                            src={place.image} alt={place.name}
                            style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 6 }}
                            onError={e => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <div style={{ fontWeight: 700, color: 'white', fontSize: 14, flex: 1, paddingRight: 8 }}>{place.name}</div>
                        {user && (
                          <button
                            onClick={() => addToFavorites(place.id)}
                            style={{
                              background: isFav ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.07)',
                              border: `1px solid ${isFav ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.12)'}`,
                              borderRadius: 8, padding: '4px 6px', cursor: 'pointer',
                              color: isFav ? '#f87171' : '#94a3b8', display: 'flex', alignItems: 'center',
                              flexShrink: 0,
                            }}
                            title={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                          >
                            ♥
                          </button>
                        )}
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: 11, marginBottom: 8, lineHeight: 1.5 }}>
                        {(place.description || '').slice(0, 90)}{(place.description?.length || 0) > 90 ? '…' : ''}
                      </div>
                      <div style={{ display: 'flex', gap: 10, fontSize: 11 }}>
                        <span style={{ color: '#facc15' }}>⭐ {place.rating}</span>
                        <span style={{ color: '#34d399' }}>{place.price === 0 ? '🆓 Gratis' : `💵 $${place.price}`}</span>
                        {place.openHours && <span style={{ color: '#818cf8' }}>🕐 {place.openHours}</span>}
                      </div>
                      {place.source === 'osm' && (
                        <div style={{ marginTop: 6, fontSize: 10, color: '#475569' }}>Fuente: OpenStreetMap</div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        )}

        {/* Zonas de trafico en vivo */}
        {showTraffic && liveTrafficZones.map(zone => (
          <Circle
            key={zone.id}
            center={[zone.lat, zone.lng]}
            radius={420}
            pathOptions={{
              color: trafficColors[zone.level],
              fillColor: trafficColors[zone.level],
              fillOpacity: 0.12,
              weight: 2,
              opacity: 0.55,
            }}
          >
            <Popup>
              <div style={{ background: '#1e293b', borderRadius: 8, padding: 10, color: 'white' }}>
                <strong style={{ color: trafficColors[zone.level] }}>{zone.name}</strong>
                <div style={{ color: trafficColors[zone.level], fontSize: 12, marginTop: 2 }}>
                  Congestión: {zone.congestion}%
                </div>
                <small style={{ color: '#94a3b8' }}>{zone.description}</small>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* Rutas */}
        {showRoutes && routes.map(route => (
          <Polyline
            key={route.id}
            positions={[CITY_CENTER, [CITY_CENTER[0] + 0.01, CITY_CENTER[1] + 0.01]]}
            pathOptions={{ color: route.color, weight: 4, opacity: 0.8, dashArray: '10, 5' }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
