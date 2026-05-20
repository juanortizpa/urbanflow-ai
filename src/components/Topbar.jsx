import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Cloud, Sun, CloudRain, X, MapPin, Loader, CalendarDays } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { searchPlaces } from '../utils/searchEngine';

const weatherIcons = {
  sunny: Sun, rainy: CloudRain, cloudy: Cloud, partly_cloudy: Cloud, clear: Sun,
};

export default function Topbar({ onMenuToggle }) {
  const { user, notifications, currentWeather, places, addToSearchHistory, userCoords, geoLoading, geoError, openPlaceDetail } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const searchRef = useRef(null);
  const notifRef = useRef(null);

  const WeatherIcon = weatherIcons[currentWeather?.current] || Cloud;

  // ── Cierra dropdowns al hacer clic fuera ──────────────────────────────────
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (q.length >= 2) {
      const results = searchPlaces(places, q, { limit: 6 });
      setSearchResults(results);
      setShowSearch(true);
    } else {
      setShowSearch(false);
      setSearchResults([]);
    }
  };

  const handleSelect = (place) => {
    addToSearchHistory(place.name);
    setSearchQuery('');
    setShowSearch(false);
    openPlaceDetail(place);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addToSearchHistory(searchQuery);
      navigate('/explore', { state: { query: searchQuery } });
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="h-16 flex items-center gap-4 px-6 flex-shrink-0 relative z-40"
      style={{ background: 'rgba(5,13,26,0.98)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(24px)' }}>

      <button onClick={onMenuToggle} className="text-dark-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 flex-shrink-0">
        <Menu size={20} />
      </button>

      {/* ── Search ── */}
      <div className="flex-1 max-w-xl relative" ref={searchRef}>
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder='Busca lugares, restaurantes, eventos...'
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowSearch(true)}
              className="input-field pl-10 pr-10 h-9 text-sm w-full"
              style={{ background: 'rgba(15,23,42,0.9)' }}
            />
            {searchQuery && (
              <button type="button" onClick={() => { setSearchQuery(''); setShowSearch(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
        </form>

        {/* Search dropdown */}
        {showSearch && searchResults.length > 0 && (
          <div className="absolute top-11 left-0 right-0 z-[200] py-2 animate-slide-up"
            style={{
              background: 'rgba(8,16,32,0.98)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 14,
              backdropFilter: 'blur(24px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
            }}>
            {searchResults.map(place => (
              <button key={place.id} onClick={() => handleSelect(place)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/6 transition-colors text-left">
                <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={place.image} alt={place.name} className="w-full h-full object-cover"
                    onError={e => { e.target.src = `https://picsum.photos/seed/${place.id}/40/40`; }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-medium truncate">{place.name}</p>
                  <p className="text-slate-500 text-xs truncate">{place.category} · ⭐ {place.rating}</p>
                </div>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-lg font-medium flex-shrink-0"
                  style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)' }}>
                  {place.price === 0 ? 'Gratis' : `$${place.price}`}
                </span>
              </button>
            ))}
            <div className="px-4 pt-2 pb-1 border-t border-white/6 mt-1">
              <button onClick={handleSearchSubmit} className="text-blue-400 text-xs hover:text-blue-300 transition-colors">
                Ver todos los resultados para "{searchQuery}" →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Location ── */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl flex-shrink-0"
        style={{
          background: geoLoading ? 'rgba(245,158,11,0.1)' : geoError ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.1)',
          border: `1px solid ${geoLoading ? 'rgba(245,158,11,0.3)' : geoError ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
        }}>
        {geoLoading
          ? <Loader size={13} className="text-yellow-400 animate-spin" />
          : <MapPin size={13} style={{ color: geoError ? '#f87171' : '#4ade80' }} />
        }
        <span className="text-xs font-medium whitespace-nowrap"
          style={{ color: geoLoading ? '#facc15' : geoError ? '#f87171' : '#4ade80' }}>
          {geoLoading ? 'Localizando...' : geoError ? 'Aprox. Cali' : userCoords ? `${userCoords[0].toFixed(3)}, ${userCoords[1].toFixed(3)}` : 'Cali'}
        </span>
      </div>

      {/* ── Weather ── */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <WeatherIcon size={15} className="text-cyan-400" />
        <span className="text-white text-sm font-semibold">{Math.round(currentWeather?.temp || 24)}°C</span>
        <span className="text-slate-500 text-xs hidden lg:block truncate max-w-[140px]">{currentWeather?.description}</span>
      </div>

      {/* ── Notifications ── */}
      <div className="relative flex-shrink-0" ref={notifRef}>
        <button
          onClick={() => { setShowNotifications(v => !v); setShowSearch(false); }}
          className="relative p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 transition-all">
          <Bell size={18} />
          {notifications.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold leading-none">
              {notifications.length > 9 ? '9+' : notifications.length}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 top-12 w-[340px] z-[200] animate-slide-up"
            style={{
              background: 'rgba(8,16,32,0.98)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16,
              backdropFilter: 'blur(24px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
            }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
              <p className="text-white font-bold text-sm">Alertas Inteligentes</p>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-bold"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}>
                {notifications.length}
              </span>
            </div>

            <div className="py-1 max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-slate-600 text-xs text-center py-6">Sin alertas activas</p>
              ) : notifications.map(n => (
                <div key={n.id}
                  className="flex items-start gap-3 px-4 py-2.5 transition-colors"
                  style={{ cursor: n.type === 'agenda' ? 'pointer' : 'default' }}
                  onClick={() => {
                    if (n.type === 'agenda') {
                      navigate('/agenda');
                      setShowNotifications(false);
                    }
                  }}
                  onMouseEnter={e => { if (n.type === 'agenda') e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                  <div className={`flex-shrink-0 mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
                    n.type === 'agenda'          ? 'bg-purple-500/15' :
                    n.severity === 'critical'    ? 'bg-red-500/15' :
                    n.severity === 'warning'     ? 'bg-yellow-500/15' : 'bg-blue-500/15'
                  }`}>
                    {n.type === 'agenda'
                      ? <CalendarDays size={12} className="text-purple-400" />
                      : n.severity === 'critical'
                      ? <span className="text-red-400 font-bold text-xs">!</span>
                      : n.severity === 'warning'
                      ? <span className="text-yellow-400 text-xs">⚠</span>
                      : <span className="text-blue-400 text-xs">i</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs leading-relaxed">{n.message}</p>
                    <p className="text-slate-600 text-[11px] mt-0.5">{n.time}</p>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 ${
                    n.severity === 'critical' ? 'bg-red-400 animate-pulse' :
                    n.severity === 'warning'  ? 'bg-yellow-400' : 'bg-blue-400'
                  }`} />
                </div>
              ))}
            </div>

            <div className="px-4 py-2.5 border-t border-white/6 flex items-center justify-between">
              <button onClick={() => { navigate('/agenda'); setShowNotifications(false); }}
                className="text-purple-400 text-xs hover:text-purple-300 flex items-center gap-1.5 transition-colors">
                <CalendarDays size={12} /> Mi agenda
              </button>
              <button onClick={() => setShowNotifications(false)}
                className="text-slate-600 text-xs hover:text-slate-400 transition-colors">
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Avatar ── */}
      <img src={user.photoURL} alt="avatar"
        className="w-8 h-8 rounded-xl object-cover border border-white/15 cursor-pointer hover:border-blue-500/50 transition-colors flex-shrink-0"
        onClick={() => navigate('/profile')} />
    </header>
  );
}
