import { useState } from 'react';
import { Shield, Phone, MapPin, AlertTriangle, Heart, Siren, Navigation, Clock } from 'lucide-react';
import { places } from '../data/mockData';
import InteractiveMap from '../components/InteractiveMap';

const emergencyContacts = [
  { name: 'Emergencias', number: '911', icon: Siren, color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  { name: 'Policia', number: '101', icon: Shield, color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  { name: 'Bomberos', number: '102', icon: AlertTriangle, color: '#f97316', bg: 'rgba(249,115,22,0.15)' },
  { name: 'Cruz Roja', number: '131', icon: Heart, color: '#f43f5e', bg: 'rgba(244,63,94,0.15)' },
];

const emergencyTips = [
  { title: 'En caso de accidente', steps: ['Llama al 911 inmediatamente', 'No muevas a los heridos', 'Sena la zona para otros conductores', 'Espera a los servicios de emergencia'] },
  { title: 'En caso de incendio', steps: ['Evacua el area inmediatamente', 'Llama al 102', 'No uses ascensores', 'Reune en punto de encuentro designado'] },
  { title: 'En caso de emergencia medica', steps: ['Llama al 911', 'Indica la ubicacion exacta', 'No muevas al paciente si tiene trauma', 'Aplica primeros auxilios basicos'] },
];

export default function Emergency() {
  const [activeTab, setActiveTab] = useState('contacts');
  const emergencyPlaces = places.filter(p => p.isEmergency || p.category === 'emergency');

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Emergency banner */}
      <div className="p-5 rounded-2xl" style={{
        background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.05))',
        border: '1px solid rgba(239,68,68,0.4)',
      }}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse"
            style={{ background: 'rgba(239,68,68,0.3)', border: '2px solid rgba(239,68,68,0.5)' }}>
            <Siren size={28} className="text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Modo Emergencia</h1>
            <p className="text-red-300 text-sm">Servicios de emergencia y rutas rapidas activas</p>
          </div>
          <div className="ml-auto hidden md:block">
            <a href="tel:911" className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-lg"
              style={{ background: '#ef4444', boxShadow: '0 0 30px rgba(239,68,68,0.5)' }}>
              <Phone size={20} />
              911
            </a>
          </div>
        </div>
      </div>

      {/* Emergency contacts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {emergencyContacts.map(({ name, number, icon: Icon, color, bg }) => (
          <a key={name} href={`tel:${number}`}
            className="glass-card-hover p-5 text-center flex flex-col items-center gap-3 group">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ background: bg, border: `2px solid ${color}40` }}>
              <Icon size={24} style={{ color }} />
            </div>
            <div>
              <p className="text-white font-bold text-lg">{number}</p>
              <p className="text-dark-400 text-xs">{name}</p>
            </div>
            <div className="flex items-center gap-1 text-xs" style={{ color }}>
              <Phone size={10} />
              <span>Llamar ahora</span>
            </div>
          </a>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.05)' }}>
        {[
          { id: 'contacts', label: 'Lugares cercanos' },
          { id: 'map', label: 'Mapa de emergencias' },
          { id: 'tips', label: 'Protocolos' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-dark-400 hover:text-white'
            }`}>{tab.label}</button>
        ))}
      </div>

      {activeTab === 'contacts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {emergencyPlaces.map(place => (
            <div key={place.id} className="glass-card-hover p-4 flex gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm">{place.name}</h3>
                <p className="text-dark-400 text-xs mb-2">{place.description}</p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="badge badge-red">24/7</span>
                  <span className="text-dark-400 flex items-center gap-1">
                    <MapPin size={10} /> Lat: {place.lat.toFixed(4)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="btn-ghost text-xs py-1.5 px-3 border-red-500/30 text-red-400 hover:border-red-500/50">
                  <Navigation size={12} className="mx-auto" />
                </button>
                <button className="btn-ghost text-xs py-1.5 px-3">
                  <Phone size={12} className="mx-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'map' && (
        <div className="animate-fade-in">
          <InteractiveMap height="500px" showPlaces filterCategory="emergency" showTraffic={false} />
        </div>
      )}

      {activeTab === 'tips' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
          {emergencyTips.map(({ title, steps }) => (
            <div key={title} className="glass-card p-5">
              <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                <AlertTriangle size={15} className="text-red-400" />
                {title}
              </h3>
              <ol className="space-y-2">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                      style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                      {i + 1}
                    </span>
                    <span className="text-dark-300 text-xs">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
