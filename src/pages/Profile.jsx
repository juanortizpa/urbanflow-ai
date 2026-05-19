import { useState } from 'react';
import { User, Star, Heart, MapPin, Settings, Camera, Bell, Shield, Brain, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyticsData } from '../data/mockData';

const interests = ['cafes', 'restaurants', 'bars', 'parks', 'culture', 'sports', 'shopping', 'desserts'];

export default function Profile() {
  const { user, setUser, favorites, places, searchHistory, notifications } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ displayName: user.displayName, email: user.email });

  const favoritePlaces = places.filter(p => favorites.includes(p.id));

  const toggleInterest = (interest) => {
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        interests: prev.preferences.interests.includes(interest)
          ? prev.preferences.interests.filter(i => i !== interest)
          : [...prev.preferences.interests, interest],
      },
    }));
  };

  const handleSave = () => {
    setUser(prev => ({ ...prev, ...form }));
    setEditing(false);
  };

  const stats = [
    { label: 'Favoritos', value: favorites.length, icon: Heart, color: '#f43f5e' },
    { label: 'Busquedas', value: searchHistory.length, icon: Search, color: '#3b82f6' },
    { label: 'Alertas', value: notifications.length, icon: Bell, color: '#f59e0b' },
    { label: 'Lugares', value: places.length, icon: MapPin, color: '#10b981' },
  ];

  return (
    <div className="space-y-5 animate-fade-in max-w-4xl">
      {/* Profile hero */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="relative">
            <img src={user.photoURL} alt="avatar"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20" />
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', border: '2px solid #020617' }}>
              <Camera size={12} className="text-white" />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-white">{user.displayName}</h2>
              {user.isPremium && <span className="badge badge-cyan">PRO</span>}
            </div>
            <p className="text-dark-400 text-sm mb-3">{user.email}</p>
            <div className="flex items-center gap-1.5">
              <div className="pulse-dot w-2 h-2" />
              <span className="text-green-400 text-sm">Online · UrbanFlow AI</span>
            </div>
          </div>
          <button onClick={() => setEditing(!editing)} className="btn-ghost flex items-center gap-2 text-sm">
            <Settings size={14} />
            {editing ? 'Cancelar' : 'Editar'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-5 pt-5 border-t border-white/5">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="text-center">
              <div className="flex justify-center mb-1">
                <Icon size={18} style={{ color }} />
              </div>
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="text-dark-500 text-xs">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.05)' }}>
        {[
          { id: 'profile', label: 'Perfil' },
          { id: 'preferences', label: 'Preferencias' },
          { id: 'activity', label: 'Actividad' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-dark-400 hover:text-white'
            }`}>{tab.label}</button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="space-y-4 animate-fade-in">
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4">Informacion Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-dark-400 text-xs font-medium mb-1.5 block">Nombre</label>
                {editing ? (
                  <input value={form.displayName} onChange={e => setForm(p => ({ ...p, displayName: e.target.value }))}
                    className="input-field" />
                ) : (
                  <p className="text-white p-2.5 rounded-xl bg-dark-800/50">{user.displayName}</p>
                )}
              </div>
              <div>
                <label className="text-dark-400 text-xs font-medium mb-1.5 block">Email</label>
                {editing ? (
                  <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="input-field" />
                ) : (
                  <p className="text-white p-2.5 rounded-xl bg-dark-800/50">{user.email}</p>
                )}
              </div>
              <div>
                <label className="text-dark-400 text-xs font-medium mb-1.5 block">Tipo de cuenta</label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-dark-800/50">
                  <Shield size={14} className="text-cyan-400" />
                  <span className="text-white text-sm">{user.isPremium ? 'UrbanFlow PRO' : 'Gratuito'}</span>
                </div>
              </div>
            </div>
            {editing && (
              <div className="flex gap-3 mt-4">
                <button onClick={handleSave} className="btn-primary text-sm py-2">Guardar cambios</button>
                <button onClick={() => setEditing(false)} className="btn-ghost text-sm py-2">Cancelar</button>
              </div>
            )}
          </div>

          {/* Favorite places */}
          {favoritePlaces.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Heart size={15} className="text-red-400 fill-red-400" />
                Lugares Favoritos ({favoritePlaces.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {favoritePlaces.map(place => (
                  <div key={place.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                    <img src={place.image} alt={place.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{place.name}</p>
                      <p className="text-dark-400 text-xs">{place.category} · ⭐ {place.rating}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="space-y-4 animate-fade-in">
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Brain size={15} className="text-purple-400" />
              Intereses (la IA usa esto para personalizar)
            </h3>
            <div className="flex gap-2 flex-wrap">
              {interests.map(interest => (
                <button key={interest} onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                    user.preferences.interests.includes(interest)
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-white/5 text-dark-400 border border-white/8 hover:text-white'
                  }`}>{interest}</button>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4">Presupuesto Preferido</h3>
            <div className="grid grid-cols-3 gap-3">
              {['low', 'medium', 'high'].map(b => (
                <button key={b} onClick={() => setUser(prev => ({ ...prev, preferences: { ...prev.preferences, budget: b } }))}
                  className={`p-4 rounded-xl text-center transition-all ${
                    user.preferences.budget === b ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400' : 'bg-white/5 text-dark-400 hover:text-white border border-white/8'
                  }`}>
                  <div className="text-2xl mb-1">{b === 'low' ? '💚' : b === 'medium' ? '💙' : '💜'}</div>
                  <div className="font-medium capitalize text-sm">{b === 'low' ? 'Economico' : b === 'medium' ? 'Moderado' : 'Premium'}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="space-y-4 animate-fade-in">
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4">Historial de Busquedas</h3>
            <div className="space-y-2">
              {searchHistory.length > 0 ? searchHistory.map((term, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                  <Search size={13} className="text-dark-500" />
                  <span className="text-dark-300 text-sm">{term}</span>
                  <span className="ml-auto badge badge-blue text-xs">Busqueda</span>
                </div>
              )) : (
                <p className="text-dark-400 text-sm text-center py-4">Sin busquedas recientes</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
