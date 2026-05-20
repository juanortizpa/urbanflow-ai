import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Music, Utensils, Dumbbell, Globe, MapPin, Clock,
  DollarSign, AlertTriangle, Search, Navigation, Star, CalendarPlus, X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CALI_EVENTS } from '../data/caliEvents';

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CALI_CENTER = [3.4516, -76.5325];

const CATEGORY_CONFIG = {
  music:   { label: 'Musica',      icon: Music,    color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
  food:    { label: 'Gastronomia', icon: Utensils,  color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  sports:  { label: 'Deportes',    icon: Dumbbell,  color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  culture: { label: 'Cultura',     icon: Globe,     color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  tourism: { label: 'Turismo',     icon: Navigation,color: '#f97316', bg: 'rgba(249,115,22,0.15)' },
};

const IMPACT_CONFIG = {
  low:    { label: 'Bajo',   color: '#22c55e' },
  medium: { label: 'Medio',  color: '#f59e0b' },
  high:   { label: 'Alto',   color: '#f97316' },
};

// Compute next occurrence text from schedule
function getNextOccurrence(schedule) {
  const today = new Date();
  const dow = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

  const scheduleLC = schedule.toLowerCase();
  if (scheduleLC.includes('domingo')) {
    const diff = (7 - dow) % 7 || 7;
    const d = new Date(today); d.setDate(today.getDate() + diff);
    return `${dayNames[0]} ${d.getDate()}/${d.getMonth() + 1}`;
  }
  if (scheduleLC.includes('sabado') || scheduleLC.includes('viernes y s')) {
    const diff = ((6 - dow) + 7) % 7 || 7;
    const d = new Date(today); d.setDate(today.getDate() + diff);
    return `${dayNames[6]} ${d.getDate()}/${d.getMonth() + 1}`;
  }
  if (scheduleLC.includes('viernes')) {
    const diff = ((5 - dow) + 7) % 7 || 7;
    const d = new Date(today); d.setDate(today.getDate() + diff);
    return `${dayNames[5]} ${d.getDate()}/${d.getMonth() + 1}`;
  }
  if (scheduleLC.includes('jueves')) {
    const diff = ((4 - dow) + 7) % 7 || 7;
    const d = new Date(today); d.setDate(today.getDate() + diff);
    return `${dayNames[4]} ${d.getDate()}/${d.getMonth() + 1}`;
  }
  if (scheduleLC.includes('martes')) {
    const diff = ((2 - dow) + 7) % 7 || 7;
    const d = new Date(today); d.setDate(today.getDate() + diff);
    return `${dayNames[2]} ${d.getDate()}/${d.getMonth() + 1}`;
  }
  return 'Esta semana';
}

function createEventIcon(category) {
  const cfg = CATEGORY_CONFIG[category] || { color: '#64748b' };
  return L.divIcon({
    html: `<div style="background:${cfg.color};border:3px solid white;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.5);font-size:13px;">📍</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -18],
    className: '',
  });
}

export default function Events() {
  const navigate = useNavigate();
  const { addToAgenda, user, showAlert } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [schedDate, setSchedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [schedTime, setSchedTime] = useState('20:00');
  const [schedNotes, setSchedNotes] = useState('');

  const handleAgendarEvent = (event) => {
    if (!user) { showAlert('Inicia sesión para agendar eventos', 'info'); return; }
    // Convert event to place-like object for agenda
    const placeProxy = {
      id: `event_${event.id}`,
      name: event.title,
      category: 'culture',
      image: event.image,
      rating: event.rating,
      price: event.price,
      lat: event.lat,
      lng: event.lng,
      description: event.description,
    };
    addToAgenda(placeProxy, schedDate, schedTime, schedNotes);
    showAlert(`"${event.title}" agregado a tu agenda`, 'success');
    setExpandedEvent(null);
    setSchedNotes('');
  };

  const filtered = useMemo(() => {
    let list = CALI_EVENTS;
    if (activeCategory !== 'all') list = list.filter(e => e.category === activeCategory);
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      list = list.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.tags.some(t => t.includes(q)) ||
        e.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCategory, searchQuery]);

  const handleGetRoute = (event) => {
    // Navigate to SmartRoutes with destination pre-filled via state
    navigate('/routes', { state: { destination: { name: event.venue, address: event.address, lat: event.lat, lng: event.lng } } });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="text-yellow-400" size={22} />
            Eventos en Cali
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Eventos recurrentes y actividades culturales de la ciudad</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)' }}>
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-yellow-300 text-xs font-medium">{CALI_EVENTS.length} eventos activos</span>
        </div>
      </div>

      {/* High traffic alert */}
      {CALI_EVENTS.some(e => e.trafficImpact === 'high') && (
        <div className="flex items-center gap-3 p-4 rounded-xl"
          style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)' }}>
          <AlertTriangle size={17} className="text-orange-400 flex-shrink-0" />
          <div>
            <p className="text-white font-semibold text-sm">Impacto en trafico esperado</p>
            <p className="text-orange-300 text-xs">
              {CALI_EVENTS.filter(e => e.trafficImpact === 'high').map(e => e.title).join(', ')} —
              considera rutas alternativas
            </p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Buscar eventos, venues, categorias..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="input-field pl-9 text-sm w-full md:w-80"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeCategory === 'all' ? 'bg-white/15 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
          }`}>
          Todos ({CALI_EVENTS.length})
        </button>
        {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => {
          const Icon = cfg.icon;
          const count = CALI_EVENTS.filter(e => e.category === key).length;
          return (
            <button key={key} onClick={() => setActiveCategory(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === key ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
              style={activeCategory === key
                ? { background: cfg.bg, border: `1px solid ${cfg.color}40` }
                : { background: 'rgba(255,255,255,0.05)' }}>
              <Icon size={14} style={{ color: activeCategory === key ? cfg.color : '#64748b' }} />
              {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Events grid */}
        <div className="lg:col-span-2">
          {filtered.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <p className="text-slate-400">No se encontraron eventos para tu busqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(event => {
                const cfg = CATEGORY_CONFIG[event.category];
                const Icon = cfg?.icon || Calendar;
                const impact = IMPACT_CONFIG[event.trafficImpact] || IMPACT_CONFIG.low;
                const nextDate = getNextOccurrence(event.schedule);

                return (
                  <div key={event.id} className="glass-card-hover overflow-hidden group flex flex-col">
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden flex-shrink-0">
                      <img src={event.image} alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent 55%)' }} />

                      {/* Category badge */}
                      <div className="absolute top-3 left-3">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                          style={{ background: cfg?.bg, color: cfg?.color, border: `1px solid ${cfg?.color}40` }}>
                          <Icon size={11} />
                          {cfg?.label}
                        </div>
                      </div>

                      {/* Traffic impact */}
                      <div className="absolute top-3 right-3">
                        <span className="text-xs px-2 py-1 rounded-lg font-medium"
                          style={{ background: `${impact.color}22`, color: impact.color, border: `1px solid ${impact.color}40` }}>
                          Trafico {impact.label}
                        </span>
                      </div>

                      {/* Title on image */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-bold text-sm line-clamp-2 leading-tight">{event.title}</h3>
                        <p className="text-slate-300 text-xs mt-0.5 flex items-center gap-1">
                          <MapPin size={10} /> {event.venue}
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-slate-400 text-xs mb-3 line-clamp-2 flex-1">{event.description}</p>

                      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Calendar size={11} className="text-blue-400" />
                          {event.schedule}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Clock size={11} className="text-cyan-400" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Star size={11} className="text-yellow-400" />
                          {event.rating} / 5.0
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign size={11} className="text-green-400" />
                          <span className={event.price === 0 ? 'text-green-400 font-semibold' : 'text-slate-300'}>
                            {event.price === 0 ? 'Gratis' : `$${event.price.toLocaleString('es-CO')}`}
                          </span>
                        </div>
                      </div>

                      {/* Next occurrence */}
                      <div className="flex items-center gap-1.5 mb-3 px-2.5 py-1.5 rounded-lg text-xs"
                        style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                        <Calendar size={11} className="text-blue-400" />
                        <span className="text-blue-300">Proxima fecha: <strong>{nextDate}</strong></span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button onClick={() => handleGetRoute(event)}
                          className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-xl font-medium transition-all"
                          style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }}
                          onMouseOver={e => e.currentTarget.style.background = 'rgba(59,130,246,0.25)'}
                          onMouseOut={e => e.currentTarget.style.background = 'rgba(59,130,246,0.15)'}>
                          <Navigation size={12} /> Como llegar
                        </button>
                        <button
                          onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                          className="flex items-center gap-1.5 text-xs py-2 px-3 rounded-xl font-medium transition-all"
                          style={{
                            background: expandedEvent === event.id ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.1)',
                            color: '#a78bfa',
                            border: '1px solid rgba(139,92,246,0.3)',
                          }}>
                          <CalendarPlus size={12} />
                          Agendar
                        </button>
                      </div>

                      {/* Inline scheduler */}
                      {expandedEvent === event.id && (
                        <div className="mt-3 p-3 rounded-xl animate-slide-up"
                          style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-white text-xs font-semibold flex items-center gap-1.5">
                              <CalendarPlus size={12} className="text-purple-400" /> Planifica tu asistencia
                            </p>
                            <button onClick={() => setExpandedEvent(null)} className="text-slate-600 hover:text-slate-400">
                              <X size={12} />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <div>
                              <label className="text-slate-500 text-[10px] mb-1 block">Fecha</label>
                              <input type="date" value={schedDate}
                                onChange={e => setSchedDate(e.target.value)}
                                min={new Date().toISOString().slice(0, 10)}
                                className="input-field h-8 text-xs py-1 w-full" />
                            </div>
                            <div>
                              <label className="text-slate-500 text-[10px] mb-1 block">Hora</label>
                              <input type="time" value={schedTime}
                                onChange={e => setSchedTime(e.target.value)}
                                className="input-field h-8 text-xs py-1 w-full" />
                            </div>
                          </div>
                          <input type="text" value={schedNotes}
                            onChange={e => setSchedNotes(e.target.value)}
                            placeholder="Notas (ej: ir con amigos...)"
                            className="input-field h-8 text-xs py-1 w-full mb-2" />
                          <button onClick={() => handleAgendarEvent(event)}
                            className="btn-primary w-full flex items-center justify-center gap-1.5 text-xs py-2">
                            <CalendarPlus size={12} /> Confirmar en agenda
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Map sidebar */}
        <div className="space-y-4">
          <div className="glass-card p-3">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <MapPin size={14} className="text-cyan-400" />
              Mapa de Eventos
            </h3>
            <div style={{ height: 380, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
              <MapContainer center={CALI_CENTER} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                {filtered.map(event => (
                  <Marker
                    key={event.id}
                    position={[event.lat, event.lng]}
                    icon={createEventIcon(event.category)}
                  >
                    <Popup>
                      <div style={{ background: '#0f172a', borderRadius: 8, padding: 10, color: 'white', minWidth: 180 }}>
                        <p style={{ fontWeight: 700, marginBottom: 4, fontSize: 13 }}>{event.title}</p>
                        <p style={{ color: '#94a3b8', fontSize: 11, marginBottom: 6 }}>{event.venue}</p>
                        <p style={{ color: '#60a5fa', fontSize: 11 }}>{event.time}</p>
                        <p style={{ color: '#22c55e', fontSize: 11 }}>
                          {event.price === 0 ? 'Gratis' : `$${event.price.toLocaleString('es-CO')}`}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Quick stats */}
          <div className="glass-card p-4">
            <h4 className="text-slate-400 text-xs font-medium mb-3">Esta semana en Cali</h4>
            <div className="space-y-2">
              {[
                { label: 'Eventos gratuitos', value: CALI_EVENTS.filter(e => e.price === 0).length, color: '#22c55e' },
                { label: 'Con musica en vivo', value: CALI_EVENTS.filter(e => e.tags.includes('live music') || e.category === 'music').length, color: '#8b5cf6' },
                { label: 'Aptos para familia', value: CALI_EVENTS.filter(e => e.tags.includes('family')).length, color: '#3b82f6' },
                { label: 'Alta demanda', value: CALI_EVENTS.filter(e => e.trafficImpact === 'high').length, color: '#f97316' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">{label}</span>
                  <span className="font-bold text-sm" style={{ color }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
