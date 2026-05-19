import { useEffect } from 'react';
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const icons = { info: Info, warning: AlertTriangle, success: CheckCircle, error: AlertTriangle };
const colors = {
  info: { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', icon: '#60a5fa' },
  warning: { bg: 'rgba(234,179,8,0.15)', border: 'rgba(234,179,8,0.3)', icon: '#facc15' },
  success: { bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.3)', icon: '#4ade80' },
  error: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', icon: '#f87171' },
};

export default function SmartAlerts({ alert }) {
  const { showAlert } = useApp();
  const Icon = icons[alert.type] || Info;
  const color = colors[alert.type] || colors.info;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-in-right">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl max-w-sm"
        style={{ background: color.bg, border: `1px solid ${color.border}`, backdropFilter: 'blur(20px)' }}>
        <Icon size={18} style={{ color: color.icon }} className="flex-shrink-0" />
        <p className="text-white text-sm">{alert.message}</p>
      </div>
    </div>
  );
}

export function NotificationBanner({ notifications, onDismiss }) {
  if (!notifications?.length) return null;
  const latest = notifications[0];

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="flex items-center gap-3 px-5 py-3 rounded-xl glass-card max-w-md">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
          latest.severity === 'critical' ? 'bg-red-400 animate-pulse' :
          latest.severity === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
        }`} />
        <p className="text-white text-sm flex-1">{latest.message}</p>
        <button onClick={() => onDismiss(latest.id)} className="text-dark-400 hover:text-white">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
