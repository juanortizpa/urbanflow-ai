import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { places, events, alerts, weatherConditions, trafficZones as initialTrafficZones } from '../data/mockData';
import { useGeolocation } from '../hooks/useGeolocation';
import { predictTraffic } from '../utils/dijkstra';

const AppContext = createContext(null);

const WTTR_URL = 'https://wttr.in/Cali%20Colombia?format=j1';

const WEATHER_CODE_MAP = {
  113: 'sunny', 116: 'partly_cloudy', 119: 'cloudy', 122: 'cloudy',
  143: 'cloudy', 176: 'rainy', 179: 'rainy', 182: 'rainy', 185: 'rainy',
  200: 'rainy', 227: 'cloudy', 230: 'cloudy', 248: 'cloudy', 260: 'cloudy',
  263: 'rainy', 266: 'rainy', 281: 'rainy', 284: 'rainy', 293: 'rainy',
  296: 'rainy', 299: 'rainy', 302: 'rainy', 305: 'rainy', 308: 'rainy',
  311: 'rainy', 314: 'rainy', 317: 'rainy', 320: 'rainy', 323: 'rainy',
  386: 'rainy', 389: 'rainy',
};

async function fetchLiveWeather() {
  const res = await fetch(WTTR_URL);
  if (!res.ok) throw new Error('weather fetch failed');
  const data = await res.json();
  const c = data.current_condition[0];
  const code = parseInt(c.weatherCode, 10);
  const forecast3h = (data.weather[0]?.hourly || []).slice(0, 3).map(h => ({
    time: `${String(parseInt(h.time, 10) / 100).padStart(2, '0')}:00`,
    condition: WEATHER_CODE_MAP[parseInt(h.weatherCode, 10)] || 'cloudy',
    temp: parseInt(h.tempC, 10),
  }));
  return {
    current: WEATHER_CODE_MAP[code] || 'cloudy',
    temp: parseInt(c.temp_C, 10),
    humidity: parseInt(c.humidity, 10),
    wind: parseInt(c.windspeedKmph, 10),
    description: `${c.weatherDesc[0].value} — Cali, Colombia`,
    forecast: forecast3h.length ? forecast3h : weatherConditions.forecast,
    liveAt: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
  };
}

function computeLiveTraffic(zones) {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  return zones.map(zone => {
    const predicted = predictTraffic(hour, day);
    const variation = (Math.random() - 0.5) * 12;
    const congestion = Math.min(100, Math.max(0, Math.round(predicted + variation)));
    const level =
      congestion >= 80 ? 'critical' :
      congestion >= 60 ? 'high' :
      congestion >= 35 ? 'medium' : 'low';
    return { ...zone, congestion, level };
  });
}

export function AppProvider({ children }) {
  const [user] = useState({
    uid: 'demo-user-001',
    displayName: 'Alex Rodriguez',
    email: 'alex@urbanflow.ai',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    preferences: { budget: 'medium', interests: ['cafes', 'restaurants', 'culture'], transport: 'bus' },
    isPremium: true,
  });

  const [favorites, setFavorites] = useState([2, 4, 7]);
  const [searchHistory, setSearchHistory] = useState(['salsa', 'café cerca', 'parques', 'sushi']);
  const [activeFilters, setActiveFilters] = useState({ category: 'all', priceRange: 'all', rating: 0 });
  const [mapLayer, setMapLayer] = useState('standard');
  const [notifications, setNotifications] = useState(alerts);
  const [isLoading, setIsLoading] = useState(false);
  const [currentWeather, setCurrentWeather] = useState(weatherConditions);
  const [liveTrafficZones, setLiveTrafficZones] = useState(() => computeLiveTraffic(initialTrafficZones));
  const [weatherLive, setWeatherLive] = useState(false);
  const [weatherLastUpdate, setWeatherLastUpdate] = useState(null);
  const [activeAlert, setActiveAlert] = useState(null);
  const [theme] = useState('dark');
  const { coords: userCoords, error: geoError, loading: geoLoading } = useGeolocation();
  const weatherRetryRef = useRef(0);

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

  // Fetch live weather on mount and every 10 minutes
  useEffect(() => {
    let cancelled = false;

    async function loadWeather() {
      try {
        const live = await fetchLiveWeather();
        if (!cancelled) {
          setCurrentWeather(live);
          setWeatherLive(true);
          setWeatherLastUpdate(live.liveAt);
          weatherRetryRef.current = 0;
        }
      } catch {
        if (!cancelled && weatherRetryRef.current < 3) {
          weatherRetryRef.current += 1;
          setTimeout(loadWeather, 5000 * weatherRetryRef.current);
        }
      }
    }

    loadWeather();
    const weatherInterval = setInterval(loadWeather, 10 * 60 * 1000);
    return () => { cancelled = true; clearInterval(weatherInterval); };
  }, []);

  // Update live traffic every 60 seconds based on current hour
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTrafficZones(computeLiveTraffic(initialTrafficZones));
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const value = {
    user,
    favorites, addToFavorites,
    searchHistory, addToSearchHistory,
    activeFilters, setActiveFilters,
    mapLayer, setMapLayer,
    notifications, dismissNotification,
    isLoading, setIsLoading,
    currentWeather, setCurrentWeather,
    weatherLive, weatherLastUpdate,
    activeAlert, showAlert,
    theme,
    timeContext: getTimeContext(),
    places,
    events,
    currentHour,
    userCoords,
    geoError,
    geoLoading,
    liveTrafficZones,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
