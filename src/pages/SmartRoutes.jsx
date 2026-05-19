import { useState, useEffect } from 'react';
import { Navigation, Clock, DollarSign, TrendingUp, Zap, MapPin, Bus, Bike, Car, ArrowRight } from 'lucide-react';
import { calculateOptimalRoute, predictTraffic } from '../utils/dijkstra';
import { routes as busRoutes } from '../data/mockData';
import { useApp } from '../context/AppContext';
import InteractiveMap from '../components/InteractiveMap';

const nodes = [
  'Terminal Cali', 'Av. Colombia', 'Hospital Valle', 'Plaza Caicedo',
  'Parque del Perro', 'Museo La Tertulia', 'El Peñón', 'Chipichape',
  'Galería Alameda', 'Unicentro', 'Zona Industrial Acopi',
];

const transportIcons = { bus: Bus, bike: Bike, taxi: Car };
const transportColors = { bus: '#3b82f6', bike: '#10b981', taxi: '#f59e0b' };

export default function SmartRoutes() {
  const { liveTrafficZones } = useApp();
  const [from, setFrom] = useState('Terminal Cali');
  const [to, setTo] = useState('Plaza Caicedo');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trafficPrediction, setTrafficPrediction] = useState(null);

  useEffect(() => {
    const now = new Date();
    const predicted = predictTraffic(now.getHours(), now.getDay());
    setTrafficPrediction(predicted);
  }, []);

  const calculateRoute = () => {
    setLoading(true);
    setTimeout(() => {
      const route = calculateOptimalRoute(from, to, liveTrafficZones);
      setResult(route);
      setLoading(false);
    }, 800);
  };

  const congestionColor = (level) =>
    level > 70 ? '#ef4444' : level > 40 ? '#f59e0b' : '#22c55e';

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">SmartFlow - Rutas Inteligentes</h1>
        <p className="text-dark-400 text-sm mt-0.5">Algoritmo Dijkstra + IA de prediccion de trafico</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Route calculator */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Zap size={15} className="text-cyan-400" />
              Calculador de Ruta
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-dark-400 text-xs font-medium mb-1.5 block">Origen</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                  <select value={from} onChange={e => setFrom(e.target.value)}
                    className="input-field pl-8 text-sm">
                    {nodes.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-px h-4 bg-dark-600" />
                  <ArrowRight size={14} className="text-dark-500 rotate-90" />
                  <div className="w-px h-4 bg-dark-600" />
                </div>
              </div>
              <div>
                <label className="text-dark-400 text-xs font-medium mb-1.5 block">Destino</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
                  <select value={to} onChange={e => setTo(e.target.value)}
                    className="input-field pl-8 text-sm">
                    {nodes.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={calculateRoute} disabled={loading || from === to}
                className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Calculando...</>
                ) : (
                  <><Navigation size={15} /> Calcular Ruta Optima</>
                )}
              </button>
            </div>
          </div>

          {/* Traffic prediction */}
          {trafficPrediction !== null && (
            <div className="glass-card p-5">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <TrendingUp size={15} className="text-yellow-400" />
                Prediccion IA
              </h3>
              <div className="text-center mb-3">
                <div className="text-4xl font-bold" style={{ color: congestionColor(trafficPrediction) }}>
                  {Math.round(trafficPrediction)}%
                </div>
                <div className="text-dark-400 text-xs mt-1">Congestion predicha ahora</div>
              </div>
              <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${trafficPrediction}%`, background: congestionColor(trafficPrediction) }} />
              </div>
              <p className="text-dark-500 text-xs text-center mt-2">
                {trafficPrediction > 70 ? 'Alto trafico — considera salir mas tarde'
                  : trafficPrediction > 40 ? 'Trafico moderado — tiempo normal'
                  : 'Trafico bajo — buen momento para salir'}
              </p>
            </div>
          )}

          {/* Bus routes */}
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Bus size={15} className="text-blue-400" />
              Rutas de Bus
            </h3>
            <div className="space-y-2">
              {busRoutes.map(route => (
                <div key={route.id} className="p-3 rounded-xl hover:bg-white/5 transition-colors"
                  style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full" style={{ background: route.color }} />
                    <span className="text-white text-sm font-medium">{route.name}</span>
                  </div>
                  <p className="text-dark-400 text-xs">{route.from} → {route.to}</p>
                  <div className="flex gap-3 mt-2 text-xs">
                    <span className="text-dark-400"><Clock size={10} className="inline mr-0.5" />{route.time} min</span>
                    <span className="text-green-400"><DollarSign size={10} className="inline" />${route.cost}</span>
                    <span style={{ color: congestionColor(route.congestion) }}>{route.congestion}% congestion</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results + Map */}
        <div className="lg:col-span-2 space-y-4">
          {result && (
            <div className="glass-card p-5 animate-slide-up">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Navigation size={16} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Ruta Optima Encontrada</h3>
                  <p className="text-dark-400 text-xs">Algoritmo Dijkstra aplicado con datos de trafico en tiempo real</p>
                </div>
              </div>

              {/* Path */}
              <div className="flex items-center gap-1 flex-wrap mb-4">
                {result.path.map((node, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="px-2 py-1 rounded-lg text-xs font-medium text-white"
                      style={{ background: i === 0 ? 'rgba(59,130,246,0.3)' : i === result.path.length - 1 ? 'rgba(6,182,212,0.3)' : 'rgba(255,255,255,0.07)' }}>
                      {node}
                    </span>
                    {i < result.path.length - 1 && <ArrowRight size={10} className="text-dark-500" />}
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Distancia', value: `${result.distance?.toFixed(1)} km`, icon: MapPin, color: '#3b82f6' },
                  { label: 'Tiempo', value: `${result.estimatedTime} min`, icon: Clock, color: '#06b6d4' },
                  { label: 'Costo', value: `$${result.estimatedCost}`, icon: DollarSign, color: '#10b981' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="text-center p-3 rounded-xl" style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
                    <Icon size={18} style={{ color }} className="mx-auto mb-1" />
                    <div className="text-white font-bold">{value}</div>
                    <div className="text-dark-400 text-xs">{label}</div>
                  </div>
                ))}
              </div>

              {/* Alternatives */}
              <div>
                <h4 className="text-dark-400 text-xs font-medium mb-2">Alternativas de Transporte</h4>
                <div className="grid grid-cols-3 gap-2">
                  {result.alternatives?.map(alt => {
                    const Icon = transportIcons[alt.type] || Car;
                    const color = transportColors[alt.type] || '#94a3b8';
                    return (
                      <div key={alt.name} className="p-3 rounded-xl text-center"
                        style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
                        <Icon size={18} style={{ color }} className="mx-auto mb-1" />
                        <div className="text-white text-xs font-bold">{alt.time} min</div>
                        <div className="text-green-400 text-xs">${alt.cost}</div>
                        <div className="text-dark-500 text-xs mt-1">{alt.name}</div>
                        <span className={`badge text-xs mt-1 ${
                          alt.traffic === 'low' ? 'badge-green' : alt.traffic === 'none' ? 'badge-green' : 'badge-yellow'
                        }`}>{alt.traffic === 'none' ? 'Sin trafico' : alt.traffic}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <InteractiveMap
            height={result ? '340px' : '520px'}
            showRoutes={true}
            showTraffic={true}
            showPlaces={false}
          />
        </div>
      </div>
    </div>
  );
}
