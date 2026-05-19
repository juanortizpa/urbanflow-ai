import { Heart, Star, MapPin, Clock, TrendingUp, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PlaceCard({ place, onClick, compact = false }) {
  const { favorites, addToFavorites } = useApp();
  const isFav = favorites.includes(place.id);

  const trendColor = place.trend === 'up' ? 'text-green-400' : place.trend === 'down' ? 'text-red-400' : 'text-dark-400';
  const categoryColors = {
    cafes: 'badge-cyan', restaurants: 'badge-blue', bars: 'badge-purple',
    parks: 'badge-green', culture: 'badge-yellow', sports: 'badge-orange',
    emergency: 'badge-red', shopping: 'badge-yellow', desserts: 'badge-purple',
  };

  if (compact) {
    return (
      <div className="glass-card-hover p-4 cursor-pointer" onClick={() => onClick?.(place)}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
            <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white font-semibold text-sm truncate">{place.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Star size={11} className="text-yellow-400 fill-yellow-400" />
              <span className="text-dark-400 text-xs">{place.rating}</span>
              <span className="text-dark-600">•</span>
              <span className="text-dark-400 text-xs">{place.openHours}</span>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); addToFavorites(place.id); }}
            className={`p-1.5 rounded-lg transition-colors ${isFav ? 'text-red-400 bg-red-500/10' : 'text-dark-500 hover:text-red-400'}`}>
            <Heart size={14} fill={isFav ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card-hover overflow-hidden cursor-pointer group" onClick={() => onClick?.(place)}>
      <div className="relative h-44 overflow-hidden">
        <img src={place.image} alt={place.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
        <div className="absolute top-3 left-3">
          <span className={`badge ${categoryColors[place.category] || 'badge-blue'} text-xs`}>{place.category}</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); addToFavorites(place.id); }}
          className={`absolute top-3 right-3 p-2 rounded-xl transition-all ${
            isFav ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-black/30 text-white hover:bg-red-500/20 hover:text-red-400'
          }`}>
          <Heart size={14} fill={isFav ? 'currentColor' : 'none'} />
        </button>
        {place.trend === 'up' && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 badge badge-green text-xs">
            <TrendingUp size={10} />
            <span>Trending</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-white font-bold text-base mb-1 line-clamp-1">{place.name}</h3>
        <p className="text-dark-400 text-xs mb-3 line-clamp-2">{place.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star size={13} className="text-yellow-400 fill-yellow-400" />
              <span className="text-white text-sm font-semibold">{place.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-dark-400">
              <MapPin size={11} />
              <span className="text-xs">{place.visits.toLocaleString()} visitas</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign size={12} className="text-green-400" />
            <span className="text-green-400 text-sm font-semibold">
              {place.price === 0 ? 'Gratis' : `$${place.price}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          {place.tags.slice(0, 3).map(tag => (
            <span key={tag} className="badge badge-blue text-xs">{tag}</span>
          ))}
        </div>

        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/5">
          <Clock size={11} className="text-dark-500" />
          <span className="text-dark-500 text-xs">{place.openHours}</span>
        </div>
      </div>
    </div>
  );
}
