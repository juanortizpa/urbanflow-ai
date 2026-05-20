import { useState } from 'react';
import { Layers, MapPin, Activity, Navigation, Thermometer, Shield, Music } from 'lucide-react';
import { useApp } from '../context/AppContext';
import InteractiveMap from '../components/InteractiveMap';
import { CALI_EVENTS } from '../data/caliEvents';

const layers = [
  { id: 'traffic', label: 'Trafico', icon: Activity, color: '#f59e0b' },
  { id: 'places', label: 'Lugares', icon: MapPin, color: '#3b82f6' },
  { id: 'routes', label: 'Rutas', icon: Navigation, color: '#06b6d4' },
  { id: 'heatmap', label: 'Calor', icon: Thermometer, color: '#ef4444' },
  { id: 'emergency', label: 'Emergencias', icon: Shield, color: '#f87171' },
  { id: 'events', label: 'Eventos', icon: Music, color: '#8b5cf6' },
];

const mapStyles = [
  { id: 'standard', label: 'Estandar' },
  { id: 'satellite', label: 'Satelite' },
];

export default function MapPage() {
  const { mapLayer, setMapLayer, liveTrafficZones } = useApp();
  const [activeLayers, setActiveLayers] = useState(new Set(['traffic', 'places']));
  const [filterCategory, setFilterCategory] = useState('all');

  const toggleLayer = (id) => {
    setActiveLayers(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const trafficLevelColor = { low: '#22c55e', medium: '#f59e0b', high: '#f97316', critical: '#ef4444' };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Mapa Inteligente</h1>
          <p className="text-dark-400 text-sm flex items-center gap-1.5 mt-0.5">
            <div className="pulse-dot w-1.5 h-1.5" />
            Datos en tiempo real
          </p>
        </div>

        {/* Map style */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {mapStyles.map(s => (
            <button key={s.id} onClick={() => setMapLayer(s.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                mapLayer === s.id ? 'bg-blue-500/20 text-blue-400' : 'text-dark-400 hover:text-white'
              }`}>{s.label}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map */}
        <div className="lg:col-span-3">
          <InteractiveMap
            height="580px"
            showTraffic={activeLayers.has('traffic')}
            showPlaces={activeLayers.has('places')}
            showRoutes={activeLayers.has('routes')}
            showHeatmap={activeLayers.has('heatmap')}
            showEmergency={activeLayers.has('emergency')}
            showEvents={activeLayers.has('events')}
            filterCategory={filterCategory}
          />
        </div>

        {/* Control panel */}
        <div className="space-y-4">
          {/* Layers */}
          <div className="glass-card p-4">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <Layers size={15} className="text-cyan-400" />
              Capas del Mapa
            </h3>
            <div className="space-y-1.5">
              {layers.map(layer => {
                const Icon = layer.icon;
                const isActive = activeLayers.has(layer.id);
                return (
                  <button key={layer.id} onClick={() => toggleLayer(layer.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left"
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                      border: isActive ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                    }}>
                    {/* Color dot indicator */}
                    <div className="w-1.5 h-6 rounded-full flex-shrink-0 transition-all duration-200"
                      style={{ background: isActive ? layer.color : 'rgba(100,116,139,0.3)' }} />
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: isActive ? `${layer.color}18` : 'rgba(255,255,255,0.04)' }}>
                      <Icon size={14} style={{ color: isActive ? layer.color : '#64748b' }} />
                    </div>
                    <span className={`text-sm font-medium flex-1 transition-colors ${isActive ? 'text-white' : 'text-slate-500'}`}>
                      {layer.label}
                    </span>
                    {/* Toggle */}
                    <div className="relative w-9 h-5 rounded-full flex-shrink-0 transition-all duration-300 cursor-pointer"
                      style={{ background: isActive ? '#3b82f6' : 'rgba(51,65,85,0.8)' }}>
                      <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300"
                        style={{ left: isActive ? '18px' : '2px', boxShadow: '0 1px 4px rgba(0,0,0,0.4)' }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Traffic zones */}
          <div className="glass-card p-4">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <Activity size={15} className="text-yellow-400" />
              Zonas de Trafico
            </h3>
            <div className="space-y-2">
              {liveTrafficZones.map(zone => (
                <div key={zone.id} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: trafficLevelColor[zone.level] }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{zone.name}</p>
                  </div>
                  <span className="text-xs font-bold" style={{ color: trafficLevelColor[zone.level] }}>
                    {zone.congestion}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Events impact */}
          <div className="glass-card p-4">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <Music size={15} className="text-purple-400" />
              Eventos Activos
            </h3>
            <div className="space-y-2">
              {CALI_EVENTS.slice(0, 4).map(event => (
                <div key={event.id} className="flex items-center gap-2 p-2 rounded-lg"
                  style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)' }}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    event.trafficImpact === 'high' ? 'bg-red-400' :
                    event.trafficImpact === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                  }`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-xs truncate font-medium">{event.title}</p>
                    <p className="text-dark-500 text-xs">{event.venue}</p>
                  </div>
                  <span className="text-purple-400 text-xs font-medium flex-shrink-0">
                    {event.price === 0 ? 'Gratis' : `$${(event.price/1000).toFixed(0)}k`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
