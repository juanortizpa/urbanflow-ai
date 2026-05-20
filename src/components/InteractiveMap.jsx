import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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

function createCustomIcon(category, isEmergency) {
  const emoji = categoryIcons[category] || '📍';
  const color = isEmergency ? '#ef4444' : (categoryColors[category] || '#1e293b');
  const bg = isEmergency ? '#ef4444' : '#1e293b';
  const border = isEmergency ? '#fca5a5' : color;
  return L.divIcon({
    html: `<div style="background:${bg};border:2px solid ${border};border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.5);">${emoji}</div>`,
    iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -18], className: '',
  });
}

function createUserIcon() {
  return L.divIcon({
    html: `
      <div style="position:relative;width:20px;height:20px;">
        <div style="position:absolute;inset:0;background:rgba(59,130,246,0.25);border-radius:50%;animation:userPulse 2s infinite;transform:scale(2.5);"></div>
        <div style="position:relative;background:linear-gradient(135deg,#2563eb,#06b6d4);border:3px solid white;border-radius:50%;width:20px;height:20px;box-shadow:0 0 20px rgba(59,130,246,0.8);z-index:1;"></div>
      </div>
      <style>@keyframes userPulse{0%,100%{opacity:0.6;transform:scale(2.5)}50%{opacity:0;transform:scale(3.5)}}</style>
    `,
    iconSize: [20, 20], iconAnchor: [10, 10], className: '',
  });
}

const trafficColors = { low: '#22c55e', medium: '#f59e0b', high: '#f97316', critical: '#ef4444' };

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom || 14, { duration: 1.5 });
  }, [center, map, zoom]);
  return null;
}

// Cali bounding box para limitar el mapa
const CALI_BOUNDS = [[3.28, -76.65], [3.58, -76.43]];

export default function InteractiveMap({
  height = '500px', showTraffic = true, showPlaces = true,
  showRoutes = false, selectedPlace = null, focusCoords = null,
  filterCategory = 'all', showHeatmap = false,
}) {
  const { mapLayer, userCoords, geoLoading, geoError, liveTrafficZones, weatherLive, weatherLastUpdate, places } = useApp();

  const center = userCoords || CITY_CENTER;

  // Filtrar lugares: solo los que tienen coordenadas validas dentro de Cali
  const visiblePlaces = places.filter(p => {
    if (!p.lat || !p.lng) return false;
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    // Limitar a bounding box de Cali
    return p.lat >= 3.28 && p.lat <= 3.58 && p.lng >= -76.65 && p.lng <= -76.43;
  });

  const tileLayers = {
    standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  };

  return (
    <div style={{ height, borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
      {/* Geo status badge */}
      <div style={{
        position: 'absolute', top: 10, left: 10, zIndex: 1000,
        background: geoLoading ? 'rgba(245,158,11,0.9)' : geoError ? 'rgba(239,68,68,0.9)' : 'rgba(34,197,94,0.9)',
        color: 'white', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
        backdropFilter: 'blur(10px)',
      }}>
        {geoLoading ? '📡 Obteniendo ubicación...' : geoError ? '📍 Cali, Colombia' : '📍 Tu ubicación real'}
      </div>

      {/* Live data badge */}
      <div style={{
        position: 'absolute', top: 42, left: 10, zIndex: 1000,
        background: weatherLive ? 'rgba(16,185,129,0.9)' : 'rgba(100,116,139,0.85)',
        color: 'white', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
        backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: 5,
      }}>
        <span style={{
          display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
          background: weatherLive ? '#fff' : '#94a3b8',
          boxShadow: weatherLive ? '0 0 6px #fff' : 'none',
          animation: weatherLive ? 'livePulse 1.5s infinite' : 'none',
        }} />
        {weatherLive ? `EN VIVO · ${weatherLastUpdate}` : 'Conectando...'}
        <style>{`@keyframes livePulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
      </div>

      {/* Places count badge */}
      {showPlaces && (
        <div style={{
          position: 'absolute', top: 74, left: 10, zIndex: 1000,
          background: 'rgba(59,130,246,0.85)',
          color: 'white', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
          backdropFilter: 'blur(10px)',
        }}>
          📌 {visiblePlaces.length} lugares en Cali
        </div>
      )}

      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        maxBounds={CALI_BOUNDS}
        maxBoundsViscosity={0.8}
      >
        <TileLayer
          url={tileLayers[mapLayer] || tileLayers.standard}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Centrar en ubicacion real cuando llega */}
        {userCoords && <MapController center={userCoords} zoom={15} />}
        {focusCoords && <MapController center={focusCoords} zoom={16} />}
        {selectedPlace && <MapController center={[selectedPlace.lat, selectedPlace.lng]} zoom={16} />}

        {/* Marcador de ubicacion del usuario */}
        <Marker position={center} icon={createUserIcon()}>
          <Popup>
            <div style={{ background: '#1e293b', borderRadius: 8, padding: 10, color: 'white', minWidth: 160 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>📍 Tu ubicación</div>
              {geoError
                ? <small style={{ color: '#f87171' }}>{geoError}</small>
                : <small style={{ color: '#94a3b8' }}>
                    {center[0].toFixed(5)}, {center[1].toFixed(5)}
                  </small>
              }
            </div>
          </Popup>
        </Marker>

        {/* Place markers con clustering automatico */}
        {showPlaces && (
          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={60}
            showCoverageOnHover={false}
            iconCreateFunction={(cluster) => {
              const count = cluster.getChildCount();
              const size = count < 10 ? 36 : count < 50 ? 42 : 50;
              return L.divIcon({
                html: `<div style="background:linear-gradient(135deg,#2563eb,#7c3aed);border:2px solid rgba(255,255,255,0.3);border-radius:50%;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:${count<100?13:11}px;box-shadow:0 4px 12px rgba(37,99,235,0.5);">${count}</div>`,
                iconSize: [size, size], iconAnchor: [size/2, size/2], className: '',
              });
            }}
          >
            {visiblePlaces.map(place => (
              <Marker
                key={place.id}
                position={[place.lat, place.lng]}
                icon={createCustomIcon(place.category, place.isEmergency)}
              >
                <Popup maxWidth={240}>
                  <div style={{ background: '#1e293b', borderRadius: 8, padding: 12, minWidth: 200 }}>
                    {place.image && (
                      <img src={place.image} alt={place.name}
                        style={{ width: '100%', height: 75, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }}
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <div style={{ fontWeight: 700, color: 'white', marginBottom: 3, fontSize: 14 }}>{place.name}</div>
                    <div style={{ color: '#94a3b8', fontSize: 11, marginBottom: 6, lineHeight: 1.4 }}>
                      {(place.description || '').slice(0, 80)}{place.description?.length > 80 ? '…' : ''}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#60a5fa', fontSize: 11 }}>
                      <span>⭐ {place.rating}</span>
                      <span style={{ color: '#34d399' }}>{place.price === 0 ? 'Gratis' : `$${place.price}`}</span>
                      <span style={{ color: '#a78bfa' }}>{place.openHours || ''}</span>
                    </div>
                    {place.source === 'osm' && (
                      <div style={{ marginTop: 4, fontSize: 10, color: '#64748b' }}>Fuente: OpenStreetMap</div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        )}

        {/* Zonas de trafico en vivo — 28 zonas cubriendo toda Cali */}
        {showTraffic && liveTrafficZones.map(zone => (
          <Circle
            key={zone.id}
            center={[zone.lat, zone.lng]}
            radius={400}
            pathOptions={{
              color: trafficColors[zone.level],
              fillColor: trafficColors[zone.level],
              fillOpacity: 0.12,
              weight: 2,
              opacity: 0.5,
            }}
          >
            <Popup>
              <div style={{ background: '#1e293b', borderRadius: 8, padding: 10, color: 'white' }}>
                <strong style={{ color: trafficColors[zone.level] }}>{zone.name}</strong><br />
                <span style={{ color: trafficColors[zone.level], fontSize: 12 }}>
                  Congestión: {zone.congestion}%
                </span><br />
                <small style={{ color: '#94a3b8' }}>{zone.description}</small>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* Route lines */}
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
