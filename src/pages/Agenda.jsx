import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Trash2, Navigation, Clock, MapPin, Star, DollarSign, CalendarCheck, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';

function groupByDate(items) {
  const groups = {};
  for (const item of items) {
    if (!groups[item.date]) groups[item.date] = [];
    groups[item.date].push(item);
  }
  return groups;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date(); today.setHours(0,0,0,0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate()+1);
  if (d.getTime() === today.getTime()) return 'Hoy';
  if (d.getTime() === tomorrow.getTime()) return 'Mañana';
  return d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
}

const categoryColors = {
  cafes: '#f59e0b', restaurants: '#3b82f6', bars: '#8b5cf6', parks: '#22c55e',
  culture: '#f97316', sports: '#06b6d4', emergency: '#ef4444', shopping: '#ec4899', desserts: '#a78bfa',
};
const categoryIcons = {
  cafes: '☕', restaurants: '🍽️', bars: '🍸', parks: '🌳',
  culture: '🏛️', sports: '⚽', emergency: '🚨', shopping: '🛍️', desserts: '🍦',
};

export default function Agenda() {
  const { agenda, removeFromAgenda, openPlaceDetail } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const sorted = [...agenda]
    .filter(item => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return item.place.name.toLowerCase().includes(q) || item.place.category.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const da = new Date(`${a.date}T${a.time}`);
      const db = new Date(`${b.date}T${b.time}`);
      return da - db;
    });

  const grouped = groupByDate(sorted);
  const sortedDates = Object.keys(grouped).sort();

  const handleDelete = (id) => {
    if (confirmDelete === id) { removeFromAgenda(id); setConfirmDelete(null); }
    else { setConfirmDelete(id); setTimeout(() => setConfirmDelete(null), 3000); }
  };

  const handleRoute = (item) => {
    navigate('/routes', { state: { destination: { name: item.place.name, lat: item.place.lat, lng: item.place.lng } } });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarDays className="text-purple-400" size={24} />
            Mi Agenda
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {agenda.length === 0 ? 'Sin planes agendados' : `${agenda.length} visita${agenda.length !== 1 ? 's' : ''} planeada${agenda.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        {agenda.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)' }}>
            <CalendarCheck size={14} className="text-purple-400" />
            <span className="text-purple-300 text-xs font-medium">{agenda.length} eventos</span>
          </div>
        )}
      </div>

      {agenda.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <CalendarDays size={52} className="text-slate-700 mx-auto mb-4" />
          <h3 className="text-white font-semibold text-lg mb-2">Tu agenda está vacía</h3>
          <p className="text-slate-400 text-sm max-w-xs mx-auto mb-6">
            Explora los lugares y eventos de Cali, y agéndalos con fecha y hora para planificar tu semana.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/explore')}
              className="btn-primary flex items-center gap-2 text-sm">
              <MapPin size={15} /> Explorar Lugares
            </button>
            <button onClick={() => navigate('/events')}
              className="btn-ghost flex items-center gap-2 text-sm">
              <CalendarDays size={15} /> Ver Eventos
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Buscar en agenda..."
              value={query} onChange={e => setQuery(e.target.value)}
              className="input-field pl-10 h-9 text-sm w-full" />
          </div>

          {sortedDates.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <p className="text-slate-400">No se encontraron resultados</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedDates.map(date => (
                <div key={date}>
                  {/* Date header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
                    <span className="text-white font-semibold text-sm px-3 py-1 rounded-lg capitalize"
                      style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#c4b5fd' }}>
                      {formatDate(date)}
                    </span>
                    <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  </div>

                  <div className="space-y-3">
                    {grouped[date]
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map(item => {
                        const color = categoryColors[item.place.category] || '#3b82f6';
                        const emoji = categoryIcons[item.place.category] || '📍';
                        const isConfirming = confirmDelete === item.id;

                        return (
                          <div key={item.id} className="glass-card-hover p-4 flex gap-4"
                            style={{ borderLeft: `3px solid ${color}` }}>
                            {/* Time */}
                            <div className="flex-shrink-0 text-center min-w-[52px]">
                              <div className="text-white font-bold text-base">{item.time}</div>
                              <div className="text-slate-600 text-xs mt-0.5">{emoji}</div>
                            </div>

                            {/* Image */}
                            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                              <img src={item.place.image} alt={item.place.name}
                                className="w-full h-full object-cover"
                                onError={e => { e.target.src = `https://picsum.photos/seed/${item.place.id}/64/64`; }} />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <button onClick={() => openPlaceDetail(item.place)}
                                className="text-white font-semibold text-sm hover:text-blue-300 transition-colors text-left line-clamp-1">
                                {item.place.name}
                              </button>
                              <div className="flex items-center gap-3 mt-1 flex-wrap">
                                <span className="text-xs px-2 py-0.5 rounded-md font-medium"
                                  style={{ background: `${color}18`, color }}>
                                  {item.place.category}
                                </span>
                                <span className="text-slate-500 text-xs flex items-center gap-1">
                                  <Star size={10} className="text-yellow-400" /> {item.place.rating}
                                </span>
                                <span className="text-slate-500 text-xs flex items-center gap-1">
                                  <DollarSign size={10} className="text-green-400" />
                                  {item.place.price === 0 ? 'Gratis' : `$${item.place.price}`}
                                </span>
                              </div>
                              {item.notes && (
                                <p className="text-slate-500 text-xs mt-1.5 italic">"{item.notes}"</p>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2 flex-shrink-0">
                              <button onClick={() => handleRoute(item)}
                                className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/15 transition-all"
                                title="Cómo llegar">
                                <Navigation size={14} />
                              </button>
                              <button onClick={() => handleDelete(item.id)}
                                className={`p-1.5 rounded-lg transition-all ${
                                  isConfirming ? 'bg-red-500/20 text-red-400' : 'text-slate-600 hover:text-red-400 hover:bg-red-500/10'
                                }`}
                                title={isConfirming ? 'Clic para confirmar eliminación' : 'Eliminar'}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary card */}
          <div className="glass-card p-4">
            <h4 className="text-slate-400 text-xs font-medium mb-3">Resumen de tu agenda</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-white font-bold text-xl">{sortedDates.length}</div>
                <div className="text-slate-500 text-xs">Días planeados</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-bold text-xl">
                  ${agenda.reduce((s, i) => s + (i.place.price || 0), 0).toLocaleString()}
                </div>
                <div className="text-slate-500 text-xs">Gasto estimado</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-bold text-xl">
                  {agenda.filter(i => i.place.price === 0).length}
                </div>
                <div className="text-slate-500 text-xs">Eventos gratis</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
