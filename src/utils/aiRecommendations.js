// Motor de recomendaciones con IA avanzada y scoring multi-factor

// Weights for scoring
const WEIGHTS = {
  rating: 15,
  popularity: 8,
  timeMatch: 25,
  weatherMatch: 20,
  budgetMatch: 15,
  interestMatch: 20,
  historyBoost: 10,
  trendBoost: 5,
};

export function getAIRecommendations(places, context) {
  const { timeContext, weather, user, currentHour, searchHistory = [], userCoords } = context;
  const budget = user?.preferences?.budget || 'medium';
  const interests = user?.preferences?.interests || [];
  const favorites = context.favorites || [];

  // Filter out night-only places during day hours and vice versa
  let candidates = places.filter(p => {
    if (currentHour >= 0 && currentHour < 6) return p.openHours === '24/7' || p.tags?.includes('nightlife');
    return true;
  });

  // Score each place
  const scored = candidates.map(place => {
    let score = 0;
    const reasons = [];

    // Rating score (0-15)
    score += (place.rating / 5) * WEIGHTS.rating;

    // Popularity score (0-8) - log scale
    score += Math.min(Math.log10((place.visits || 100) + 1) / 4, 1) * WEIGHTS.popularity;

    // Time match (0-25)
    if (place.popularAt?.includes(timeContext)) {
      score += WEIGHTS.timeMatch;
      reasons.push(
        timeContext === 'morning' ? 'Perfecto para la manana' :
        timeContext === 'afternoon' ? 'Ideal para la tarde' :
        timeContext === 'evening' ? 'Ambiente de tarde-noche' :
        'Disponible en la noche'
      );
    }

    // Weather match (0-20)
    const weatherCurrent = weather?.current || weather || 'any';
    if (place.weather?.includes(weatherCurrent) || place.weather?.includes('any')) {
      score += WEIGHTS.weatherMatch;
      if (weatherCurrent === 'rainy' && place.type === 'indoor') reasons.push('Techado, perfecto para la lluvia');
      if (weatherCurrent === 'sunny' && place.type === 'outdoor') reasons.push('Ideal para el clima soleado');
    } else if (weatherCurrent === 'rainy' && place.type === 'outdoor') {
      score -= 15; // penalize outdoor in rain
    }

    // Budget match (0-15)
    const budgetRanges = { low: [0, 10], medium: [0, 25], high: [0, 200] };
    const [minB, maxB] = budgetRanges[budget] || [0, 50];
    if (place.price >= minB && place.price <= maxB) {
      score += WEIGHTS.budgetMatch;
      if (budget === 'low' && place.price <= 5) reasons.push('Muy economico');
    }

    // Interest match (0-20)
    const interestMatches = interests.filter(i => place.tags?.includes(i) || place.category === i);
    if (interestMatches.length > 0) {
      score += (interestMatches.length / Math.max(interests.length, 1)) * WEIGHTS.interestMatch;
      reasons.push('Coincide con tus intereses');
    }

    // History boost (0-10)
    const histKeywords = searchHistory.join(' ').toLowerCase();
    if (place.tags?.some(t => histKeywords.includes(t)) || histKeywords.includes(place.category)) {
      score += WEIGHTS.historyBoost;
      reasons.push('Basado en tu historial');
    }

    // Favorites category boost
    if (favorites.length > 0) {
      score += 3; // slight boost for logged-in users with favorites
    }

    // Trend boost (0-5)
    if (place.trend === 'up') {
      score += WEIGHTS.trendBoost;
      reasons.push('Tendencia al alza esta semana');
    }

    // Distance penalty if userCoords available
    if (userCoords) {
      const dist = getDistance(userCoords, { lat: place.lat, lng: place.lng });
      if (dist < 0.5) { score += 10; reasons.push('A menos de 500m de ti'); }
      else if (dist > 5) score -= 5;
    }

    const reason = reasons.length > 0
      ? reasons.slice(0, 2).join(' · ')
      : `Calificacion ${place.rating}★ · ${(place.visits || 0).toLocaleString()} visitas`;

    return {
      ...place,
      aiScore: Math.round(score),
      aiReason: reason,
      aiMatch: Math.min(Math.round((score / 85) * 100), 99),
    };
  });

  return scored.sort((a, b) => b.aiScore - a.aiScore).slice(0, 10);
}

function getDistance(coords, place) {
  const R = 6371;
  const dLat = ((place.lat - coords[0]) * Math.PI) / 180;
  const dLon = ((place.lng - coords[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((coords[0] * Math.PI) / 180) * Math.cos((place.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function generateDayPlan(params, places) {
  const { budget, hours, interests, startTime = 9 } = params;
  const budgetRanges = { low: [0, 8], medium: [0, 20], high: [0, 100] };
  const [minP, maxP] = budgetRanges[budget] || [0, 50];

  const filtered = places
    .filter(p => p.price >= minP && p.price <= maxP)
    .filter(p => interests.length === 0 || interests.some(i => p.tags?.includes(i) || p.category === i))
    .sort((a, b) => b.rating - a.rating);

  const maxPlaces = Math.min(Math.floor(hours / 1.5), 5);
  const categories = new Set();
  const selected = [];

  // Try to diversify categories
  for (const place of filtered) {
    if (selected.length >= maxPlaces) break;
    if (!categories.has(place.category) || selected.length < 2) {
      selected.push(place);
      categories.add(place.category);
    }
  }
  // Fill remaining
  for (const place of filtered) {
    if (selected.length >= maxPlaces) break;
    if (!selected.find(p => p.id === place.id)) selected.push(place);
  }

  const plan = selected.map((place, idx) => {
    const start = startTime + idx * 1.5;
    const end = start + 1.5;
    return {
      order: idx + 1,
      place,
      startTime: formatTime(start),
      endTime: formatTime(end),
      duration: '1h 30min',
      tip: getTip(place),
    };
  });

  const totalCost = selected.reduce((sum, p) => sum + p.price, 0);
  return {
    plan,
    totalCost,
    totalTime: `${Math.floor(selected.length * 1.5)}h`,
    summary: `Plan de ${selected.length} lugares cuidadosamente seleccionados para tu ${
      budget === 'low' ? 'presupuesto ajustado' :
      budget === 'high' ? 'experiencia premium' : 'dia perfecto'
    } en Cali.`,
    route: selected.map(p => p.name).join(' → '),
  };
}

function getTip(place) {
  const tips = {
    cafes: 'Pide el cafe de origen colombiano, es la especialidad.',
    restaurants: `Mejor hora para ir: ${place.popularAt?.includes('lunch') ? 'almuerzo (12-2pm)' : 'cena (7-9pm)'}`,
    bars: 'Llega antes de las 10pm para conseguir buen lugar.',
    parks: 'Lleva protector solar y agua si es de dia.',
    culture: 'Verifica horarios en el sitio web antes de ir.',
    desserts: 'Los fines de semana hay mas variedad disponible.',
    sports: 'Reserva con anticipacion si es un lugar popular.',
  };
  return tips[place.category] || `Calificado con ${place.rating}★ por la comunidad calena.`;
}

function formatTime(hour) {
  const h = Math.floor(hour) % 24;
  const m = hour % 1 === 0.5 ? '30' : '00';
  return `${h.toString().padStart(2, '0')}:${m}`;
}

export function getSmartAlerts(context) {
  const { currentHour, weather, liveTrafficZones: trafficZones } = context;
  const alerts = [];
  const highTraffic = trafficZones?.find(z => z.congestion > 75);
  if (highTraffic) {
    alerts.push({
      id: 1,
      type: 'traffic',
      severity: 'warning',
      message: `Congestion alta en ${highTraffic.name} (${highTraffic.congestion}%) — Sal 20 min antes`,
      action: 'Ver rutas alternas',
    });
  }
  if (currentHour >= 17 && currentHour <= 19) {
    alerts.push({
      id: 2,
      type: 'traffic',
      severity: 'info',
      message: 'Hora pico activa en Cali — recomendamos rutas alternativas',
      action: 'Ver SmartFlow',
    });
  }
  if (weather?.current === 'rainy' || weather === 'rainy') {
    alerts.push({
      id: 3,
      type: 'weather',
      severity: 'info',
      message: 'Lluvia activa en Cali — te mostramos solo lugares techados',
      action: 'Ver lugares',
    });
  }
  if (currentHour >= 22 || currentHour < 6) {
    alerts.push({
      id: 4,
      type: 'info',
      severity: 'info',
      message: 'Modo nocturno activo — solo mostramos lugares abiertos ahora',
      action: null,
    });
  }
  return alerts;
}

export function scoreRelevance(place, query, context) {
  let score = place.rating * 10;
  const q = query.toLowerCase();
  if (place.name.toLowerCase().includes(q)) score += 50;
  if (place.tags?.some(t => t.includes(q))) score += 30;
  if (context?.timeContext && place.popularAt?.includes(context.timeContext)) score += 20;
  return score;
}
