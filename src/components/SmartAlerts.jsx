import { AlertTriangle, Info, CheckCircle, CalendarDays, X } from 'lucide-react';

const typeConfig = {
  info:    { icon: Info,          bg: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.35)',  iconColor: '#60a5fa' },
  warning: { icon: AlertTriangle, bg: 'rgba(234,179,8,0.15)',   border: 'rgba(234,179,8,0.35)',   iconColor: '#facc15' },
  success: { icon: CheckCircle,   bg: 'rgba(34,197,94,0.15)',   border: 'rgba(34,197,94,0.35)',   iconColor: '#4ade80' },
  error:   { icon: AlertTriangle, bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.35)',   iconColor: '#f87171' },
  agenda:  { icon: CalendarDays,  bg: 'rgba(139,92,246,0.15)',  border: 'rgba(139,92,246,0.35)', iconColor: '#a78bfa' },
};

export default function SmartAlerts({ alert }) {
  const cfg = typeConfig[alert.type] || typeConfig.info;
  const Icon = cfg.icon;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-slide-in-right">
      <div
        className="flex items-center gap-3 px-4 py-3.5 rounded-2xl max-w-xs shadow-2xl"
        style={{
          background: 'rgba(8,16,32,0.95)',
          border: `1px solid ${cfg.border}`,
          backdropFilter: 'blur(20px)',
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), inset 0 0 0 1px ${cfg.border}`,
        }}
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: cfg.bg }}>
          <Icon size={16} style={{ color: cfg.iconColor }} />
        </div>
        <p className="text-white text-sm leading-snug">{alert.message}</p>
      </div>
    </div>
  );
}

export function NotificationBanner({ notifications, onDismiss }) {
  if (!notifications?.length) return null;
  const latest = notifications[0];
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="flex items-center gap-3 px-5 py-3 rounded-xl glass-card max-w-md shadow-2xl">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
          latest.severity === 'critical' ? 'bg-red-400 animate-pulse' :
          latest.severity === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
        }`} />
        <p className="text-white text-sm flex-1">{latest.message}</p>
        <button onClick={() => onDismiss(latest.id)} className="text-dark-400 hover:text-white transition-colors">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
