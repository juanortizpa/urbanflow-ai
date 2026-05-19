import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { places, events, alerts, weatherConditions } from '../data/mockData';
import { useGeolocation } from '../hooks/useGeolocation';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState({
    uid: 'demo-user-001',
    displayName: 'Alex Rodriguez',
    email: 'alex@urbanflow.ai',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    preferences: { budget: 'medium', interests: ['cafes', 'restaurants', 'culture'], transport: 'bus' },
    isPremium: true,
  });

  const [favorites, setFavorites] = useState([2, 4, 7]);
  const [searchHistory, setSearchHistory] = useState(['hamburguesa', 'cafe cerca', 'parques', 'sushi']);
  const [activeFilters, setActiveFilters] = useState({ category: 'all', priceRange: 'all', rating: 0 });
  const [mapLayer, setMapLayer] = useState('standard');
  const [notifications, setNotifications] = useState(alerts);
  const [isLoading, setIsLoading] = useState(false);
  const [currentWeather, setCurrentWeather] = useState(weatherConditions);
  const [activeAlert, setActiveAlert] = useState(null);
  const [theme] = useState('dark');
  const { coords: userCoords, error: geoError, loading: geoLoading } = useGeolocation();

  const currentHour = new Date().getHours();

  const getTimeContext = useCallback(() => {
    if (currentHour >= 6 && currentHour < 12) return 'morning';
    if (currentHour >= 12 && currentHour < 17) return 'afternoon';
    if (currentHour >= 17 && currentHour < 21) return 'evening';
    return 'night';
  }, [currentHour]);

  const addToFavorites = useCallback((placeId) => {
    setFavorites(prev =>
      prev.includes(placeId) ? prev.filter(id => id !== placeId) : [...prev, placeId]
    );
  }, []);

  const addToSearchHistory = useCallback((query) => {
    setSearchHistory(prev => {
      const filtered = prev.filter(h => h !== query);
      return [query, ...filtered].slice(0, 10);
    });
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const showAlert = useCallback((message, type = 'info') => {
    setActiveAlert({ message, type, id: Date.now() });
    setTimeout(() => setActiveAlert(null), 4000);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWeather(prev => ({
        ...prev,
        temp: prev.temp + (Math.random() - 0.5) * 0.5,
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const value = {
    user, setUser,
    favorites, addToFavorites,
    searchHistory, addToSearchHistory,
    activeFilters, setActiveFilters,
    mapLayer, setMapLayer,
    notifications, dismissNotification,
    isLoading, setIsLoading,
    currentWeather, setCurrentWeather,
    activeAlert, showAlert,
    theme,
    timeContext: getTimeContext(),
    places,
    events,
    currentHour,
    userCoords,
    geoError,
    geoLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
