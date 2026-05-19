import { useState } from 'react';
import { Settings, Users, MapPin, Activity, BarChart3, Shield, Trash2, Edit, Plus, Eye, TrendingUp } from 'lucide-react';
import { places, events, analyticsData } from '../data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');
  const [managedPlaces, setManagedPlaces] = useState(places);

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: BarChart3 },
    { id: 'places', label: 'Lugares', icon: MapPin },
    { id: 'events', label: 'Eventos', icon: Activity },
    { id: 'users', label: 'Usuarios', icon: Users },
  ];

  const mockUsers = [
    { id: 1, name: 'Alex Rodriguez', email: 'alex@example.com', role: 'admin', status: 'active', joined: '2024-01-15' },
    { id: 2, name: 'Maria Lopez', email: 'maria@example.com', role: 'user', status: 'active', joined: '2024-02-20' },
    { id: 3, name: 'Carlos Perez', email: 'carlos@example.com', role: 'user', status: 'inactive', joined: '2024-03-10' },
    { id: 4, name: 'Ana Garcia', email: 'ana@example.com', role: 'moderator', status: 'active', joined: '2024-01-28' },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="text-blue-400" size={22} />
            Panel Administrativo
          </h1>
          <p className="text-dark-400 text-sm mt-0.5">Control total de la plataforma UrbanFlow AI</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <Shield size={13} className="text-red-400" />
          <span className="text-red-400 text-xs font-medium">Acceso Admin</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.05)' }}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === id ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-dark-400 hover:text-white'
            }`}>
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-5 animate-fade-in">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Usuarios', value: '12,480', icon: Users, color: '#3b82f6', change: '+245 hoy' },
              { label: 'Lugares Activos', value: places.length, icon: MapPin, color: '#06b6d4', change: `+${analyticsData.kpis.newPlaces} nuevos` },
              { label: 'Eventos Activos', value: events.length, icon: Activity, color: '#8b5cf6', change: 'Esta semana' },
              { label: 'Busquedas Hoy', value: '3,240', icon: TrendingUp, color: '#10b981', change: '+8.2%' },
            ].map(({ label, value, icon: Icon, color, change }) => (
              <div key={label} className="kpi-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${color}18`, border: `1px solid ${color}25` }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <span className="text-green-400 text-xs">{change}</span>
                </div>
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-dark-500 text-xs">{label}</div>
              </div>
            ))}
          </div>

          {/* Traffic chart */}
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4">Actividad de la Plataforma (7 dias)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={analyticsData.weeklyActivity}>
                <defs>
                  <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" fill="url(#adminGrad)" strokeWidth={2} name="Usuarios" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'places' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <p className="text-dark-400 text-sm">{places.length} lugares registrados</p>
            <button className="btn-primary flex items-center gap-2 text-sm py-2">
              <Plus size={14} /> Nuevo Lugar
            </button>
          </div>
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                  <th className="text-left text-dark-400 font-medium px-4 py-3">Lugar</th>
                  <th className="text-left text-dark-400 font-medium px-4 py-3">Categoria</th>
                  <th className="text-left text-dark-400 font-medium px-4 py-3">Rating</th>
                  <th className="text-left text-dark-400 font-medium px-4 py-3">Visitas</th>
                  <th className="text-left text-dark-400 font-medium px-4 py-3">Estado</th>
                  <th className="text-left text-dark-400 font-medium px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {managedPlaces.slice(0, 8).map(place => (
                  <tr key={place.id} className="transition-colors hover:bg-white/3"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={place.image} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                        <span className="text-white font-medium text-xs">{place.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge badge-blue text-xs">{place.category}</span>
                    </td>
                    <td className="px-4 py-3 text-white text-xs">⭐ {place.rating}</td>
                    <td className="px-4 py-3 text-dark-300 text-xs">{place.visits.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="badge badge-green text-xs">Activo</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-blue-500/20 text-dark-400 hover:text-blue-400 transition-colors">
                          <Eye size={13} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-yellow-500/20 text-dark-400 hover:text-yellow-400 transition-colors">
                          <Edit size={13} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-red-500/20 text-dark-400 hover:text-red-400 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="glass-card overflow-hidden animate-fade-in">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                <th className="text-left text-dark-400 font-medium px-4 py-3">Usuario</th>
                <th className="text-left text-dark-400 font-medium px-4 py-3">Rol</th>
                <th className="text-left text-dark-400 font-medium px-4 py-3">Estado</th>
                <th className="text-left text-dark-400 font-medium px-4 py-3">Registro</th>
                <th className="text-left text-dark-400 font-medium px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map(u => (
                <tr key={u.id} className="hover:bg-white/3 transition-colors"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                        alt="" className="w-8 h-8 rounded-lg" />
                      <div>
                        <p className="text-white text-xs font-medium">{u.name}</p>
                        <p className="text-dark-500 text-xs">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge text-xs ${
                      u.role === 'admin' ? 'badge-red' :
                      u.role === 'moderator' ? 'badge-purple' : 'badge-blue'
                    }`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge text-xs ${u.status === 'active' ? 'badge-green' : 'badge-yellow'}`}>
                      {u.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-dark-400 text-xs">{u.joined}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-blue-500/20 text-dark-400 hover:text-blue-400 transition-colors">
                        <Edit size={13} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-500/20 text-dark-400 hover:text-red-400 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {events.map(event => (
            <div key={event.id} className="glass-card-hover p-4 flex gap-4">
              <img src={event.image} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm">{event.name}</h3>
                <p className="text-dark-400 text-xs mt-0.5">{event.date} · {event.time}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="badge badge-purple text-xs">{event.category}</span>
                  <span className={`badge text-xs ${
                    event.impact === 'very_high' ? 'badge-red' : event.impact === 'high' ? 'badge-yellow' : 'badge-green'
                  }`}>Impacto {event.impact}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button className="p-1.5 rounded-lg hover:bg-yellow-500/20 text-dark-400 hover:text-yellow-400 transition-colors">
                  <Edit size={13} />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-red-500/20 text-dark-400 hover:text-red-400 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
