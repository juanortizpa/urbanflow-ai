import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Grid, List, MapPin, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { searchPlaces } from '../utils/searchEngine';
import PlaceCard from '../components/PlaceCard';
import InteractiveMap from '../components/InteractiveMap';

const categories = [
  { id: 'all', label: 'Todos', emoji: '🌎' },
  { id: 'restaurants', label: 'Restaurantes', emoji: '🍽️' },
  { id: 'cafes', label: 'Cafes', emoji: '☕' },
  { id: 'bars', label: 'Bares', emoji: '🍸' },
  { id: 'parks', label: 'Parques', emoji: '🌳' },
  { id: 'culture', label: 'Cultura', emoji: '🏛️' },
  { id: 'sports', label: 'Deportes', emoji: '⚽' },
  { id: 'shopping', label: 'Compras', emoji: '🛍️' },
  { id: 'desserts', label: 'Postres', emoji: '🍦' },
];

const sortOptions = [
  { value: 'rating', label: 'Mejor valorado' },
  { value: 'visits', label: 'Mas visitado' },
  { value: 'price_asc', label: 'Precio: menor' },
  { value: 'price_desc', label: 'Precio: mayor' },
  { value: 'trending', label: 'Tendencia' },
];

export default function Explore() {
  const location = useLocation();
  const { places, addToSearchHistory, openPlaceDetail } = useApp();
  const [query, setQuery] = useState(location.state?.query || '');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  useEffect(() => {
    if (location.state?.query) {
      setQuery(location.state.query);
      addToSearchHistory(location.state.query);
    }
  }, [location.state]);

  const filtered = useMemo(() => {
    let result = query.trim().length >= 2 ? searchPlaces(places, query) : [...places];

    if (activeCategory !== 'all') result = result.filter(p => p.category === activeCategory);
    if (priceRange === 'free') result = result.filter(p => p.price === 0);
    if (priceRange === 'low') result = result.filter(p => p.price > 0 && p.price <= 10);
    if (priceRange === 'medium') result = result.filter(p => p.price > 10 && p.price <= 20);
    if (priceRange === 'high') result = result.filter(p => p.price > 20);
    if (minRating > 0) result = result.filter(p => p.rating >= minRating);

    switch (sortBy) {
      case 'visits': result.sort((a, b) => b.visits - a.visits); break;
      case 'price_asc': result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'trending': result.sort((a, b) => (b.trend === 'up' ? 1 : 0) - (a.trend === 'up' ? 1 : 0)); break;
      default: result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [places, query, activeCategory, sortBy, priceRange, minRating]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [query, activeCategory, sortBy, priceRange, minRating]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Explorar Ciudad</h1>
          <p className="text-dark-400 text-sm mt-0.5">{filtered.length} lugares encontrados</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowMap(!showMap)}
            className={`btn-ghost flex items-center gap-2 text-sm py-2 px-3 ${showMap ? 'border-blue-500/50 text-blue-400' : ''}`}>
            <MapPin size={15} />
            {showMap ? 'Ocultar Mapa' : 'Ver Mapa'}
          </button>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`btn-ghost flex items-center gap-2 text-sm py-2 px-3 ${showFilters ? 'border-blue-500/50 text-blue-400' : ''}`}>
            <SlidersHorizontal size={15} />
            Filtros
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
        <input type="text" placeholder='Busca lugares... (ej: "hamburguesa", "cafe con wifi", "bares de noche")'
          value={query} onChange={e => setQuery(e.target.value)}
          className="input-field pl-11 pr-10 h-11 w-full" />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white">
            <X size={15} />
          </button>
        )}
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="glass-card p-4 animate-slide-up">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-dark-400 text-xs font-medium mb-2 block">Precio</label>
              <div className="flex gap-2 flex-wrap">
                {[['all','Todos'],['free','Gratis'],['low','< $10'],['medium','$10-20'],['high','> $20']].map(([v, l]) => (
                  <button key={v} onClick={() => setPriceRange(v)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      priceRange === v ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-dark-800 text-dark-400 hover:text-white'
                    }`}>{l}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-dark-400 text-xs font-medium mb-2 block">Rating minimo: {minRating > 0 ? `${minRating}+` : 'Todos'}</label>
              <input type="range" min="0" max="5" step="0.5" value={minRating}
                onChange={e => setMinRating(parseFloat(e.target.value))}
                className="w-full accent-blue-500" />
            </div>
            <div>
              <label className="text-dark-400 text-xs font-medium mb-2 block">Ordenar por</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="input-field h-8 text-xs py-1">
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-white/5 text-dark-300 border border-white/8 hover:bg-white/10 hover:text-white'
            }`}>
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
            {activeCategory === cat.id && (
              <span className="text-xs bg-blue-500/30 px-1.5 rounded-full">
                {places.filter(p => cat.id === 'all' || p.category === cat.id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Map */}
      {showMap && (
        <div className="animate-slide-up">
          <InteractiveMap height="380px" filterCategory={activeCategory} showTraffic showPlaces />
        </div>
      )}

      {/* View controls */}
      <div className="flex items-center justify-between">
        <p className="text-dark-400 text-sm">
          {query && <><span className="text-white font-medium">{filtered.length}</span> resultados para "<span className="text-blue-400">{query}</span>"</>}
        </p>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <button onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-500/20 text-blue-400' : 'text-dark-400 hover:text-white'}`}>
            <Grid size={15} />
          </button>
          <button onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-500/20 text-blue-400' : 'text-dark-400 hover:text-white'}`}>
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <Search size={40} className="text-dark-600 mx-auto mb-3" />
          <p className="text-dark-400 text-lg font-medium">No se encontraron lugares</p>
          <p className="text-dark-500 text-sm mt-1">Intenta con otra busqueda o categoria</p>
        </div>
      ) : (
        <>
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
            : 'space-y-3'}>
            {paginated.map(place => (
              <PlaceCard key={place.id} place={place} compact={viewMode === 'list'}
                onClick={() => openPlaceDetail(place)} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl btn-ghost disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let p;
                  if (totalPages <= 7) p = i + 1;
                  else if (page <= 4) p = i + 1;
                  else if (page >= totalPages - 3) p = totalPages - 6 + i;
                  else p = page - 3 + i;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                        p === page ? 'bg-blue-500/25 text-blue-400 border border-blue-500/40' : 'text-dark-400 hover:text-white hover:bg-white/8'
                      }`}>
                      {p}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-xl btn-ghost disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronRight size={16} />
              </button>
              <span className="text-dark-500 text-xs">
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
