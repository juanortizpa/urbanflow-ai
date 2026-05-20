// Overpass API — fetches real places from OpenStreetMap within Cali, Colombia
// Bounding box: S=3.32, W=-76.62, N=3.58, E=-76.43

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

const CALI_BBOX = '3.32,-76.62,3.58,-76.43';

const OSM_CATEGORY_MAP = {
  restaurant:    { category: 'restaurants', tags: ['food', 'dining'] },
  cafe:          { category: 'cafes',       tags: ['coffee', 'work', 'cozy'] },
  bar:           { category: 'bars',        tags: ['drinks', 'nightlife'] },
  fast_food:     { category: 'restaurants', tags: ['fast food', 'quick'] },
  ice_cream:     { category: 'desserts',    tags: ['desserts', 'sweet'] },
  bakery:        { category: 'cafes',       tags: ['bread', 'coffee', 'breakfast'] },
  nightclub:     { category: 'bars',        tags: ['nightlife', 'party', 'dancing'] },
  museum:        { category: 'culture',     tags: ['museum', 'history', 'art'] },
  theatre:       { category: 'culture',     tags: ['theatre', 'culture', 'entertainment'] },
  cinema:        { category: 'culture',     tags: ['cinema', 'movies'] },
  gym:           { category: 'sports',      tags: ['gym', 'fitness', 'health'] },
  sports_centre: { category: 'sports',      tags: ['sports', 'fitness'] },
  park:          { category: 'parks',       tags: ['outdoor', 'nature', 'family'] },
  garden:        { category: 'parks',       tags: ['outdoor', 'nature', 'relaxation'] },
  attraction:    { category: 'culture',     tags: ['tourist', 'landmark'] },
  gallery:       { category: 'culture',     tags: ['art', 'gallery', 'culture'] },
  supermarket:   { category: 'shopping',   tags: ['shopping', 'grocery'] },
  mall:          { category: 'shopping',   tags: ['shopping', 'mall'] },
};

const OVERPASS_QUERY = `
[out:json][timeout:30];
(
  node["amenity"~"restaurant|cafe|bar|fast_food|ice_cream|bakery|nightclub|museum|theatre|cinema|gym"](${CALI_BBOX});
  node["leisure"~"park|garden|sports_centre"](${CALI_BBOX});
  node["tourism"~"museum|gallery|attraction"](${CALI_BBOX});
  node["shop"~"supermarket|mall"](${CALI_BBOX});
);
out body;
`;

// Average ratings by category (realistic estimates for OSM places)
function estimateRating(category) {
  const base = { restaurants: 4.2, cafes: 4.3, bars: 4.1, desserts: 4.5, culture: 4.4, sports: 4.0, parks: 4.6, shopping: 4.0 };
  const b = base[category] || 4.0;
  return Math.round((b + (Math.random() * 0.6 - 0.3)) * 10) / 10;
}

function estimatePrice(amenity) {
  const prices = { restaurant: 18, cafe: 8, bar: 12, fast_food: 7, ice_cream: 5, bakery: 6, nightclub: 15, museum: 5, theatre: 25, cinema: 18, gym: 40, sports_centre: 20, park: 0, garden: 0, attraction: 0, gallery: 4, supermarket: 30, mall: 0 };
  return prices[amenity] || 10;
}

let _cache = null;
let _cacheTime = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function fetchCaliPlaces() {
  // Return cached results if fresh
  if (_cache && Date.now() - _cacheTime < CACHE_TTL) return _cache;

  try {
    const res = await fetch(OVERPASS_URL, {
      method: 'POST',
      body: `data=${encodeURIComponent(OVERPASS_QUERY)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    if (!res.ok) throw new Error('Overpass error');
    const data = await res.json();

    const places = data.elements
      .filter(el => el.tags?.name && el.lat && el.lon)
      .map((el, idx) => {
        const amenity = el.tags.amenity || el.tags.leisure || el.tags.tourism || el.tags.shop || 'attraction';
        const mapping = OSM_CATEGORY_MAP[amenity] || { category: 'culture', tags: ['attraction'] };
        const category = mapping.category;
        const rating = estimateRating(category);
        const visits = Math.floor(Math.random() * 3000) + 200;

        return {
          id: `osm_${el.id}`,
          name: el.tags.name,
          category,
          tags: [...mapping.tags, amenity],
          description: el.tags.description || el.tags['description:es'] || `${el.tags.name} — lugar en Cali, Colombia.`,
          lat: el.lat,
          lng: el.lon,
          rating,
          visits,
          trend: rating >= 4.4 ? 'up' : 'stable',
          price: estimatePrice(amenity),
          openHours: el.tags.opening_hours || '9:00-20:00',
          image: `https://picsum.photos/seed/osm${el.id}/400/250`,
          reviews: [],
          menu: [],
          popularAt: ['morning', 'afternoon', 'evening'],
          weather: ['any'],
          type: ['park', 'garden'].includes(amenity) ? 'outdoor' : 'indoor',
          source: 'osm',
          website: el.tags.website,
          phone: el.tags.phone,
          address: el.tags['addr:street'] ? `${el.tags['addr:street']} ${el.tags['addr:housenumber'] || ''}`.trim() : undefined,
        };
      });

    _cache = places;
    _cacheTime = Date.now();
    return places;
  } catch (err) {
    console.warn('Overpass fetch failed, using local data only:', err.message);
    return [];
  }
}
