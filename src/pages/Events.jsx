import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Music, Utensils, Dumbbell, Globe, MapPin, Clock,
  DollarSign, AlertTriangle, Search, Navigation, Star, ChevronRight,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CALI_CENTER = [3.4516, -76.5325];

const CALI_EVENTS = [
  {
    id: 1, title: 'Noche de Salsa en Topa Tolondra', category: 'music',
    venue: 'Topa Tolondra', address: 'Av. 5 Norte #23-52, Cali',
    lat: 3.4712, lng: -76.5298,
    schedule: 'Jueves a Domingo', time: '9:00 PM - 3:00 AM',
    price: 20000, currency: 'COP', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&h=250&q=80',
    description: 'La mejor noche de salsa calena con orquesta en vivo, un ambiente inigualable y el mejor ron colombiano.',
    tags: ['salsa', 'nightlife', 'live music', 'dancing'], rating: 4.9,
    isRecurring: true, trafficImpact: 'medium',
  },
  {
    id: 2, title: 'Mercado Gastronomico Granada', category: 'food',
    venue: 'Parque de Granada', address: 'Carrera 35 #3-41, Cali',
    lat: 3.4662, lng: -76.5315,
    schedule: 'Sabados y Domingos', time: '10:00 AM - 6:00 PM',
    price: 0, currency: 'COP', image: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=400&h=250&q=80',
    description: 'El mercado de artesanias y gastronomia mas completo de Cali, con mas de 80 emprendedores locales y musica en vivo.',
    tags: ['food', 'market', 'artisan', 'family', 'free'], rating: 4.7,
    isRecurring: true, trafficImpact: 'low',
  },
  {
    id: 3, title: 'Festival de Cine al Aire Libre', category: 'culture',
    venue: 'Parque del Perro', address: 'El Penon, Cali',
    lat: 3.4681, lng: -76.5334,
    schedule: 'Viernes', time: '7:00 PM - 10:00 PM',
    price: 0, currency: 'COP', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&h=250&q=80',
    description: 'Proyecciones gratuitas de cine latinoamericano bajo las estrellas, con picnic y food trucks alrededor.',
    tags: ['culture', 'cinema', 'outdoor', 'free', 'family'], rating: 4.6,
    isRecurring: true, trafficImpact: 'low',
  },
  {
    id: 4, title: 'Clase Abierta de Salsa — Swing Latino', category: 'sports',
    venue: 'Swing Latino Dance Academy', address: 'Calle 5 #38-71, Cali',
    lat: 3.4523, lng: -76.5378,
    schedule: 'Martes y Jueves', time: '6:00 PM - 8:00 PM',
    price: 15000, currency: 'COP', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&h=250&q=80',
    description: 'Clases abiertas para todos los niveles en la academia de salsa mas reconocida de Cali. Sin experiencia previa necesaria.',
    tags: ['salsa', 'dance', 'sports', 'learning'], rating: 4.8,
    isRecurring: true, trafficImpact: 'low',
  },
  {
    id: 5, title: 'Tour Nocturno por las Salsotecas de Cali', category: 'tourism',
    venue: 'Juanchito, Cali', address: 'Via Cali-Candelaria Km 3',
    lat: 3.4350, lng: -76.4680,
    schedule: 'Viernes y Sabados', time: '8:00 PM - 2:00 AM',
    price: 35000, currency: 'COP', image: 'https://images.unsplash.com/photo-1543007630-9359431db9f3?auto=format&fit=crop&w=400&h=250&q=80',
    description: 'Recorre las salsotecas mas iconicas de Juanchito, la meca mundial de la salsa, con guia local incluido.',
    tags: ['salsa', 'tourism', 'nightlife', 'culture'], rating: 4.8,
    isRecurring: true, trafficImpact: 'high',
  },
  {
    id: 6, title: 'Ciclovia Dominical de Cali', category: 'sports',
    venue: 'Av. Roosevelt y conexiones', address: 'Cali — Av. Roosevelt',
    lat: 3.4516, lng: -76.5325,
    schedule: 'Domingos', time: '7:00 AM - 1:00 PM',
    price: 0, currency: 'COP', image: 'https://images.unsplash.com/photo-1541625602538-5f66ab6da7de?auto=format&fit=crop&w=400&h=250&q=80',
    description: 'Mas de 40km de vias habilitadas exclusivamente para ciclistas, peatones y patinadores todos los domingos.',
    tags: ['sports', 'cycling', 'outdoor', 'free', 'family', 'health'], rating: 4.9,
    isRecurring: true, trafficImpact: 'low',
  },
  {
    id: 7, title: 'Exposicion Arte Contemporaneo — La Tertulia', category: 'culture',
    venue: 'Museo de Arte Moderno La Tertulia', address: 'Av. Colombia #5-105 Oeste, Cali',
    lat: 3.4616, lng: -76.5485,
    schedule: 'Martes a Domingo', time: '9:00 AM - 6:00 PM',
    price: 5000, currency: 'COP', image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=400&h=250&q=80',
    description: 'Exposicion permanente del museo de arte mas importante del suroccidente colombiano mas exposiciones temporales rotativas.',
    tags: ['culture', 'art', 'museum', 'history', 'education'], rating: 4.5,
    isRecurring: true, trafficImpact: 'low',
  },
  {
    id: 8, title: 'Feria Gastronomica Sabores del Valle', category: 'food',
    venue: 'Centro Comercial Chipichape', address: 'Calle 38 Norte, Cali',
    lat: 3.4790, lng: -76.5258,
    schedule: 'Primer fin de semana del mes', time: '11:00 AM - 8:00 PM',
    price: 0, currency: 'COP', image: 'https://images.unsplash.com/photo-1555939594-7d08fd45dc0e?auto=format&fit=crop&w=400&h=250&q=80',
    description: 'Feria mensual con los mejores restaurantes y emprendedores de comida calena ofreciendo muestras y platos especiales.',
    tags: ['food', 'culture', 'family', 'free', 'local'], rating: 4.6,
    isRecurring: true, trafficImpact: 'medium',
  },,
  {
    id: 9, title: 'Festival de Salsa de Cali — Ensayos Abiertos', category: 'music',
    venue: 'Plaza de Caicedo', address: 'Carrera 4 #11-29, Centro, Cali',
    lat: 3.4508, lng: -76.5329,
    schedule: 'Diciembre', time: '4:00 PM - 10:00 PM',
    price: 0, currency: 'COP',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=400&h=250&q=80',
    description: 'Los ensayos y presentaciones previas al Festival Mundial de Salsa de Cali, con participación de academias y grupos de toda la ciudad.',
    tags: ['salsa', 'festival', 'free', 'culture', 'dancing'], rating: 4.9,
    isRecurring: false, trafficImpact: 'high',
  },
  {
    id: 10, title: 'Feria de Cali — Cabalgata y Salsaódromo', category: 'culture',
    venue: 'Av. 6N y Centro de Cali', address: 'Avenida 6 Norte, Cali',
    lat: 3.4780, lng: -76.5270,
    schedule: 'Del 25 al 30 de Diciembre', time: 'Todo el día',
    price: 0, currency: 'COP',
    image: 'https://images.unsplash.com/photo-1580747025283-a33e34826d5f?auto=format&fit=crop&w=400&h=250&q=80',
    description: 'La Feria de Cali es la celebración más grande de la ciudad, con la Cabalgata del 28, el Salsaódromo del 29 y conciertos gratuitos en el Estadio Olímpico.',
    tags: ['feria', 'salsa', 'culture', 'free', 'festival', 'family'], rating: 5.0,
    isRecurring: true, trafficImpact: 'high',
  },
  {
    id: 11, title: 'Petronio Álvarez — Festival de Música del Pacífico', category: 'music',
    venue: 'Estadio Deportivo Cali', address: 'Av. Cañasgordas #33-25, Cali',
    lat: 3.4200, lng: -76.5550,
    schedule: 'Agosto', time: '4:00 PM - 2:00 AM',
    price: 40000, currency: 'COP',
    image: 'https://images.unsplash.com/photo-1501386761578-eaa54b2b62d7?auto=format&fit=crop&w=400&h=250&q=80',
    description: 'El festival más importante de música y cultura afropacífica de Colombia, con marimba, chirimía, violines caucanos y gastronomía del Pacífico.',
    tags: ['pacifico', 'afro', 'culture', 'music', 'festival'], rating: 4.9,
    isRecurring: true, trafficImpact: 'high',
  },
  {
    id: 12, title: 'Tarde en el Zoológico de Cali', category: 'tourism',
    venue: 'Zoológico de Cali', address: 'Carrera 2 Oeste #14-97, Cali',
    lat: 3.4480, lng: -76.5520,
    schedule: 'Martes a Domingo', time: '9:00 AM - 5:00 PM',
    price: 25000, currency: 'COP',
    image: 'https://images.unsplash.com/photo-1503066211613-c17ebc9daef0?auto=format&fit=crop&w=400&h=250&q=80',
    description: 'El Zoológico de Cali es uno de los mejores de América Latina con más de 4.500 animales de 250 especies. Orillas del Río Cali en el barrio Santa Teresita.',
    tags: ['zoo', 'family', 'nature', 'animals', 'tourism', 'outdoor'], rating: 4.8,
    isRecurring: true, trafficImpact: 'low',
  },
];

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
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
                        <button className="flex items-center gap-1 text-xs py-2 px-3 rounded-xl font-medium text-slate-400 hover:text-white transition-colors"
                          style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <ChevronRight size={13} />
                        </button>
                      </div>
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
