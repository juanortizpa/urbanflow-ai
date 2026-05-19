import { useState } from 'react';
import { Calendar, Music, Utensils, Dumbbell, Code, MapPin, Users, Clock, DollarSign, AlertTriangle } from 'lucide-react';
import { events } from '../data/mockData';

const categoryConfig = {
  music: { label: 'Musica', icon: Music, color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
  food: { label: 'Gastronomia', icon: Utensils, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  sports: { label: 'Deportes', icon: Dumbbell, color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  tech: { label: 'Tecnologia', icon: Code, color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
};

const impactConfig = {
  low: { label: 'Bajo', color: '#22c55e' },
  medium: { label: 'Medio', color: '#f59e0b' },
  high: { label: 'Alto', color: '#f97316' },
  very_high: { label: 'Critico', color: '#ef4444' },
};

export default function Events() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [view, setView] = useState('grid');

  const filtered = activeCategory === 'all' ? events : events.filter(e => e.category === activeCategory);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="text-yellow-400" size={22} />
            Eventos Urbanos
          </h1>
          <p className="text-dark-400 text-sm mt-0.5">Eventos que impactan la movilidad y recomendaciones</p>
        </div>
      </div>

      {/* Impact alert */}
      {events.some(e => e.impact === 'very_high') && (
        <div className="flex items-center gap-3 p-4 rounded-xl animate-slide-up"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <AlertTriangle size={18} className="text-red-400 flex-shrink-0" />
          <div>
            <p className="text-white font-semibold text-sm">Alerta de Impacto Critico</p>
            <p className="text-red-300 text-xs">
              {events.filter(e => e.impact === 'very_high').map(e => e.name).join(', ')} —
              se espera alta congestion vial. Planifica con anticipacion.
            </p>
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeCategory === 'all' ? 'bg-white/15 text-white' : 'bg-white/5 text-dark-400 hover:text-white'
          }`}>
          🌎 Todos ({events.length})
        </button>
        {Object.entries(categoryConfig).map(([key, cfg]) => {
          const Icon = cfg.icon;
          const count = events.filter(e => e.category === key).length;
          return (
            <button key={key} onClick={() => setActiveCategory(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === key ? 'text-white' : 'text-dark-400 hover:text-white'
              }`}
              style={activeCategory === key ? { background: cfg.bg, border: `1px solid ${cfg.color}40` } : { background: 'rgba(255,255,255,0.05)' }}>
              <Icon size={14} style={{ color: activeCategory === key ? cfg.color : '#64748b' }} />
              {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Events grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(event => {
          const cfg = categoryConfig[event.category];
          const Icon = cfg?.icon || Calendar;
          const impact = impactConfig[event.impact];
          const capacity = Math.round((event.attendees / event.maxAttendees) * 100);

          return (
            <div key={event.id} className="glass-card-hover overflow-hidden group">
              <div className="relative h-44 overflow-hidden">
                <img src={event.image} alt={event.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent 50%)' }} />
                <div className="absolute top-3 left-3 flex gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium"
                    style={{ background: cfg?.bg || 'rgba(255,255,255,0.1)', color: cfg?.color || 'white', border: `1px solid ${cfg?.color || '#ffffff'}30` }}>
                    <Icon size={11} />
                    {cfg?.label || event.category}
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="badge text-xs" style={{ background: `${impact.color}20`, color: impact.color, border: `1px solid ${impact.color}30` }}>
                    Impacto {impact.label}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-bold text-base line-clamp-1">{event.name}</h3>
                </div>
              </div>

              <div className="p-4">
                <p className="text-dark-400 text-xs mb-3 line-clamp-2">{event.description}</p>

                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div className="flex items-center gap-1.5 text-dark-300">
                    <Calendar size={11} className="text-blue-400" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-1.5 text-dark-300">
                    <Clock size={11} className="text-cyan-400" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-1.5 text-dark-300">
                    <Users size={11} className="text-purple-400" />
                    {event.attendees.toLocaleString()} asistentes
                  </div>
                  <div className="flex items-center gap-1.5 text-dark-300">
                    <DollarSign size={11} className="text-green-400" />
                    {event.price === 0 ? 'Gratis' : `$${event.price}`}
                  </div>
                </div>

                {/* Capacity bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-dark-400">Capacidad</span>
                    <span className={capacity > 80 ? 'text-red-400' : capacity > 60 ? 'text-yellow-400' : 'text-green-400'}>
                      {capacity}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{
                        width: `${capacity}%`,
                        background: capacity > 80 ? '#ef4444' : capacity > 60 ? '#f59e0b' : '#22c55e',
                      }} />
                  </div>
                </div>

                {/* Traffic impact warning */}
                {(event.trafficImpact === 'high' || event.trafficImpact === 'very_high') && (
                  <div className="flex items-center gap-2 p-2 rounded-lg text-xs"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <AlertTriangle size={11} className="text-red-400 flex-shrink-0" />
                    <span className="text-red-300">Alto impacto en trafico — planifica tu ruta</span>
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <button className="btn-primary flex-1 text-xs py-2">Mas Info</button>
                  <button className="btn-ghost text-xs py-2 px-3">Ver Ruta</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
