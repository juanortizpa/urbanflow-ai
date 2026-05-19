import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CITY_CENTER, places, routes } from '../data/mockData';
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

function createCustomIcon(category, isEmergency) {
  const emoji = categoryIcons[category] || '📍';
  const bg = isEmergency ? '#ef4444' : '#1e293b';
  const border = isEmergency ? '#fca5a5' : '#334155';
  return L.divIcon({
    html: `<div style="background:${bg};border:2px solid ${border};border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 4px 12px rgba(0,0,0,0.5);">${emoji}</div>`,
    iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -20], className: '',
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

export default function InteractiveMap({
  height = '500px', showTraffic = true, showPlaces = true,
  showRoutes = false, selectedPlace = null, focusCoords = null,
  filterCategory = 'all', showHeatmap = false,
}) {
  const { mapLayer, userCoords, geoLoading, geoError, liveTrafficZones, weatherLive, weatherLastUpdate } = useApp();
  const [selectedMarker, setSelectedMarker] = useState(null);

  const center = userCoords || CITY_CENTER;

  const visiblePlaces = places.filter(p =>
    filterCategory === 'all' || p.category === filterCategory
  );

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

      <MapContainer
        center={center}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          url={tileLayers[mapLayer] || tileLayers.standard}
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Centrar en ubicacion real cuando llega */}
        {userCoords && <MapController center={userCoords} zoom={15} />}
        {focusCoords && <MapController center={focusCoords} zoom={16} />}
        {selectedPlace && <MapController center={[selectedPlace.lat, selectedPlace.lng]} zoom={16} />}

        {/* Marcador de ubicacion real del usuario */}
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

        {/* Place markers */}
        {showPlaces && visiblePlaces.map(place => (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={createCustomIcon(place.category, place.isEmergency)}
            eventHandlers={{ click: () => setSelectedMarker(place) }}
          >
            <Popup maxWidth={240}>
              <div style={{ background: '#1e293b', borderRadius: 8, padding: 12, minWidth: 200 }}>
                <img src={place.image} alt={place.name}
                  style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }} />
                <div style={{ fontWeight: 700, color: 'white', marginBottom: 4 }}>{place.name}</div>
                <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 6 }}>{place.description}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#60a5fa', fontSize: 12 }}>
                  <span>⭐ {place.rating}</span>
                  <span>{place.price === 0 ? 'Gratis' : `$${place.price}`}</span>
                  <span>{place.openHours}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Traffic zones — datos en vivo, se actualizan cada 60 s */}
        {showTraffic && liveTrafficZones.map(zone => (
          <Circle
            key={zone.id}
            center={[zone.lat, zone.lng]}
            radius={350}
            pathOptions={{
              color: trafficColors[zone.level],
              fillColor: trafficColors[zone.level],
              fillOpacity: 0.15,
              weight: 2,
              opacity: 0.6,
            }}
          >
            <Popup>
              <div style={{ background: '#1e293b', borderRadius: 8, padding: 10, color: 'white' }}>
                <strong>{zone.name}</strong><br />
                <span style={{ color: trafficColors[zone.level], fontSize: 12 }}>
                  Congestion: {zone.congestion}%
                </span><br />
                <small style={{ color: '#94a3b8' }}>{zone.description}</small>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* Route lines */}
        {showRoutes && routes.map(route => {
          const startPlace = visiblePlaces[0];
          const endPlace = visiblePlaces[visiblePlaces.length - 1];
          return (
            <Polyline
              key={route.id}
              positions={[CITY_CENTER, [CITY_CENTER[0] + 0.01, CITY_CENTER[1] + 0.01]]}
              pathOptions={{ color: route.color, weight: 4, opacity: 0.8, dashArray: '10, 5' }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
