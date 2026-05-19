import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Cloud, Sun, CloudRain, Wind, X, MapPin, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { searchPlaces } from '../utils/searchEngine';

const weatherIcons = {
  sunny: Sun, rainy: CloudRain, cloudy: Cloud, partly_cloudy: Cloud, clear: Sun,
};

export default function Topbar({ onMenuToggle }) {
  const { user, notifications, currentWeather, places, addToSearchHistory, userCoords, geoLoading, geoError } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const WeatherIcon = weatherIcons[currentWeather.current] || Cloud;

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (q.length >= 2) {
      const results = searchPlaces(places, q, { limit: 5 });
      setSearchResults(results);
      setShowSearch(true);
    } else {
      setShowSearch(false);
      setSearchResults([]);
    }
  };

  const handleSelect = (place) => {
    addToSearchHistory(searchQuery);
    setSearchQuery('');
    setShowSearch(false);
    navigate('/explore', { state: { selectedPlace: place } });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addToSearchHistory(searchQuery);
      navigate('/explore', { state: { query: searchQuery } });
      setShowSearch(false);
    }
  };

  return (
    <header className="h-16 flex items-center gap-4 px-6 flex-shrink-0"
      style={{ background: 'rgba(5,13,26,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>

      <button onClick={onMenuToggle} className="text-dark-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-xl relative">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
            <input
              type="text"
              placeholder="Busca lugares, restaurantes, eventos... (prueba: hamburguesa)"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowSearch(true)}
              className="input-field pl-10 pr-10 h-9 text-sm"
            />
            {searchQuery && (
              <button type="button" onClick={() => { setSearchQuery(''); setShowSearch(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>
        </form>

        {/* Search dropdown */}
        {showSearch && searchResults.length > 0 && (
          <div className="absolute top-11 left-0 right-0 z-50 glass-card py-2 animate-slide-up">
            {searchResults.map(place => (
              <button key={place.id} onClick={() => handleSelect(place)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{place.name}</p>
                  <p className="text-dark-400 text-xs truncate">{place.category} • ⭐ {place.rating}</p>
                </div>
                <span className="ml-auto badge badge-blue text-xs">{place.price === 0 ? 'Gratis' : `$${place.price}`}</span>
              </button>
            ))}
            <div className="px-4 pt-2 border-t border-white/5">
              <button onClick={handleSearchSubmit} className="text-blue-400 text-xs hover:text-blue-300">
                Ver todos los resultados para "{searchQuery}"
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Location indicator */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl"
        style={{
          background: geoLoading ? 'rgba(245,158,11,0.1)' : geoError ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
          border: `1px solid ${geoLoading ? 'rgba(245,158,11,0.3)' : geoError ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
        }}>
        {geoLoading
          ? <Loader size={14} className="text-yellow-400 animate-spin" />
          : <MapPin size={14} style={{ color: geoError ? '#f87171' : '#4ade80' }} />
        }
        <span className="text-xs font-medium" style={{ color: geoLoading ? '#facc15' : geoError ? '#f87171' : '#4ade80' }}>
          {geoLoading ? 'Localizando...' : geoError ? 'Ubicación aprox.' : userCoords ? `${userCoords[0].toFixed(3)}, ${userCoords[1].toFixed(3)}` : ''}
        </span>
      </div>

      {/* Weather */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <WeatherIcon size={16} className="text-cyan-400" />
        <span className="text-white text-sm font-medium">{Math.round(currentWeather.temp)}°C</span>
        <span className="text-dark-400 text-xs hidden lg:block">{currentWeather.description}</span>
      </div>

      {/* Notifications */}
      <div className="relative">
        <button onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-xl text-dark-400 hover:text-white hover:bg-white/10 transition-all">
          <Bell size={18} />
          {notifications.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {notifications.length}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 top-12 w-80 z-50 glass-card py-2 animate-slide-up">
            <div className="px-4 py-2 border-b border-white/5">
              <p className="text-white font-semibold text-sm">Alertas Inteligentes</p>
            </div>
            {notifications.slice(0, 4).map(n => (
              <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  n.severity === 'critical' ? 'bg-red-400' :
                  n.severity === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                }`} />
                <div>
                  <p className="text-white text-xs">{n.message}</p>
                  <p className="text-dark-500 text-xs mt-0.5">Hace {n.time}</p>
                </div>
              </div>
            ))}
            <div className="px-4 pt-2 border-t border-white/5">
              <button className="text-blue-400 text-xs">Ver todas las alertas</button>
            </div>
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-3">
        <img src={user.photoURL} alt="avatar"
          className="w-8 h-8 rounded-lg object-cover border border-white/20 cursor-pointer hover:border-blue-500/50 transition-colors"
          onClick={() => navigate('/profile')} />
      </div>
    </header>
  );
}
