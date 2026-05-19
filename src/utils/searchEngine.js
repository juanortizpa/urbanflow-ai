// Motor de busqueda semantico avanzado con relevancia inteligente

const synonymMap = {
  hamburguesa: ['burger', 'burgers', 'hamburgesa', 'fast food', 'american', 'grill', 'comida americana'],
  cafe: ['coffee', 'cafeteria', 'espresso', 'cappuccino', 'latte', 'cozy', 'work', 'wifi'],
  pizza: ['pizzeria', 'italian', 'pasta', 'napoli', 'italiana'],
  sushi: ['japanese', 'japones', 'asian', 'seafood', 'roll', 'sashimi'],
  bar: ['nightlife', 'cocktails', 'drinks', 'pub', 'noche', 'bebidas'],
  helado: ['ice cream', 'dessert', 'postre', 'sweet', 'dulce'],
  museo: ['museum', 'culture', 'historia', 'history', 'art', 'arte'],
  parque: ['park', 'outdoor', 'nature', 'naturaleza', 'outdoor', 'green'],
  emergencia: ['hospital', 'policia', 'emergency', 'urgencia', 'health'],
  mercado: ['market', 'shopping', 'artisan', 'crafts', 'artesanias'],
  gym: ['fitness', 'sports', 'deporte', 'ejercicio', 'workout', 'gym'],
};

function expandQuery(query) {
  const terms = new Set([query.toLowerCase()]);
  for (const [key, synonyms] of Object.entries(synonymMap)) {
    if (query.toLowerCase().includes(key) || synonyms.some(s => query.toLowerCase().includes(s))) {
      terms.add(key);
      synonyms.forEach(s => terms.add(s));
    }
  }
  return Array.from(terms);
}

function scorePlace(place, expandedTerms) {
  let score = 0;
  const nameLC = place.name.toLowerCase();
  const descLC = place.description.toLowerCase();
  const catLC = place.category.toLowerCase();
  const allTags = [...place.tags, ...(place.menu || [])].map(t => t.toLowerCase());
  const reviewsText = (place.reviews || []).join(' ').toLowerCase();

  for (const term of expandedTerms) {
    if (nameLC === term) score += 100;
    else if (nameLC.startsWith(term)) score += 80;
    else if (nameLC.includes(term)) score += 60;
    if (catLC === term) score += 50;
    else if (catLC.includes(term)) score += 35;
    for (const tag of allTags) {
      if (tag === term) score += 40;
      else if (tag.includes(term)) score += 25;
    }
    if (descLC.includes(term)) score += 20;
    if (reviewsText.includes(term)) score += 10;
  }

  score += place.rating * 5;
  score += Math.log(place.visits + 1) * 2;
  if (place.trend === 'up') score += 10;

  return score;
}

export function searchPlaces(places, query, options = {}) {
  if (!query || query.trim().length < 1) return places;

  const { limit = 20, minScore = 5 } = options;
  const expandedTerms = expandQuery(query.trim());

  const scored = places
    .map(place => ({ place, score: scorePlace(place, expandedTerms) }))
    .filter(({ score }) => score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(({ place }) => place);
}

export function getSearchSuggestions(query) {
  if (!query || query.length < 2) return [];
  const suggestions = [
    'hamburguesas cerca', 'cafes con wifi', 'restaurantes baratos', 'bares de noche',
    'parques para familia', 'museos culturales', 'gimnasios premium', 'sushi autentico',
    'helados artesanales', 'mercados locales', 'eventos hoy', 'emergencias cercanas',
  ];
  return suggestions.filter(s => s.includes(query.toLowerCase())).slice(0, 5);
}

export function rankByContext(places, context) {
  const { timeContext, weather, budget, interests } = context;
  return [...places].sort((a, b) => {
    let scoreA = a.rating * 10, scoreB = b.rating * 10;

    if (timeContext && a.popularAt?.includes(timeContext)) scoreA += 15;
    if (timeContext && b.popularAt?.includes(timeContext)) scoreB += 15;

    if (weather === 'rainy') {
      if (a.type === 'indoor') scoreA += 20;
      if (b.type === 'indoor') scoreB += 20;
    }

    if (budget === 'low') {
      if (a.price <= 8) scoreA += 15;
      if (b.price <= 8) scoreB += 15;
    } else if (budget === 'high') {
      if (a.price >= 20) scoreA += 10;
      if (b.price >= 20) scoreB += 10;
    }

    if (interests) {
      interests.forEach(interest => {
        if (a.tags?.includes(interest)) scoreA += 12;
        if (b.tags?.includes(interest)) scoreB += 12;
      });
    }

    if (a.trend === 'up') scoreA += 8;
    if (b.trend === 'up') scoreB += 8;

    return scoreB - scoreA;
  });
}
