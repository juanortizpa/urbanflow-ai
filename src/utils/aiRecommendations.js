// Motor de recomendaciones con IA basica simulada

import { rankByContext } from './searchEngine';

export function getAIRecommendations(places, context) {
  const { timeContext, weather, user, currentHour } = context;
  const budget = user?.preferences?.budget || 'medium';
  const interests = user?.preferences?.interests || [];
  const searchHistory = context.searchHistory || [];

  let recommendations = rankByContext(places, { timeContext, weather, budget, interests });

  if (weather === 'rainy') {
    const indoor = recommendations.filter(p => p.type === 'indoor');
    const outdoor = recommendations.filter(p => p.type !== 'indoor');
    recommendations = [...indoor, ...outdoor];
  }

  if (currentHour >= 22 || currentHour < 6) {
    recommendations = recommendations.filter(p =>
      p.openHours === '24/7' || p.tags.includes('nightlife') || p.category === 'emergency'
    );
  }

  const historyCategories = extractCategoriesFromHistory(searchHistory);
  if (historyCategories.length > 0) {
    recommendations = recommendations.sort((a, b) => {
      const aMatch = historyCategories.some(cat => a.tags.includes(cat) || a.category === cat) ? 1 : 0;
      const bMatch = historyCategories.some(cat => b.tags.includes(cat) || b.category === cat) ? 1 : 0;
      return bMatch - aMatch;
    });
  }

  return recommendations.slice(0, 8);
}

function extractCategoriesFromHistory(history) {
  const categoryMap = {
    'cafe': 'cafes', 'coffee': 'cafes', 'hamburguesa': 'restaurants', 'burger': 'restaurants',
    'bar': 'bars', 'gym': 'sports', 'museo': 'culture', 'parque': 'parks',
    'sushi': 'restaurants', 'pizza': 'restaurants',
  };
  const categories = new Set();
  history.forEach(term => {
    const lc = term.toLowerCase();
    Object.entries(categoryMap).forEach(([key, cat]) => {
      if (lc.includes(key)) categories.add(cat);
    });
  });
  return Array.from(categories);
}

export function generateDayPlan(params, places) {
  const { budget, hours, interests } = params;
  const budgetMap = { low: [0, 10], medium: [0, 20], high: [0, 100] };
  const [minPrice, maxPrice] = budgetMap[budget] || [0, 50];

  const filtered = places.filter(p =>
    p.price >= minPrice && p.price <= maxPrice &&
    (interests.length === 0 || interests.some(i => p.tags.includes(i) || p.category === i))
  );

  const sorted = filtered.sort((a, b) => b.rating - a.rating);
  const maxPlaces = Math.min(Math.floor(hours / 1.5), 5);
  const selected = sorted.slice(0, maxPlaces);

  const totalCost = selected.reduce((sum, p) => sum + p.price, 0);
  const totalTime = selected.length * 1.5;

  const plan = selected.map((place, idx) => ({
    order: idx + 1,
    place,
    startTime: formatTime(10 + idx * 1.5),
    endTime: formatTime(10 + (idx + 1) * 1.5),
    duration: '90 min',
  }));

  return {
    plan,
    totalCost,
    totalTime: `${Math.floor(totalTime)}h ${totalTime % 1 === 0.5 ? '30' : '0'}min`,
    summary: generatePlanSummary(selected, budget),
    route: selected.map(p => p.name).join(' → '),
  };
}

function formatTime(hour) {
  const h = Math.floor(hour);
  const m = hour % 1 === 0.5 ? '30' : '00';
  return `${h.toString().padStart(2, '0')}:${m}`;
}

function generatePlanSummary(places, budget) {
  const categories = [...new Set(places.map(p => p.category))];
  return `Plan ${budget === 'low' ? 'economico' : budget === 'high' ? 'premium' : 'balanceado'} que incluye ${categories.join(', ')} — perfectamente optimizado para tu dia.`;
}

export function getSmartAlerts(context) {
  const { currentHour, weather, trafficZones } = context;
  const alerts = [];

  const highTraffic = trafficZones?.find(z => z.congestion > 80);
  if (highTraffic) {
    alerts.push({
      id: Date.now() + 1,
      type: 'traffic',
      severity: 'warning',
      message: `Congestion critica en ${highTraffic.name} - Sal 20 min antes`,
      action: 'Ver ruta alterna',
    });
  }

  if (currentHour >= 17 && currentHour <= 19) {
    alerts.push({
      id: Date.now() + 2,
      type: 'recommendation',
      severity: 'info',
      message: 'Hora pico activa — Te recomendamos rutas alternativas',
      action: 'Ver rutas',
    });
  }

  if (weather?.current === 'rainy') {
    alerts.push({
      id: Date.now() + 3,
      type: 'weather',
      severity: 'info',
      message: 'Lluvia activa — Cafes y lugares techados cerca de ti',
      action: 'Ver lugares',
    });
  }

  return alerts;
}

export function scoreRelevance(place, query, context) {
  let score = place.rating * 10;
  const q = query.toLowerCase();
  if (place.name.toLowerCase().includes(q)) score += 50;
  if (place.tags.some(t => t.includes(q))) score += 30;
  if (context?.timeContext && place.popularAt?.includes(context.timeContext)) score += 20;
  return score;
}
