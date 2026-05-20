import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CITY_CENTER } from '../data/mockData';
import { CALI_EVENTS } from '../data/caliEvents';
import { useApp } from '../context/AppContext';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ── Datos de capas ─────────────────────────────────────────────────────────────

const MIO_ROUTES = [
  {
    id: 'mio1', name: 'Troncal Calle 5', color: '#3b82f6',
    coords: [
      [3.4095, -76.5590], [3.4150, -76.5520], [3.4280, -76.5465],
      [3.4440, -76.5390], [3.4516, -76.5325], [3.4620, -76.5282],
      [3.4760, -76.5262], [3.4810, -76.5255],
    ],
  },
  {
    id: 'mio2', name: 'Troncal Simón Bolívar', color: '#8b5cf6',
    coords: [
      [3.3750, -76.5380], [3.3950, -76.5400], [3.4120, -76.5445],
      [3.4250, -76.5460], [3.4420, -76.5510], [3.4580, -76.5430],
      [3.4660, -76.5500], [3.4720, -76.5545],
    ],
  },
  {
    id: 'mio3', name: 'Circular Oriente', color: '#06b6d4',
    coords: [
      [3.4050, -76.4940], [3.4120, -76.5010], [3.4200, -76.4890],
      [3.4350, -76.4900], [3.4500, -76.4960], [3.4620, -76.4960],
    ],
  },
  {
    id: 'mio4', name: 'Troncal Norte (Av. 6N)', color: '#10b981',
    coords: [
      [3.4516, -76.5325], [3.4600, -76.5310], [3.4700, -76.5295],
      [3.4800, -76.5280], [3.4900, -76.5265], [3.5050, -76.5245],
    ],
  },
];

const EMERGENCY_PLACES = [
  { id: 'emg1', name: 'Hospital Universitario del Valle', type: 'hospital', lat: 3.4328, lng: -76.5384, phone: '(602) 620-0040', address: 'Calle 5 #36-08, Cali' },
  { id: 'emg2', name: 'Clínica Valle del Lili', type: 'hospital', lat: 3.3636, lng: -76.5387, phone: '(602) 331-9090', address: 'Cra. 98 #18-49, Cali' },
  { id: 'emg3', name: 'Clínica Imbanaco', type: 'hospital', lat: 3.4250, lng: -76.5416, phone: '(602) 682-4646', address: 'Cra. 38A #5A-100, Cali' },
  { id: 'emg4', name: 'Clínica San Fernando', type: 'hospital', lat: 3.4120, lng: -76.5380, phone: '(602) 324-8000', address: 'Calle 5 Cra. 42, Cali' },
  { id: 'emg5', name: 'Hospital Joaquín Paz Borrero', type: 'hospital', lat: 3.5009, lng: -76.5236, phone: '(602) 662-6060', address: 'Calle 50 #1-50, Buenaventura' },
  { id: 'emg6', name: 'Bomberos Central Cali', type: 'bomberos', lat: 3.4508, lng: -76.5329, phone: '119', address: 'Carrera 4 #12-00, Centro' },
  { id: 'emg7', name: 'Bomberos Sede Norte', type: 'bomberos', lat: 3.4790, lng: -76.5258, phone: '119', address: 'Av. 6 Norte #45-12, Cali' },
  { id: 'emg8', name: 'Policía Metropolitana Cali', type: 'policia', lat: 3.4516, lng: -76.5180, phone: '112', address: 'Carrera 15 #12-28, Cali' },
  { id: 'emg9', name: 'CAI Policía El Peñón', type: 'policia', lat: 3.4681, lng: -76.5334, phone: '112', address: 'Parque del Perro, El Peñón' },
  { id: 'emg10', name: 'Cruz Roja Valle del Cauca', type: 'cruz_roja', lat: 3.4388, lng: -76.5485, phone: '132', address: 'Av. Colombia #4-50, Cali' },
];

// ── Constantes ─────────────────────────────────────────────────────────────────

const categoryIcons = {
  cafes: '☕', restaurants: '🍽️', bars: '🍸', parks: '🌳',
  culture: '🏛️', sports: '⚽', emergency: '🚨', shopping: '🛍️', desserts: '🍦',
};
const categoryColors = {
  cafes: '#f59e0b', restaurants: '#3b82f6', bars: '#8b5cf6', parks: '#22c55e',
  culture: '#f97316', sports: '#06b6d4', emergency: '#ef4444', shopping: '#ec4899', desserts: '#a78bfa',
};
const trafficColors = { low: '#22c55e', medium: '#f59e0b', high: '#f97316', critical: '#ef4444' };
const emergencyColors = {
  hospital: '#ef4444', bomberos: '#f97316', policia: '#3b82f6', cruz_roja: '#ef4444',
};
const emergencyIcons = { hospital: '🏥', bomberos: '🚒', policia: '👮', cruz_roja: '🚑' };

const ZOOM_LIMITS = [
  { minZoom: 0,  maxPlaces: 30 },
  { minZoom: 13, maxPlaces: 80 },
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

function importanceScore(p) {
  const r = (p.rating || 4) / 5;
  const v = Math.log10((p.visits || 100) + 1) / 4;
  const trend = p.trend === 'up' ? 0.1 : 0;
  return r * 0.6 + v * 0.3 + trend;
}

// ── Iconos ─────────────────────────────────────────────────────────────────────

function createPlaceIcon(category) {
  const emoji = categoryIcons[category] || '📍';
  const color = categoryColors[category] || '#334155';
  return L.divIcon({
    html: `<div style="background:#0f172a;border:2.5px solid ${color};border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 10px rgba(0,0,0,0.7),0 0 0 1px rgba(255,255,255,0.06);">${emoji}</div>`,
    iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -18], className: '',
  });
}

function createEmergencyIcon(type) {
  const emoji = emergencyIcons[type] || '🚨';
  const color = emergencyColors[type] || '#ef4444';
  return L.divIcon({
    html: `<div style="background:linear-gradient(135deg,#1e0505,#3b0000);border:2.5px solid ${color};border-radius:10px;width:34px;height:34px;display:flex;align-items:center;justify-content:center;font-size:15px;box-shadow:0 0 12px ${color}50,0 2px 8px rgba(0,0,0,0.8);">${emoji}</div>`,
    iconSize: [34, 34], iconAnchor: [17, 17], popupAnchor: [0, -19], className: '',
  });
}

function createEventIcon() {
  return L.divIcon({
    html: `<div style="background:linear-gradient(135deg,#1e003b,#3b0070);border:2.5px solid #a78bfa;border-radius:10px;width:34px;height:34px;display:flex;align-items:center;justify-content:center;font-size:15px;box-shadow:0 0 12px rgba(139,92,246,0.5),0 2px 8px rgba(0,0,0,0.8);">🎭</div>`,
    iconSize: [34, 34], iconAnchor: [17, 17], popupAnchor: [0, -19], className: '',
  });
}

function createUserIcon() {
  return L.divIcon({
    html: `
      <div style="position:relative;width:22px;height:22px;">
        <div style="position:absolute;inset:-6px;background:rgba(59,130,246,0.2);border-radius:50%;animation:pulse_u 2s infinite;"></div>
        <div style="position:relative;background:linear-gradient(135deg,#2563eb,#06b6d4);border:3px solid white;border-radius:50%;width:22px;height:22px;box-shadow:0 0 20px rgba(59,130,246,0.8);"></div>
      </div>
      <style>@keyframes pulse_u{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:0;transform:scale(1.6)}}</style>
    `,
    iconSize: [22, 22], iconAnchor: [11, 11], className: '',
  });
}

// ── Sub-componentes ────────────────────────────────────────────────────────────

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom || 14, { duration: 1.2 });
  }, [center, map, zoom]);
  return null;
}

function ZoomWatcher({ onZoomChange }) {
  useMapEvents({ zoomend: (e) => onZoomChange(e.target.getZoom()) });
  return null;
}

const CALI_BOUNDS = [[3.25, -76.68], [3.62, -76.40]];

// ── Componente principal ───────────────────────────────────────────────────────

export default function InteractiveMap({
  height = '500px',
  showTraffic = true,
  showPlaces = true,
  showRoutes = false,
  showHeatmap = false,
  showEvents = false,
  showEmergency = false,
  selectedPlace = null,
  focusCoords = null,
  filterCategory = 'all',
}) {
  const {
    mapLayer, userCoords, geoLoading, geoError,
    liveTrafficZones, weatherLive, weatherLastUpdate,
    places, favorites, addToFavorites, user, openPlaceDetail,
  } = useApp();

  const [zoom, setZoom] = useState(13);
  const center = userCoords || CITY_CENTER;

  const sortedPlaces = useMemo(() => (
    places
      .filter(p => {
        if (!p.lat || !p.lng) return false;
        if (filterCategory !== 'all' && p.category !== filterCategory) return false;
        return p.lat >= 3.25 && p.lat <= 3.62 && p.lng >= -76.68 && p.lng <= -76.40;
      })
      .sort((a, b) => importanceScore(b) - importanceScore(a))
  ), [places, filterCategory]);

  const visiblePlaces = useMemo(() => {
    const limit = placesLimit(zoom);
    return limit === Infinity ? sortedPlaces : sortedPlaces.slice(0, limit);
  }, [sortedPlaces, zoom]);

  const eventsWithCoords = useMemo(
    () => CALI_EVENTS.filter(e => e.lat && e.lng),
    []
  );

  const tileLayers = {
    standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  };

  // ─── Popup helpers ───────────────────────────────────────────────────────────

  const popupBase = { background: '#0f1f3d', borderRadius: 12, padding: 14, fontFamily: 'system-ui,sans-serif', minWidth: 220, border: '1px solid rgba(255,255,255,0.08)' };

  return (
    <div style={{ height, borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>

      {/* ── Status overlay — esquina inferior izquierda ── */}
      <div style={{
        position: 'absolute', bottom: 12, left: 12, zIndex: 1000,
        display: 'flex', flexDirection: 'column', gap: 5, pointerEvents: 'none',
      }}>
        {/* GPS */}
        <div style={{
          background: geoLoading ? 'rgba(245,158,11,0.92)' : geoError ? 'rgba(100,116,139,0.92)' : 'rgba(22,163,74,0.92)',
          color: 'white', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
          backdropFilter: 'blur(12px)', boxShadow: '0 2px 8px rgba(0,0,0,0.4)', display: 'inline-flex', alignItems: 'center', gap: 5, width: 'fit-content',
        }}>
          {geoLoading ? '📡 Localizando...' : geoError ? '📍 Cali, Colombia' : '📍 Ubicación real'}
        </div>

        {/* Live */}
        <div style={{
          background: weatherLive ? 'rgba(5,150,105,0.92)' : 'rgba(71,85,105,0.88)',
          color: 'white', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
          backdropFilter: 'blur(12px)', boxShadow: '0 2px 8px rgba(0,0,0,0.4)', display: 'inline-flex', alignItems: 'center', gap: 6, width: 'fit-content',
        }}>
          <span style={{
            display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
            background: weatherLive ? '#fff' : '#94a3b8',
            animation: weatherLive ? 'blink_lp 1.5s infinite' : 'none',
          }} />
          {weatherLive ? `EN VIVO · ${weatherLastUpdate}` : 'Conectando...'}
          <style>{`@keyframes blink_lp{0%,100%{opacity:1}50%{opacity:0.2}}`}</style>
        </div>

        {/* Lugares visibles */}
        {showPlaces && (
          <div style={{
            background: 'rgba(37,99,235,0.92)', color: 'white',
            padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
            backdropFilter: 'blur(12px)', boxShadow: '0 2px 8px rgba(0,0,0,0.4)', width: 'fit-content',
          }}>
            📌 {visiblePlaces.length} / {sortedPlaces.length} · zoom {zoom}
          </div>
        )}
      </div>

      <MapContainer
        center={center} zoom={13}
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

        {/* ── Capa: Calor (Heatmap) ── */}
        {showHeatmap && sortedPlaces.slice(0, 120).map(place => {
          const intensity = Math.min((place.visits || 100) / 5000, 1);
          const radius = 160 + intensity * 450;
          const color = intensity > 0.75 ? '#ef4444' : intensity > 0.5 ? '#f97316' : intensity > 0.25 ? '#eab308' : '#3b82f6';
          return (
            <Circle
              key={`heat_${place.id}`}
              center={[place.lat, place.lng]}
              radius={radius}
              pathOptions={{ color: 'transparent', fillColor: color, fillOpacity: 0.07 + intensity * 0.14, weight: 0 }}
            />
          );
        })}

        {/* ── Capa: Rutas MIO ── */}
        {showRoutes && MIO_ROUTES.map(route => (
          <Polyline
            key={route.id}
            positions={route.coords}
            pathOptions={{ color: route.color, weight: 5, opacity: 0.85, dashArray: '12,5', lineCap: 'round', lineJoin: 'round' }}
          >
            <Popup>
              <div style={{ ...popupBase, minWidth: 180 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ display: 'inline-block', width: 12, height: 4, borderRadius: 2, background: route.color }} />
                  <span style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>🚌 {route.name}</span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: 11, margin: 0 }}>Sistema MIO — Transporte Masivo Cali</p>
              </div>
            </Popup>
          </Polyline>
        ))}

        {/* ── Capa: Tráfico ── */}
        {showTraffic && liveTrafficZones.map(zone => (
          <Circle
            key={zone.id}
            center={[zone.lat, zone.lng]}
            radius={430}
            pathOptions={{
              color: trafficColors[zone.level],
              fillColor: trafficColors[zone.level],
              fillOpacity: zone.level === 'critical' ? 0.18 : 0.11,
              weight: 2,
              opacity: 0.6,
              dashArray: zone.level === 'critical' ? '6,3' : undefined,
            }}
          >
            <Popup>
              <div style={{ ...popupBase, minWidth: 190 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>{zone.name}</span>
                  <span style={{ color: trafficColors[zone.level], fontWeight: 800, fontSize: 13 }}>{zone.congestion}%</span>
                </div>
                <div style={{ height: 4, background: '#1e293b', borderRadius: 2, marginBottom: 6 }}>
                  <div style={{ height: '100%', width: `${zone.congestion}%`, background: trafficColors[zone.level], borderRadius: 2 }} />
                </div>
                <small style={{ color: '#64748b' }}>{zone.description}</small>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* ── Capa: Emergencias ── */}
        {showEmergency && (
          <>
            {EMERGENCY_PLACES.map(emg => (
              <Marker
                key={emg.id}
                position={[emg.lat, emg.lng]}
                icon={createEmergencyIcon(emg.type)}
              >
                <Popup maxWidth={240}>
                  <div style={{ ...popupBase }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 18 }}>{emergencyIcons[emg.type]}</span>
                      <span style={{ color: 'white', fontWeight: 700, fontSize: 13, flex: 1 }}>{emg.name}</span>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: 11, margin: '0 0 6px' }}>{emg.address}</p>
                    <a href={`tel:${emg.phone}`}
                      style={{ color: '#f87171', fontWeight: 700, fontSize: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                      📞 {emg.phone}
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
            {/* Círculo de cobertura emergencias */}
            {EMERGENCY_PLACES.filter(e => e.type === 'hospital').map(emg => (
              <Circle
                key={`cov_${emg.id}`}
                center={[emg.lat, emg.lng]}
                radius={1200}
                pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.04, weight: 1, opacity: 0.3, dashArray: '8,4' }}
              />
            ))}
          </>
        )}

        {/* ── Capa: Eventos ── */}
        {showEvents && eventsWithCoords.map(event => (
          <Marker
            key={`ev_${event.id}`}
            position={[event.lat, event.lng]}
            icon={createEventIcon()}
          >
            <Popup maxWidth={260}>
              <div style={{ ...popupBase }}>
                <img
                  src={event.image} alt={event.title}
                  style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
                <div style={{ color: 'white', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{event.title}</div>
                <div style={{ color: '#a78bfa', fontSize: 11, marginBottom: 4 }}>
                  🗓 {event.schedule} · {event.time}
                </div>
                <div style={{ color: '#94a3b8', fontSize: 11, marginBottom: 6 }}>{event.venue}</div>
                <div style={{ display: 'flex', gap: 10, fontSize: 11 }}>
                  <span style={{ color: '#facc15' }}>⭐ {event.rating}</span>
                  <span style={{ color: '#34d399' }}>
                    {event.price === 0 ? '🆓 Gratis' : `💵 $${(event.price / 1000).toFixed(0)}k COP`}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* ── Capa: Lugares ── */}
        {showPlaces && (
          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={55}
            showCoverageOnHover={false}
            iconCreateFunction={(cluster) => {
              const count = cluster.getChildCount();
              const size = count < 10 ? 34 : count < 50 ? 42 : 50;
              return L.divIcon({
                html: `<div style="background:linear-gradient(135deg,#1d4ed8,#7c3aed);border:2px solid rgba(255,255,255,0.2);border-radius:50%;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:${count<100?13:11}px;box-shadow:0 4px 14px rgba(37,99,235,0.55);">${count}</div>`,
                iconSize: [size, size], iconAnchor: [size/2, size/2], className: '',
              });
            }}
          >
            {visiblePlaces.map(place => {
              const isFav = favorites.includes(place.id);
              return (
                <Marker key={place.id} position={[place.lat, place.lng]} icon={createPlaceIcon(place.category)}>
                  <Popup maxWidth={260}>
                    <div style={{ ...popupBase }}>
                      {place.image && (
                        <img
                          src={place.image} alt={place.name}
                          style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }}
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <div style={{ color: 'white', fontWeight: 700, fontSize: 14, flex: 1, paddingRight: 8 }}>{place.name}</div>
                        {user && (
                          <button
                            onClick={() => addToFavorites(place.id)}
                            style={{
                              background: isFav ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.06)',
                              border: `1px solid ${isFav ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`,
                              borderRadius: 8, padding: '4px 7px', cursor: 'pointer',
                              color: isFav ? '#f87171' : '#94a3b8', fontSize: 14, flexShrink: 0,
                            }}
                          >
                            {isFav ? '♥' : '♡'}
                          </button>
                        )}
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: 11, marginBottom: 8, lineHeight: 1.6 }}>
                        {(place.description || '').slice(0, 90)}{(place.description?.length || 0) > 90 ? '…' : ''}
                      </div>
                      <div style={{ display: 'flex', gap: 10, fontSize: 11, marginBottom: 8 }}>
                        <span style={{ color: '#facc15' }}>⭐ {place.rating}</span>
                        <span style={{ color: '#34d399' }}>{place.price === 0 ? '🆓 Gratis' : `💵 $${place.price}`}</span>
                        {place.openHours && <span style={{ color: '#818cf8' }}>🕐 {place.openHours}</span>}
                      </div>
                      <button
                        onClick={() => openPlaceDetail(place)}
                        style={{
                          width: '100%', padding: '7px 0', borderRadius: 8, border: 'none',
                          background: 'linear-gradient(90deg,#1d4ed8,#7c3aed)', color: 'white',
                          fontWeight: 700, fontSize: 12, cursor: 'pointer',
                        }}
                      >
                        Ver detalles →
                      </button>
                      {place.source === 'osm' && (
                        <div style={{ marginTop: 6, fontSize: 10, color: '#334155', textAlign: 'center' }}>Fuente: OpenStreetMap</div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        )}

        {/* ── Tu ubicación ── */}
        <Marker position={center} icon={createUserIcon()}>
          <Popup>
            <div style={{ ...popupBase, minWidth: 170 }}>
              <div style={{ fontWeight: 700, color: 'white', marginBottom: 4 }}>📍 Tu ubicación</div>
              <small style={{ color: geoError ? '#f87171' : '#64748b' }}>
                {geoError ? 'Ubicación aproximada — Cali' : `${center[0].toFixed(5)}, ${center[1].toFixed(5)}`}
              </small>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
