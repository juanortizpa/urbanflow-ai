import { useState } from 'react';
import { Heart, Search, Trash2, Navigation, MapPin, Grid, List, SortAsc } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PlaceCard from '../components/PlaceCard';

export default function Favorites() {
  const { favorites, places, addToFavorites, searchHistory } = useApp();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');

  const favoritePlaces = places.filter(p => favorites.includes(p.id));
  const filtered = favoritePlaces.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) =>
    sortBy === 'rating' ? b.rating - a.rating :
    sortBy === 'visits' ? b.visits - a.visits :
    a.name.localeCompare(b.name)
  );

  const clearAll = () => {
    favorites.forEach(id => addToFavorites(id));
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Heart className="text-red-400 fill-red-400" size={22} />
            Mis Favoritos
          </h1>
          <p className="text-dark-400 text-sm mt-0.5">{favoritePlaces.length} lugares guardados</p>
        </div>
        {favoritePlaces.length > 0 && (
          <button onClick={clearAll} className="btn-ghost flex items-center gap-2 text-sm text-red-400 border-red-500/20 hover:border-red-500/40">
            <Trash2 size={14} />
            Limpiar todo
          </button>
        )}
      </div>

      {favoritePlaces.length === 0 ? (
        <div className="text-center py-24 glass-card">
          <Heart size={48} className="text-dark-600 mx-auto mb-4" />
          <h3 className="text-white font-semibold text-lg mb-2">Sin favoritos aun</h3>
          <p className="text-dark-400 text-sm max-w-xs mx-auto">
            Explora la ciudad y guarda los lugares que mas te gusten
          </p>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="flex gap-3 flex-wrap items-center">
            <div className="relative flex-1 min-w-0 max-w-sm">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
              <input type="text" placeholder="Buscar en favoritos..."
                value={query} onChange={e => setQuery(e.target.value)}
                className="input-field pl-10 h-9 text-sm w-full" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <SortAsc size={14} className="text-dark-400 ml-1" />
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="bg-transparent text-dark-300 text-sm pr-2 py-0.5 outline-none">
                <option value="rating">Rating</option>
                <option value="visits">Visitas</option>
                <option value="name">Nombre</option>
              </select>
            </div>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <button onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-blue-500/20 text-blue-400' : 'text-dark-400'}`}>
                <Grid size={14} />
              </button>
              <button onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-blue-500/20 text-blue-400' : 'text-dark-400'}`}>
                <List size={14} />
              </button>
            </div>
          </div>

          {/* Historial de busquedas */}
          {searchHistory.length > 0 && (
            <div className="glass-card p-4">
              <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                <Search size={14} className="text-dark-400" />
                Busquedas Recientes
              </h3>
              <div className="flex gap-2 flex-wrap">
                {searchHistory.slice(0, 8).map(term => (
                  <span key={term} className="badge badge-blue text-xs cursor-pointer hover:bg-blue-500/30 transition-colors">
                    {term}
                  </span>
                ))}
              </div>
            </div>
          )}

          {sorted.length === 0 ? (
            <div className="text-center py-12 glass-card">
              <Search size={36} className="text-dark-600 mx-auto mb-3" />
              <p className="text-dark-400">No se encontraron resultados</p>
            </div>
          ) : (
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'}>
              {sorted.map(place => (
                <PlaceCard key={place.id} place={place} compact={viewMode === 'list'} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
