import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
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

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
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
