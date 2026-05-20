import { useState, useEffect, useMemo } from 'react';
import { Brain, Cloud, CloudRain, Sun, Clock, DollarSign, Sparkles, RefreshCw, Filter, MapPin, Star, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getAIRecommendations, generateDayPlan } from '../utils/aiRecommendations';
import RecommendationCard from '../components/RecommendationCard';
import PlaceCard from '../components/PlaceCard';

const budgets = [
  { id: 'low', label: 'Economico', desc: 'Hasta $10', icon: '💚' },
  { id: 'medium', label: 'Moderado', desc: '$10-20', icon: '💙' },
  { id: 'high', label: 'Premium', desc: '$20+', icon: '💜' },
];

const interestOptions = [
  { id: 'cafes', label: 'Cafes', emoji: '☕' },
  { id: 'restaurants', label: 'Restaurantes', emoji: '🍽️' },
  { id: 'bars', label: 'Bares', emoji: '🍸' },
  { id: 'parks', label: 'Naturaleza', emoji: '🌳' },
  { id: 'culture', label: 'Cultura', emoji: '🎭' },
  { id: 'sports', label: 'Deporte', emoji: '⚽' },
  { id: 'shopping', label: 'Compras', emoji: '🛍️' },
  { id: 'desserts', label: 'Postres', emoji: '🍦' },
];

function AIReasonForPlace(place, context) {
  const { timeContext, weather, budget } = context;
  const reasons = [];
  if (place.popularAt?.includes(timeContext)) reasons.push(`Popular en ${timeContext === 'morning' ? 'la manana' : timeContext === 'afternoon' ? 'la tarde' : 'la noche'}`);
  if (weather === 'rainy' && place.type === 'indoor') reasons.push('Ideal para clima lluvioso');
  if (place.trend === 'up') reasons.push('Tendencia al alza esta semana');
  if (place.rating >= 4.7) reasons.push(`Altamente valorado (${place.rating}★)`);
  if (budget === 'low' && place.price <= 8) reasons.push('Excelente precio para tu presupuesto');
  if (reasons.length === 0) reasons.push('Recomendado basado en tu historial');
  return reasons.slice(0, 2).join(' · ');
}

const PAGE_SIZE = 12;

export default function Recommendations() {
  const { places, user, currentWeather, timeContext, searchHistory, userCoords, favorites, openPlaceDetail } = useApp();
  const [activeTab, setActiveTab] = useState('ai');
  const [dayPlanConfig, setDayPlanConfig] = useState({ budget: 'medium', hours: 4, interests: ['cafes', 'restaurants'] });
  const [dayPlan, setDayPlan] = useState(null);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const aiContext = useMemo(() => ({
    timeContext,
    weather: currentWeather,
    user,
    searchHistory,
    currentHour: new Date().getHours(),
    budget: user?.preferences?.budget || 'medium',
    userCoords,
    favorites,
  }), [timeContext, currentWeather, user, searchHistory, userCoords, favorites]);

  const allRecommendations = useMemo(() =>
    getAIRecommendations(places, aiContext),
    [places, aiContext]
  );

  const recommendations = allRecommendations.slice(0, visibleCount);
  const hasMore = visibleCount < allRecommendations.length;

  const toggleInterest = (id) => {
    setDayPlanConfig(prev => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id],
    }));
  };

  const handleGeneratePlan = () => {
    setGeneratingPlan(true);
    setTimeout(() => {
      const plan = generateDayPlan(dayPlanConfig, places);
      setDayPlan(plan);
      setGeneratingPlan(false);
    }, 1200);
  };

  const weatherLabels = { sunny: 'Soleado', rainy: 'Lluvioso', cloudy: 'Nublado', partly_cloudy: 'Parcialmente nublado', clear: 'Despejado' };
  const timeLabels = { morning: 'Manana', afternoon: 'Tarde', evening: 'Tarde-noche', night: 'Noche' };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="text-purple-400" size={24} />
            Recomendaciones IA
          </h1>
          <p className="text-dark-400 text-sm mt-0.5">
            Personalizadas para ti ahora — {timeLabels[timeContext]}, {weatherLabels[currentWeather.current]}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
            <Sparkles size={13} className="text-purple-400" />
            <span className="text-purple-300 text-xs font-medium">IA Activa</span>
          </div>
        </div>
      </div>

      {/* Context chips */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: `⏰ ${timeLabels[timeContext]}`, color: 'badge-blue' },
          { label: `🌤 ${Math.round(currentWeather.temp)}°C`, color: 'badge-cyan' },
          { label: `💼 ${user.preferences.budget === 'medium' ? 'Presupuesto moderado' : user.preferences.budget}`, color: 'badge-green' },
          { label: `🔍 ${searchHistory.slice(0, 1)[0] || 'Sin historial'}`, color: 'badge-purple' },
        ].map(({ label, color }) => (
          <span key={label} className={`badge ${color}`}>{label}</span>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.05)' }}>
        {[
          { id: 'ai', label: 'Para Ti', icon: Brain },
          { id: 'plan', label: 'Que Hacer Hoy', icon: Sparkles },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === id ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-dark-400 hover:text-white'
            }`}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {activeTab === 'ai' && (
        <div className="space-y-4">
          <p className="text-dark-400 text-xs">
            {allRecommendations.length} lugares encontrados — mostrando {Math.min(visibleCount, allRecommendations.length)}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((place, i) => (
              <RecommendationCard
                key={place.id}
                place={place}
                score={place.aiMatch || Math.max(10, 95 - i * 3)}
                reason={place.aiReason || 'Recomendado para ti'}
                rank={i + 1}
              />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}
              >
                <RefreshCw size={14} />
                Cargar más ({allRecommendations.length - visibleCount} restantes)
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'plan' && (
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Filter size={15} className="text-cyan-400" />
              Configurar mi Plan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Budget */}
              <div>
                <label className="text-dark-400 text-xs font-medium mb-2 block">Presupuesto</label>
                <div className="space-y-2">
                  {budgets.map(b => (
                    <button key={b.id} onClick={() => setDayPlanConfig(p => ({ ...p, budget: b.id }))}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                        dayPlanConfig.budget === b.id
                          ? 'bg-blue-500/20 border border-blue-500/30'
                          : 'bg-white/3 border border-white/6 hover:bg-white/7'
                      }`}>
                      <span className="text-xl">{b.icon}</span>
                      <div>
                        <p className="text-white text-sm font-medium">{b.label}</p>
                        <p className="text-dark-400 text-xs">{b.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time */}
              <div>
                <label className="text-dark-400 text-xs font-medium mb-2 block">
                  Tiempo disponible: <span className="text-white font-bold">{dayPlanConfig.hours}h</span>
                </label>
                <input type="range" min="2" max="8" step="1" value={dayPlanConfig.hours}
                  onChange={e => setDayPlanConfig(p => ({ ...p, hours: parseInt(e.target.value) }))}
                  className="w-full accent-blue-500 mb-2" />
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {[2, 4, 6, 8].map(h => (
                    <button key={h} onClick={() => setDayPlanConfig(p => ({ ...p, hours: h }))}
                      className={`py-2 rounded-lg text-xs font-medium transition-all ${
                        dayPlanConfig.hours === h ? 'bg-blue-500/20 text-blue-400' : 'bg-dark-700 text-dark-400 hover:text-white'
                      }`}>{h}h</button>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="text-dark-400 text-xs font-medium mb-2 block">Intereses</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {interestOptions.map(opt => (
                    <button key={opt.id} onClick={() => toggleInterest(opt.id)}
                      className={`flex items-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                        dayPlanConfig.interests.includes(opt.id)
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-dark-700 text-dark-400 hover:text-white border border-transparent'
                      }`}>
                      <span>{opt.emoji}</span> {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={handleGeneratePlan} disabled={generatingPlan}
              className="btn-primary flex items-center gap-2 mt-5">
              {generatingPlan ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generando plan con IA...</>
              ) : (
                <><Sparkles size={15} /> Generar Mi Plan del Dia</>
              )}
            </button>
          </div>

          {dayPlan && (
            <div className="glass-card p-5 animate-slide-up" style={{ border: '1px solid rgba(139,92,246,0.3)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}>
                  <Sparkles size={18} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Tu Plan Perfecto</h3>
                  <p className="text-dark-400 text-xs">{dayPlan.summary}</p>
                </div>
                <div className="ml-auto flex gap-3">
                  <div className="text-center">
                    <div className="text-green-400 font-bold">${dayPlan.totalCost}</div>
                    <div className="text-dark-500 text-xs">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-400 font-bold">{dayPlan.totalTime}</div>
                    <div className="text-dark-500 text-xs">Duracion</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {dayPlan.plan.map(({ order, place, startTime, endTime, duration }) => (
                  <div key={place.id} className="flex items-center gap-4 p-3 rounded-xl cursor-pointer hover:bg-white/6 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                    onClick={() => openPlaceDetail(place)}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                      style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', color: 'white' }}>
                      {order}
                    </div>
                    <img src={place.image} alt={place.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm">{place.name}</p>
                      <p className="text-dark-400 text-xs">{place.description.slice(0, 60)}...</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-white text-sm font-medium">{startTime} - {endTime}</div>
                      <div className="text-dark-500 text-xs">{duration}</div>
                      <div className="text-green-400 text-xs">{place.price === 0 ? 'Gratis' : `$${place.price}`}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-dark-400 text-sm">
                  <MapPin size={13} />
                  <span>Ruta sugerida: {dayPlan.route}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
