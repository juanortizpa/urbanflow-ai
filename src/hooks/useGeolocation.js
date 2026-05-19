import { useState, useEffect } from 'react';

const FALLBACK = [-4.0383, -79.2113]; // Loja, Ecuador

export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización');
      setCoords(FALLBACK);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords([pos.coords.latitude, pos.coords.longitude]);
        setError(null);
        setLoading(false);
      },
      (err) => {
        const messages = {
          1: 'Permiso de ubicación denegado — usando ubicación por defecto',
          2: 'Ubicación no disponible — usando ubicación por defecto',
          3: 'Tiempo de espera agotado — usando ubicación por defecto',
        };
        setError(messages[err.code] || 'Error al obtener ubicación');
        setCoords(FALLBACK);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  return { coords, error, loading };
}
