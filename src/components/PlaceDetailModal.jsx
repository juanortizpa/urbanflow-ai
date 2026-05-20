import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, Star, MapPin, Clock, DollarSign, Heart, Navigation,
  CalendarPlus, Phone, Globe, Tag, TrendingUp, Users, Share2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const categoryColors = {
  cafes: '#f59e0b', restaurants: '#3b82f6', bars: '#8b5cf6', parks: '#22c55e',
  culture: '#f97316', sports: '#06b6d4', emergency: '#ef4444', shopping: '#ec4899', desserts: '#a78bfa',
};

const categoryLabels = {
  cafes: 'Café', restaurants: 'Restaurante', bars: 'Bar / Salsoteca',
  parks: 'Parque', culture: 'Cultura', sports: 'Deporte',
  emergency: 'Emergencia', shopping: 'Compras', desserts: 'Postres',
};

export default function PlaceDetailModal() {
  const { detailPlace, closePlaceDetail, favorites, addToFavorites, addToAgenda, user, showAlert } = useApp();
  const navigate = useNavigate();
  const [showScheduler, setShowScheduler] = useState(false);
  const [schedDate, setSchedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [schedTime, setSchedTime] = useState('12:00');
  const [schedNotes, setSchedNotes] = useState('');
  const [imgError, setImgError] = useState(false);

  // reset img error when place changes
  useEffect(() => { setImgError(false); setShowScheduler(false); }, [detailPlace]);

  // close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closePlaceDetail(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closePlaceDetail]);

  if (!detailPlace) return null;

  const place = detailPlace;
  const isFav = favorites.includes(place.id);
  const color = categoryColors[place.category] || '#3b82f6';

  const handleAddToAgenda = () => {
    if (!user) { showAlert('Inicia sesión para usar la agenda', 'info'); return; }
    addToAgenda(place, schedDate, schedTime, schedNotes);
    showAlert(`${place.name} agregado a tu agenda`, 'success');
    setShowScheduler(false);
    setSchedNotes('');
  };

  const handleRoute = () => {
    closePlaceDetail();
    navigate('/routes', { state: { destination: { name: place.name, lat: place.lat, lng: place.lng } } });
  };

  const handleFav = () => {
    if (!user) { showAlert('Inicia sesión para guardar favoritos', 'info'); return; }
    addToFavorites(place.id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: place.name, text: place.description, url: window.location.href });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showAlert('Enlace copiado al portapapeles', 'success');
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/70"
        style={{ backdropFilter: 'blur(4px)' }}
        onClick={closePlaceDetail}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full z-50 w-full max-w-md overflow-y-auto animate-slide-in-right"
        style={{ background: '#0a1628', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>

        {/* Hero image */}
        <div className="relative h-56 flex-shrink-0">
          <img
            src={imgError ? `https://picsum.photos/seed/${place.id}/600/350` : place.image}
            alt={place.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,22,40,0.95) 0%, rgba(10,22,40,0.3) 60%, transparent 100%)' }} />

          {/* Close */}
          <button onClick={closePlaceDetail}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white transition-all"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }}>
            <X size={18} />
          </button>

          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg"
              style={{ background: `${color}25`, color, border: `1px solid ${color}40` }}>
              {categoryLabels[place.category] || place.category}
            </span>
          </div>

          {/* Name on image */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-white font-bold text-xl leading-tight">{place.name}</h2>
            {place.address && (
              <p className="text-slate-300 text-xs mt-1 flex items-center gap-1">
                <MapPin size={11} /> {place.address}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(250,204,21,0.08)', border: '1px solid rgba(250,204,21,0.15)' }}>
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Star size={13} className="text-yellow-400 fill-yellow-400" />
                <span className="text-white font-bold text-lg">{place.rating}</span>
              </div>
              <span className="text-slate-500 text-xs">Rating</span>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)' }}>
              <div className="text-green-400 font-bold text-lg mb-0.5">
                {place.price === 0 ? 'Gratis' : `$${place.price}`}
              </div>
              <span className="text-slate-500 text-xs">Precio</span>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.15)' }}>
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Users size={12} className="text-blue-400" />
                <span className="text-white font-bold text-sm">{(place.visits || 0).toLocaleString()}</span>
              </div>
              <span className="text-slate-500 text-xs">Visitas</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-slate-300 text-sm leading-relaxed">{place.description}</p>
          </div>

          {/* Info grid */}
          <div className="space-y-2.5">
            {place.openHours && (
              <div className="flex items-start gap-3">
                <Clock size={15} className="text-slate-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-slate-500 text-xs block">Horario</span>
                  <span className="text-slate-200 text-sm">{place.openHours}</span>
                </div>
              </div>
            )}
            {place.phone && (
              <div className="flex items-center gap-3">
                <Phone size={15} className="text-slate-500 flex-shrink-0" />
                <div>
                  <span className="text-slate-500 text-xs block">Teléfono</span>
                  <a href={`tel:${place.phone}`} className="text-blue-400 text-sm hover:text-blue-300">{place.phone}</a>
                </div>
              </div>
            )}
            {place.website && (
              <div className="flex items-center gap-3">
                <Globe size={15} className="text-slate-500 flex-shrink-0" />
                <div>
                  <span className="text-slate-500 text-xs block">Sitio web</span>
                  <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:text-blue-300 truncate block max-w-xs">
                    {place.website.replace('https://', '')}
                  </a>
                </div>
              </div>
            )}
            {place.trend === 'up' && (
              <div className="flex items-center gap-3">
                <TrendingUp size={15} className="text-green-400 flex-shrink-0" />
                <span className="text-green-400 text-sm font-medium">Tendencia al alza esta semana</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {place.tags?.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {place.tags.slice(0, 6).map(tag => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleRoute}
              className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ background: 'rgba(37,99,235,0.2)', color: '#60a5fa', border: '1px solid rgba(37,99,235,0.35)' }}>
              <Navigation size={16} /> Cómo llegar
            </button>
            <button onClick={() => setShowScheduler(!showScheduler)}
              className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ background: 'rgba(139,92,246,0.2)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.35)' }}>
              <CalendarPlus size={16} /> Agendar visita
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleFav}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isFav ? 'text-red-400 border-red-500/30 bg-red-500/10' : 'text-slate-400 hover:text-red-400'
              }`}
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
              <Heart size={15} fill={isFav ? 'currentColor' : 'none'} />
              {isFav ? 'En favoritos' : 'Guardar'}
            </button>
            <button onClick={handleShare}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
              <Share2 size={15} /> Compartir
            </button>
          </div>

          {/* Scheduler panel */}
          {showScheduler && (
            <div className="rounded-xl p-4 space-y-3 animate-slide-up"
              style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)' }}>
              <p className="text-white font-semibold text-sm flex items-center gap-2">
                <CalendarPlus size={15} className="text-purple-400" /> Planifica tu visita
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Fecha</label>
                  <input type="date" value={schedDate}
                    onChange={e => setSchedDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 10)}
                    className="input-field h-9 text-sm w-full" />
                </div>
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Hora</label>
                  <input type="time" value={schedTime}
                    onChange={e => setSchedTime(e.target.value)}
                    className="input-field h-9 text-sm w-full" />
                </div>
              </div>
              <div>
                <label className="text-slate-500 text-xs mb-1 block">Notas (opcional)</label>
                <input type="text" value={schedNotes}
                  onChange={e => setSchedNotes(e.target.value)}
                  placeholder="Ej: ir con amigos, llevar efectivo..."
                  className="input-field h-9 text-sm w-full" />
              </div>
              <button onClick={handleAddToAgenda}
                className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
                <CalendarPlus size={15} /> Confirmar en agenda
              </button>
            </div>
          )}

          {place.source === 'osm' && (
            <p className="text-slate-700 text-xs text-center">Fuente: OpenStreetMap contributors</p>
          )}
        </div>
      </div>
    </>
  );
}
