import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, Marker, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Navigation, Clock, DollarSign, MapPin, Bus, Bike, Car, User,
  Search, X, ChevronRight, RotateCw, ArrowRight, ArrowLeft, ArrowUp,
  AlertCircle, Locate,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { searchAddress, reverseGeocode } from '../utils/nominatim';
import { getRoute, formatDistance, formatDuration, estimateCost } from '../utils/osrm';

const TRANSPORT_MODES = [
  { id: 'bus', label: 'MIO Bus', icon: Bus, color: '#3b82f6' },
  { id: 'taxi', label: 'Taxi', icon: Car, color: '#f59e0b' },
  { id: 'bike', label: 'Bicicleta', icon: Bike, color: '#10b981' },
  { id: 'walk', label: 'A pie', icon: User, color: '#a855f7' },
];

const CALI_CENTER = [3.4516, -76.5325];

// Fix leaflet default icon
function fixLeafletIcons() {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

function createPinIcon(color, label) {
  return L.divIcon({
    html: `<div style="background:${color};border:3px solid white;border-radius:50% 50% 50% 0;width:32px;height:32px;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;">
      <span style="transform:rotate(45deg);color:white;font-size:11px;font-weight:700;">${label}</span>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -36],
    className: '',
  });
}

function MapController({ routes, origin, destination }) {
  const map = useMap();
  useEffect(() => {
    if (routes && routes.length > 0 && routes[0].geometry.length > 0) {
      const allCoords = routes[0].geometry;
      const bounds = L.latLngBounds(allCoords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16, animate: true, duration: 1 });
    }
  }, [routes, map]);
  return null;
}

function ManeuverIcon({ type, modifier }) {
  if (type === 'arrive') return <MapPin size={14} className="text-green-400 flex-shrink-0" />;
  if (type === 'depart') return <Navigation size={14} className="text-blue-400 flex-shrink-0" />;
  if (modifier === 'right' || modifier === 'sharp right') return <ArrowRight size={14} className="text-yellow-400 flex-shrink-0" />;
  if (modifier === 'left' || modifier === 'sharp left') return <ArrowLeft size={14} className="text-yellow-400 flex-shrink-0" />;
  if (type === 'roundabout') return <RotateCw size={14} className="text-cyan-400 flex-shrink-0" />;
  return <ArrowUp size={14} className="text-slate-400 flex-shrink-0" />;
}

function AddressInput({ label, value, placeholder, icon: Icon, iconColor, suggestions, onQueryChange, onSelect, onClear, loading }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (suggestions.length > 0) setOpen(true);
    else setOpen(false);
  }, [suggestions]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="text-slate-400 text-xs font-medium mb-1.5 block">{label}</label>
      <div className="relative flex items-center">
        <Icon size={14} className="absolute left-3 flex-shrink-0" style={{ color: iconColor }} />
        <input
          type="text"
          value={value}
          onChange={e => onQueryChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="input-field pl-8 pr-8 text-sm w-full"
          style={{ paddingRight: value ? '2rem' : '0.75rem' }}
          autoComplete="off"
        />
        {loading && (
          <div className="absolute right-3 w-3.5 h-3.5 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
        )}
        {!loading && value && (
          <button onClick={onClear} className="absolute right-3 text-slate-500 hover:text-white transition-colors">
            <X size={13} />
          </button>
        )}
      </div>
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 rounded-xl overflow-hidden shadow-2xl"
          style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', maxHeight: 240, overflowY: 'auto' }}>
          {suggestions.map(s => (
            <button key={s.id} onClick={() => { onSelect(s); setOpen(false); }}
              className="w-full flex items-start gap-2.5 px-3 py-2.5 hover:bg-white/8 transition-colors text-left">
              <MapPin size={13} className="text-slate-500 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{s.name}</p>
                <p className="text-slate-500 text-xs truncate">{s.fullName.split(',').slice(1, 3).join(',')}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function useDebounce(fn, delay) {
  const timer = useRef(null);
  return useCallback((...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}

export default function SmartRoutes() {
  const { userCoords } = useApp();
  const location = useLocation();

  // Accept destination pre-filled from Events page
  const incomingDest = location.state?.destination || null;

  // Input state
  const [originQuery, setOriginQuery] = useState('');
  const [destQuery, setDestQuery] = useState(incomingDest?.name || '');
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [originSelected, setOriginSelected] = useState(null);
  const [destSelected, setDestSelected] = useState(incomingDest || null);
  const [originLoading, setOriginLoading] = useState(false);
  const [destLoading, setDestLoading] = useState(false);

  // Route state
  const [routes, setRoutes] = useState([]);
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);
  const [mode, setMode] = useState('bus');
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState('');
  const [showSteps, setShowSteps] = useState(false);

  // Fix leaflet icons on mount
  useEffect(() => { fixLeafletIcons(); }, []);

  // Debounced address search
  const searchOrigin = useCallback(async (q) => {
    if (!q || q.length < 3) { setOriginSuggestions([]); return; }
    setOriginLoading(true);
    const results = await searchAddress(q);
    setOriginSuggestions(results);
    setOriginLoading(false);
  }, []);

  const searchDest = useCallback(async (q) => {
    if (!q || q.length < 3) { setDestSuggestions([]); return; }
    setDestLoading(true);
    const results = await searchAddress(q);
    setDestSuggestions(results);
    setDestLoading(false);
  }, []);

  const debouncedOriginSearch = useDebounce(searchOrigin, 300);
  const debouncedDestSearch = useDebounce(searchDest, 300);

  const handleOriginQuery = (q) => {
    setOriginQuery(q);
    setOriginSelected(null);
    debouncedOriginSearch(q);
  };

  const handleDestQuery = (q) => {
    setDestQuery(q);
    setDestSelected(null);
    debouncedDestSearch(q);
  };

  const handleOriginSelect = (s) => {
    setOriginSelected(s);
    setOriginQuery(s.name);
    setOriginSuggestions([]);
  };

  const handleDestSelect = (s) => {
    setDestSelected(s);
    setDestQuery(s.name);
    setDestSuggestions([]);
  };

  // Use my location
  const handleUseMyLocation = async () => {
    if (!userCoords) {
      setRouteError('No se pudo obtener tu ubicacion. Activa el GPS.');
      return;
    }
    const [lat, lng] = userCoords;
    setOriginLoading(true);
    const name = await reverseGeocode(lat, lng);
    setOriginSelected({ lat, lng, name });
    setOriginQuery(name);
    setOriginSuggestions([]);
    setOriginLoading(false);
  };

  // Calculate route
  const handleCalculate = async () => {
    if (!originSelected || !destSelected) {
      setRouteError('Selecciona un origen y destino de las sugerencias.');
      return;
    }
    if (originSelected.lat === destSelected.lat && originSelected.lng === destSelected.lng) {
      setRouteError('El origen y destino son el mismo lugar.');
      return;
    }
    setRouteLoading(true);
    setRouteError('');
    setRoutes([]);
    setSelectedRouteIdx(0);
    setShowSteps(false);
    try {
      const result = await getRoute(
        { lat: originSelected.lat, lng: originSelected.lng },
        { lat: destSelected.lat, lng: destSelected.lng },
        mode
      );
      setRoutes(result);
    } catch (err) {
      setRouteError(err.message || 'No se pudo calcular la ruta. Intenta de nuevo.');
    } finally {
      setRouteLoading(false);
    }
  };

  const selectedRoute = routes[selectedRouteIdx];
  const currentMode = TRANSPORT_MODES.find(m => m.id === mode);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">SmartFlow — Rutas Inteligentes</h1>
        <p className="text-slate-400 text-sm mt-0.5">Busqueda real de direcciones + rutas con indicaciones paso a paso</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left panel */}
        <div className="space-y-4">
          {/* Route planner */}
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Navigation size={15} className="text-cyan-400" />
              Planificar Ruta
            </h3>

            <div className="space-y-3">
              {/* Origin */}
              <div>
                <AddressInput
                  label="Origen"
                  value={originQuery}
                  placeholder="Busca una direccion en Cali..."
                  icon={MapPin}
                  iconColor="#3b82f6"
                  suggestions={originSuggestions}
                  onQueryChange={handleOriginQuery}
                  onSelect={handleOriginSelect}
                  onClear={() => { setOriginQuery(''); setOriginSelected(null); setOriginSuggestions([]); }}
                  loading={originLoading}
                />
                <button onClick={handleUseMyLocation}
                  className="mt-2 flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  <Locate size={12} /> Usar mi ubicacion actual
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center py-1">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-px h-3 bg-slate-700" />
                  <ChevronRight size={14} className="text-slate-600 rotate-90" />
                  <div className="w-px h-3 bg-slate-700" />
                </div>
              </div>

              {/* Destination */}
              <AddressInput
                label="Destino"
                value={destQuery}
                placeholder="Busca tu destino en Cali..."
                icon={MapPin}
                iconColor="#06b6d4"
                suggestions={destSuggestions}
                onQueryChange={handleDestQuery}
                onSelect={handleDestSelect}
                onClear={() => { setDestQuery(''); setDestSelected(null); setDestSuggestions([]); }}
                loading={destLoading}
              />
            </div>

            {/* Transport mode */}
            <div className="mt-4">
              <label className="text-slate-400 text-xs font-medium mb-2 block">Modo de transporte</label>
              <div className="grid grid-cols-4 gap-1.5">
                {TRANSPORT_MODES.map(({ id, label, icon: Icon, color }) => (
                  <button key={id} onClick={() => setMode(id)}
                    className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl transition-all text-xs font-medium ${
                      mode === id ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                    style={mode === id
                      ? { background: `${color}22`, border: `1px solid ${color}55` }
                      : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }
                    }>
                    <Icon size={16} style={{ color: mode === id ? color : '#64748b' }} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {routeError && (
              <div className="mt-3 flex items-start gap-2 p-3 rounded-xl text-xs"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                <AlertCircle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-red-300">{routeError}</span>
              </div>
            )}

            {/* Calculate button */}
            <button onClick={handleCalculate}
              disabled={routeLoading || !originSelected || !destSelected}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-4">
              {routeLoading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Calculando ruta...</>
              ) : (
                <><Search size={15} /> Calcular Ruta</>
              )}
            </button>
          </div>

          {/* Route alternatives */}
          {routes.length > 1 && (
            <div className="glass-card p-4">
              <h4 className="text-slate-400 text-xs font-medium mb-2">Rutas disponibles</h4>
              <div className="space-y-2">
                {routes.map((r, i) => (
                  <button key={r.id} onClick={() => setSelectedRouteIdx(i)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-sm ${
                      selectedRouteIdx === i ? 'bg-blue-500/15 border border-blue-500/35' : 'bg-white/4 border border-white/6 hover:bg-white/8'
                    }`}>
                    <span className="text-white font-medium">{i === 0 ? 'Ruta principal' : `Alternativa ${i}`}</span>
                    <div className="flex gap-3 text-xs">
                      <span className="text-slate-400">{formatDistance(r.distance)}</span>
                      <span className="text-cyan-400">{formatDuration(r.duration)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Route summary */}
          {selectedRoute && (
            <div className="glass-card p-4">
              <h4 className="text-slate-400 text-xs font-medium mb-3">Resumen de ruta</h4>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { label: 'Distancia', value: formatDistance(selectedRoute.distance), icon: MapPin, color: currentMode.color },
                  { label: 'Tiempo', value: formatDuration(selectedRoute.duration), icon: Clock, color: '#06b6d4' },
                  { label: 'Costo', value: estimateCost(selectedRoute.distance, mode) === 0 ? 'Gratis' : `$${estimateCost(selectedRoute.distance, mode).toLocaleString('es-CO')}`, icon: DollarSign, color: '#10b981' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="text-center p-2.5 rounded-xl"
                    style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
                    <Icon size={15} style={{ color }} className="mx-auto mb-1" />
                    <div className="text-white text-xs font-bold leading-tight">{value}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowSteps(s => !s)}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                <ChevronRight size={12} className={`transition-transform ${showSteps ? 'rotate-90' : ''}`} />
                {showSteps ? 'Ocultar' : 'Ver'} indicaciones paso a paso ({selectedRoute.steps.length})
              </button>
            </div>
          )}

          {/* Step-by-step */}
          {showSteps && selectedRoute && (
            <div className="glass-card p-4 max-h-72 overflow-y-auto">
              <h4 className="text-slate-400 text-xs font-medium mb-3">Indicaciones</h4>
              <div className="space-y-2">
                {selectedRoute.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-2.5 py-1.5 border-b border-white/4 last:border-0">
                    <ManeuverIcon type={step.type} modifier={step.modifier} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium">{step.instruction}</p>
                      {step.name && step.name !== 'Via sin nombre' && (
                        <p className="text-slate-500 text-xs truncate">{step.name}</p>
                      )}
                    </div>
                    <span className="text-slate-500 text-xs flex-shrink-0">{formatDistance(step.distance)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="lg:col-span-2">
          <div style={{ height: 580, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
            <MapContainer
              center={CALI_CENTER}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              zoomControl={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

              {/* Fit map to route */}
              {routes.length > 0 && <MapController routes={routes} />}

              {/* Route polylines */}
              {routes.map((r, i) => (
                <Polyline
                  key={r.id}
                  positions={r.geometry}
                  pathOptions={{
                    color: i === 0 ? (selectedRouteIdx === i ? currentMode.color : '#3b82f6') : '#64748b',
                    weight: i === selectedRouteIdx ? 6 : 4,
                    opacity: i === selectedRouteIdx ? 0.9 : 0.45,
                    lineCap: 'round',
                    lineJoin: 'round',
                  }}
                  eventHandlers={{ click: () => setSelectedRouteIdx(i) }}
                />
              ))}

              {/* Origin marker */}
              {originSelected && (
                <Marker
                  position={[originSelected.lat, originSelected.lng]}
                  icon={createPinIcon('#22c55e', 'A')}
                >
                  <Popup>
                    <div style={{ background: '#0f172a', borderRadius: 8, padding: 10, color: 'white', minWidth: 160 }}>
                      <div style={{ fontWeight: 700, color: '#22c55e', marginBottom: 4 }}>Origen</div>
                      <small style={{ color: '#94a3b8' }}>{originSelected.name}</small>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Destination marker */}
              {destSelected && (
                <Marker
                  position={[destSelected.lat, destSelected.lng]}
                  icon={createPinIcon('#ef4444', 'B')}
                >
                  <Popup>
                    <div style={{ background: '#0f172a', borderRadius: 8, padding: 10, color: 'white', minWidth: 160 }}>
                      <div style={{ fontWeight: 700, color: '#ef4444', marginBottom: 4 }}>Destino</div>
                      <small style={{ color: '#94a3b8' }}>{destSelected.name}</small>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>

            {/* Map overlay hint */}
            {!originSelected && !destSelected && (
              <div style={{
                position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
                padding: '10px 18px', zIndex: 1000, whiteSpace: 'nowrap',
              }}>
                <p className="text-slate-300 text-sm">Busca un origen y destino para ver la ruta</p>
              </div>
            )}

            {/* Loading overlay */}
            {routeLoading && (
              <div style={{
                position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
              }}>
                <div style={{
                  background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 16, padding: '20px 32px', textAlign: 'center',
                }}>
                  <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-400 rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-white text-sm font-medium">Calculando la mejor ruta...</p>
                  <p className="text-slate-500 text-xs mt-1">Conectando con OSRM</p>
                </div>
              </div>
            )}
          </div>

          {/* Route info strip */}
          {selectedRoute && (
            <div className="mt-3 glass-card p-3 flex items-center gap-4 flex-wrap animate-slide-up">
              <div className="flex items-center gap-2">
                {(() => { const Icon = currentMode.icon; return <Icon size={16} style={{ color: currentMode.color }} />; })()}
                <span className="text-white text-sm font-semibold">{currentMode.label}</span>
              </div>
              <div className="h-4 w-px bg-slate-700" />
              <div className="flex items-center gap-1.5 text-sm">
                <MapPin size={13} className="text-slate-500" />
                <span className="text-slate-300">{formatDistance(selectedRoute.distance)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <Clock size={13} className="text-slate-500" />
                <span className="text-slate-300">{formatDuration(selectedRoute.duration)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <DollarSign size={13} className="text-slate-500" />
                <span className="text-green-400 font-medium">
                  {estimateCost(selectedRoute.distance, mode) === 0
                    ? 'Gratis'
                    : `$${estimateCost(selectedRoute.distance, mode).toLocaleString('es-CO')} COP`}
                </span>
              </div>
              <div className="ml-auto">
                <span className="text-xs px-2 py-1 rounded-lg font-medium"
                  style={{ background: `${currentMode.color}20`, color: currentMode.color, border: `1px solid ${currentMode.color}40` }}>
                  {selectedRoute.steps.length} pasos
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
