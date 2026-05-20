import { useState } from 'react';
import { Zap, MapPin, Activity, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

const features = [
  { icon: MapPin, text: 'Explora Cali en tiempo real' },
  { icon: Activity, text: 'Tráfico y rutas inteligentes' },
  { icon: Shield, text: 'Alertas de emergencia' },
  { icon: Zap,    text: 'Recomendaciones con IA' },
];

export default function Login() {
  const { login } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await login();
    } catch (err) {
      setError('No se pudo iniciar sesión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #020617 0%, #0a1628 50%, #050d1a 100%)',
      padding: 24,
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 300, borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(ellipse, rgba(37,99,235,0.15) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
            boxShadow: '0 0 40px rgba(59,130,246,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={32} color="white" />
          </div>
          <h1 style={{ color: 'white', fontSize: 28, fontWeight: 800, margin: 0 }}>
            UrbanFlow <span style={{ color: '#06b6d4' }}>AI</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>
            Inteligencia urbana para Cali, Colombia
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20, padding: 32, backdropFilter: 'blur(20px)',
        }}>
          <h2 style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 6, marginTop: 0 }}>
            Bienvenido de vuelta
          </h2>
          <p style={{ color: '#64748b', fontSize: 13, marginBottom: 28 }}>
            Inicia sesión para acceder a todas las funciones
          </p>

          {/* Features */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
            {features.map(({ icon: Icon, text }) => (
              <div key={text} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                background: 'rgba(255,255,255,0.03)', borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <Icon size={14} color="#06b6d4" style={{ flexShrink: 0 }} />
                <span style={{ color: '#94a3b8', fontSize: 11 }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            style={{
              width: '100%', padding: '14px 20px', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.12)',
              background: loading ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.07)',
              color: 'white', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              transition: 'all 0.2s', outline: 'none',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = loading ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.07)'; }}
          >
            {loading ? (
              <div style={{
                width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite',
              }} />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {loading ? 'Iniciando sesión...' : 'Continuar con Google'}
          </button>

          {error && (
            <p style={{ color: '#f87171', fontSize: 13, textAlign: 'center', marginTop: 16, marginBottom: 0 }}>
              {error}
            </p>
          )}

          <p style={{ color: '#475569', fontSize: 11, textAlign: 'center', marginTop: 20, marginBottom: 0 }}>
            Al iniciar sesión aceptas los términos de uso de UrbanFlow AI
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
