import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap, MapPin, Navigation, Brain, TrendingUp, Users, Search,
  AlertTriangle, Clock, Star, ArrowRight, Shield, Calendar, BarChart3,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyticsData, alerts as mockAlerts } from '../data/mockData';
import { getAIRecommendations } from '../utils/aiRecommendations';
import PlaceCard from '../components/PlaceCard';

const quickActions = [
  { icon: MapPin, label: 'Explorar', path: '/explore', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  { icon: Navigation, label: 'Rutas', path: '/routes', color: '#06b6d4', bg: 'rgba(6,182,212,0.15)' },
  { icon: Brain, label: 'IA Recomenda', path: '/recommendations', color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
  { icon: Shield, label: 'Emergencia', path: '/emergency', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  { icon: Calendar, label: 'Eventos', path: '/events', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  { icon: BarChart3, label: 'Dashboard', path: '/dashboard', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
];

export default function Home() {
  const { user, places, currentWeather, timeContext, searchHistory } = useApp();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [greeting, setGreeting] = useState('');
  const [liveTraffic, setLiveTraffic] = useState(67);

  useEffect(() => {
    const greetings = { morning: 'Buenos dias', afternoon: 'Buenas tardes', evening: 'Buenas tardes', night: 'Buenas noches' };
    setGreeting(greetings[timeContext] || 'Hola');

    const recs = getAIRecommendations(places, {
      timeContext, weather: currentWeather.current,
      user, searchHistory,
      currentHour: new Date().getHours(),
    });
    setRecommendations(recs.slice(0, 4));

    const interval = setInterval(() => {
      setLiveTraffic(prev => Math.min(100, Math.max(20, prev + (Math.random() - 0.5) * 8)));
    }, 3000);
    return () => clearInterval(interval);
  }, [places, timeContext, currentWeather, user, searchHistory]);

  const kpis = analyticsData.kpis;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(37,99,235,0.2) 0%, rgba(6,182,212,0.15) 50%, rgba(139,92,246,0.1) 100%)',
          border: '1px solid rgba(59,130,246,0.2)',
        }}>
        <div className="absolute inset-0 bg-mesh" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <div className="pulse-dot" />
            <span className="text-green-400 text-sm font-medium">Sistema activo</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            {greeting}, <span className="gradient-text">{user.displayName.split(' ')[0]}</span>
          </h1>
          <p className="text-dark-400 text-lg mb-6 max-w-xl">
            Tu ciudad inteligente en tiempo real. {Math.round(currentWeather.temp)}°C afuera —{' '}
            {currentWeather.description.toLowerCase()}.
          </p>

          <div className="flex gap-3 flex-wrap">
            <button className="btn-primary flex items-center gap-2" onClick={() => navigate('/explore')}>
              <Search size={16} />
              Explorar Ciudad
            </button>
            <button className="btn-ghost flex items-center gap-2" onClick={() => navigate('/routes')}>
              <Navigation size={16} />
              Optimizar Ruta
            </button>
          </div>
        </div>

        {/* Live traffic indicator */}
        <div className="absolute right-8 top-8 hidden lg:block">
          <div className="glass-card p-4 text-center w-36">
            <div className="text-3xl font-bold mb-1" style={{
              color: liveTraffic > 70 ? '#f87171' : liveTraffic > 40 ? '#facc15' : '#4ade80'
            }}>{Math.round(liveTraffic)}%</div>
            <div className="text-dark-400 text-xs">Trafico Urbano</div>
            <div className="mt-2 h-1.5 rounded-full bg-dark-700 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{
                width: `${liveTraffic}%`,
                background: liveTraffic > 70 ? '#ef4444' : liveTraffic > 40 ? '#f59e0b' : '#22c55e'
              }} />
            </div>
            <div className="flex items-center justify-center gap-1 mt-1.5">
              <div className="pulse-dot w-1.5 h-1.5" />
              <span className="text-green-400 text-xs">En vivo</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Usuarios Activos', value: kpis.activeUsers.toLocaleString(), icon: Users, color: '#3b82f6', change: '+12%' },
          { label: 'Lugares', value: kpis.totalPlaces, icon: MapPin, color: '#06b6d4', change: '+3' },
          { label: 'Busquedas Hoy', value: kpis.dailySearches.toLocaleString(), icon: Search, color: '#8b5cf6', change: '+8%' },
          { label: 'Satisfaccion', value: `${kpis.satisfactionRate}%`, icon: Star, color: '#10b981', change: '+2%' },
        ].map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="kpi-card">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <span className="badge badge-green text-xs">{change}</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-dark-400 text-xs mt-0.5">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Zap size={18} className="text-cyan-400" /> Acciones Rapidas
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {quickActions.map(({ icon: Icon, label, path, color, bg }) => (
            <button key={path} onClick={() => navigate(path)}
              className="glass-card-hover p-4 flex flex-col items-center gap-2.5 text-center">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform hover:scale-110"
                style={{ background: bg, border: `1px solid ${color}30` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <span className="text-dark-300 text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* AI Recommendations + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommendations */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Brain size={18} className="text-purple-400" />
              Recomendaciones IA
              <span className="badge badge-purple text-xs">LIVE</span>
            </h2>
            <button onClick={() => navigate('/recommendations')} className="text-blue-400 text-sm flex items-center gap-1 hover:text-blue-300">
              Ver mas <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendations.map(place => (
              <PlaceCard key={place.id} place={place} onClick={() => navigate('/explore')} />
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-yellow-400" />
            Alertas Activas
          </h2>
          <div className="space-y-3">
            {mockAlerts.map(alert => (
              <div key={alert.id} className="glass-card p-3 flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
                  alert.severity === 'critical' ? 'bg-red-400 animate-pulse' :
                  alert.severity === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                }`} />
                <div>
                  <p className="text-white text-xs leading-snug">{alert.message}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock size={10} className="text-dark-500" />
                    <span className="text-dark-500 text-xs">Hace {alert.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trending */}
          <h2 className="text-lg font-bold text-white mt-6 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-green-400" />
            Tendencias
          </h2>
          <div className="space-y-2">
            {places.filter(p => p.trend === 'up').slice(0, 3).map((place, i) => (
              <div key={place.id} className="glass-card-hover p-3 flex items-center gap-3"
                onClick={() => navigate('/explore')}>
                <span className="text-dark-400 text-sm font-bold w-5">#{i + 1}</span>
                <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{place.name}</p>
                  <p className="text-dark-400 text-xs">{place.visits.toLocaleString()} visitas</p>
                </div>
                <TrendingUp size={14} className="text-green-400 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
