import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, Users, MapPin, Search, Star, Activity, Zap, Clock } from 'lucide-react';
import { analyticsData, places, trafficZones } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <p className="text-white font-medium mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [period, setPeriod] = useState('week');
  const { kpis, trafficByHour, popularZones, weeklyActivity, categoryDistribution } = analyticsData;

  const kpiCards = [
    { label: 'Usuarios Activos', value: kpis.activeUsers.toLocaleString(), change: '+12.5%', icon: Users, color: '#3b82f6', trend: 'up' },
    { label: 'Lugares Registrados', value: kpis.totalPlaces, change: '+3 nuevos', icon: MapPin, color: '#06b6d4', trend: 'up' },
    { label: 'Busquedas Diarias', value: kpis.dailySearches.toLocaleString(), change: '+8.2%', icon: Search, color: '#8b5cf6', trend: 'up' },
    { label: 'Trafico Promedio', value: `${kpis.avgTraffic}%`, change: '-5%', icon: Activity, color: '#f59e0b', trend: 'down' },
    { label: 'Satisfaccion', value: `${kpis.satisfactionRate}%`, change: '+2%', icon: Star, color: '#10b981', trend: 'up' },
    { label: 'Nuevos Lugares', value: kpis.newPlaces, change: 'este mes', icon: Zap, color: '#f43f5e', trend: 'up' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Analitico</h1>
          <p className="text-dark-400 text-sm flex items-center gap-1.5 mt-0.5">
            <div className="pulse-dot w-1.5 h-1.5" />
            Actualizacion en tiempo real
          </p>
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {['day', 'week', 'month'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                period === p ? 'bg-blue-500/20 text-blue-400' : 'text-dark-400 hover:text-white'
              }`}>{p === 'day' ? 'Hoy' : p === 'week' ? 'Semana' : 'Mes'}</button>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map(({ label, value, change, icon: Icon, color, trend }) => (
          <div key={label} className="kpi-card">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${color}18`, border: `1px solid ${color}25` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {change}
              </span>
            </div>
            <div className="text-xl font-bold text-white">{value}</div>
            <div className="text-dark-500 text-xs mt-0.5 line-clamp-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic by hour */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Activity size={16} className="text-yellow-400" />
            Trafico por Hora
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trafficByHour}>
              <defs>
                <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="traffic" stroke="#f59e0b" fill="url(#trafficGrad)" strokeWidth={2} name="Trafico %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly activity */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Users size={16} className="text-blue-400" />
            Actividad Semanal
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Usuarios" />
              <Bar dataKey="places" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Busquedas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category distribution */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Zap size={16} className="text-purple-400" />
            Categorias
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                paddingAngle={3} dataKey="value">
                {categoryDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {categoryDistribution.map(cat => (
              <div key={cat.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                <span className="text-dark-400 text-xs truncate">{cat.name}</span>
                <span className="text-white text-xs font-medium ml-auto">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular zones */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <MapPin size={16} className="text-cyan-400" />
            Zonas Populares
          </h3>
          <div className="space-y-3">
            {popularZones.map((zone, i) => {
              const maxVisits = Math.max(...popularZones.map(z => z.visits));
              const pct = Math.round((zone.visits / maxVisits) * 100);
              const colors = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];
              return (
                <div key={zone.zone}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm font-medium">{zone.zone}</span>
                    <span className="text-dark-400 text-xs">{zone.visits.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${pct}%`, background: colors[i] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Traffic zones status */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Activity size={16} className="text-yellow-400" />
            Estado del Trafico
          </h3>
          <div className="space-y-3">
            {trafficZones.map(zone => {
              const color = zone.level === 'critical' ? '#ef4444' : zone.level === 'high' ? '#f97316' : zone.level === 'medium' ? '#f59e0b' : '#22c55e';
              return (
                <div key={zone.id} className="p-3 rounded-xl" style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-xs font-semibold">{zone.name}</span>
                    <span className="text-xs font-bold" style={{ color }}>{zone.congestion}%</span>
                  </div>
                  <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${zone.congestion}%`, background: color }} />
                  </div>
                  <p className="text-dark-500 text-xs mt-1">{zone.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top places table */}
      <div className="glass-card p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-green-400" />
          Lugares mas Populares
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-dark-400 font-medium py-2 pr-4">#</th>
                <th className="text-left text-dark-400 font-medium py-2 pr-4">Lugar</th>
                <th className="text-left text-dark-400 font-medium py-2 pr-4">Categoria</th>
                <th className="text-left text-dark-400 font-medium py-2 pr-4">Rating</th>
                <th className="text-left text-dark-400 font-medium py-2 pr-4">Visitas</th>
                <th className="text-left text-dark-400 font-medium py-2">Tendencia</th>
              </tr>
            </thead>
            <tbody>
              {places.sort((a, b) => b.visits - a.visits).slice(0, 7).map((place, i) => (
                <tr key={place.id} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                  <td className="py-3 pr-4 text-dark-400 font-bold">{i + 1}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <img src={place.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                      <span className="text-white font-medium">{place.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="badge badge-blue">{place.category}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-white">{place.rating}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-white">{place.visits.toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`badge ${place.trend === 'up' ? 'badge-green' : place.trend === 'down' ? 'badge-red' : 'badge-blue'}`}>
                      {place.trend === 'up' ? '↑ Subiendo' : place.trend === 'down' ? '↓ Bajando' : '→ Estable'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
