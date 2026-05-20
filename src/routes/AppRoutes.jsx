import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Explore from '../pages/Explore';
import MapPage from '../pages/MapPage';
import SmartRoutes from '../pages/SmartRoutes';
import Dashboard from '../pages/Dashboard';
import Recommendations from '../pages/Recommendations';
import Events from '../pages/Events';
import Favorites from '../pages/Favorites';
import Emergency from '../pages/Emergency';
import Profile from '../pages/Profile';
import Admin from '../pages/Admin';

function ProtectedRoute({ children }) {
  const { user, authLoading } = useApp();

  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#020617',
      }}>
        <div style={{
          width: 40, height: 40, border: '3px solid rgba(59,130,246,0.3)',
          borderTopColor: '#3b82f6', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="map" element={<MapPage />} />
        <Route path="routes" element={<SmartRoutes />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="recommendations" element={<Recommendations />} />
        <Route path="events" element={<Events />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="emergency" element={<Emergency />} />
        <Route path="profile" element={<Profile />} />
        <Route path="admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
