import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from 'firebase/auth';
import {
  doc, getDoc, setDoc, updateDoc,
  arrayUnion, arrayRemove, serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';
import { places, events, alerts, weatherConditions, trafficZones as initialTrafficZones } from '../data/mockData';
import { useGeolocation } from '../hooks/useGeolocation';
import { predictTraffic } from '../utils/dijkstra';

const AppContext = createContext(null);

const WTTR_URL = 'https://wttr.in/Cali%20Colombia?format=j1';

const WEATHER_CODE_MAP = {
  113: 'sunny', 116: 'partly_cloudy', 119: 'cloudy', 122: 'cloudy',
  143: 'cloudy', 176: 'rainy', 179: 'rainy', 182: 'rainy', 185: 'rainy',
  200: 'rainy', 263: 'rainy', 266: 'rainy', 293: 'rainy', 296: 'rainy',
  299: 'rainy', 302: 'rainy', 305: 'rainy', 308: 'rainy', 386: 'rainy',
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

const DEFAULT_PREFERENCES = { budget: 'medium', interests: ['cafes', 'restaurants', 'culture'], transport: 'bus' };

export function AppProvider({ children }) {
  // Auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // App state
  const [favorites, setFavorites] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
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

  // ── Firebase Auth ───────────────────────────────────────────────────────────

  const login = useCallback(async () => {
    await signInWithRedirect(auth, googleProvider);
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    setFavorites([]);
    setSearchHistory([]);
  }, []);

  // Auth init: primero procesa el redirect result de Google (si lo hay),
  // luego registra el listener. Sin este await, onAuthStateChanged puede
  // disparar con null antes de que Firebase procese el resultado del redirect.
  useEffect(() => {
    let cancelled = false;
    let unsub;

    async function init() {
      try {
        await getRedirectResult(auth);
      } catch {
        // errores COOP / red no son fatales
      }
      if (cancelled) return;

      unsub = onAuthStateChanged(auth, async (firebaseUser) => {
        if (cancelled) return;
        if (firebaseUser) {
          const ref = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(ref);
          if (cancelled) return;

          if (!snap.exists()) {
            const profile = {
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              isPremium: false,
              preferences: DEFAULT_PREFERENCES,
              favorites: [],
              searchHistory: [],
              createdAt: serverTimestamp(),
            };
            await setDoc(ref, profile);
            if (cancelled) return;
            setFavorites([]);
            setSearchHistory([]);
            setUser({ uid: firebaseUser.uid, ...profile });
          } else {
            const data = snap.data();
            setFavorites(data.favorites || []);
            setSearchHistory(data.searchHistory || []);
            setUser({
              uid: firebaseUser.uid,
              displayName: data.displayName || firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: data.photoURL || firebaseUser.photoURL,
              isPremium: data.isPremium || false,
              preferences: data.preferences || DEFAULT_PREFERENCES,
            });
          }
        } else {
          setUser(null);
        }
        setAuthLoading(false);
      });
    }

    init();
    return () => { cancelled = true; if (unsub) unsub(); };
  }, []);

  // ── Firestore actions ───────────────────────────────────────────────────────

  const addToFavorites = useCallback(async (placeId) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid);
    const isAlready = favorites.includes(placeId);
    setFavorites(prev => isAlready ? prev.filter(id => id !== placeId) : [...prev, placeId]);
    await updateDoc(ref, {
      favorites: isAlready ? arrayRemove(placeId) : arrayUnion(placeId),
    });
  }, [user, favorites]);

  const addToSearchHistory = useCallback(async (query) => {
    if (!user) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(h => h !== query);
      return [query, ...filtered].slice(0, 10);
    });
    // Keep Firestore history in sync (max 10 entries via client-side slice)
    const ref = doc(db, 'users', user.uid);
    await updateDoc(ref, { searchHistory: arrayUnion(query) });
  }, [user]);

  const updateUserProfile = useCallback(async (data) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid);
    await updateDoc(ref, data);
    setUser(prev => ({ ...prev, ...data }));
  }, [user]);

  // ── Utilities ───────────────────────────────────────────────────────────────

  const getTimeContext = useCallback(() => {
    if (currentHour >= 6 && currentHour < 12) return 'morning';
    if (currentHour >= 12 && currentHour < 17) return 'afternoon';
    if (currentHour >= 17 && currentHour < 21) return 'evening';
    return 'night';
  }, [currentHour]);

  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const showAlert = useCallback((message, type = 'info') => {
    setActiveAlert({ message, type, id: Date.now() });
    setTimeout(() => setActiveAlert(null), 4000);
  }, []);

  // ── Live weather (wttr.in) ──────────────────────────────────────────────────

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
    const interval = setInterval(loadWeather, 10 * 60 * 1000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  // ── Live traffic (every 60 s) ───────────────────────────────────────────────

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTrafficZones(computeLiveTraffic(initialTrafficZones));
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Context value ───────────────────────────────────────────────────────────

  const value = {
    user, authLoading,
    login, logout,
    updateUserProfile,
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
