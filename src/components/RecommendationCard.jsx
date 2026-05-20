import { Brain, Star, DollarSign, Sparkles, Heart, Clock, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function RecommendationCard({ place, reason, score, rank }) {
  const { addToFavorites, favorites, user, openPlaceDetail } = useApp();
  const isFav = favorites.includes(place.id);

  const scoreColor = score >= 80 ? '#4ade80' : score >= 60 ? '#facc15' : '#94a3b8';

  const handleFav = (e) => {
    e.stopPropagation();
    if (!user) return;
    addToFavorites(place.id);
  };

  return (
    <div className="glass-card-hover p-4 flex gap-4 relative overflow-hidden" onClick={() => openPlaceDetail(place)}>
      {/* Rank badge */}
      {rank <= 3 && (
        <div className="absolute top-3 right-10">
          <span className="text-lg">{rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}</span>
        </div>
      )}

      {/* Favorito */}
      <button
        onClick={handleFav}
        title={user ? (isFav ? 'Quitar de favoritos' : 'Agregar a favoritos') : 'Inicia sesion para guardar'}
        className={`absolute top-3 right-3 p-1.5 rounded-lg transition-all ${
          isFav ? 'text-red-400 bg-red-500/15 border border-red-500/30' : 'text-dark-500 hover:text-red-400 hover:bg-red-500/10'
        }`}
      >
        <Heart size={14} fill={isFav ? 'currentColor' : 'none'} />
      </button>

      {/* Imagen */}
      <div className="relative flex-shrink-0">
        <img
          src={place.image}
          alt={place.name}
          className="w-20 h-20 rounded-xl object-cover"
          onError={e => { e.target.src = `https://picsum.photos/seed/${place.id}/80/80`; }}
        />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', border: '2px solid #0a1628' }}>
          <Brain size={10} className="text-white" />
        </div>
      </div>

      <div className="flex-1 min-w-0 pr-6">
        <h4 className="text-white font-bold text-sm mb-0.5 truncate">{place.name}</h4>
        <p className="text-dark-400 text-xs mb-2 line-clamp-2">{place.description}</p>

        {/* Razon IA */}
        <div className="flex items-start gap-1.5 mb-2 p-2 rounded-lg"
          style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
          <Sparkles size={11} className="text-purple-400 flex-shrink-0 mt-0.5" />
          <p className="text-purple-300 text-xs">{reason}</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            <Star size={11} className="text-yellow-400 fill-yellow-400" />
            <span className="text-white text-xs font-medium">{place.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign size={11} className="text-green-400" />
            <span className="text-green-400 text-xs">{place.price === 0 ? 'Gratis' : `$${place.price}`}</span>
          </div>
          {place.openHours && (
            <div className="flex items-center gap-1">
              <Clock size={11} className="text-dark-500" />
              <span className="text-dark-500 text-xs">{place.openHours}</span>
            </div>
          )}
          <div className="flex items-center gap-1 ml-auto">
            <div className="w-12 h-1.5 rounded-full bg-dark-700 overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: scoreColor }} />
            </div>
            <span className="text-xs font-bold" style={{ color: scoreColor }}>{score}%</span>
          </div>
        </div>

        {place.source === 'osm' && (
          <div className="mt-1.5 text-dark-600 text-xs">📍 OpenStreetMap</div>
        )}
      </div>
    </div>
  );
}
