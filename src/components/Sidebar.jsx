import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  MapPin, BarChart3, Navigation, Star, Calendar, User,
  Shield, Compass, Brain, Home, Settings, ChevronLeft, ChevronRight,
  Zap, Bell,
} from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Inicio', badge: null },
  { path: '/explore', icon: Compass, label: 'Explorar', badge: null },
  { path: '/map', icon: MapPin, label: 'Mapa', badge: 'LIVE' },
  { path: '/routes', icon: Navigation, label: 'SmartFlow', badge: null },
  { path: '/dashboard', icon: BarChart3, label: 'Dashboard', badge: null },
  { path: '/recommendations', icon: Brain, label: 'IA Recomenda', badge: 'AI' },
  { path: '/events', icon: Calendar, label: 'Eventos', badge: '5' },
  { path: '/favorites', icon: Star, label: 'Favoritos', badge: null },
  { path: '/emergency', icon: Shield, label: 'Emergencia', badge: null },
  { path: '/profile', icon: User, label: 'Perfil', badge: null },
  { path: '/admin', icon: Settings, label: 'Admin', badge: null },
];

export default function Sidebar({ isOpen, onToggle }) {
  const { user, notifications } = useApp();
  const location = useLocation();

  return (
    <aside className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}
      style={{ background: 'linear-gradient(180deg, #0a1628 0%, #050d1a 100%)', borderRight: '1px solid rgba(255,255,255,0.07)' }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/7">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', boxShadow: '0 0 20px rgba(59,130,246,0.4)' }}>
          <Zap size={16} className="text-white" />
        </div>
        {isOpen && (
          <div className="animate-fade-in">
            <span className="font-bold text-white text-sm tracking-wide">UrbanFlow</span>
            <span className="text-cyan-400 font-bold text-sm"> AI</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="ml-auto text-dark-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* User pill */}
      {isOpen && (
        <div className="mx-3 my-3 p-3 rounded-xl flex items-center gap-3 animate-fade-in"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-lg object-cover" />
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user.displayName}</p>
            <div className="flex items-center gap-1.5">
              <div className="pulse-dot w-1.5 h-1.5" />
              <span className="text-green-400 text-xs">Online</span>
              {user.isPremium && <span className="badge badge-cyan text-xs py-0 px-1.5">PRO</span>}
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
        {navItems.map(({ path, icon: Icon, label, badge }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink
              key={path}
              to={path}
              className={isActive ? 'nav-item-active' : 'nav-item'}
              title={!isOpen ? label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {isOpen && (
                <span className="flex-1 animate-fade-in">{label}</span>
              )}
              {isOpen && badge && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
                  badge === 'LIVE' ? 'bg-red-500/20 text-red-400' :
                  badge === 'AI' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>{badge}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom alerts indicator */}
      {isOpen && notifications.length > 0 && (
        <div className="mx-3 mb-4 p-3 rounded-xl animate-fade-in"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div className="flex items-center gap-2">
            <Bell size={14} className="text-red-400" />
            <span className="text-red-400 text-xs font-medium">{notifications.length} alertas activas</span>
          </div>
        </div>
      )}
    </aside>
  );
}
